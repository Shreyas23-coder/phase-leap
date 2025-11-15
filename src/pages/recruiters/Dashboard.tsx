import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Briefcase, 
  TrendingUp,
  Eye,
  UserCheck,
  Clock,
  Star,
  Filter,
  BrainCircuit,
  Settings,
  User,
  MapPin,
  DollarSign,
  Sparkles,
  ArrowUp
} from "lucide-react";
import Navigation from "@/components/ui/navigation";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PostJobModal } from "@/components/PostJobModal";
import { CandidatePipeline } from "@/components/CandidatePipeline";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { JobMatchesView } from "./JobMatchesView";
import { useToast } from "@/hooks/use-toast";

const RecruiterDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("postings");
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    loadRecruiterJobs();
  }, []);

  const loadRecruiterJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) return;

      const { data: jobsData } = await supabase
        .from('job_postings')
        .select('*')
        .eq('recruiter_id', userData.id)
        .order('created_at', { ascending: false });

      if (jobsData) {
        setJobs(jobsData);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    toast({
      title: "Seeding database...",
      description: "Creating 100 elite jobs and 100 elite candidates. This may take a minute.",
    });

    try {
      const { data, error } = await supabase.functions.invoke('seed-database', {
        body: {}
      });

      if (error) throw error;

      toast({
        title: "Database seeded successfully! 🎉",
        description: "Created 100 elite job postings and 100 elite candidates",
      });

      // Refresh the jobs list
      await loadRecruiterJobs();
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        title: "Seeding failed",
        description: error instanceof Error ? error.message : "Failed to seed database",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };
  // Mock data
  const activeJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      applicants: 24,
      newApplicants: 5,
      interviews: 3,
      status: "Active",
      posted: "1 week ago",
      aiMatches: 8
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      applicants: 16,
      newApplicants: 2,
      interviews: 1,
      status: "Active",
      posted: "3 days ago",
      aiMatches: 5
    },
    {
      id: 3,
      title: "Data Scientist",
      department: "Analytics",
      applicants: 31,
      newApplicants: 8,
      interviews: 2,
      status: "Active",
      posted: "2 weeks ago",
      aiMatches: 12
    }
  ];

  const topCandidates = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Senior React Developer",
      matchScore: 96,
      location: "San Francisco, CA",
      experience: "5+ years",
      status: "New"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      title: "Full Stack Engineer", 
      matchScore: 92,
      location: "Remote",
      experience: "4+ years",
      status: "Reviewed"
    },
    {
      id: 3,
      name: "Lisa Wang",
      title: "Frontend Developer",
      matchScore: 89,
      location: "New York, NY",
      experience: "3+ years",
      status: "Interviewed"
    }
  ];

  const dashboardStats = {
    activeJobs: { value: 12, growth: "+25%", metric1: "98%", metric2: "2.3x", label1: "Success Rate", label2: "Faster Hiring" },
    aiMatches: { value: 347, growth: "+158%", metric1: "98%", metric2: "2.3x", label1: "Success Rate", label2: "Faster Hiring" },
    totalApplicants: { value: 1247, growth: "+687%", metric1: "98%", metric2: "2.3x", label1: "Success Rate", label2: "Faster Hiring" },
    successfulHires: { value: 89, growth: "+34%", metric1: "98%", metric2: "2.3x", label1: "Success Rate", label2: "Faster Hiring" }
  };

  const jobPostings = [
    {
      id: 1,
      title: "Senior Software Architect",
      location: "San Francisco, CA",
      salary: "$190k - $220k",
      type: "Engineering",
      priority: "High",
      status: "Active",
      posted: "Mar 28, 2025",
      applicants: 47,
      aiMatches: 23
    },
    {
      id: 2,
      title: "Product Strategy Director",
      location: "Remote Global",
      salary: "$140k - $180k",
      type: "Product",
      priority: "High",
      status: "Active",
      posted: "Mar 25, 2025",
      applicants: 89,
      aiMatches: 34
    },
    {
      id: 3,
      title: "Lead UX Designer",
      location: "New York, NY",
      salary: "$120k - $150k",
      type: "Design",
      priority: "Medium",
      status: "Draft",
      posted: "Mar 22, 2025",
      applicants: 65,
      aiMatches: 18
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Navigation />
      
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Recruitment Command Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Leverage <span className="text-primary font-semibold">advanced AI intelligence</span> to discover, evaluate, and hire exceptional
              <br />talent faster than ever before.
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              onClick={handleSeedDatabase}
              disabled={isSeeding}
            >
              <BrainCircuit className="mr-2 h-5 w-5" />
              {isSeeding ? "Seeding..." : "Seed Database"}
            </Button>
            <Button 
              size="lg" 
              className="bg-success-green hover:bg-success-green/90 text-white shadow-lg"
              onClick={() => setIsPostJobModalOpen(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              Post Premium Job
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          {/* Active Jobs */}
          <Card className="relative overflow-hidden border-t-4 border-t-stat-blue-icon bg-stat-blue/30 backdrop-blur shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-stat-blue-icon/10 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Active Jobs</p>
                  <p className="text-4xl font-bold text-foreground">{dashboardStats.activeJobs.value}</p>
                  <p className="text-xs font-semibold text-success-green flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {dashboardStats.activeJobs.growth} this month
                  </p>
                </div>
                <div className="p-4 bg-stat-blue rounded-2xl">
                  <Briefcase className="h-8 w-8 text-stat-blue-icon" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardStats.activeJobs.metric1}</p>
                  <p className="text-xs text-muted-foreground">{dashboardStats.activeJobs.label1}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardStats.activeJobs.metric2}</p>
                  <p className="text-xs text-muted-foreground">{dashboardStats.activeJobs.label2}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Matches Found */}
          <Card className="relative overflow-hidden border-t-4 border-t-stat-purple-icon bg-stat-purple/30 backdrop-blur shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-stat-purple-icon/10 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">AI Matches Found</p>
                  <p className="text-4xl font-bold text-foreground">{dashboardStats.aiMatches.value}</p>
                  <p className="text-xs font-semibold text-success-green flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {dashboardStats.aiMatches.growth} this week
                  </p>
                </div>
                <div className="p-4 bg-stat-purple rounded-2xl">
                  <BrainCircuit className="h-8 w-8 text-stat-purple-icon" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardStats.aiMatches.metric1}</p>
                  <p className="text-xs text-muted-foreground">{dashboardStats.aiMatches.label1}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardStats.aiMatches.metric2}</p>
                  <p className="text-xs text-muted-foreground">{dashboardStats.aiMatches.label2}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Applicants */}
          <Card className="relative overflow-hidden border-t-4 border-t-stat-mint-icon bg-stat-mint/30 backdrop-blur shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-stat-mint-icon/10 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Applicants</p>
                  <p className="text-4xl font-bold text-foreground">{dashboardStats.totalApplicants.value}</p>
                  <p className="text-xs font-semibold text-success-green flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {dashboardStats.totalApplicants.growth} this month
                  </p>
                </div>
                <div className="p-4 bg-stat-mint rounded-2xl">
                  <Users className="h-8 w-8 text-stat-mint-icon" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardStats.totalApplicants.metric1}</p>
                  <p className="text-xs text-muted-foreground">{dashboardStats.totalApplicants.label1}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardStats.totalApplicants.metric2}</p>
                  <p className="text-xs text-muted-foreground">{dashboardStats.totalApplicants.label2}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Successful Hires */}
          <Card className="relative overflow-hidden border-t-4 border-t-stat-coral-icon bg-stat-coral/30 backdrop-blur shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-stat-coral-icon/10 rounded-full -mr-16 -mt-16" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Successful Hires</p>
                  <p className="text-4xl font-bold text-foreground">{dashboardStats.successfulHires.value}</p>
                  <p className="text-xs font-semibold text-success-green flex items-center mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {dashboardStats.successfulHires.growth} this quarter
                  </p>
                </div>
                <div className="p-4 bg-stat-coral rounded-2xl">
                  <UserCheck className="h-8 w-8 text-stat-coral-icon" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardStats.successfulHires.metric1}</p>
                  <p className="text-xs text-muted-foreground">{dashboardStats.successfulHires.label1}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{dashboardStats.successfulHires.metric2}</p>
                  <p className="text-xs text-muted-foreground">{dashboardStats.successfulHires.label2}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === "postings" ? "default" : "outline"}
            onClick={() => setActiveTab("postings")}
            className={`rounded-full px-6 ${activeTab === "postings" ? "bg-white text-primary shadow-md" : "bg-white/50 text-muted-foreground hover:bg-white/80"}`}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Job Management
          </Button>
          <Button
            variant={activeTab === "matching" ? "default" : "outline"}
            onClick={() => setActiveTab("matching")}
            className={`rounded-full px-6 ${activeTab === "matching" ? "bg-white text-primary shadow-md" : "bg-white/50 text-muted-foreground hover:bg-white/80"}`}
          >
            <BrainCircuit className="h-4 w-4 mr-2" />
            AI Intelligence
          </Button>
          <Button
            variant={activeTab === "pipeline" ? "default" : "outline"}
            onClick={() => setActiveTab("pipeline")}
            className={`rounded-full px-6 ${activeTab === "pipeline" ? "bg-white text-primary shadow-md" : "bg-white/50 text-muted-foreground hover:bg-white/80"}`}
          >
            <Users className="h-4 w-4 mr-2" />
            Talent Pipeline
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="postings" className="space-y-6 mt-0">
            {selectedJobId ? (
              <JobMatchesView 
                jobId={selectedJobId} 
                onBack={() => setSelectedJobId(null)}
              />
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Active Job Postings</h2>
                  <Select defaultValue="active">
                    <SelectTrigger className="w-[180px] bg-white">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active Jobs</SelectItem>
                      <SelectItem value="all">All Jobs</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {loadingJobs ? (
                  <div className="text-center py-12">
                    <BrainCircuit className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading your jobs...</p>
                  </div>
                ) : jobs.length === 0 ? (
                  <Card className="p-12 text-center shadow-lg bg-white/80 backdrop-blur">
                    <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-bold mb-2">No jobs posted yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start by creating your first job posting with AI-powered candidate matching
                    </p>
                    <Button 
                      onClick={() => setIsPostJobModalOpen(true)}
                      className="bg-gradient-primary hover:shadow-glow"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Post Your First Job
                    </Button>
                  </Card>
                ) : (
                  <Card className="shadow-lg bg-white/80 backdrop-blur">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="border-b bg-muted/30">
                            <tr>
                              <th className="text-left p-5 font-semibold text-sm text-foreground">Job Details</th>
                              <th className="text-left p-5 font-semibold text-sm text-foreground">Salary Range</th>
                              <th className="text-left p-5 font-semibold text-sm text-foreground">Status</th>
                              <th className="text-left p-5 font-semibold text-sm text-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {jobs.map((job, index) => (
                              <tr key={job.id} className={`border-b hover:bg-muted/20 transition-colors ${index % 2 === 0 ? 'bg-white/50' : 'bg-transparent'}`}>
                                <td className="p-5">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-bold text-base">{job.job_title}</h3>
                                      {job.is_premium && (
                                        <Badge className="bg-gradient-primary text-white text-xs">
                                          Premium
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{job.company_name}</p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {job.location}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-5">
                                  <span className="flex items-center gap-1 text-sm">
                                    <DollarSign className="h-3 w-3" />
                                    ${job.salary_min/1000}k - ${job.salary_max/1000}k
                                  </span>
                                </td>
                                <td className="p-5">
                                  <Badge className={job.status === "active" ? "bg-success-green/20 text-success-green hover:bg-success-green/20" : "bg-warning-orange/20 text-warning-orange hover:bg-warning-orange/20"}>
                                    {job.status}
                                  </Badge>
                                </td>
                                <td className="p-5">
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setSelectedJobId(job.id)}
                                    >
                                      <BrainCircuit className="h-4 w-4 mr-2" />
                                      AI Matches
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="matching" className="space-y-6">
            <div className="text-center py-12">
              <BrainCircuit className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Candidate Matching</h3>
              <p className="text-muted-foreground mb-4">
                Advanced AI algorithms to match candidates with your job postings.
              </p>
              <Button>Start AI Matching</Button>
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6 mt-0">
            <CandidatePipeline />
          </TabsContent>
        </Tabs>
      </div>

      <PostJobModal open={isPostJobModalOpen} onOpenChange={setIsPostJobModalOpen} />
    </div>
  );
};

export default RecruiterDashboard;