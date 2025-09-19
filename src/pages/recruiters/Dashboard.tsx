import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  BrainCircuit
} from "lucide-react";
import Navigation from "@/components/ui/navigation";
import { Link } from "react-router-dom";

const RecruiterDashboard = () => {
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
    activeJobs: 8,
    totalApplicants: 156,
    newThisWeek: 23,
    interviewsScheduled: 7
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
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-3xl font-bold">{dashboardStats.activeJobs}</p>
                </div>
                <Briefcase className="h-8 w-8 text-primary" />
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
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New This Week</p>
                  <p className="text-3xl font-bold text-success">{dashboardStats.newThisWeek}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Interviews</p>
                  <p className="text-3xl font-bold text-warning">{dashboardStats.interviewsScheduled}</p>
                </div>
                <UserCheck className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Active Jobs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Active Job Postings</h2>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="space-y-4">
              {activeJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <Badge variant="secondary">{job.status}</Badge>
                          {job.newApplicants > 0 && (
                            <Badge variant="secondary" className="bg-success/10 text-success">
                              {job.newApplicants} New
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{job.department} • Posted {job.posted}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link to={`/recruiters/jobs/${job.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </Link>
                        <Link to={`/recruiters/jobs/${job.id}/candidates`}>
                          <Button size="sm">
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{job.applicants}</span>
                        <span className="text-muted-foreground">Applicants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="h-4 w-4 text-primary" />
                        <span className="font-medium">{job.aiMatches}</span>
                        <span className="text-muted-foreground">AI Matches</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-warning" />
                        <span className="font-medium">{job.interviews}</span>
                        <span className="text-muted-foreground">Interviews</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Active</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Link to="/recruiters/jobs">
                <Button variant="outline">
                  View All Jobs
                </Button>
              </Link>
            </div>
          </div>

          {/* Top AI-Matched Candidates */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Top AI Matches</h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <BrainCircuit className="mr-1 h-3 w-3" />
                AI Powered
              </Badge>
            </div>

            <div className="space-y-3">
              {topCandidates.map((candidate) => (
                <Card key={candidate.id} className="cursor-pointer hover:shadow-soft transition-shadow">
                  <Link to={`/recruiters/candidates/${candidate.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{candidate.name}</h4>
                          <p className="text-sm text-muted-foreground">{candidate.title}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${candidate.matchScore >= 95 ? 'bg-success/10 text-success' : 
                                    candidate.matchScore >= 90 ? 'bg-warning/10 text-warning' : 
                                    'bg-info/10 text-info'
                                   }`}
                        >
                          <Star className="mr-1 h-3 w-3" />
                          {candidate.matchScore}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>{candidate.location} • {candidate.experience}</p>
                        <Badge variant="outline" className="text-xs">
                          {candidate.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            <Link to="/recruiters/candidates">
              <Button variant="outline" className="w-full">
                View All Candidates
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;