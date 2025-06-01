import { useUser } from '@clerk/clerk-react';
import { isClerkAvailable } from '@/lib/clerk-utils';
import { Badge } from '@/components/ui/badge';
import { getUserDisplayName } from '@/lib/auth-utils';

export const AuthStatus = () => {
  const hasClerk = isClerkAvailable();
  const clerkHook = hasClerk ? useUser() : { isLoaded: true, isSignedIn: false, user: null };
  
  // For development mode
  const devUser = !hasClerk ? 
    (localStorage.getItem('dev-user') ? JSON.parse(localStorage.getItem('dev-user')!) : null) : 
    null;
  
  const { isLoaded, isSignedIn, user } = clerkHook;
  
  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="animate-pulse">Loading...</Badge>
      </div>
    );
  }
  
  if (hasClerk && isSignedIn && user) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="default" className="bg-green-600">
          Clerk: {getUserDisplayName(user)}
        </Badge>
      </div>
    );
  }
  
  if (!hasClerk && devUser) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="secondary">
          Dev Mode: {getUserDisplayName(devUser)}
        </Badge>
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      <Badge variant="destructive">Not Authenticated</Badge>
    </div>
  );
}; 