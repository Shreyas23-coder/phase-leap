import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface PipelineStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage: 'new' | 'contacted' | 'screening' | 'interview' | 'offer';
  candidateName: string;
  initialNote?: string;
  onSave: (note: string, scheduledDate?: string) => void;
}

const stageLabels = {
  new: 'New Candidate',
  contacted: 'Contacted',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer'
};

const stageDescriptions = {
  new: 'Initial candidate review and assessment',
  contacted: 'First contact made with candidate',
  screening: 'Phone or video screening call',
  interview: 'In-depth interview process',
  offer: 'Offer extended or negotiation phase'
};

export const PipelineStageDialog = ({
  open,
  onOpenChange,
  stage,
  candidateName,
  initialNote = '',
  onSave
}: PipelineStageDialogProps) => {
  const [note, setNote] = useState(initialNote);
  const [scheduledDate, setScheduledDate] = useState('');

  const handleSave = () => {
    onSave(note, scheduledDate || undefined);
    onOpenChange(false);
    setNote('');
    setScheduledDate('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {stageLabels[stage]} - {candidateName}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {stageDescriptions[stage]}
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {(stage === 'interview' || stage === 'screening') && (
            <div className="space-y-2">
              <Label htmlFor="scheduled-date">Schedule Date & Time</Label>
              <Input
                id="scheduled-date"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="note">Notes</Label>
            <Textarea
              id="note"
              placeholder={`Add notes about this ${stageLabels[stage].toLowerCase()} stage...`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
