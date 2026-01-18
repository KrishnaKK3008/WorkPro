import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast"; 
import { Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data.user);
      toast({ title: "Welcome back!", description: "Access granted." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
      {/* Background Neon Blobs */}
      <div className="absolute top-[-20%] left-[-20%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-20%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[100px]" />

      <Card className="w-full max-w-sm z-10 border-white/10 bg-black/40 backdrop-blur-xl text-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Lock className="h-8 w-8 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription className="text-gray-400">
            Welcome back to Syncra.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500"
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500"
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="submit" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Sign In"}
            </Button>
            <div className="mt-2 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-blue-400 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}