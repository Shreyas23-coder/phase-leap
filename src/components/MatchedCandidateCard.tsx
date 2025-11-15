import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { User, MapPin, Briefcase, CheckCircle2, XCircle, Calendar } from "lucide-react";

interface MatchedCandidateCardProps {
  candidate: any;
  matchScore: number;
  matchingSkills: string[];
  reason?: string;
  skillMatchDetails?: any;
}

export const MatchedCandidateCard = ({ 
  candidate, 
  matchScore, 
  matchingSkills,
  reason,
  skillMatchDetails 
}: MatchedCandidateCardProps) => {
  const allSkills = candidate.skills || [];
  const missingSkills = allSkills.filter((skill: string) => !matchingSkills.includes(skill));
  
  return (
    <Card className="hover:shadow-lg transition-all border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{candidate.full_name || 'Candidate'}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {candidate.location || 'Location not specified'}
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {candidate.experience_years || 0} years
                </div>
              </div>
            </div>
          </div>
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 px-4 py-1.5 text-base font-bold">
            {matchScore}% Match
          </Badge>
        </div>

        {reason && (
          <p className="text-sm text-muted-foreground mb-4 italic">
            {reason}
          </p>
        )}

        <div className="space-y-4">
          {/* Skills Matched */}
          {matchingSkills.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold text-success">
                  Skills Matched ({matchingSkills.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchingSkills.map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="outline" 
                    className="border-success/30 text-success bg-success/5"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Skills Missing */}
          {missingSkills.length > 0 && missingSkills.length <= 10 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-semibold text-destructive">
                  Skills Missing ({missingSkills.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingSkills.slice(0, 8).map((skill) => (
                  <Badge 
                    key={skill} 
                    variant="outline" 
                    className="border-destructive/30 text-destructive bg-destructive/5"
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Match Score Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Match Score</span>
              <span className="text-sm font-bold text-destructive">{matchScore}%</span>
            </div>
            <Progress 
              value={matchScore} 
              className="h-2 bg-secondary"
            />
          </div>

          {/* Experience Match Indicator */}
          {skillMatchDetails?.experience_match && (
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-medium">Experience Match</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <Button className="flex-1 bg-gradient-primary hover:shadow-glow">
            View Full Profile
          </Button>
          <Button variant="outline" className="flex-1">
            Add to Pipeline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
