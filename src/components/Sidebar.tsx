import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Plus, 
  FileText, 
  ClipboardList, 
  CreditCard, 
  User, 
  HelpCircle, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

type CurrentView = 'landing' | 'dashboard' | 'generate' | 'documents' | 'sets' | 'billing' | 'settings' | 'support';

interface SidebarProps {
  onLogout: () => void;
  onNavigate?: (view: CurrentView) => void;
  currentView?: CurrentView;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, onNavigate, currentView = 'dashboard' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(currentView);
  
  // Update active item when currentView changes
  useEffect(() => {
    setActiveItem(currentView);
  }, [currentView]);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: 'dashboard' },
    { icon: Plus, label: 'Generate New Set', path: 'generate' },
    { icon: FileText, label: 'My Documents', path: 'documents' },
    { icon: ClipboardList, label: 'My Question Sets', path: 'sets' },
    { icon: CreditCard, label: 'Billing & Subscription', path: 'billing' },
    { icon: User, label: 'Profile & Settings', path: 'settings' },
    { icon: HelpCircle, label: 'Help & Support', path: 'support' },
  ];

  const handleNavigation = (path: string) => {
    setActiveItem(path as CurrentView);
    setIsMobileOpen(false);
    if (onNavigate) {
      onNavigate(path as CurrentView);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-600 rounded-lg mr-3"></div>
          {!isCollapsed && (
            <span className="font-bold text-xl text-white">ExamGenius</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`
              w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors relative
              ${activeItem === item.path
                ? 'bg-blue-800 text-white border-l-4 border-green-400' 
                : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              }
            `}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">{item.label}</span>
            )}
            {activeItem === item.path && (
              <div className="absolute left-0 top-0 w-1 h-full bg-green-400 rounded-r"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-800">
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start text-blue-100 hover:bg-blue-800 hover:text-white"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Log Out</span>}
        </Button>
      </div>

      {/* Collapse Toggle (Desktop) */}
      <div className="hidden lg:block p-4">
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="ghost"
          size="sm"
          className="w-full text-blue-100 hover:bg-blue-800"
        >
          {isCollapsed ? '→' : '←'}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsMobileOpen(true)}
          variant="outline"
          size="sm"
          className="bg-white"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="fixed inset-y-0 left-0 w-64 bg-blue-900 z-50">
            <div className="absolute top-4 right-4">
              <Button
                onClick={() => setIsMobileOpen(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-blue-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden lg:block bg-blue-900 h-screen ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
