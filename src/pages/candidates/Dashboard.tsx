import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BrainCircuit, 
  FileText, 
  MessageSquare, 
  MapPin,
  DollarSign,
  Upload,
  User,
  Sparkles,
  Zap,
  Shield,
  Award,
  ArrowRight,
  Star
} from "lucide-react";
import Navigation from "@/components/ui/navigation";
import { useState, useEffect } from "react";
import { ResumeUpload } from "@/components/ResumeUpload";
import { ProfileForm } from "@/components/ProfileForm";
import { AIAnalysisCard } from "@/components/AIAnalysisCard";

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState("resume");
  const [showAIAssistant, setShowAIAssistant] = useState(true);
  const [aiMatches, setAiMatches] = useState<any[]>([]);
  const [resumeData, setResumeData] = useState<any>(null);

  useEffect(() => {
    // Load AI matches from localStorage
    const stored = localStorage.getItem('aiMatches');
    if (stored) {
      setAiMatches(JSON.parse(stored));
    }
  }, [activeTab]);

  // Mock data
  const jobMatches = [
    {
      id: 1,
      title: "Senior Frontend Architect",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$140k - $180k",
      matchScore: 97,
      featured: true,
      skills: ["React", "TypeScript", "System Design"],
      benefits: ["Equity", "Remote", "Learning Budget"]
    },
    {
      id: 2,
      title: "Full Stack Principal Engineer",
      company: "StartupXYZ",
      location: "Remote Worldwide",
      salary: "$120k - $160k",
      matchScore: 94,
      featured: true,
      skills: ["Python", "React", "AWS"],
      benefits: ["Stock Options", "Flexible Hours", "Healthcare"]
    },
    {
      id: 3,
      title: "Lead Software Engineer",
      company: "InnovateNow",
      location: "New York, NY",
      salary: "$130k - $170k",
      matchScore: 89,
      featured: false,
      skills: ["Node.js", "MongoDB", "Leadership"],
      benefits: ["401k", "PTO", "Remote Options"]
    }
  ];

  const profileStats = {
    profileCompletion: 85,
    applications: 12,
    interviews: 3,
    offers: 1
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
              Job Seeker Portal
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Upload your resume to get started. Our AI will analyze your resume to extract skills and experience, helping us match you with relevant job opportunities.
            </p>
          </div>
          <Button 
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="flex items-center gap-2 bg-gradient-primary hover:shadow-glow transition-all"
            size="lg"
          >
            <Sparkles className="h-4 w-4" />
            AI Career Assistant
          </Button>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-card/60 backdrop-blur-xl border border-border/50 p-1.5 rounded-2xl shadow-soft">
                <TabsTrigger 
                  value="resume" 
                  className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-medium"
                >
                  <FileText className="h-4 w-4" />
                  Smart Resume
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-medium"
                >
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="analysis" 
                  className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-medium"
                  onClick={() => setActiveTab("matches")}
                >
                  <BrainCircuit className="h-4 w-4" />
                  AI Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="matches" 
                  className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-medium"
                >
                  <Sparkles className="h-4 w-4" />
                  AI Matches
                </TabsTrigger>
              </TabsList>

              <TabsContent value="resume" className="space-y-6">
                {/* AI Resume Intelligence Hero Section */}
                <div className="text-center mb-8 pt-4">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                    AI Resume Intelligence
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                    Upload your resume for comprehensive AI analysis including{" "}
                    <span className="text-primary font-semibold">skill extraction</span>,{" "}
                    <span className="text-primary font-semibold">gap analysis</span>, and{" "}
                    <span className="text-primary font-semibold">optimization recommendations</span>.
                  </p>
                </div>

                <ResumeUpload onUploadSuccess={(data) => setResumeData(data)} />

                {/* AI Analysis Card */}
                <AIAnalysisCard 
                  onAnalysisComplete={() => setActiveTab("matches")}
                  resumeText={resumeData?.text}
                />

                {/* Feature Cards */}
                <div className="grid gap-6 md:grid-cols-3 mt-8">
                  <Card className="bg-gradient-card backdrop-blur-xl border border-border/50 hover:shadow-medium transition-all rounded-2xl overflow-hidden">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
                        <Zap className="h-8 w-8 text-primary" />
                      </div>
                      <h4 className="font-bold text-lg mb-2">Instant Analysis</h4>
                      <p className="text-sm text-muted-foreground">AI processing in seconds</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-card backdrop-blur-xl border border-border/50 hover:shadow-medium transition-all rounded-2xl overflow-hidden">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-3 bg-success/10 rounded-2xl mb-4">
                        <Shield className="h-8 w-8 text-success" />
                      </div>
                      <h4 className="font-bold text-lg mb-2">Secure & Private</h4>
                      <p className="text-sm text-muted-foreground">Your data stays protected</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-card backdrop-blur-xl border border-border/50 hover:shadow-medium transition-all rounded-2xl overflow-hidden">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-3 bg-accent/10 rounded-2xl mb-4">
                        <Award className="h-8 w-8 text-accent" />
                      </div>
                      <h4 className="font-bold text-lg mb-2">Expert Insights</h4>
                      <p className="text-sm text-muted-foreground">Professional recommendations</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 mt-6">
                  <Card className="bg-gradient-card backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-4">Profile Completion</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-bold text-primary">{profileStats.profileCompletion}%</span>
                        </div>
                        <Progress value={profileStats.profileCompletion} className="h-3 bg-secondary" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-card backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-4">Quick Stats</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Applications</span>
                          <span className="font-bold text-lg">{profileStats.applications}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Interviews</span>
                          <span className="font-bold text-lg">{profileStats.interviews}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Offers</span>
                          <span className="font-bold text-lg text-success">{profileStats.offers}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="matches" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    AI-Matched Jobs
                  </h2>
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm">
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    {(aiMatches.length > 0 ? aiMatches : jobMatches).length} New Matches
                  </Badge>
                </div>

                <div className="space-y-4">
                  {(aiMatches.length > 0 ? aiMatches : jobMatches).map((jobItem: any) => {
                    const job = aiMatches.length > 0 ? jobItem.job : jobItem;
                    const matchScore = aiMatches.length > 0 ? jobItem.match_score : jobItem.matchScore;
                    
                    return (
                    <Card 
                      key={job.id} 
                      className={`group hover:shadow-glow transition-all cursor-pointer rounded-2xl overflow-hidden border-2 ${
                        job.featured 
                          ? 'border-primary/30 bg-gradient-to-r from-primary/5 via-accent/5 to-transparent' 
                          : 'border-border/50 bg-gradient-card backdrop-blur-xl'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-6">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-xl font-bold hover:text-primary transition-colors">
                                {job.title}
                              </h3>
                              {job.featured && (
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                                  <Star className="mr-1 h-3 w-3 fill-current" />
                                  FEATURED
                                </Badge>
                              )}
                              <Badge 
                                className={`${
                                  matchScore >= 95 
                                    ? 'bg-success/10 text-success border-success/20' 
                                    : 'bg-info/10 text-info border-info/20'
                                } text-sm font-bold px-3 py-1`}
                              >
                                <Sparkles className="mr-1 h-3 w-3" />
                                {matchScore}% Match
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="font-semibold text-lg text-foreground">{job.company}</div>
                              <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-4 w-4" />
                                  {job.location}
                                </div>
                                <div className="flex items-center gap-1.5 font-semibold text-success">
                                  <DollarSign className="h-4 w-4" />
                                  {job.salary}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                              {job.skills.map((skill) => (
                                <Badge 
                                  key={skill} 
                                  variant="outline" 
                                  className="bg-primary/5 border-primary/20 text-primary rounded-lg"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex gap-2 flex-wrap">
                              {job.benefits.map((benefit) => (
                                <Badge 
                                  key={benefit} 
                                  variant="outline" 
                                  className="bg-success/5 border-success/20 text-success rounded-lg text-xs"
                                >
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Button 
                              className="bg-gradient-primary hover:shadow-glow transition-all group-hover:scale-105"
                            >
                              Apply Now
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              className="border-border/50 hover:bg-secondary/50"
                            >
                              Save & Compare
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <ProfileForm />
                
                {/* AI Analysis Card */}
                <AIAnalysisCard 
                  onAnalysisComplete={() => setActiveTab("matches")}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* AI Career Assistant */}
          {showAIAssistant && (
            <Card className="w-96 h-fit sticky top-8 bg-gradient-card backdrop-blur-xl border border-border/50 rounded-2xl shadow-large">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                  </div>
                  AI Career Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="bg-gradient-glow p-4 rounded-xl border border-primary/10">
                  <p className="text-sm leading-relaxed">
                    Hi there! I'm your AI job assistant. How can I help you today?
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all rounded-xl"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Resume Analysis
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all rounded-xl"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Job Recommendations
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all rounded-xl"
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Interview Prep
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all rounded-xl"
                  >
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Career Advice
                  </Button>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="flex gap-2">
                    <input 
                      placeholder="Type your question..."
                      className="flex-1 px-4 py-2.5 text-sm border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background/50 backdrop-blur"
                    />
                    <Button className="bg-gradient-primary hover:shadow-glow transition-all rounded-xl">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
