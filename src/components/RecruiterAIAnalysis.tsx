import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Sparkles } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface RecruiterAIAnalysisProps {
  jobData: any;
  onAnalysisComplete: (matches: any[]) => void;
}

export const RecruiterAIAnalysis = ({ jobData, onAnalysisComplete }: RecruiterAIAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-job', {
        body: { jobData }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Analysis Complete",
          description: `Found ${data.matches.length} matching candidates for this position`,
        });
        
        onAnalysisComplete(data.matches);
      }
    } catch (error) {
      console.error('Error analyzing job:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze job posting",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20 shadow-soft">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-primary shadow-glow">
            <BrainCircuit className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              AI Candidate Matching
              <Sparkles className="h-4 w-4 text-primary" />
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Use AI to analyze this job posting and find the best matching candidates from our talent pool. Our advanced algorithm compares skills, experience, and preferences.
            </p>
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-gradient-primary hover:shadow-glow transition-all"
            >
              {isAnalyzing ? (
                <>Analyzing Candidates...</>
              ) : (
                <>
                  <BrainCircuit className="h-4 w-4 mr-2" />
                  Find Matching Candidates
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
