"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const isFormValid = username.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const params = new URLSearchParams({ username, password });
      const res = await fetch(`/api/pengguna?${params.toString()}`);
      const data = await res.json();

      console.log('Login response:', data);
      if (!res.ok || !data.data || data.data.length === 0) {
        toast({
          variant: "destructive",
          title: "Login gagal. Cek kembali username dan password."
        });
      } else {
        toast({ title: "Login berhasil" });
        // Attempt navigation
        try {
          await router.push('/dashboard');
        } catch (navErr) {
          console.warn('router.push failed, falling back to window.location', navErr);
          window.location.href = '/dashboard';
        }
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan saat login"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[360px] bg-white shadow-md rounded-2xl border-none">
      <CardContent className="px-6 py-8">
        <h2 className="text-xl font-bold text-center">Login</h2>
        <p className="text-gray-500 text-center mt-1 mb-8 text-sm">
          Please login to admin dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto">
          <div>
            <Label htmlFor="username" className="block text-xs font-medium text-black mb-1">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full py-2 px-3 border border-gray-300 rounded-full placeholder-gray-300 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="password" className="block text-xs font-medium text-black mb-1">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full py-2 px-3 border border-gray-300 rounded-full placeholder-gray-300 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? <Eye strokeWidth={1}  /> : <EyeOff strokeWidth={1} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className={`w-full rounded-full text-white ${isFormValid ? 'bg-[#377dec] hover:bg-[#4a8ef0]' : 'bg-gray-700 cursor-not-allowed'}`}
            disabled={loading || !isFormValid}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
