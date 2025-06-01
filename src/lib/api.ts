import { GenerateFormData } from '@/components/GenerateWizard';
import { auth, authenticatedFetch } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';

// Types for API responses
export interface QuestionSetRequest {
  id: string;
  status: 'pending' | 'in_progress' | 'complete' | 'failed';
  progressPct: number;
  error?: string;
  setId?: string;
}

export interface QuestionSetResponse {
  id: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'MCQ' | 'True/False' | 'Fill-in-the-Blank' | 'Short Answer';
  text: string;
  options?: string[];
  answer: string | boolean | number;
}

// OpenRouter API configuration
const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "openai/gpt-4o-mini";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// API service
export const api = {
  /**
   * Create a new question set generation request
   */
  createQuestionSetRequest: async (formData: GenerateFormData): Promise<string> => {
    try {
      // Check if user is authenticated
      if (!auth.isAuthenticated()) {
        throw new Error('You must be logged in to generate questions');
      }
      
      // In a real implementation, this would make an API call to your backend
      // For now, we'll simulate it with a request ID
      const requestId = `req_${Math.random().toString(36).substring(2, 15)}`;
      
      const user = auth.getCurrentUser();
      
      // Store the request data in localStorage for demo purposes
      // In production, this would be handled by your backend
      localStorage.setItem(`request_${requestId}`, JSON.stringify({
        id: requestId,
        formData,
        status: 'pending',
        progressPct: 0,
        createdAt: new Date().toISOString(),
        userId: user?.id || 'anonymous'
      }));
      
      // Start processing in the background
      setTimeout(() => api.processQuestionGeneration(requestId, formData), 1000);
      
      return requestId;
    } catch (error) {
      console.error('Error creating question set request:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      throw error;
    }
  },

  /**
   * Check the status of a question set generation request
   */
  checkQuestionSetStatus: async (requestId: string): Promise<QuestionSetRequest> => {
    try {
      // Check if user is authenticated
      if (!auth.isAuthenticated()) {
        throw new Error('You must be logged in to check question generation status');
      }
      
      // In a real implementation, this would make an API call to your backend
      // For now, we'll simulate it with localStorage
      const requestData = localStorage.getItem(`request_${requestId}`);
      if (!requestData) {
        throw new Error('Request not found');
      }
      
      const request = JSON.parse(requestData);
      
      // Check if this request belongs to the current user
      const user = auth.getCurrentUser();
      if (user && request.userId && request.userId !== user.id) {
        throw new Error('You do not have permission to access this request');
      }
      
      return {
        id: request.id,
        status: request.status,
        progressPct: request.progressPct,
        error: request.error,
        setId: request.setId
      };
    } catch (error) {
      console.error('Error checking question set status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      throw error;
    }
  },

  /**
   * Get the generated question set
   */
  getQuestionSet: async (setId: string): Promise<QuestionSetResponse> => {
    try {
      // Check if user is authenticated
      if (!auth.isAuthenticated()) {
        throw new Error('You must be logged in to view question sets');
      }
      
      // In a real implementation, this would make an API call to your backend
      // For now, we'll simulate it with localStorage
      const setData = localStorage.getItem(`set_${setId}`);
      if (!setData) {
        throw new Error('Question set not found');
      }
      
      const questionSet = JSON.parse(setData);
      
      // Check if this question set belongs to the current user
      const user = auth.getCurrentUser();
      if (user && questionSet.userId && questionSet.userId !== user.id) {
        throw new Error('You do not have permission to access this question set');
      }
      
      return questionSet;
    } catch (error) {
      console.error('Error getting question set:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      throw error;
    }
  },
  
  /**
   * Process the question generation in the background
   * This simulates what would happen on your backend
   */
  processQuestionGeneration: async (requestId: string, formData: GenerateFormData) => {
    try {
      // Update status to in_progress
      let requestData = JSON.parse(localStorage.getItem(`request_${requestId}`) || '{}');
      requestData.status = 'in_progress';
      requestData.progressPct = 10;
      localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
      
      // Simulate document retrieval
      await new Promise(resolve => setTimeout(resolve, 1000));
      requestData.progressPct = 20;
      localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
      
      // Get mock document text (in production, you would fetch the actual document)
      const documentText = "This is a sample document about Ghana's educational curriculum...";
      
      // Prepare curriculum context
      const curriculum = {
        level: formData.classLevel,
        subject: formData.subjectId, // In production, you'd resolve IDs to actual names
        strand: formData.strandId,
        subStrand: formData.subStrandId
      };
      
      requestData.progressPct = 30;
      localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
      
      // Generate questions using OpenRouter API
      try {
        const questions = await generateQuestionsWithAI(
          documentText,
          curriculum,
          formData.questionTypes,
          formData.additionalNotes
        );
        
        requestData.progressPct = 90;
        localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
        
        // Get current user
        const user = auth.getCurrentUser();
        
        // Create the question set
        const setId = `set_${Math.random().toString(36).substring(2, 15)}`;
        const questionSet: QuestionSetResponse & { userId?: string } = {
          id: setId,
          questions,
          userId: user?.id
        };
        
        // Store the question set
        localStorage.setItem(`set_${setId}`, JSON.stringify(questionSet));
        
        // Mark the request as complete
        requestData.status = 'complete';
        requestData.progressPct = 100;
        requestData.setId = setId;
        localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
      } catch (error) {
        console.error('Error generating questions:', error);
        requestData.status = 'failed';
        requestData.error = error instanceof Error ? error.message : 'Unknown error';
        localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
      }
    } catch (error) {
      console.error('Error processing question generation:', error);
      // Update status to failed
      const requestData = JSON.parse(localStorage.getItem(`request_${requestId}`) || '{}');
      requestData.status = 'failed';
      requestData.error = error instanceof Error ? error.message : 'Unknown error';
      localStorage.setItem(`request_${requestId}`, JSON.stringify(requestData));
    }
  },
  
  /**
   * Save edited questions
   */
  saveQuestionSet: async (setId: string, questions: Question[]): Promise<void> => {
    try {
      // Check if user is authenticated
      if (!auth.isAuthenticated()) {
        throw new Error('You must be logged in to save questions');
      }
      
      // In a real implementation, this would make an API call to your backend
      // For now, we'll simulate it with localStorage
      const setData = localStorage.getItem(`set_${setId}`);
      if (!setData) {
        throw new Error('Question set not found');
      }
      
      const questionSet = JSON.parse(setData);
      
      // Check if this question set belongs to the current user
      const user = auth.getCurrentUser();
      if (user && questionSet.userId && questionSet.userId !== user.id) {
        throw new Error('You do not have permission to modify this question set');
      }
      
      // Update the questions
      questionSet.questions = questions;
      questionSet.updatedAt = new Date().toISOString();
      
      // Save back to localStorage
      localStorage.setItem(`set_${setId}`, JSON.stringify(questionSet));
    } catch (error) {
      console.error('Error saving question set:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      throw error;
    }
  },
  
  /**
   * Export question set to PDF (mock implementation)
   */
  exportToPDF: async (setId: string): Promise<void> => {
    try {
      // Check if user is authenticated
      if (!auth.isAuthenticated()) {
        throw new Error('You must be logged in to export questions');
      }
      
      // Get the question set
      const setData = localStorage.getItem(`set_${setId}`);
      if (!setData) {
        throw new Error('Question set not found');
      }
      
      const questionSet = JSON.parse(setData);
      
      // In a real implementation, we would generate a PDF on the server
      // For now, we'll create a simple text representation and trigger a download
      
      let content = "EXAM GENIUS GHANA - GENERATED QUESTIONS\n\n";
      content += "Date: " + new Date().toLocaleDateString() + "\n\n";
      
      questionSet.questions.forEach((q: Question, index: number) => {
        content += `Question ${index + 1}: ${q.type}\n`;
        content += q.text + "\n";
        
        if (q.type === 'MCQ' && q.options) {
          q.options.forEach((option, i) => {
            content += `${String.fromCharCode(65 + i)}. ${option}\n`;
          });
          content += `Answer: ${String.fromCharCode(65 + (q.answer as number))}\n`;
        } else if (q.type === 'True/False') {
          content += `Answer: ${q.answer ? 'True' : 'False'}\n`;
        } else {
          content += `Answer: ${q.answer}\n`;
        }
        
        content += "\n";
      });
      
      // Create a blob and trigger download
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exam-questions-${setId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Your questions have been exported to PDF.",
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      throw error;
    }
  },
  
  /**
   * Export question set to Word document (mock implementation)
   */
  exportToWord: async (setId: string): Promise<void> => {
    try {
      // Check if user is authenticated
      if (!auth.isAuthenticated()) {
        throw new Error('You must be logged in to export questions');
      }
      
      // Get the question set
      const setData = localStorage.getItem(`set_${setId}`);
      if (!setData) {
        throw new Error('Question set not found');
      }
      
      const questionSet = JSON.parse(setData);
      
      // In a real implementation, we would generate a Word document on the server
      // For now, we'll create a simple HTML representation and trigger a download
      
      let content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Exam Questions</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            .question { margin-bottom: 20px; }
            .answer { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>EXAM GENIUS GHANA - GENERATED QUESTIONS</h1>
          <p>Date: ${new Date().toLocaleDateString()}</p>
          <hr>
      `;
      
      questionSet.questions.forEach((q: Question, index: number) => {
        content += `<div class="question">`;
        content += `<h3>Question ${index + 1}: ${q.type}</h3>`;
        content += `<p>${q.text}</p>`;
        
        if (q.type === 'MCQ' && q.options) {
          content += `<ol type="A">`;
          q.options.forEach((option, i) => {
            const isAnswer = i === (q.answer as number);
            content += `<li${isAnswer ? ' class="answer"' : ''}>${option}</li>`;
          });
          content += `</ol>`;
          content += `<p>Answer: ${String.fromCharCode(65 + (q.answer as number))}</p>`;
        } else if (q.type === 'True/False') {
          content += `<p>Answer: <span class="answer">${q.answer ? 'True' : 'False'}</span></p>`;
        } else {
          content += `<p>Answer: <span class="answer">${q.answer}</span></p>`;
        }
        
        content += `</div>`;
      });
      
      content += `
        </body>
        </html>
      `;
      
      // Create a blob and trigger download
      const blob = new Blob([content], { type: 'application/vnd.ms-word' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exam-questions-${setId}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Your questions have been exported to Word.",
      });
    } catch (error) {
      console.error('Error exporting to Word:', error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
      throw error;
    }
  }
};

/**
 * Generate questions using OpenRouter API with the specified model
 */
async function generateQuestionsWithAI(
  documentText: string, 
  curriculum: { level: string, subject: string, strand: string, subStrand: string },
  questionTypes: Array<{ type: string, count: number }>,
  notes?: string
): Promise<Question[]> {
  try {
    // Prepare the prompt for the AI
    const prompt = `
    You are an expert educational content creator specializing in creating exam questions for Ghanaian students.
    
    Create exam questions based on the following parameters:
    - Educational Level: ${curriculum.level}
    - Subject: ${curriculum.subject}
    - Strand: ${curriculum.strand}
    - Sub-Strand: ${curriculum.subStrand}
    
    Question types to generate:
    ${questionTypes.map(qt => `- ${qt.count} ${qt.type} questions`).join('\n')}
    
    Additional notes: ${notes || 'None'}
    
    Document content to base questions on:
    ${documentText}
    
    Return the questions in JSON format as an array of objects with the following structure:
    {
      "id": "unique_id",
      "type": "question_type",
      "text": "question_text",
      "options": ["option1", "option2", "option3", "option4"], // Only for MCQ
      "answer": "correct_answer"
    }
    `;

    // Make the API call to OpenRouter
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin, // Required by OpenRouter
        'X-Title': 'Exam Genius Ghana' // Optional - your app name
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content: "You are an AI assistant that specializes in creating educational content for Ghanaian students."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    let parsedQuestions;
    try {
      const jsonResponse = JSON.parse(content);
      parsedQuestions = jsonResponse.questions || [];
      
      // Ensure each question has an ID
      parsedQuestions = parsedQuestions.map((q: any, index: number) => ({
        ...q,
        id: q.id || `q_${Math.random().toString(36).substring(2, 9)}_${index}`
      }));
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI response');
    }
    
    return parsedQuestions;
  } catch (error) {
    console.error('Error generating questions with AI:', error);
    throw error;
  }
}

export default api; 