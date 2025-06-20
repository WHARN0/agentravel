import { Hono } from "hono";
import { Reservasi, LogTransaksi } from "@/database/model/all";
import Invois from "@/database/model/invois";

const reservasi = new Hono();

async function saveLogReservasi(baru: any) {
  const log = new LogTransaksi({
    reference_id: baru.ticket_id,
    reference_type: "Reservation",
    date: new Date(),
    description: `Reservation ID: #${baru.ticket_id} successfully created`,
    actor: "Travel Admin",
  });

  await log.save();
  console.log("Log transaksi berhasil disimpan");
}

reservasi
  .get("/", async (c) => {
    const data = await Reservasi.find();
    return c.json({ status: "berhasil", data });
  })

  // .post("/", async (c) => {
  //   const body = await c.req.json();
  //   body.status = "Booked"; // Set default status to Booked
  //   const baru = new Reservasi(body);
  //   await baru.save();

  //   try {
  //     await saveLogReservasi(baru);
  //   } catch (error) {
  //     console.error("Gagal menyimpan log reservasi:", error);
  //   }

  //   return c.json({ message: "Berhasil menambahkan reservasi", data: baru });
  // })

  .post("/", async (c) => {
    try {
      const body = await c.req.json();

      body.status = "Booked";
      body.payment_status = body.payment_status || "Pending";
      body.payment_method = body.payment_method || "Prepaid";

      console.log("Body masuk:", body);

      const baru = new Reservasi(body);
      console.log("Reservasi instance:", baru);

      await baru.save();

      try {
        await saveLogReservasi(baru);
      } catch (logErr) {
        console.error("Gagal menyimpan log reservasi:", logErr);
      }

      return c.json({ message: "Berhasil menambahkan reservasi", data: baru });
    } catch (error) {
      console.error("ERROR SAAT POST /api/reservasi:", error);
      return c.json({ message: "Gagal menambahkan reservasi", error: String(error) }, 500);
    }
  })

  .get("/:id", async (c) => {
    const { id } = c.req.param();
    const data = await Reservasi.findById(id);
    return c.json({ status: "berhasil", data });
  })

  .put("/:id", async (c) => {
    const body = await c.req.json();
    const { id } = c.req.param();
    if (body.status == "Canceled") {

    }
    const data = await Reservasi.findByIdAndUpdate(id, body, { new: true });
    return c.json({ status: "berhasil", data });
  })

  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    try {
      // Cari reservasi untuk mendapatkan ticket_id
      const reservasi = await Reservasi.findById(id);
      if (!reservasi) {
        return c.json({ status: "tidak ditemukan", message: "Reservasi tidak ditemukan" }, 404);
      }

      // Hapus log transaksi terkait
      await LogTransaksi.deleteMany({
        reference_id: reservasi.ticket_id,
        reference_type: "Reservation",
      });
      
      const reservasiToCancel = await Reservasi.findById(id);
      const relatedInvoice = await Invois.findOne({ reservation_id: id });

      // 3. Jika invois yang terkait ditemukan, kurangi `total_amount`.
      if (relatedInvoice) {
        // Gunakan operator $inc untuk mengurangi nilai secara atomik.
        // Ini lebih aman daripada mengambil data, menghitung di JS, lalu menyimpan kembali.
        await Invois.updateOne(
          { _id: relatedInvoice._id },
          { $inc: { total_amount: -reservasiToCancel.total_price } }
        );
        // Anda juga bisa mempertimbangkan untuk mengurangi `fee` jika perlu
        // { $inc: { total_amount: -reservasiToCancel.total_price, fee: -biaya_admin_lain } }
      }

      // Hapus reservasi
      await Reservasi.findByIdAndDelete(id);

      return c.json({ status: "berhasil", message: "Reservasi dihapus" });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      return c.json(
        {
          status: "gagal",
          message: "Gagal menghapus reservasi",
          error: String(error),
        },
        500
      );
    }
  });

export default reservasi;
