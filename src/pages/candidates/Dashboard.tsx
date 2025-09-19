import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BrainCircuit, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  TrendingUp,
  MapPin,
  DollarSign,
  Clock,
  Star
} from "lucide-react";
import Navigation from "@/components/ui/navigation";
import { Link } from "react-router-dom";

const CandidateDashboard = () => {
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
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, Alex!</h1>
          <p className="text-muted-foreground">Here are your latest job matches and opportunities.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Profile Completion Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completion</span>
                  <span className="font-medium">{profileStats.profileCompletion}%</span>
                </div>
                <Progress value={profileStats.profileCompletion} className="h-2" />
              </div>
              
              <div className="space-y-3 text-sm">
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
              
              <Link to="/candidates/profile">
                <Button className="w-full" variant="outline">
                  Update Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Job Matches */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">AI-Matched Jobs</h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <BrainCircuit className="mr-1 h-4 w-4" />
                {jobMatches.length} New Matches
              </Badge>
            </div>

            <div className="space-y-4">
              {jobMatches.map((job) => (
                <Card key={job.id} className="hover:shadow-medium transition-shadow cursor-pointer">
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
                        <Link to={`/candidates/jobs/${job.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        <Button size="sm">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Link to="/candidates/jobs">
                <Button variant="outline">
                  View All Job Matches
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-medium transition-shadow">
            <Link to="/candidates/ai-feedback" className="block p-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-accent" />
                <div>
                  <h3 className="font-semibold">AI Career Chat</h3>
                  <p className="text-sm text-muted-foreground">Get personalized career advice</p>
                </div>
              </div>
            </Link>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-medium transition-shadow">
            <Link to="/candidates/resume" className="block p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Resume Builder</h3>
                  <p className="text-sm text-muted-foreground">Optimize your resume with AI</p>
                </div>
              </div>
            </Link>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-medium transition-shadow">
            <Link to="/candidates/analytics" className="block p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-success" />
                <div>
                  <h3 className="font-semibold">Job Market Insights</h3>
                  <p className="text-sm text-muted-foreground">Track market trends</p>
                </div>
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;