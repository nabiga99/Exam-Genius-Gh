import React from 'react';
import { verifyClerkSetup } from '@/lib/clerk-utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AuthHelp: React.FC = () => {
  const clerkSetup = verifyClerkSetup();
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Authentication Setup</CardTitle>
        <CardDescription>
          This page helps you verify and troubleshoot Clerk authentication setup
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Clerk Configuration Status</h3>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-6 mr-2">
                {clerkSetup.details.isKeyPresent ? 
                  <CheckCircle2 className="text-green-500 h-5 w-5" /> : 
                  <AlertCircle className="text-red-500 h-5 w-5" />
                }
              </div>
              <span>Publishable Key Present</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-6 mr-2">
                {!clerkSetup.details.isKeyEmpty ? 
                  <CheckCircle2 className="text-green-500 h-5 w-5" /> : 
                  <AlertCircle className="text-red-500 h-5 w-5" />
                }
              </div>
              <span>Publishable Key Not Empty</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-6 mr-2">
                {!clerkSetup.details.isPlaceholder ? 
                  <CheckCircle2 className="text-green-500 h-5 w-5" /> : 
                  <AlertCircle className="text-red-500 h-5 w-5" />
                }
              </div>
              <span>Using Real Key (Not Placeholder)</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-6 mr-2">
                {clerkSetup.details.isValidFormat ? 
                  <CheckCircle2 className="text-green-500 h-5 w-5" /> : 
                  <AlertCircle className="text-red-500 h-5 w-5" />
                }
              </div>
              <span>Valid Key Format</span>
            </div>
            
            {clerkSetup.details.isDevelopment && (
              <div className="flex items-center">
                <div className="w-6 mr-2">
                  <CheckCircle2 className="text-blue-500 h-5 w-5" />
                </div>
                <span>Using Development Key (pk_test_)</span>
              </div>
            )}
            
            {clerkSetup.details.isProduction && (
              <div className="flex items-center">
                <div className="w-6 mr-2">
                  <CheckCircle2 className="text-purple-500 h-5 w-5" />
                </div>
                <span>Using Production Key (pk_live_)</span>
              </div>
            )}
          </div>
          
          {clerkSetup.messages.length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuration Issues</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  {clerkSetup.messages.map((message, index) => (
                    <li key={index}>{message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {clerkSetup.isValid && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">Configuration Valid</AlertTitle>
              <AlertDescription className="text-green-600">
                Your Clerk authentication is properly configured.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">How to Fix Common Issues</h3>
          
          <ol className="list-decimal pl-5 space-y-2">
            <li>Create a <code>.env</code> file in the project root if it doesn't exist</li>
            <li>Add your Clerk publishable key:
              <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">
                VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
              </pre>
            </li>
            <li>Make sure the key starts with <code>pk_test_</code> (development) or <code>pk_live_</code> (production)</li>
            <li>Restart your development server</li>
          </ol>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Status
        </Button>
        
        <Button variant="outline" onClick={() => window.open('https://clerk.com/docs', '_blank')}>
          Clerk Documentation
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}; 