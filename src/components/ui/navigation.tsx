import { Button } from "@/components/ui/button";
import { Users, BrainCircuit, User, Building } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">TalentAI</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/candidates" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname.startsWith('/candidates') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            For Candidates
          </Link>
          <Link 
            to="/recruiters" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname.startsWith('/recruiters') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            For Recruiters
          </Link>
          <Link 
            to="/about" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/auth/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/auth/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;