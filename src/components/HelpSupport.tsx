import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Upload, CheckCircle, Lock } from 'lucide-react';
import Sidebar from './Sidebar';

type CurrentView = 'landing' | 'dashboard' | 'generate' | 'documents' | 'sets' | 'billing' | 'settings' | 'support';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpSupportProps {
  onLogout: () => void;
  onNavigate: (view: CurrentView) => void;
}

const HelpSupport = ({ onLogout, onNavigate }: HelpSupportProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    message: '',
    attachment: null as File | null
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I upload documents for question generation?',
      answer: 'Go to "My Documents" in the sidebar, click "Upload New Document" and select PDF, DOCX, or PPTX files up to 10MB. The AI will use these documents as reference material for generating questions.',
      category: 'Getting Started'
    },
    {
      id: '2',
      question: 'What question types are supported?',
      answer: 'ExamGenius supports Multiple Choice Questions (MCQ), True/False, Fill-in-the-Blank, and Short Answer questions. You can mix different types in a single question set.',
      category: 'Question Generation'
    },
    {
      id: '3',
      question: 'How accurate are the AI-generated questions?',
      answer: 'Our AI is trained on curriculum-aligned content and generates pedagogically sound questions. However, we recommend reviewing and editing questions before use to ensure they meet your specific requirements.',
      category: 'Question Generation'
    },
    {
      id: '4',
      question: 'Can I edit generated questions?',
      answer: 'Yes! After generation, you can review, edit, regenerate individual questions, or shuffle the entire set. All changes are saved automatically.',
      category: 'Question Generation'
    },
    {
      id: '5',
      question: 'How do question limits work?',
      answer: 'Question limits reset every month on your billing date. Free accounts get 20 questions/month, Pro gets 200, and Institutional gets 1000. Unused questions do not roll over.',
      category: 'Billing'
    },
    {
      id: '6',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and mobile money payments (MTN Mobile Money, Vodafone Cash, AirtelTigo Money) for Ghanaian users.',
      category: 'Billing'
    },
    {
      id: '7',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from the Billing page. You\'ll retain access to Pro features until the end of your current billing period.',
      category: 'Billing'
    },
    {
      id: '8',
      question: 'How do I export questions to Word format?',
      answer: 'From the question review page or "My Question Sets", click the "Export to DOCX" button. The system will generate a formatted Word document with questions and answer keys.',
      category: 'Export'
    },
    {
      id: '9',
      question: 'Which curriculum standards does ExamGenius follow?',
      answer: 'ExamGenius is aligned with the Ghana Education Service (GES) and National Council for Curriculum and Assessment (NaCCA) standards for both JHS and SHS levels.',
      category: 'Curriculum'
    },
    {
      id: '10',
      question: 'Can I use the same document for multiple question sets?',
      answer: 'Yes! Once uploaded, documents remain in your library and can be reused for generating different question sets with various curriculum topics.',
      category: 'Documents'
    },
    {
      id: '11',
      question: 'How do I set up authentication with Clerk?',
      answer: 'ExamGenius uses Clerk for secure authentication. You need to add your Clerk publishable key to the .env file. Visit our Authentication Help page for detailed instructions.',
      category: 'Authentication'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularFaqs = faqs.slice(0, 6);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTicketForm(prev => ({ ...prev, attachment: file }));
    }
  };

  const handleSubmitTicket = () => {
    // Generate a random ticket number
    const ticketNum = `#${Math.floor(Math.random() * 9000) + 1000}`;
    setTicketNumber(ticketNum);
    setShowSuccessMessage(true);
    
    // Reset form
    setTicketForm({
      subject: '',
      message: '',
      attachment: null
    });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  const handleReset = () => {
    setTicketForm({
      subject: '',
      message: '',
      attachment: null
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} currentView="support" />
      
      <div className="flex-1">
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h1>

          {/* Authentication Help Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Authentication Help</CardTitle>
              <CardDescription>
                Having trouble with authentication? Visit our dedicated page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <p className="text-sm">
                  Set up or troubleshoot Clerk authentication for your application.
                </p>
                <Button variant="outline" onClick={() => window.location.href = '/auth-help'}>
                  Authentication Help
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Success Message */}
          {showSuccessMessage && (
            <Card className="mb-6 bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      Thank you! Your ticket {ticketNumber} has been submitted.
                    </p>
                    <p className="text-sm text-green-700">
                      We'll get back to you within 24 hours via email.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search FAQs */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search FAQs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Popular FAQs or Search Results */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {searchTerm ? `Search Results (${filteredFaqs.length})` : 'Popular FAQs'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {(searchTerm ? filteredFaqs : popularFaqs).map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2">
                        <p className="text-gray-700 mb-2">{faq.answer}</p>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {faq.category}
                        </span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              {searchTerm && filteredFaqs.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No FAQs found matching "{searchTerm}". Try different keywords or contact support below.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Contact Support Form */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={ticketForm.subject} 
                  onValueChange={(value) => setTicketForm(prev => ({ ...prev, subject: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="account">Account Issue</SelectItem>
                    <SelectItem value="curriculum">Curriculum Question</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question in detail..."
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={6}
                  maxLength={2000}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Please provide as much detail as possible</span>
                  <span>{ticketForm.message.length}/2000</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachment">Attach Screenshot (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="attachment"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('attachment')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                  {ticketForm.attachment && (
                    <span className="text-sm text-gray-600">
                      {ticketForm.attachment.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Accepted formats: JPG, PNG, PDF (max 5MB)
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button 
                  onClick={handleSubmitTicket}
                  disabled={!ticketForm.subject || !ticketForm.message.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Ticket
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
