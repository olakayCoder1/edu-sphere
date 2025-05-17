"use client";

import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera, Lock, User, CheckCircle,
  FileText, AlertTriangle, Trash2
} from "lucide-react";
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import authService from "@/services/authService";
import { toast } from "sonner";
import api from "@/lib/api";

export default function SettingsProfilePage() {
  // State for profile data
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
    profileImage: null as string | null,
    timezone: "",
    language: "",
    subjects: [] as string[],
    experience: "",
    education: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [saveStatus, setSaveStatus] = useState<null | "saving" | "saved" | "error">(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for edit forms
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
    timezone: "",
    language: "",
    subjects: [] as string[],
    experience: ""
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  // State for account deletion
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsFetching(true);
      const response = await authService.getProfile();

      console.log(response.data)
      
      // Extract profile data from response
      const userData = response.data.data || {};
      
      // Update profile state with actual data
      setProfile({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        bio: userData.bio || "",
        profileImage: userData.profile_image || null,
        timezone: userData.timezone || "America/New_York",
        language: userData.language || "english",
        subjects: userData.subjects || [],
        experience: userData.experience || "",
        education: userData.education || ""
      });
      
      // Update form data with the same values
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        bio: userData.bio || "",
        timezone: userData.timezone || "America/New_York",
        language: userData.language || "english",
        subjects: userData.subjects || [],
        experience: userData.experience || ""
      });
      
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile data. Please try again.");
      setIsFetching(false);
    }
  };

  // Handle input change for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password change inputs
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [id === "current-password" ? "current_password" : 
       id === "new-password" ? "new_password" : "confirm_password"]: value
    }));
  };

  // Handle profile image upload
  const handleProfileImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  // Handle profile form submission
  const handleProfileSave = async () => {
    setSaveStatus("saving");
    setIsLoading(true);
    
    try {
      const accessToken = authService.getAccessToken();
      
      // Prepare data for API
      const profileUpdateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        bio: formData.bio,
        timezone: formData.timezone,
        language: formData.language,
        subjects: formData.subjects,
        experience: formData.experience
      };
      
      // Make API request to update profile
      const response = await api.patch('/auth/profile/', profileUpdateData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      // Update profile state with response data
      setProfile(prev => ({
        ...prev,
        ...response.data
      }));
      
      setSaveStatus("saved");
      toast.success("Profile updated successfully");
      
      // Reset save status after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus("error");
      toast.error("Failed to update profile");
      
      // Reset save status after error
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password update
  const handleUpdatePassword = async () => {
    // Validate passwords match
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New passwords don't match");
      return;
    }
    
    // Validate password length
    if (passwordData.new_password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setPasswordChangeLoading(true);
    
    try {
      const accessToken = authService.getAccessToken();
      
      // Make API request to update password
      await api.post('/auth/change-password/', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      // Clear password fields
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
      
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Please check your current password.");
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await authService.deleteAccount(deletePassword);
      // The redirect is handled in the authService
    } catch (error) {
      console.error("Error deleting account:", error);
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName[0] : "";
    const lastInitial = lastName ? lastName[0] : "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  // Show loading state while fetching profile data
  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2">Loading profile data...</span>
      </div>
    );
  }

  return (
    <div className="">
      <Header title="Account Settings" />
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>

            <TabsTrigger value="account" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden md:inline">Account</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and how it appears to students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-6 border-b">
                  <div className="relative">
                    <Avatar 
                      className="h-24 w-24 cursor-pointer"
                      onClick={handleProfileImageClick}
                    >
                      {profile.profileImage ? (
                        <AvatarImage src={profile.profileImage} alt={`${profile.first_name} ${profile.last_name}`} />
                      ) : (
                        <AvatarFallback className="text-2xl">
                          {getInitials(profile.first_name, profile.last_name)}
                        </AvatarFallback>
                      )}
                      <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1">
                        <Camera className="h-4 w-4" />
                      </div>
                    </Avatar>
                  </div>
                  <div className="flex-1">
               
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input 
                      id="first_name" 
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input 
                      id="last_name" 
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                    />
                  </div>
                  {/* <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="min-h-32"
                      placeholder="Tell students about your teaching experience, qualifications, and approach"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This will be displayed on your public profile
                    </p>
                  </div> */}
                </div>

              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setFormData({
                  first_name: profile.first_name,
                  last_name: profile.last_name,
                  email: profile.email,
                  bio: profile.bio,
                  timezone: profile.timezone,
                  language: profile.language,
                  subjects: profile.subjects,
                  experience: profile.experience
                })}>
                  Cancel
                </Button>
                <Button onClick={handleProfileSave} disabled={isLoading}>
                  {saveStatus === "saving" ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : saveStatus === "saved" ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Saved
                    </>
                  ) : saveStatus === "error" ? (
                    <>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Try Again
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your account security and password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Change Password</h4>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>
                  <Button 
                    className="mt-4" 
                    onClick={handleUpdatePassword}
                    disabled={passwordChangeLoading}
                  >
                    {passwordChangeLoading ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Deletion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-4 border-t border-b">
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-5 w-5 text-destructive" />
                    <div>
                      <h4 className="font-medium">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                  </div>
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Delete Account</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                          <p className="text-sm">To confirm, please enter your password below</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="delete-account-password">Password</Label>
                          <Input 
                            id="delete-account-password" 
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Enter your password"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                          variant="destructive" 
                          onClick={handleDeleteAccount}
                          disabled={isDeleting || !deletePassword}
                        >
                          {isDeleting ? (
                            <>
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                              Deleting...
                            </>
                          ) : (
                            "Delete Account"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}