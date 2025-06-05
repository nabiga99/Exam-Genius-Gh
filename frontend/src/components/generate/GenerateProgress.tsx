import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Home, RefreshCw, Info } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface GenerateProgressProps {
  requestId: string;
  onComplete: (setId: string) => void;
  onDashboard: () => void;
}

const GenerateProgress: React.FC<GenerateProgressProps> = ({ 
  requestId, 
  onComplete,
  onDashboard
}) => {
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'complete' | 'failed'>('pending');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    let intervalId: number | undefined;
    
    const checkStatus = async () => {
      try {
        const response = await api.checkQuestionSetStatus(requestId);
        setStatus(response.status);
        setProgress(response.progressPct);
        setError(response.error);
        
        if (response.status === 'complete' && response.setId) {
          setIsPolling(false);
          toast({
            title: "Success!",
            description: "Your exam questions have been generated successfully.",
          });
          onComplete(response.setId);
        } else if (response.status === 'failed') {
          setIsPolling(false);
          toast({
            variant: "destructive",
            title: "Generation Failed",
            description: response.error || "An unknown error occurred.",
          });
        }
      } catch (error) {
        console.error('Error checking status:', error);
        setStatus('failed');
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        setIsPolling(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check generation status. Please try again.",
        });
      }
    };
    
    // Initial check
    checkStatus();
    
    // Set up polling if not complete or failed
    if (isPolling) {
      intervalId = window.setInterval(checkStatus, 3000);
    }
    
    // Clean up interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [requestId, onComplete, isPolling]);

  const handleRetry = async () => {
    try {
      // Get the original form data from localStorage
      const requestData = localStorage.getItem(`request_${requestId}`);
      if (!requestData) {
        throw new Error('Request data not found');
      }
      
      const { formData } = JSON.parse(requestData);
      
      // Create a new request with the same form data
      const newRequestId = await api.createQuestionSetRequest(formData);
      
      // Reset state and start polling again
      setStatus('pending');
      setProgress(0);
      setError(undefined);
      setIsPolling(true);
      
      // Update the requestId in the parent component
      // This is a bit of a hack - in a real app, you'd use a more robust approach
      window.history.replaceState(null, '', `?requestId=${newRequestId}`);
      window.location.reload();
    } catch (error) {
      console.error('Error retrying generation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to retry generation. Please try again.",
      });
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'pending':
        return 'Preparing to generate your exam questions...';
      case 'in_progress':
        if (progress < 30) {
          return 'Analyzing document content...';
        } else if (progress < 60) {
          return 'Generating questions based on curriculum...';
        } else {
          return 'Finalizing and formatting your exam questions...';
        }
      case 'complete':
        return 'Your exam questions have been generated successfully!';
      case 'failed':
        return error || 'An error occurred while generating your exam questions.';
      default:
        return 'Processing your request...';
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Generating Exam Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">{getStatusMessage()}</p>
        </div>
        
        {status === 'failed' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'An error occurred during question generation.'}
            </AlertDescription>
          </Alert>
        )}
        
        {status === 'in_progress' && progress > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This process may take a few minutes depending on the complexity and length of your document.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-center space-x-4 pt-4">
          {status === 'failed' ? (
            <>
              <Button onClick={handleRetry} variant="default">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
              <Button onClick={onDashboard} variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
            </>
          ) : (
            <Button onClick={onDashboard} variant="outline" disabled={status === 'pending' || status === 'in_progress'}>
              <Home className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GenerateProgress; 