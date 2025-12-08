// login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../netlify/functions/usermanager.js';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Alert, AlertDescription } from "./components/ui/alert";
import { Key, Mail } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submitEvent(e) {
    e.preventDefault();
    setError("");
    
    try {
      await signIn(e, email, password);
      setEmail("");
      setPassword("");
      
      const userRole = await getUserRole(email);
      
      if (userRole === 'staff') {
        navigate('/staffdashboard');
      } else if (userRole === 'courier') {
        navigate('/courierdashboard');
      } else {
        navigate('/home');
      }
    } catch (error) {
      setError("Invalid email or password");
    }
  }

  async function getUserRole(email) {
    try {
      const response = await fetch(`/.netlify/functions/getUserRole?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.role || 'customer';
    } catch (err) {
      console.error("Error fetching user role:", err);
      return 'customer';
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={submitEvent}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full mt-4">
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}