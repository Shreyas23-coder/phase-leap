import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Briefcase, GraduationCap, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkExperience {
  company: string;
  title: string;
  duration: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  year: string;
}

export const ProfileForm = () => {
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCertification, setNewCertification] = useState("");
  
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([{
    company: "",
    title: "",
    duration: "",
    description: ""
  }]);
  
  const [education, setEducation] = useState<Education[]>([{
    institution: "",
    degree: "",
    year: ""
  }]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addCertification = () => {
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification("");
    }
  };

  const removeCertification = (cert: string) => {
    setCertifications(certifications.filter(c => c !== cert));
  };

  const addWorkExperience = () => {
    setWorkExperience([...workExperience, { company: "", title: "", duration: "", description: "" }]);
  };

  const removeWorkExperience = (index: number) => {
    setWorkExperience(workExperience.filter((_, i) => i !== index));
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
    const updated = [...workExperience];
    updated[index][field] = value;
    setWorkExperience(updated);
  };

  const addEducation = () => {
    setEducation([...education, { institution: "", degree: "", year: "" }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Integrate with Supabase to save profile
    console.log({
      fullName,
      phone,
      linkedinUrl,
      location,
      skills,
      certifications,
      workExperience,
      education
    });

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card className="bg-gradient-card backdrop-blur-xl border border-border/50 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-gradient-card backdrop-blur-xl border border-border/50 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill (e.g., React, Python)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            />
            <Button type="button" onClick={addSkill} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeSkill(skill)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card className="bg-gradient-card backdrop-blur-xl border border-border/50 rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Work Experience
          </CardTitle>
          <Button type="button" onClick={addWorkExperience} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {workExperience.map((exp, index) => (
            <div key={index} className="space-y-4 p-4 bg-background/50 rounded-lg relative">
              {workExperience.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeWorkExperience(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    value={exp.title}
                    onChange={(e) => updateWorkExperience(index, 'title', e.target.value)}
                    placeholder="Senior Developer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={exp.duration}
                  onChange={(e) => updateWorkExperience(index, 'duration', e.target.value)}
                  placeholder="Jan 2020 - Present"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                  placeholder="Describe your role and achievements..."
                  rows={3}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="bg-gradient-card backdrop-blur-xl border border-border/50 rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Education
          </CardTitle>
          <Button type="button" onClick={addEducation} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="space-y-4 p-4 bg-background/50 rounded-lg relative">
              {education.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeEducation(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    placeholder="University Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    placeholder="Bachelor of Computer Science"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  value={edu.year}
                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                  placeholder="2015 - 2019"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="bg-gradient-card backdrop-blur-xl border border-border/50 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="Add a certification"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
            />
            <Button type="button" onClick={addCertification} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <Badge key={cert} variant="secondary" className="gap-1">
                {cert}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeCertification(cert)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit" className="bg-gradient-primary hover:shadow-glow">
          Save Profile
        </Button>
      </div>
    </form>
  );
};