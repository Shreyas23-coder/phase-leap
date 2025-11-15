import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ResumeUploadProps {
  onUploadSuccess?: (data: any) => void;
}

export const ResumeUpload = ({ onUploadSuccess }: ResumeUploadProps = {}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }

    await uploadResume(file);
  };

  const uploadResume = async (file: File) => {
    setUploading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to upload your resume.",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('upload-resume', {
        body: formData,
      });

      if (error) throw error;

      setUploadedFile(file.name);
      
      // Store matches in localStorage if available
      if (data.matches && data.matches.length > 0) {
        localStorage.setItem('aiMatches', JSON.stringify(data.matches));
      }
      
      // Call success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
      
      const matchCount = data.matches?.length || 0;
      toast({
        title: "Resume Uploaded Successfully",
        description: data.parsed 
          ? `Profile auto-populated! Found ${matchCount} matching jobs.`
          : "Your resume has been uploaded and saved to your profile.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload resume",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or DOCX file.",
          variant: "destructive",
        });
        return;
      }
      await uploadResume(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Card 
      className="p-12 text-center border-2 border-dashed border-primary/20 bg-gradient-card backdrop-blur-xl hover:border-primary/40 hover:shadow-glow transition-all rounded-2xl cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
    >
      <CardContent className="flex flex-col items-center space-y-6 p-0">
        {uploadedFile ? (
          <>
            <div className="p-6 bg-success/10 rounded-3xl">
              <div className="p-4 bg-success/20 rounded-2xl">
                <CheckCircle className="h-16 w-16 text-success" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-success">Resume Uploaded!</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <p>{uploadedFile}</p>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Your resume has been analyzed. You can now view your AI-matched jobs.
              </p>
            </div>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                setUploadedFile(null);
              }}
              variant="outline"
              className="mt-4"
            >
              Upload New Resume
            </Button>
          </>
        ) : (
          <>
            <div className="p-6 bg-gradient-glow rounded-3xl">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Upload className="h-16 w-16 text-primary" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">Upload Your Resume</h3>
              <p className="text-muted-foreground max-w-md">
                Drag and drop your resume here or click to browse. Our AI will analyze it to extract your skills and experience.
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF and DOCX files (Max 5MB)
              </p>
            </div>
            <Button 
              size="lg" 
              disabled={uploading}
              className="mt-4 bg-gradient-primary hover:shadow-glow transition-all text-lg px-8 py-6 rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Upload className="mr-2 h-5 w-5" />
              {uploading ? "Uploading..." : "Upload & Analyze Resume"}
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};