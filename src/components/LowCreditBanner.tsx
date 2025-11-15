import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink, X } from "lucide-react";
import { useState } from "react";

interface LowCreditBannerProps {
  onDismiss?: () => void;
}

export const LowCreditBanner = ({ onDismiss }: LowCreditBannerProps) => {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  return (
    <Alert className="mb-6 border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20">
      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      <div className="flex items-start justify-between flex-1">
        <div className="flex-1">
          <AlertDescription className="text-orange-900 dark:text-orange-100">
            <span className="font-semibold">AI Credits Low:</span> Using simple skill-based matching instead. 
            For AI-powered matching, add credits in Settings → Workspace → Usage.
          </AlertDescription>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-orange-500 text-orange-700 hover:bg-orange-100 dark:text-orange-300 dark:hover:bg-orange-950"
              onClick={() => window.open('https://docs.lovable.dev/features/ai', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-orange-600 hover:text-orange-700 dark:text-orange-400"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};
