import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Sidebar from './Sidebar';
import GenerateStep1 from './generate/GenerateStep1New';
import GenerateStep2 from './generate/GenerateStep2';
import GenerateStep3 from './generate/GenerateStep3';
import GenerateProgress from './generate/GenerateProgress';
import QuestionReview from './QuestionReview';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

type CurrentView = 'landing' | 'dashboard' | 'generate' | 'documents' | 'sets' | 'billing' | 'settings' | 'support';

interface GenerateWizardProps {
  onLogout: () => void;
  onNavigate: (view: CurrentView) => void;
}

export interface GenerateFormData {
  documentId: string;
  classLevel: 'JHS' | 'SHS' | '';
  classGrade: string; // BS7, BS8, BS9, SHS1, SHS2, SHS3
  subjectId: string;
  strandId: string;
  subStrandId: string;
  learningIndicators: string[]; // Array of selected learning indicator IDs
  questionTypes: Array<{
    id: string;
    type: 'MCQ' | 'True/False' | 'Fill-in-the-Blank' | 'Short Answer';
    count: number;
  }>;
  additionalNotes: string;
}

const GenerateWizard: React.FC<GenerateWizardProps> = ({ onLogout, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [questionSetId, setQuestionSetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<GenerateFormData>({
    documentId: '',
    classLevel: '',
    classGrade: '',
    subjectId: '',
    strandId: '',
    subStrandId: '',
    learningIndicators: [],
    questionTypes: [
      { id: '1', type: 'MCQ', count: 5 }
    ],
    additionalNotes: ''
  });

  // Validate step 1 data
  const isStep1Valid = () => {
    return (
      formData.documentId !== '' &&
      formData.classLevel !== '' &&
      formData.classGrade !== '' &&
      formData.subjectId !== '' &&
      formData.strandId !== '' &&
      formData.subStrandId !== '' &&
      formData.learningIndicators.length > 0
    );
  };

  // Validate step 2 data
  const isStep2Valid = () => {
    return formData.questionTypes.length > 0 && 
      formData.questionTypes.every(qt => qt.count > 0);
  };

  const handleNext = () => {
    if (currentStep === 1 && !isStep1Valid()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please complete all required fields before proceeding.",
      });
      return;
    }
    
    if (currentStep === 2 && !isStep2Valid()) {
      toast({
        variant: "destructive",
        title: "Invalid Question Types",
        description: "Please ensure all question types have a count greater than 0.",
      });
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      
      // Validate the form data before submission
      if (!isStep1Valid()) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please complete all curriculum context fields and select at least one learning indicator.",
        });
        setCurrentStep(1);
        return;
      }
      
      if (!isStep2Valid()) {
        toast({
          variant: "destructive",
          title: "Invalid Question Types",
          description: "Please ensure you have at least one question type with a count greater than 0.",
        });
        setCurrentStep(2);
        return;
      }
      
      // Create question set request
      const reqId = await api.createQuestionSetRequest(formData);
      setRequestId(reqId);
      setCurrentStep(4); // Move to progress page
      
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerationComplete = (setId: string) => {
    setQuestionSetId(setId);
    setCurrentStep(5); // Move to review page
    
    toast({
      title: "Success!",
      description: "Questions generated successfully!",
    });
  };

  const handleBackToDashboard = () => {
    setCurrentStep(1);
    setRequestId(null);
    setQuestionSetId(null);
  };

  const updateFormData = (updates: Partial<GenerateFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <GenerateStep1 data={formData} onUpdate={updateFormData} />;
      case 2:
        return <GenerateStep2 data={formData} onUpdate={updateFormData} />;
      case 3:
        return <GenerateStep3 data={formData} onUpdate={updateFormData} />;
      case 4:
        return requestId ? (
          <GenerateProgress 
            requestId={requestId} 
            onComplete={handleGenerationComplete}
            onDashboard={handleBackToDashboard} 
          />
        ) : (
          <div className="text-center p-8">
            <p>Error: No request ID found. Please try again.</p>
            <Button onClick={() => setCurrentStep(1)} className="mt-4">
              Start Over
            </Button>
          </div>
        );
      case 5:
        return questionSetId ? (
          <QuestionReview 
            setId={questionSetId} 
            onBack={handleBackToDashboard}
            onLogout={onLogout}
            onNavigate={onNavigate}
          />
        ) : (
          <div className="text-center p-8">
            <p>Error: No question set ID found. Please try again.</p>
            <Button onClick={() => setCurrentStep(1)} className="mt-4">
              Start Over
            </Button>
          </div>
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  // If we're on the review page, render it full screen
  if (currentStep === 5) {
    return renderStep();
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} currentView="generate" />
      
      <div className="flex-1">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              onClick={handleBackToDashboard}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Button>
          </div>
          
          <h1 className="text-2xl font-bold mb-8">Generate Exam Questions</h1>
          
          {currentStep <= 3 && (
            <div className="mb-8">
              <Progress value={(currentStep / 3) * 100} className="h-2" />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span className={currentStep >= 1 ? "font-medium text-primary" : ""}>Curriculum Context</span>
                <span className={currentStep >= 2 ? "font-medium text-primary" : ""}>Question Types</span>
                <span className={currentStep >= 3 ? "font-medium text-primary" : ""}>Review & Generate</span>
              </div>
            </div>
          )}
          
          <div className="flex-1 flex flex-col">
            {renderStep()}
          </div>
          
          {currentStep <= 3 && (
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handleBack} 
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleGenerate} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Questions'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateWizard;
