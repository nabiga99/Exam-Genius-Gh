import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Download, Trash2, TrendingUp, BookOpen, Clock, Award } from 'lucide-react';
import Sidebar from './Sidebar';

type CurrentView = 'landing' | 'dashboard' | 'generate' | 'documents' | 'sets' | 'billing' | 'settings' | 'support';

interface DashboardProps {
  onCreateNew: () => void;
  onLogout: () => void;
  onNavigate: (view: CurrentView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateNew, onLogout, onNavigate }) => {
  // Mock data - in real app, this would come from API/database
  const userData = {
    fullName: "John Doe",
    plan: {
      name: "Free",
      monthlyLimit: 20
    }
  };

  const usageData = {
    usageCount: 12,
    monthlyLimit: 20
  };

  const recentSets = [
    {
      id: '1',
      date: '2024-01-15',
      subStrand: 'Photosynthesis',
      count: 15,
      status: 'Completed' as const,
      subject: 'Science'
    },
    {
      id: '2',
      date: '2024-01-12',
      subStrand: 'Algebraic Expressions',
      count: 20,
      status: 'Completed' as const,
      subject: 'Mathematics'
    },
    {
      id: '3',
      date: '2024-01-10',
      subStrand: 'Reading Comprehension',
      count: 12,
      status: 'Draft' as const,
      subject: 'English'
    }
  ];

  const tips = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      title: "Upload Quality Documents",
      description: "Use comprehensive syllabi and teaching notes for better question generation."
    },
    {
      icon: <Award className="w-6 h-6 text-green-500" />,
      title: "Review Before Use",
      description: "Always review and edit generated questions to ensure they meet your standards."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
      title: "Mix Question Types",
      description: "Combine MCQ, True/False, and Short Answer questions for comprehensive assessment."
    }
  ];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const usagePercentage = (usageData.usageCount / usageData.monthlyLimit) * 100;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} currentView="dashboard" />
      
      <div className="flex-1">
        <div className="p-6">
          {/* Welcome Banner */}
          <Card className="mb-8 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    {getTimeGreeting()}, {userData.fullName}!
                  </h1>
                  <p className="text-green-100 mb-4">
                    Ready to create your next question set?
                  </p>
                  <Button 
                    onClick={onCreateNew}
                    className="bg-white text-green-600 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Generate New Set
                  </Button>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Usage Snapshot */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>This Month's Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Questions Generated</span>
                    <span className="font-semibold">
                      {usageData.usageCount} / {usageData.monthlyLimit}
                    </span>
                  </div>
                  <Progress value={usagePercentage} className="w-full" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{userData.plan.name} Plan</span>
                    {usagePercentage > 80 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onNavigate('billing')}
                      >
                        Upgrade to Pro
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Sets</span>
                    <span className="font-semibold">{recentSets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Documents</span>
                    <span className="font-semibold">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">This Week</span>
                    <span className="font-semibold">8 questions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Question Sets</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onNavigate('sets')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentSets.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No question sets yet</p>
                    <Button onClick={onCreateNew} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Generate New Set
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentSets.map((set) => (
                      <div key={set.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-sm">{set.subStrand}</h4>
                            <Badge 
                              variant={set.status === 'Completed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {set.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">
                            {set.count} questions • {set.date}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Carousel */}
            <Card>
              <CardHeader>
                <CardTitle>Tips for Better Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {tip.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                        <p className="text-xs text-gray-600">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
