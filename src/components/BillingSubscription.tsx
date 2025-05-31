import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, CreditCard, Download, Star, Crown, Building } from 'lucide-react';
import Sidebar from './Sidebar';

type CurrentView = 'landing' | 'dashboard' | 'generate' | 'documents' | 'sets' | 'billing' | 'settings' | 'support';

interface Plan {
  id: string;
  name: string;
  price: number;
  monthlyLimit: number;
  features: string[];
  current: boolean;
  popular?: boolean;
}

interface PaymentTransaction {
  id: string;
  date: string;
  amount: number;
  status: string;
  invoiceUrl: string;
}

interface BillingSubscriptionProps {
  onLogout: () => void;
  onNavigate: (view: CurrentView) => void;
}

const BillingSubscription = ({ onLogout, onNavigate }: BillingSubscriptionProps) => {
  const [currentPlan] = useState<Plan>({
    id: 'free',
    name: 'Free',
    price: 0,
    monthlyLimit: 20,
    features: ['Up to 20 questions per month', 'Basic question types', 'DOCX export'],
    current: true
  });

  const [usageThisMonth] = useState(12);
  const [nextBillingDate] = useState('2024-02-15');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      monthlyLimit: 20,
      features: ['Up to 20 questions per month', 'Basic question types', 'DOCX export'],
      current: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 799,
      monthlyLimit: 200,
      features: [
        'Up to 200 questions per month',
        'All question types',
        'Priority AI processing',
        'Advanced editing tools',
        'Email support'
      ],
      popular: true,
      current: false
    },
    {
      id: 'institutional',
      name: 'Institutional',
      price: 2999,
      monthlyLimit: 1000,
      features: [
        'Up to 1000 questions per month',
        'All question types',
        'Priority AI processing',
        'Advanced editing tools',
        'Phone & email support',
        'Multiple teacher accounts',
        'Admin dashboard'
      ],
      current: false
    }
  ];

  const paymentHistory: PaymentTransaction[] = [
    {
      id: '1',
      date: '2024-01-15',
      amount: 799,
      status: 'Paid',
      invoiceUrl: '#'
    },
    {
      id: '2',
      date: '2023-12-15',
      amount: 799,
      status: 'Paid',
      invoiceUrl: '#'
    }
  ];

  const faqItems = [
    {
      question: 'How do question limits work?',
      answer: 'Question limits reset every month on your billing date. Unused questions do not roll over to the next month.'
    },
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and mobile money payments for Ghanaian users.'
    },
    {
      question: 'Is there a free trial for paid plans?',
      answer: 'Pro and Institutional plans come with a 7-day free trial. You can cancel anytime during the trial period.'
    }
  ];

  const handleUpgrade = (planId: string) => {
    // Simulate Stripe checkout
    console.log(`Upgrading to ${planId}`);
    // In real implementation, this would redirect to Stripe
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(false);
    // Implement cancellation logic
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'Pro':
        return <Star className="w-6 h-6 text-yellow-500" />;
      case 'Institutional':
        return <Building className="w-6 h-6 text-purple-500" />;
      default:
        return <CreditCard className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} currentView="billing" />
      
      <div className="flex-1">
        <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Billing & Subscription</h1>

          {/* Current Plan Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getPlanIcon(currentPlan.name)}
                <span>Current Plan: {currentPlan.name}</span>
                {currentPlan.name !== 'Free' && (
                  <Badge variant="secondary">Active</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Usage this month</span>
                    <span>{usageThisMonth} / {currentPlan.monthlyLimit} questions</span>
                  </div>
                  <Progress 
                    value={(usageThisMonth / currentPlan.monthlyLimit) * 100} 
                    className="w-full"
                  />
                </div>
                
                {currentPlan.name !== 'Free' && (
                  <p className="text-sm text-gray-600">
                    Next billing date: {nextBillingDate}
                  </p>
                )}
                
                <div className="flex space-x-2">
                  {currentPlan.name === 'Free' ? (
                    <Button onClick={() => handleUpgrade('pro')} className="bg-green-600 hover:bg-green-700">
                      Upgrade to Pro
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline">Change Plan</Button>
                      <Button 
                        variant="outline" 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setShowCancelModal(true)}
                      >
                        Cancel Subscription
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative ${plan.popular ? 'ring-2 ring-green-500' : ''} ${plan.current ? 'bg-green-50' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-600 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPlanIcon(plan.name)}
                        <span>{plan.name}</span>
                      </div>
                      {plan.current && <Badge variant="outline">Current</Badge>}
                    </CardTitle>
                    <div className="text-3xl font-bold text-gray-900">
                      {plan.price === 0 ? 'Free' : `₵${(plan.price / 100).toFixed(2)}`}
                      {plan.price > 0 && <span className="text-sm font-normal text-gray-600">/month</span>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.current ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                      disabled={plan.current}
                      onClick={() => !plan.current && handleUpgrade(plan.id)}
                    >
                      {plan.current ? 'Current Plan' : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          {currentPlan.name !== 'Free' && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium">**** **** **** 4242</p>
                      <p className="text-sm text-gray-600">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline">Update Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment History */}
          {paymentHistory.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((transaction) => (
                        <tr key={transaction.id} className="border-b">
                          <td className="py-2 text-sm">{transaction.date}</td>
                          <td className="py-2 text-sm">₵{(transaction.amount / 100).toFixed(2)}</td>
                          <td className="py-2">
                            <Badge className="bg-green-100 text-green-800">
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="py-2">
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Invoice
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to cancel your subscription? You'll lose access to Pro features at the end of your current billing period.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                Your subscription will remain active until {nextBillingDate}. After that, you'll be moved to the Free plan.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                Keep Subscription
              </Button>
              <Button variant="destructive" onClick={handleCancelSubscription}>
                Cancel Subscription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingSubscription;
