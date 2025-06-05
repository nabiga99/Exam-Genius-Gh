import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileText, Download, Clock } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
  onSignUp: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted, onSignUp }) => {
  const features = [
    {
      title: "Save Hours on Question Prep",
      description: "Generate comprehensive question sets in minutes, not hours",
      icon: Clock
    },
    {
      title: "Precisely Aligned to NaCCA Curriculum",
      description: "Questions perfectly matched to Ghanaian JHS & SHS curriculum standards",
      icon: CheckCircle
    },
    {
      title: "Multiple Formats (MCQ, T/F, Fill-in, etc.)",
      description: "Support for all question types including MCQ, True/False, Fill-in-the-Blank, and Short Answer",
      icon: FileText
    },
    {
      title: "Export Directly to Word (DOCX)",
      description: "Download ready-to-use question papers and answer keys",
      icon: Download
    }
  ];

  const testimonials = [
    {
      quote: "As a JHS teacher in Tamale, ExamGenius has transformed how I prepare assessments. What used to take me 3 hours now takes 15 minutes!",
      author: "Margaret Asante",
      school: "Tamale JHS"
    },
    {
      quote: "The curriculum alignment is spot-on. Every question perfectly matches the NaCCA standards for my SHS Chemistry classes.",
      author: "Dr. Kwame Osei",
      school: "Accra Senior High"
    },
    {
      quote: "My students' performance has improved since I started using more varied question types from ExamGenius.",
      author: "Grace Mensah",
      school: "Cape Coast JHS"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-lg mr-3"></div>
                <span className="font-bold text-xl text-gray-900">ExamGenius Ghana</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Home</a>
              <a href="#features" className="text-gray-600 hover:text-green-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-green-600 transition-colors">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-green-600 transition-colors">About</a>
              <a href="#help" className="text-gray-600 hover:text-green-600 transition-colors">Help</a>
              <Button variant="outline" onClick={onGetStarted}>Login</Button>
              <Button onClick={onSignUp}>Sign Up</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Generate Curriculum-Aligned Exam Questions in Minutes
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            AI-powered, built for Ghanaian JHS & SHS teachers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted} className="bg-green-600 hover:bg-green-700">
              Get Started (Free)
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Create Perfect Assessments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Trusted by Teachers Across Ghana
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="pt-6">
                  <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.school}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg mr-3"></div>
                <span className="font-bold text-xl">ExamGenius Ghana</span>
              </div>
              <p className="text-gray-400">
                AI-powered question generation for Ghanaian educators
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="mailto:support@examgenius.gh" className="hover:text-white transition-colors">support@examgenius.gh</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ExamGenius Ghana. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
