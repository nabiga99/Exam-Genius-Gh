
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { GenerateFormData } from '../GenerateWizard';

interface GenerateStep2Props {
  data: GenerateFormData;
  onUpdate: (updates: Partial<GenerateFormData>) => void;
}

const GenerateStep2: React.FC<GenerateStep2Props> = ({ data, onUpdate }) => {
  const questionTypeOptions = [
    { value: 'MCQ', label: 'Multiple Choice Questions (MCQ)' },
    { value: 'True/False', label: 'True/False' },
    { value: 'Fill-in-the-Blank', label: 'Fill-in-the-Blank' },
    { value: 'Short Answer', label: 'Short Answer' }
  ];

  const addQuestionType = () => {
    const newQuestionType = {
      id: `qt_${Date.now()}`,
      type: '' as any,
      count: 1
    };
    onUpdate({
      questionTypes: [...data.questionTypes, newQuestionType]
    });
  };

  const removeQuestionType = (id: string) => {
    onUpdate({
      questionTypes: data.questionTypes.filter(qt => qt.id !== id)
    });
  };

  const updateQuestionType = (id: string, field: 'type' | 'count', value: any) => {
    onUpdate({
      questionTypes: data.questionTypes.map(qt => 
        qt.id === id ? { ...qt, [field]: value } : qt
      )
    });
  };

  const hasValidationErrors = () => {
    return data.questionTypes.length === 0 || 
           data.questionTypes.some(qt => !qt.type || qt.count < 1);
  };

  const getTotalQuestions = () => {
    return data.questionTypes.reduce((total, qt) => total + qt.count, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Question Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">Select question types and counts</Label>
          <Button
            onClick={addQuestionType}
            variant="outline"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Question Type
          </Button>
        </div>

        {/* Question Type Rows */}
        <div className="space-y-4">
          {data.questionTypes.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please add at least one question type to continue.
              </AlertDescription>
            </Alert>
          ) : (
            data.questionTypes.map((questionType, index) => (
              <Card key={questionType.id} className="border-2 border-gray-100">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor={`type-${questionType.id}`}>Type</Label>
                      <Select
                        value={questionType.type}
                        onValueChange={(value) => 
                          updateQuestionType(questionType.id, 'type', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent>
                          {questionTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`count-${questionType.id}`}>Count</Label>
                      <Input
                        id={`count-${questionType.id}`}
                        type="number"
                        min="1"
                        max="100"
                        value={questionType.count}
                        onChange={(e) => 
                          updateQuestionType(
                            questionType.id, 
                            'count', 
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => removeQuestionType(questionType.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        disabled={data.questionTypes.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Validation errors for this row */}
                  {(!questionType.type || questionType.count < 1) && (
                    <Alert className="mt-3" variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please select a question type and enter a valid count (1-100).
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        {data.questionTypes.length > 0 && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-800">
                  Total Questions: {getTotalQuestions()}
                </span>
                <div className="text-sm text-green-700">
                  {data.questionTypes
                    .filter(qt => qt.type && qt.count > 0)
                    .map(qt => `${qt.type} (${qt.count})`)
                    .join(', ')}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall validation */}
        {hasValidationErrors() && data.questionTypes.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please complete all question type configurations before proceeding.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default GenerateStep2;
