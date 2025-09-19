import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Users, Building2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'candidate';
  const [activeTab, setActiveTab] = useState('signin');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - redirect to appropriate dashboard
    if (userType === 'recruiter') {
      window.location.href = '/recruiters';
    } else {
      window.location.href = '/candidates';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">TalentAI</span>
          </Link>
          <h1 className="text-2xl font-bold">
            {userType === 'recruiter' ? 'Recruiter' : 'Candidate'} Portal
          </h1>
          <p className="text-muted-foreground">
            Access your AI-powered recruitment dashboard
          </p>
        </div>

        <Card className="shadow-large">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              {userType === 'recruiter' ? (
                <Building2 className="h-8 w-8 text-primary" />
              ) : (
                <Users className="h-8 w-8 text-accent" />
              )}
            </div>
            <CardTitle className="text-center">
              Welcome {userType === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password"
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary">
                    Sign In
                  </Button>
                </form>
                
                <div className="text-center text-sm text-muted-foreground">
                  <Link to="#" className="hover:text-primary">
                    Forgot your password?
                  </Link>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="John"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe"
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input 
                      id="signupEmail" 
                      type="email" 
                      placeholder="john@example.com"
                      required 
                    />
                  </div>
                  {userType === 'recruiter' && (
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input 
                        id="company" 
                        placeholder="Your company name"
                        required 
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input 
                      id="signupPassword" 
                      type="password" 
                      placeholder="Create a password"
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
              {userType === 'recruiter' ? (
                <span>Looking for a job? <Link to="/auth/login?type=candidate" className="text-primary hover:underline">Join as candidate</Link></span>
              ) : (
                <span>Hiring talent? <Link to="/auth/login?type=recruiter" className="text-primary hover:underline">Join as recruiter</Link></span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;