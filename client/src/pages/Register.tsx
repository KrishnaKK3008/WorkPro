import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Shield, User } from "lucide-react"; 
import { cn } from "@/lib/utils";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [role, setRole] = useState<"employee" | "admin">("employee");
  
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/auth/register", { name, email, password, role });
      setUser(res.data.user);
      console.log({name, email, password, role})
      toast({ title: "Welcome to Syncra!", description: `Account created as ${role}.` });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950 px-4 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-20%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[100px]" />

      <Card className="w-full max-w-md z-10 border-white/10 bg-black/40 backdrop-blur-xl text-white">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
                <Sparkles className="h-8 w-8 text-blue-500" />
            </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription className="text-gray-400">
            Join Syncra to manage your workforce properly.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="grid gap-4">
            
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                className="bg-white/5 border-white/10 text-white focus-visible:ring-blue-500"
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                <Label>I am a...</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div 
                        onClick={() => setRole("employee")}
                        className={cn(
                            "cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center gap-2 transition-all",
                            role === "employee" 
                                ? "bg-blue-600/20 border-blue-500 text-blue-200" 
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                        )}
                    >
                        <User className="h-6 w-6" />
                        <span className="text-sm font-medium">Employee</span>
                    </div>

                    <div 
                        onClick={() => setRole("admin")}
                        className={cn(
                            "cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center gap-2 transition-all",
                            role === "admin" 
                                ? "bg-purple-600/20 border-purple-500 text-purple-200" 
                                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                        )}
                    >
                        <Shield className="h-6 w-6" />
                        <span className="text-sm font-medium">Admin</span>
                    </div>
                </div>
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
            <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
            <div className="mt-2 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-400 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}