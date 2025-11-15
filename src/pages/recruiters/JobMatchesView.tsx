import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Briefcase, MapPin, DollarSign, Sparkles, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MatchedCandidateCard } from "@/components/MatchedCandidateCard";
import { RecruiterAIAnalysis } from "@/components/RecruiterAIAnalysis";

interface JobMatchesViewProps {
  jobId: string;
  onBack: () => void;
}

export const JobMatchesView = ({ jobId, onBack }: JobMatchesViewProps) => {
  const [job, setJob] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobAndMatches();
  }, [jobId]);

  const loadJobAndMatches = async () => {
    try {
      // Load job details
      const { data: jobData } = await supabase
        .from('job_postings')
        .select('*')
        .eq('id', jobId)
        .single();

      setJob(jobData);

      // Load AI matches
      const { data: matchData } = await supabase
        .from('ai_match_results')
        .select(`
          *,
          candidate:users!ai_match_results_candidate_id_fkey(
            id,
            full_name,
            email
          )
        `)
        .eq('job_id', jobId)
        .order('match_score', { ascending: false })
        .limit(10);

      if (matchData) {
        // Enrich with candidate profiles
        const enrichedMatches = await Promise.all(
          matchData.map(async (match) => {
            const { data: profile } = await supabase
              .from('candidate_profiles')
              .select('*')
              .eq('user_id', match.candidate_id)
              .single();

            return {
              ...match,
              candidate: {
                ...match.candidate,
                ...profile
              }
            };
          })
        );

        setMatches(enrichedMatches);
      }
    } catch (error) {
      console.error('Error loading job matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisComplete = (newMatches: any[]) => {
    setMatches(newMatches);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BrainCircuit className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading job matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
      </div>

      {job && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{job.job_title}</h2>
                <p className="text-lg text-muted-foreground">{job.company_name}</p>
              </div>
              {job.is_premium && (
                <Badge className="bg-gradient-primary text-white">
                  Premium
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                ${job.salary_min/1000}k - ${job.salary_max/1000}k
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {job.experience_min} - {job.experience_max} years
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {matches.length === 0 && (
        <RecruiterAIAnalysis 
          jobData={job} 
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}

      {matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Top {matches.length} AI-Matched Candidates
            </h3>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Using Gemini 2.5 Flash
            </Badge>
          </div>

          <div className="grid gap-4">
            {matches.map((match) => (
              <MatchedCandidateCard
                key={match.id}
                candidate={match.candidate}
                matchScore={match.match_score}
                matchingSkills={match.skill_match_details?.matched || []}
                reason={match.skill_match_details?.reason}
                skillMatchDetails={match}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
