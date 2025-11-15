import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BrainCircuit, 
  FileText, 
  MapPin,
  DollarSign,
  User,
  Sparkles,
  ArrowRight,
  Star
} from "lucide-react";
import Navigation from "@/components/ui/navigation";
import { useState } from "react";
import { ResumeUpload } from "@/components/ResumeUpload";
import { ProfileForm } from "@/components/ProfileForm";
import { AIAnalysisCard } from "@/components/AIAnalysisCard";
import { AICareerChatbot } from "@/components/AICareerChatbot";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState("resume");
  const [showAIAssistant, setShowAIAssistant] = useState(true);
  const [aiMatches, setAiMatches] = useState<any[]>([]);
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('job_postings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) {
        const formattedJobs = data.map(job => ({
          ...job,
          title: job.job_title,
          company: job.company_name,
          salary: `$${job.salary_min/1000}k - $${job.salary_max/1000}k`,
          matchScore: 85,
          featured: job.is_premium,
          skills: job.skills_required.slice(0, 3)
        }));
        setAiMatches(formattedJobs);
      }
      setLoading(false);
    };
    loadJobs();
  }, []);

  const handleAnalysisComplete = () => {
    const stored = localStorage.getItem('aiMatches');
    if (stored) {
      setAiMatches(JSON.parse(stored));
      setActiveTab("matches");
    }
  };

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
                  className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow rounded-xl transition-all"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Smart Resume
                </TabsTrigger>
                <TabsTrigger 
                  value="profile"
                  className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow rounded-xl transition-all"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="analysis"
                  className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow rounded-xl transition-all"
                >
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  AI Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="matches"
                  className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow rounded-xl transition-all"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Matches
                </TabsTrigger>
              </TabsList>

              <TabsContent value="resume" className="space-y-6">
                <ResumeUpload onUploadSuccess={setResumeData} />
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <ProfileForm />
                
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

              <TabsContent value="analysis" className="space-y-6">
                <AIAnalysisCard 
                  onAnalysisComplete={handleAnalysisComplete}
                  profileData={resumeData}
                  resumeText={resumeData?.resumeText}
                />
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
                    // Handle both database jobs and AI matched jobs
                    const job = jobItem.job || jobItem;
                    const matchScore = jobItem.match_score || jobItem.matchScore || 85;
                    const matchingSkills = jobItem.matching_skills || null;
                    const matchReason = jobItem.reason || null;
                    
                    return (
                    <Card 
                      key={job.id} 
                      className={`group hover:shadow-glow transition-all cursor-pointer rounded-2xl overflow-hidden border-2 ${
                        job.is_premium || job.featured
                          ? 'border-primary/30 bg-gradient-to-r from-primary/5 via-accent/5 to-transparent' 
                          : 'border-border/50 bg-gradient-card backdrop-blur-xl'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-6">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-xl font-bold hover:text-primary transition-colors">
                                {job.job_title || job.title}
                              </h3>
                              {(job.is_premium || job.featured) && (
                                <Badge className="bg-gradient-primary text-white px-3 py-1">
                                  <Star className="h-3 w-3 mr-1" />
                                  FEATURED
                                </Badge>
                              )}
                              <Badge className="bg-success/10 text-success border-success/20 px-4 py-1.5 text-sm font-bold">
                                <Sparkles className="h-3 w-3 mr-1.5" />
                                {matchScore}% Match
                              </Badge>
                            </div>
                            
                            <p className="text-lg font-semibold text-foreground">
                              {job.company_name || job.company}
                            </p>
                            
                            {matchReason && (
                              <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                                {matchReason}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <DollarSign className="h-4 w-4" />
                                {job.salary_min && job.salary_max 
                                  ? `$${job.salary_min/1000}k - $${job.salary_max/1000}k`
                                  : job.salary
                                }
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {matchingSkills ? (
                                matchingSkills.map((skill: string) => (
                                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                                    {skill}
                                  </Badge>
                                ))
                              ) : (
                                (job.skills_required || job.skills)?.slice(0, 4).map((skill: string) => (
                                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                                    {skill}
                                  </Badge>
                                ))
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-3">
                            <Button className="bg-gradient-primary hover:shadow-glow transition-all whitespace-nowrap">
                              Apply Now
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="outline" className="border-border/50 hover:border-primary/50 whitespace-nowrap">
                              Save & Compare
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )})}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {showAIAssistant && (
            <div className="w-96">
              <AICareerChatbot />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
