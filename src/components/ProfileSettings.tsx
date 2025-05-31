import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Monitor, Smartphone, MapPin } from 'lucide-react';
import Sidebar from './Sidebar';

type CurrentView = 'landing' | 'dashboard' | 'generate' | 'documents' | 'sets' | 'billing' | 'settings' | 'support';

interface LoginActivity {
  id: string;
  device: string;
  location: string;
  timestamp: string;
  current: boolean;
}

interface ProfileSettingsProps {
  onLogout: () => void;
  onNavigate: (view: CurrentView) => void;
}

const ProfileSettings = ({ onLogout, onNavigate }: ProfileSettingsProps) => {
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    schoolName: 'Accra Senior High School'
  });

  const [notifications, setNotifications] = useState({
    notifyOnSetReady: true,
    notifyInApp: true,
    notifyUsageSummary: false
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const loginHistory: LoginActivity[] = [
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'Accra, Ghana',
      timestamp: '2024-01-15 09:30 AM',
      current: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'Accra, Ghana',
      timestamp: '2024-01-14 02:15 PM',
      current: false
    },
    {
      id: '3',
      device: 'Firefox on Windows',
      location: 'Kumasi, Ghana',
      timestamp: '2024-01-12 11:45 AM',
      current: false
    },
    {
      id: '4',
      device: 'Chrome on Android',
      location: 'Tamale, Ghana',
      timestamp: '2024-01-10 07:20 PM',
      current: false
    },
    {
      id: '5',
      device: 'Edge on Windows',
      location: 'Cape Coast, Ghana',
      timestamp: '2024-01-08 03:30 PM',
      current: false
    }
  ];

  const handleProfileSave = () => {
    // Update profile logic
    console.log('Profile updated:', profile);
  };

  const handleNotificationsSave = () => {
    // Update notifications logic
    console.log('Notifications updated:', notifications);
  };

  const handlePasswordChange = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Change password logic
    console.log('Password changed');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleChangeEmail = () => {
    // Change email logic
    console.log('Email change requested:', newEmail);
    setShowChangeEmailModal(false);
    setNewEmail('');
  };

  const handleLogoutOtherDevices = () => {
    // Logout other devices logic
    console.log('Logged out from other devices');
    setShowLogoutModal(false);
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
      return <Smartphone className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} currentView="settings" />
      
      <div className="flex-1">
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile & Settings</h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profile.fullName}
                        onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="email"
                          value={profile.email}
                          readOnly
                          className="bg-gray-50"
                        />
                        <Button 
                          variant="outline"
                          onClick={() => setShowChangeEmailModal(true)}
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      value={profile.schoolName}
                      onChange={(e) => setProfile(prev => ({ ...prev, schoolName: e.target.value }))}
                    />
                  </div>

                  {/* Change Password Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          >
                            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showPasswords.new ? "text" : "password"}
                              value={passwords.newPassword}
                              onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                            >
                              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwords.confirmPassword}
                              onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                            >
                              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleProfileSave} className="bg-green-600 hover:bg-green-700">
                      Save Changes
                    </Button>
                    <Button onClick={handlePasswordChange} variant="outline">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyOnSetReady">Question Set Ready</Label>
                      <p className="text-sm text-gray-600">
                        Get notified when your AI-generated question sets are ready
                      </p>
                    </div>
                    <Switch
                      id="notifyOnSetReady"
                      checked={notifications.notifyOnSetReady}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, notifyOnSetReady: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyInApp">In-App Notifications</Label>
                      <p className="text-sm text-gray-600">
                        Show notifications within the application
                      </p>
                    </div>
                    <Switch
                      id="notifyInApp"
                      checked={notifications.notifyInApp}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, notifyInApp: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyUsageSummary">Usage Summary</Label>
                      <p className="text-sm text-gray-600">
                        Receive monthly usage summaries and plan recommendations
                      </p>
                    </div>
                    <Switch
                      id="notifyUsageSummary"
                      checked={notifications.notifyUsageSummary}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, notifyUsageSummary: checked }))
                      }
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleNotificationsSave} className="bg-green-600 hover:bg-green-700">
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Login Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loginHistory.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getDeviceIcon(activity.device)}
                            <div>
                              <p className="font-medium text-sm">{activity.device}</p>
                              <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span>{activity.location}</span>
                                <span>•</span>
                                <span>{activity.timestamp}</span>
                              </div>
                            </div>
                          </div>
                          {activity.current && (
                            <Badge variant="secondary">Current Session</Badge>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Button 
                        variant="outline"
                        onClick={() => setShowLogoutModal(true)}
                      >
                        Logout from all other devices
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable 2FA</Label>
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch disabled />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Coming soon</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Change Email Modal */}
      <Dialog open={showChangeEmailModal} onOpenChange={setShowChangeEmailModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail">New Email Address</Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email address"
              />
            </div>
            <p className="text-sm text-gray-600">
              A verification link will be sent to your new email address.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowChangeEmailModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleChangeEmail}>
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Other Devices Modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout from Other Devices</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This will log you out from all other devices except this one. You'll need to log in again on those devices.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleLogoutOtherDevices}>
                Logout Other Devices
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;
