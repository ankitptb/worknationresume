import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import FileUpload from '@/components/FileUpload';
import RoleSelector from '@/components/RoleSelector';
import ProcessingStatus from '@/components/ProcessingStatus';
import { supabase } from '@/integrations/supabase/client';
import { ResumeAnalysis } from '@/types/resume';
import { FileText } from 'lucide-react';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileSelect = async (file: File) => {
    if (!selectedRole) {
      toast.error('Please select a target role before analyzing your resume.');
      return;
    }

    setIsProcessing(true);

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: {
          fileBase64: base64,
          fileName: file.name,
          fileType: file.type,
          targetRole: selectedRole,
        },
      });

      if (error) throw error;

      const analysis = data as ResumeAnalysis;

      if (!analysis.isResume) {
        toast.error("This file doesn't appear to be a resume. ATS cannot parse this document.");
        setIsProcessing(false);
        return;
      }

      navigate('/results', { state: { analysis } });
    } catch (err: any) {
      console.error('Resume analysis error:', err);
      toast.error(err?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            AI Resume Scorer
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Upload your resume and get an instant AI-powered score with actionable feedback.
          </p>
        </div>

        {isProcessing ? (
          <ProcessingStatus isProcessing={isProcessing} />
        ) : (
          <div className="space-y-6">
            <RoleSelector selectedRole={selectedRole} onSelect={setSelectedRole} />
            <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Supports PDF and DOCX files up to 10MB. Your resume is analyzed securely and not stored.
        </p>
      </div>
    </div>
  );
};

export default Index;
