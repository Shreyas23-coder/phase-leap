import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Sparkles } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIAnalysisCardProps {
  onAnalysisComplete: () => void;
  profileData?: any;
  resumeText?: string;
}

export const AIAnalysisCard = ({ onAnalysisComplete, profileData, resumeText }: AIAnalysisCardProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-profile', {
        body: { profileData, resumeText }
      });

      if (error) throw error;

      if (data.success) {
        if (data.message) {
          // Show message if profile is incomplete
          toast({
            title: "Profile Incomplete",
            description: data.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Analysis Complete",
            description: `Found ${data.matches.length} matching jobs for your profile`,
          });
          
          // Store matches in localStorage for the AI Matches tab
          localStorage.setItem('aiMatches', JSON.stringify(data.matches));
          
          // Redirect to AI Matches tab
          onAnalysisComplete();
        }
      } else if (data?.error?.includes('credits') || data?.error?.includes('402')) {
        // Set flag for low credit banner
        localStorage.setItem('ai_credits_low', 'true');
        
        toast({
          title: "AI Credits Low",
          description: "Unable to run AI analysis. Please add credits or contact support.",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : '';
      if (errMsg.includes('credits') || errMsg.includes('402')) {
        localStorage.setItem('ai_credits_low', 'true');
      }
      console.error('Error analyzing profile:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze profile",
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
              AI Analysis
              <Sparkles className="h-4 w-4 text-primary" />
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get AI-powered job recommendations based on your profile and resume. Our advanced matching algorithm analyzes your skills and experience to find the perfect opportunities.
            </p>
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-gradient-primary hover:shadow-glow transition-all"
            >
              {isAnalyzing ? (
                <>Analyzing...</>
              ) : (
                <>
                  <BrainCircuit className="h-4 w-4 mr-2" />
                  Analyze & Find Matches
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
