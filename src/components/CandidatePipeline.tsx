import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Users, Mail, Phone, Calendar, Linkedin, MapPin } from "lucide-react";
import { PipelineStageDialog } from "@/components/PipelineStageDialog";
import { useToast } from "@/components/ui/use-toast";

interface Candidate {
  id: string;
  name: string;
  initials: string;
  title: string;
  location: string;
  experience: string;
  matchScore: number;
  stage: 'new' | 'contacted' | 'screening' | 'interview' | 'offer';
  email: string;
  phone: string;
  linkedinUrl: string;
  skills: string[];
  availableDate: string;
  statusNote: string;
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Alex Johnson",
    initials: "AJ",
    title: "Senior Software Engineer",
    location: "San Francisco, CA",
    experience: "8 years experience",
    matchScore: 95,
    stage: "contacted",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    linkedinUrl: "https://linkedin.com/in/alexjohnson",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    availableDate: "2 weeks notice",
    statusNote: "Very interested in the role"
  },
  {
    id: "2",
    name: "Jamie Williams",
    initials: "JW",
    title: "Full Stack Developer",
    location: "Seattle, WA",
    experience: "5 years experience",
    matchScore: 89,
    stage: "screening",
    email: "jamie.williams@example.com",
    phone: "+1 (555) 987-6543",
    linkedinUrl: "https://linkedin.com/in/jamiewilliams",
    skills: ["Python", "Django", "PostgreSQL"],
    availableDate: "Immediately available",
    statusNote: ""
  },
  {
    id: "3",
    name: "Taylor Smith",
    initials: "TS",
    title: "Frontend Developer",
    location: "Portland, OR",
    experience: "4 years experience",
    matchScore: 87,
    stage: "new",
    email: "taylor.smith@example.com",
    phone: "+1 (555) 456-7890",
    linkedinUrl: "https://linkedin.com/in/taylorsmith",
    skills: ["Vue.js", "CSS", "JavaScript"],
    availableDate: "1 month notice",
    statusNote: ""
  },
  {
    id: "4",
    name: "Morgan Lewis",
    initials: "ML",
    title: "Backend Engineer",
    location: "Austin, TX",
    experience: "6 years experience",
    matchScore: 92,
    stage: "interview",
    email: "morgan.lewis@example.com",
    phone: "+1 (555) 321-0987",
    linkedinUrl: "https://linkedin.com/in/morganlewis",
    skills: ["Java", "Spring Boot", "Microservices"],
    availableDate: "3 weeks notice",
    statusNote: "Excellent cultural fit"
  },
];

const stageColors: Record<Candidate['stage'], string> = {
  new: "bg-blue-500/20 text-blue-600 hover:bg-blue-500/20",
  contacted: "bg-orange-500/20 text-orange-600 hover:bg-orange-500/20",
  screening: "bg-purple-500/20 text-purple-600 hover:bg-purple-500/20",
  interview: "bg-indigo-500/20 text-indigo-600 hover:bg-indigo-500/20",
  offer: "bg-green-500/20 text-green-600 hover:bg-green-500/20",
};

const stageLabels: Record<Candidate['stage'], string> = {
  new: "New",
  contacted: "Contacted",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
};

