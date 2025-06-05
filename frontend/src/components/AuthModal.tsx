import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { auth } from '@/lib/auth';
import { toast } from '@/components/ui/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  initialMode?: AuthMode;
}

type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, initialMode = 'login' }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [subject, setSubject] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update mode when initialMode prop changes
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return null;
  };

  const validatePhone = (phone: string) => {
    // Ghana phone number format: +233XXXXXXXXX or 0XXXXXXXXX (10 digits)
    const ghanaPhoneRegex = /^(\+233|0)[2-9][0-9]{8}$/;
    if (!ghanaPhoneRegex.test(phone)) {
      return 'Please enter a valid Ghana phone number (+233XXXXXXXXX or 0XXXXXXXXX)';
    }
    return null;
  };

  const validateForm = () => {
    setError(null);
    
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    if (mode !== 'forgot-password') {
      if (!password) {
        setError('Password is required');
        return false;
      }
      
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        return false;
      }
    }
    
    if (mode === 'register') {
      if (!name) {
        setError('Full name is required');
        return false;
      }
      
      if (!school) {
        setError('School name is required');
        return false;
      }
      
      if (!subject) {
        setError('Subject taught is required');
        return false;
      }
      
      if (!phone) {
        setError('Phone number is required');
        return false;
      }
      
      const phoneError = validatePhone(phone);
      if (phoneError) {
        setError(phoneError);
        return false;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (mode === 'login') {
        await auth.login(email, password);
        toast({
          title: "Login Successful",
          description: "Welcome back to Exam Genius Ghana!",
        });
        onLogin();
      } else if (mode === 'register') {
        await auth.register(email, password, name, school, subject, phone);
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Welcome to Exam Genius Ghana!",
        });
        onLogin();
      } else if (mode === 'forgot-password') {
        await auth.requestPasswordReset(email);
        resetForm();
        setMode('login');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setSchool('');
    setSubject('');
    setPhone('');
    setError(null);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Login to Your Account';
      case 'register': return 'Create an Account';
      case 'forgot-password': return 'Reset Your Password';
      case 'reset-password': return 'Set New Password';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto my-4">
        <DialogHeader className="mb-1">
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {mode === 'login' && 'Enter your credentials to access your account.'}
            {mode === 'register' && 'Create a new account to get started.'}
            {mode === 'forgot-password' && 'Enter your email to receive a password reset link.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Email field - shown in all modes */}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              required
              className="h-9"
            />
          </div>
          
          {/* Name field - only shown in register mode */}
          {mode === 'register' && (
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                disabled={isLoading}
                required
                className="h-9"
              />
            </div>
          )}
          
          {/* School name field - only shown in register mode */}
          {mode === 'register' && (
            <div className="space-y-1">
              <Label htmlFor="school">School Name</Label>
              <Input 
                id="school" 
                type="text" 
                value={school} 
                onChange={(e) => setSchool(e.target.value)}
                placeholder="Ghana Secondary School"
                disabled={isLoading}
                required
                className="h-9"
              />
            </div>
          )}
          
          {/* Subject taught field - only shown in register mode */}
          {mode === 'register' && (
            <div className="space-y-1">
              <Label htmlFor="subject">Subject Taught</Label>
              <Input 
                id="subject" 
                type="text" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Mathematics, Science, etc."
                disabled={isLoading}
                required
                className="h-9"
              />
            </div>
          )}
          
          {/* Phone number field - only shown in register mode */}
          {mode === 'register' && (
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number (Ghana format)</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233XXXXXXXXX or 0XXXXXXXXX"
                disabled={isLoading}
                required
                className="h-9"
              />
            </div>
          )}
          
          {/* Password field - not shown in forgot-password mode */}
          {mode !== 'forgot-password' && (
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="h-9"
              />
            </div>
          )}
          
          {/* Confirm Password field - only shown in register mode */}
          {mode === 'register' && (
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
                className="h-9"
              />
            </div>
          )}
          
          {/* Action buttons */}
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : (
                mode === 'login' ? 'Login' : 
                mode === 'register' ? 'Create Account' : 
                mode === 'forgot-password' ? 'Send Reset Link' : 
                'Reset Password'
              )}
            </Button>
          </div>
          
          {/* Mode switching links */}
          <div className="text-center space-y-2 pt-2">
            {mode === 'login' && (
              <>
                <p className="text-sm">
                  <button 
                    type="button"
                    onClick={() => switchMode('forgot-password')}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Forgot your password?
                  </button>
                </p>
                <p className="text-sm">
                  Don't have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => switchMode('register')}
                    className="text-blue-600 hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </>
            )}
            
            {mode === 'register' && (
              <p className="text-sm">
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-blue-600 hover:underline"
                >
                  Log in
                </button>
              </p>
            )}
            
            {mode === 'forgot-password' && (
              <p className="text-sm">
                <button 
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-blue-600 hover:underline"
                >
                  Back to login
                </button>
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
