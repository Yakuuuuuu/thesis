import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleAuth = async () => {
    const endpoint = mode === 'signin' ? '/api/v1/auth/login' : '/api/v1/auth/register';
    try {
      const body = mode === 'signin' 
        ? JSON.stringify({ email, password })
        : JSON.stringify({ username: email, email, password, role: 'admin' });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      localStorage.setItem('token', data.token);
      toast({ title: "Success", description: `Successfully ${mode === 'signin' ? 'signed in' : 'signed up'}.` });
      navigate("/admin", { replace: true });

    } catch (error: any) {
      toast({ title: "Authentication Failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO title="Sign in – Admin Access" description="Sign in to manage service requests." path="/auth" />
      <Navbar />
      <main className="container mx-auto flex-1 py-10 grid place-items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{mode === "signin" ? "Sign in" : "Create Admin Account"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Button className="w-full" onClick={handleAuth}>
                {mode === "signin" ? "Sign in" : "Sign up"}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
                {mode === "signin" ? "Need an account?" : "Have an account?"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
