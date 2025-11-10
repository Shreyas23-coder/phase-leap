import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Briefcase, BrainCircuit, Eye, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PostJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PostJobModal = ({ open, onOpenChange }: PostJobModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    experienceMin: "",
    experienceMax: "",
    salaryMin: "",
    salaryMax: "",
    location: "",
    description: "",
    visibility: "premium"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const toggleJobType = (type: string) => {
    if (jobTypes.includes(type)) {
      setJobTypes(jobTypes.filter(t => t !== type));
    } else {
      setJobTypes([...jobTypes, type]);
    }
  };

  const validateJobDetails = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }
    if (skills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }
    if (!formData.experienceMin || !formData.experienceMax) {
      newErrors.experience = "Experience range is required";
    }
    if (!formData.location.trim() && !isRemote) {
      newErrors.location = "Location is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAndContinue = () => {
    if (validateJobDetails()) {
      setActiveTab("matching");
      toast({
        title: "Job details saved",
        description: "Proceeding to AI matching configuration",
      });
    } else {
      toast({
        title: "Validation failed",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  const handlePublish = () => {
    toast({
      title: "Job posted successfully! 🎉",
      description: "Your job posting is now live and AI matching is active",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background via-purple-50/20 to-blue-50/20 dark:from-background dark:via-purple-950/20 dark:to-blue-950/20 border-border/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Post Premium Job
          </DialogTitle>
          <DialogDescription>
            Create a new job posting with AI-powered candidate matching
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="details" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Job Details
            </TabsTrigger>
            <TabsTrigger value="matching" className="gap-2" disabled={Object.keys(errors).length > 0}>
              <BrainCircuit className="h-4 w-4" />
              AI Matching
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2" disabled={Object.keys(errors).length > 0}>
              <Eye className="h-4 w-4" />
              Preview & Publish
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-0">
            <div className="space-y-4">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={errors.companyName ? "border-destructive" : ""}
                />
                {errors.companyName && (
                  <p className="text-sm text-destructive">{errors.companyName}</p>
                )}
              </div>

              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="jobTitle">
                  Job Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className={errors.jobTitle ? "border-destructive" : ""}
                />
                {errors.jobTitle && (
                  <p className="text-sm text-destructive">{errors.jobTitle}</p>
                )}
              </div>

              {/* Skills Required */}
              <div className="space-y-2">
                <Label>
                  Skills Required <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddSkill} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
                {errors.skills && (
                  <p className="text-sm text-destructive">{errors.skills}</p>
                )}
              </div>

              {/* Experience Required */}
              <div className="space-y-2">
                <Label>
                  Experience Required <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Select
                      value={formData.experienceMin}
                      onValueChange={(value) => setFormData({ ...formData, experienceMin: value })}
                    >
                      <SelectTrigger className={errors.experience ? "border-destructive" : ""}>
                        <SelectValue placeholder="Min years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 years</SelectItem>
                        <SelectItem value="1">1 year</SelectItem>
                        <SelectItem value="2">2 years</SelectItem>
                        <SelectItem value="3">3 years</SelectItem>
                        <SelectItem value="5">5 years</SelectItem>
                        <SelectItem value="7">7 years</SelectItem>
                        <SelectItem value="10">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select
                      value={formData.experienceMax}
                      onValueChange={(value) => setFormData({ ...formData, experienceMax: value })}
                    >
                      <SelectTrigger className={errors.experience ? "border-destructive" : ""}>
                        <SelectValue placeholder="Max years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 year</SelectItem>
                        <SelectItem value="3">3 years</SelectItem>
                        <SelectItem value="5">5 years</SelectItem>
                        <SelectItem value="7">7 years</SelectItem>
                        <SelectItem value="10">10 years</SelectItem>
                        <SelectItem value="15">15+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {errors.experience && (
                  <p className="text-sm text-destructive">{errors.experience}</p>
                )}
              </div>

              {/* Salary Range */}
              <div className="space-y-2">
                <Label>Salary Range (optional)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Min (e.g. 80000)"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Max (e.g. 120000)"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-4 mb-2">
                  <Switch checked={isRemote} onCheckedChange={setIsRemote} />
                  <span className="text-sm">Remote position</span>
                </div>
                <Input
                  id="location"
                  placeholder={isRemote ? "Remote, Worldwide" : "e.g. San Francisco, CA"}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={errors.location ? "border-destructive" : ""}
                  disabled={isRemote}
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location}</p>
                )}
              </div>

              {/* Job Type / Seniority Tags */}
              <div className="space-y-2">
                <Label>Job Type & Seniority</Label>
                <div className="flex flex-wrap gap-2">
                  {["Full-time", "Part-time", "Contract", "Senior", "Mid-level", "Junior"].map((type) => (
                    <Badge
                      key={type}
                      variant={jobTypes.includes(type) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleJobType(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Job Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, requirements, and benefits..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`min-h-[150px] ${errors.description ? "border-destructive" : ""}`}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description.length} characters
                </p>
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label>Posting Type</Label>
                <Select value={formData.visibility} onValueChange={(value) => setFormData({ ...formData, visibility: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium (Featured + AI Boost)</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAndContinue} className="bg-primary">
                Save & Continue
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="matching" className="space-y-6 mt-0">
            <div className="text-center py-12">
              <BrainCircuit className="h-16 w-16 mx-auto text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Matching Configuration</h3>
              <p className="text-muted-foreground mb-6">
                Configure how AI will match candidates to this position
              </p>
              <div className="space-y-4 max-w-md mx-auto text-left">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <span>Auto-match candidates</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <span>Send match notifications</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <span>Priority matching</span>
                  <Switch />
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("preview")} className="bg-primary">
                Continue to Preview
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-0">
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-2xl font-bold mb-2">{formData.jobTitle || "Job Title"}</h3>
                <p className="text-lg text-muted-foreground mb-4">{formData.companyName || "Company Name"}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>{formData.location || isRemote ? "Remote" : "Location"}</Badge>
                  {formData.salaryMin && formData.salaryMax && (
                    <Badge variant="secondary">
                      ${parseInt(formData.salaryMin).toLocaleString()} - ${parseInt(formData.salaryMax).toLocaleString()}
                    </Badge>
                  )}
                  {jobTypes.map((type) => (
                    <Badge key={type} variant="outline">{type}</Badge>
                  ))}
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Experience</h4>
                    <p className="text-muted-foreground">
                      {formData.experienceMin} - {formData.experienceMax} years
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{formData.description}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setActiveTab("matching")}>
                Back
              </Button>
              <Button onClick={handlePublish} className="bg-success-green hover:bg-success-green/90">
                Publish Job
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
