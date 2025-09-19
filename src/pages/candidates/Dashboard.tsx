import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BrainCircuit, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  TrendingUp,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Upload,
  User,
  Calendar,
  LinkedinIcon,
  Sparkles
} from "lucide-react";
import Navigation from "@/components/ui/navigation";
import { Link } from "react-router-dom";
import { useState } from "react";

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState("resume");
  const [showAIAssistant, setShowAIAssistant] = useState(true);

  // Mock data
  const jobMatches = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120k - $160k",
      matchScore: 94,
      type: "Full-time",
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "React Developer",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$90k - $130k",
      matchScore: 87,
      type: "Full-time",
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "GrowthCo",
      location: "New York, NY",
      salary: "$100k - $140k",
      matchScore: 82,
      type: "Full-time",
      posted: "3 days ago"
    }
  ];

  const profileStats = {
    profileCompletion: 85,
    applications: 12,
    interviews: 3,
    offers: 1
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Job Seeker Portal</h1>
            <p className="text-muted-foreground">
              Upload your resume to get started. Our AI will analyze your resume to extract skills and experience, helping us match you with relevant job opportunities.
            </p>
          </div>
          <Button 
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            AI Career Assistant
          </Button>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 mb-8">
                <TabsTrigger value="resume" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Resume
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="matches" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Job Matches
                </TabsTrigger>
                <TabsTrigger value="applications" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Applications
                </TabsTrigger>
                <TabsTrigger value="interviews" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Interviews
                </TabsTrigger>
                <TabsTrigger value="linkedin" className="flex items-center gap-2">
                  <LinkedinIcon className="h-4 w-4" />
                  LinkedIn
                </TabsTrigger>
              </TabsList>

              <TabsContent value="resume" className="space-y-6">
                <Card className="p-12 text-center border-dashed border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <Upload className="h-12 w-12 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Upload Your Resume</h3>
                      <p className="text-muted-foreground max-w-md">
                        Drag and drop your resume here or click to browse. Our AI will analyze it to extract your skills and experience.
                      </p>
                    </div>
                    <Button size="lg" className="mt-4">
                      Choose File
                    </Button>
                  </div>
                </Card>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="p-6">
                    <h4 className="font-semibold mb-3">Profile Completion</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{profileStats.profileCompletion}%</span>
                      </div>
                      <Progress value={profileStats.profileCompletion} className="h-2" />
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h4 className="font-semibold mb-3">Quick Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Applications</span>
                        <span className="font-medium">{profileStats.applications}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Interviews</span>
                        <span className="font-medium">{profileStats.interviews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Offers</span>
                        <span className="font-medium text-success">{profileStats.offers}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="matches" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">AI-Matched Jobs</h2>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <BrainCircuit className="mr-1 h-4 w-4" />
                    {jobMatches.length} New Matches
                  </Badge>
                </div>

                <div className="space-y-4">
                  {jobMatches.map((job) => (
                    <Card key={job.id} className="hover:shadow-lg transition-all cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-semibold hover:text-primary transition-colors">
                                {job.title}
                              </h3>
                              <Badge 
                                variant="secondary" 
                                className={`${job.matchScore >= 90 ? 'bg-success/10 text-success' : 
                                          job.matchScore >= 80 ? 'bg-warning/10 text-warning' : 
                                          'bg-info/10 text-info'
                                         }`}
                              >
                                <Star className="mr-1 h-3 w-3" />
                                {job.matchScore}% Match
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">{job.company}</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {job.salary}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {job.posted}
                              </div>
                            </div>

                            <Badge variant="outline">{job.type}</Badge>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button size="sm">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="applications" className="space-y-6">
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground">
                    Start applying to jobs to see your application status here.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="interviews" className="space-y-6">
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Interviews Scheduled</h3>
                  <p className="text-muted-foreground">
                    Your upcoming interviews will appear here.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <div className="text-center py-12">
                  <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
                  <p className="text-muted-foreground mb-4">
                    Add more details to improve your job matches.
                  </p>
                  <Button>Edit Profile</Button>
                </div>
              </TabsContent>

              <TabsContent value="linkedin" className="space-y-6">
                <Card className="p-8 text-center">
                  <LinkedinIcon className="h-16 w-16 mx-auto text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Connect Your LinkedIn</h3>
                  <p className="text-muted-foreground mb-4">
                    Import your LinkedIn profile to enhance your job search.
                  </p>
                  <Button>Connect LinkedIn</Button>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* AI Career Assistant */}
          {showAIAssistant && (
            <Card className="w-80 h-fit sticky top-8">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  AI Career Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="text-sm">
                    Hi there! I'm your AI job assistant. How can I help you today?
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Resume Analysis
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Job Recommendations
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Interview Prep
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Career Advice
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <input 
                      placeholder="Type your question..."
                      className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Button size="sm">
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