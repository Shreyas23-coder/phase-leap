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
  User
} from "lucide-react";
import Navigation from "@/components/ui/navigation";
import { Link } from "react-router-dom";
import { useState } from "react";

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState("postings");
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
    activeJobs: 3,
    totalApplicants: 86,
    aiMatches: 50
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
            <p className="text-muted-foreground">Manage your job postings and candidate pipeline.</p>
          </div>
          <Link to="/recruiters/jobs/new">
            <Button size="lg" className="bg-gradient-primary">
              <Plus className="mr-2 h-5 w-5" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-3xl font-bold">{dashboardStats.activeJobs}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Applicants</p>
                  <p className="text-3xl font-bold">{dashboardStats.totalApplicants}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Matches</p>
                  <p className="text-3xl font-bold">{dashboardStats.aiMatches}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BrainCircuit className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="postings" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Your Job Postings
            </TabsTrigger>
            <TabsTrigger value="matching" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              AI Candidate Matching
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Candidate Pipeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="postings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Job Postings</h2>
              <select className="px-3 py-2 border rounded-md text-sm">
                <option>Active Jobs</option>
                <option>All Jobs</option>
                <option>Draft</option>
              </select>
            </div>

            {/* Job Postings Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">JOB TITLE</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">STATUS</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">POSTED</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">APPLICANTS</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">AI MATCHES</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div>
                            <h3 className="font-semibold">Senior Software Engineer</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              TechCorp Inc.
                            </p>
                            <p className="text-sm text-muted-foreground">San Francisco, CA (Remote)</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                            <p className="text-xs text-muted-foreground mt-1">Deadline: Apr 30, 2025</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm">Mar 28, 2025</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold">12</span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold">8</span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <Button variant="outline" size="sm" className="w-full text-xs">
                              View Applicants
                            </Button>
                            <Button variant="outline" size="sm" className="w-full text-xs">
                              <Settings className="h-3 w-3 mr-1" />
                              Find AI Matches
                            </Button>
                          </div>
                        </td>
                      </tr>
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
    </div>
  );
};

export default RecruiterDashboard;