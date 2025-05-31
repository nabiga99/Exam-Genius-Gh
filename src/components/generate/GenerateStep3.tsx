
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GenerateFormData } from '../GenerateWizard';

interface GenerateStep3Props {
  data: GenerateFormData;
  onUpdate: (updates: Partial<GenerateFormData>) => void;
}

const GenerateStep3: React.FC<GenerateStep3Props> = ({ data, onUpdate }) => {
  const maxChars = 500;
  const remainingChars = maxChars - data.additionalNotes.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Notes & Generate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="E.g., Focus on application-level questions covering Photosynthesis. Include diagrams where appropriate. Make questions suitable for JHS Form 2 level."
            value={data.additionalNotes}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) {
                onUpdate({ additionalNotes: e.target.value });
              }
            }}
            className="min-h-[120px] resize-none"
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              Provide specific guidance to help the AI generate better questions
            </span>
            <span className={`${remainingChars < 50 ? 'text-orange-500' : 'text-gray-500'}`}>
              {data.additionalNotes.length}/{maxChars}
            </span>
          </div>
        </div>

        {/* Examples of good notes */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <h4 className="font-medium text-blue-800 mb-2">Examples of helpful notes:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• "Focus on practical applications and real-world examples"</li>
              <li>• "Include questions about laboratory procedures and safety"</li>
              <li>• "Make sure difficulty is appropriate for Form 2 students"</li>
              <li>• "Include some questions that require calculations"</li>
              <li>• "Emphasize understanding of processes over memorization"</li>
            </ul>
          </CardContent>
        </Card>

        {/* Warning about generation */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Before generating:</p>
                <p>
                  Please review your selections in the summary panel. Once you click "Generate Questions," 
                  the AI will create your question set based on your document and curriculum selections. 
                  This process typically takes 1-3 minutes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default GenerateStep3;