export const CandidatePipeline = () => {
  const [candidates] = useState<Candidate[]>(mockCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(candidates[0]);
  const [filterStage, setFilterStage] = useState<string>("all");
  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Candidate['stage']>('new');
  const { toast } = useToast();

  const filteredCandidates = filterStage === "all" 
    ? candidates 
    : candidates.filter(c => c.stage === filterStage);

  const handleStageUpdate = (candidateId: string, newStage: Candidate['stage']) => {
    // TODO: Update via Supabase
    console.log('Update stage:', candidateId, newStage);
  };

  const handleScheduleInterview = () => {
    // TODO: Implement interview scheduling
    console.log('Schedule interview for:', selectedCandidate?.id);
  };

  const handleSaveStageNote = (note: string, scheduledDate?: string) => {
    toast({
      title: "Stage Updated",
      description: `Note saved for ${stageLabels[selectedStage]} stage`,
    });
    console.log('Saving note:', { stage: selectedStage, note, scheduledDate, candidateId: selectedCandidate?.id });
    // TODO: Save to database
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-300px)]">
      {/* Candidate List */}
      <Card className="w-96 bg-white/80 backdrop-blur shadow-lg overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">Candidate Pipeline</h2>
          </div>
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="All Candidates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Candidates</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-y-auto h-[calc(100%-120px)]">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate)}
              className={`p-4 border-b cursor-pointer transition-colors ${
                selectedCandidate?.id === candidate.id 
                  ? 'bg-primary/10 border-l-4 border-l-primary' 
                  : 'hover:bg-muted/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {candidate.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm truncate">{candidate.name}</h3>
                    {candidate.stage === 'contacted' && <Mail className="h-3 w-3 text-orange-500" />}
                    {candidate.stage === 'screening' && <Phone className="h-3 w-3 text-purple-500" />}
                    {candidate.stage === 'interview' && <Calendar className="h-3 w-3 text-indigo-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{candidate.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{candidate.location}</span>
                  </div>
                  <Badge className={`mt-2 text-xs ${stageColors[candidate.stage]}`}>
                    {stageLabels[candidate.stage]}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Candidate Details */}
      {selectedCandidate && (
        <Card className="flex-1 bg-white/80 backdrop-blur shadow-lg overflow-y-auto">
          <CardContent className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center font-bold text-2xl text-primary">
                  {selectedCandidate.initials}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{selectedCandidate.name}</h1>
                  <p className="text-muted-foreground">{selectedCandidate.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {selectedCandidate.location}
                    <span className="mx-2">•</span>
                    {selectedCandidate.experience}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-success">{selectedCandidate.matchScore}</div>
                <div className="text-xs text-muted-foreground">Match Score</div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-4">Contact Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a href={`mailto:${selectedCandidate.email}`} className="text-sm text-primary hover:underline">
                      {selectedCandidate.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <a href={`tel:${selectedCandidate.phone}`} className="text-sm text-primary hover:underline">
                      {selectedCandidate.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">LinkedIn</p>
                    <a 
                      href={selectedCandidate.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-primary hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Availability</p>
                    <p className="text-sm">{selectedCandidate.availableDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCandidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Hiring Pipeline Progress */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-4">Hiring Pipeline Progress</h3>
              <div className="relative">
                <div className="absolute top-8 left-0 right-0 h-1 bg-muted" />
                <div className="flex justify-between items-center relative">
                  {(['new', 'contacted', 'screening', 'interview', 'offer'] as const).map((stage, index) => {
                    const isCompleted = index <= (['new', 'contacted', 'screening', 'interview', 'offer'] as const).indexOf(selectedCandidate.stage);
                    return (
                      <div key={stage} className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedStage(stage);
                            setStageDialogOpen(true);
                          }}
                          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110 ${
                            isCompleted ? 'bg-primary text-white hover:shadow-glow' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {stageLabels[stage].slice(0, 3)}
                        </button>
                        <span className="text-xs font-medium">{stageLabels[stage]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Candidate Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-4">Candidate Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Available:</span>
                  <span>{selectedCandidate.availableDate}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={stageColors[selectedCandidate.stage]}>
                    {stageLabels[selectedCandidate.stage]}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Status Note */}
            {selectedCandidate.statusNote && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4">Notes</h3>
                <p className="text-sm text-muted-foreground">{selectedCandidate.statusNote}</p>
              </div>
            )}

            {/* Actions */}
            <div className="border-t pt-6 flex gap-3">
              <Button 
                onClick={() => handleStageUpdate(selectedCandidate.id, 'contacted')}
                variant="outline"
                className="flex-1"
              >
                Add Note
              </Button>
              <Select 
                value={selectedCandidate.stage} 
                onValueChange={(value) => handleStageUpdate(selectedCandidate.id, value as Candidate['stage'])}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleScheduleInterview}
                className="flex-1 bg-gradient-primary"
              >
                Schedule Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pipeline Stage Dialog */}
      {selectedCandidate && (
        <PipelineStageDialog
          open={stageDialogOpen}
          onOpenChange={setStageDialogOpen}
          stage={selectedStage}
          candidateName={selectedCandidate.name}
          initialNote={selectedCandidate.statusNote}
          onSave={handleSaveStageNote}
        />
      )}
    </div>
  );
};