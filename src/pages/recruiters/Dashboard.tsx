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

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState("postings");
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
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

            {/* Job Postings Table */}
            <Card className="shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/30">
                      <tr>
                        <th className="text-left p-5 font-semibold text-sm text-foreground">Job Details</th>
                        <th className="text-left p-5 font-semibold text-sm text-foreground">Performance</th>
                        <th className="text-left p-5 font-semibold text-sm text-foreground">AI Analytics</th>
                        <th className="text-left p-5 font-semibold text-sm text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobPostings.map((job, index) => (
                        <tr key={job.id} className={`border-b hover:bg-muted/20 transition-colors ${index % 2 === 0 ? 'bg-white/50' : 'bg-transparent'}`}>
                          <td className="p-5">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base">{job.title}</h3>
                                <Badge variant={job.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                                  {job.priority}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {job.salary}
                                </span>
                                <Badge variant="outline" className="text-xs">{job.type}</Badge>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="space-y-1">
                              <Badge className={job.status === "Active" ? "bg-success-green/20 text-success-green hover:bg-success-green/20" : "bg-warning-orange/20 text-warning-orange hover:bg-warning-orange/20"}>
                                {job.status}
                              </Badge>
                              <p className="text-xs text-muted-foreground">Posted {job.posted}</p>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stat-blue">
                                  <Users className="h-5 w-5 text-stat-blue-icon" />
                                </div>
                                <div>
                                  <p className="text-lg font-bold text-stat-blue-icon">{job.applicants}</p>
                                  <p className="text-xs text-muted-foreground">applicants</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-stat-purple">
                                  <BrainCircuit className="h-5 w-5 text-stat-purple-icon" />
                                </div>
                                <div>
                                  <p className="text-lg font-bold text-stat-purple-icon">{job.aiMatches}</p>
                                  <p className="text-xs text-muted-foreground">AI matches</p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex gap-2">
                              <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                                <Eye className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                              <Button variant="outline" size="sm">
                                Edit Job
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

          <TabsContent value="pipeline" className="space-y-6">
            <div className="text-center py-12">
              <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Candidate Pipeline</h3>
              <p className="text-muted-foreground mb-4">
                Manage your recruitment pipeline and track candidate progress.
              </p>
              <Button>View Pipeline</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <PostJobModal open={isPostJobModalOpen} onOpenChange={setIsPostJobModalOpen} />
    </div>
  );
};

export default RecruiterDashboard;