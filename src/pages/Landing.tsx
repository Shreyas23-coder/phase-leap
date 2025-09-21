import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Users, Target, Zap, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/ui/navigation";
import heroBackground from "@/assets/hero-background.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Content */}
        <div className="relative z-10 container px-4 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                <Sparkles className="mr-2 h-4 w-4" />
                Powered by AI
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                The Future of
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"> Smart </span>
                Recruitment
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Connect top talent with dream opportunities through AI-powered matching. 
                Experience recruitment that understands skills, culture, and potential.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/candidates">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  <Users className="mr-2 h-5 w-5" />
                  Find My Dream Job
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/recruiters">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                  <Target className="mr-2 h-5 w-5" />
                  Hire Top Talent
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>95% Match Accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>50% Faster Hiring</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Why Choose TalentAI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-driven platform revolutionizes recruitment by understanding what truly matters.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-medium bg-card/50 backdrop-blur">
              <CardContent className="p-8">
                <BrainCircuit className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">AI-Powered Matching</h3>
                <p className="text-muted-foreground">
                  Our advanced algorithms analyze skills, experience, and cultural fit to deliver perfect matches.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-medium bg-card/50 backdrop-blur">
              <CardContent className="p-8">
                <Zap className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Reduce time-to-hire from weeks to days with automated screening and intelligent recommendations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-medium bg-card/50 backdrop-blur">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-success mb-4" />
                <h3 className="text-xl font-semibold mb-3">Better Outcomes</h3>
                <p className="text-muted-foreground">
                  Higher retention rates and job satisfaction through intelligent matching and continuous learning.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-gradient-primary text-white border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Recruitment?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of companies and candidates who've already discovered the power of AI recruitment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth/register?type=candidate">
                  <Button size="lg" variant="secondary">
                    Join as Candidate
                  </Button>
                </Link>
                <Link to="/auth/register?type=recruiter">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Start Recruiting
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Landing;