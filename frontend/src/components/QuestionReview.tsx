import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Download, Edit2, Save, Printer, FileText, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Sidebar from './Sidebar';
import { api, Question } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

type CurrentView = 'landing' | 'dashboard' | 'generate' | 'documents' | 'sets' | 'billing' | 'settings' | 'support';

interface QuestionReviewProps {
  setId: string;
  onBack: () => void;
  onLogout: () => void;
  onNavigate: (view: CurrentView) => void;
}

const QuestionReview: React.FC<QuestionReviewProps> = ({ setId, onBack, onLogout, onNavigate }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Question>>({});
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await api.getQuestionSet(setId);
        setQuestions(response.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError(error instanceof Error ? error.message : 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [setId]);

  const handleEdit = (question: Question) => {
    setEditingQuestionId(question.id);
    setEditForm({ ...question });
  };

  const handleSaveEdit = async () => {
    if (!editingQuestionId || !editForm) return;

    const updatedQuestions = questions.map(q =>
      q.id === editingQuestionId ? { ...q, ...editForm } as Question : q
    );

    setIsSaving(true);
    try {
      await api.saveQuestionSet(setId, updatedQuestions);
      setQuestions(updatedQuestions);
      setEditingQuestionId(null);
      setEditForm({});
      toast({
        title: "Question Updated",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      console.error('Error saving question:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditForm({});
  };

  const handleSelectQuestion = (questionId: string, selected: boolean) => {
    const newSelected = new Set(selectedQuestions);
    if (selected) {
      newSelected.add(questionId);
    } else {
      newSelected.delete(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIds = questions.map(q => q.id);
      setSelectedQuestions(new Set(allIds));
    } else {
      setSelectedQuestions(new Set());
    }
  };

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      await api.exportToWord(setId);
    } catch (error) {
      // Error is already handled in the API service
    } finally {
      setIsExporting(false);
    }
  };

  const filteredQuestions = activeTab === 'all' 
    ? questions 
    : questions.filter(q => q.type === activeTab);

  const renderQuestionContent = (question: Question) => {
    if (editingQuestionId === question.id) {
      return (
        <div className="space-y-4 p-4 border rounded-md bg-gray-50">
          <div>
            <label className="block text-sm font-medium mb-1">Question Type</label>
            <Select 
              value={editForm.type} 
              onValueChange={(value) => setEditForm({...editForm, type: value as Question['type']})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MCQ">Multiple Choice</SelectItem>
                <SelectItem value="True/False">True/False</SelectItem>
                <SelectItem value="Fill-in-the-Blank">Fill in the Blank</SelectItem>
                <SelectItem value="Short Answer">Short Answer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Question Text</label>
            <Textarea 
              value={editForm.text || ''} 
              onChange={(e) => setEditForm({...editForm, text: e.target.value})}
              rows={3}
            />
          </div>
          
          {editForm.type === 'MCQ' && (
            <div>
              <label className="block text-sm font-medium mb-1">Options</label>
              {(editForm.options || []).map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input 
                    value={option} 
                    onChange={(e) => {
                      const newOptions = [...(editForm.options || [])];
                      newOptions[index] = e.target.value;
                      setEditForm({...editForm, options: newOptions});
                    }}
                  />
                  <Checkbox 
                    checked={index === (editForm.answer as number)} 
                    onCheckedChange={() => setEditForm({...editForm, answer: index})}
                  />
                </div>
              ))}
            </div>
          )}
          
          {editForm.type === 'True/False' && (
            <div>
              <label className="block text-sm font-medium mb-1">Answer</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={editForm.answer === true} 
                    onCheckedChange={() => setEditForm({...editForm, answer: true})}
                  />
                  <span>True</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={editForm.answer === false} 
                    onCheckedChange={() => setEditForm({...editForm, answer: false})}
                  />
                  <span>False</span>
                </div>
              </div>
            </div>
          )}
          
          {(editForm.type === 'Fill-in-the-Blank' || editForm.type === 'Short Answer') && (
            <div>
              <label className="block text-sm font-medium mb-1">Answer</label>
              <Input 
                value={editForm.answer as string || ''} 
                onChange={(e) => setEditForm({...editForm, answer: e.target.value})}
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <p className="mb-4">{question.text}</p>
        
        {question.type === 'MCQ' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  checked={index === (question.answer as number)}
                  disabled
                />
                <span className={index === (question.answer as number) ? "font-medium" : ""}>
                  {option}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {question.type === 'True/False' && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox checked={question.answer === true} disabled />
              <span className={question.answer === true ? "font-medium" : ""}>True</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={question.answer === false} disabled />
              <span className={question.answer === false ? "font-medium" : ""}>False</span>
            </div>
          </div>
        )}
        
        {(question.type === 'Fill-in-the-Blank' || question.type === 'Short Answer') && (
          <div className="mt-2">
            <span className="text-sm font-medium">Answer: </span>
            <span>{question.answer as string}</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar onLogout={onLogout} onNavigate={onNavigate} currentView="sets" />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar onLogout={onLogout} onNavigate={onNavigate} currentView="sets" />
        <div className="flex-1 p-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <div className="flex justify-center mt-4">
            <Button onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} currentView="sets" />
      
      <div className="flex-1">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Question Sets
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar with filters and actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Question Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="MCQ">MCQ</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="True/False">T/F</TabsTrigger>
                      <TabsTrigger value="Fill-in-the-Blank">Fill-in</TabsTrigger>
                    </TabsList>
                    <TabsList className="grid grid-cols-1 mt-2">
                      <TabsTrigger value="Short Answer">Short Answer</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleExportWord}
                    disabled={isExporting}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {isExporting ? 'Exporting...' : 'Export as Word'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main content with questions */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Generated Questions</CardTitle>
                    <CardDescription>
                      Showing {filteredQuestions.length} of {questions.length} questions
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="select-all"
                      checked={selectedQuestions.size === questions.length && questions.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <label htmlFor="select-all" className="text-sm">Select All</label>
                  </div>
                </CardHeader>
              </Card>

              {filteredQuestions.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No questions found for the selected filter.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredQuestions.map((question, index) => (
                  <Card key={question.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 flex flex-row items-center justify-between py-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`select-${question.id}`}
                          checked={selectedQuestions.has(question.id)}
                          onCheckedChange={(checked) => handleSelectQuestion(question.id, checked === true)}
                        />
                        <div>
                          <CardTitle className="text-md">Question {index + 1}</CardTitle>
                          <CardDescription>{question.type}</CardDescription>
                        </div>
                      </div>
                      {editingQuestionId !== question.id && (
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(question)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="pt-4">
                      {renderQuestionContent(question)}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionReview; 