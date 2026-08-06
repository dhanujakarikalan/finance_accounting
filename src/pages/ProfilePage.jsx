import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { User, LogOut, Camera, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const navigate = useNavigate();
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleChangePassword = () => {
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
        <p className="text-slate-500">Manage your personal information and security.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center text-3xl font-medium text-slate-500 shadow-sm border-4 border-white">
                JD
              </div>
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 shadow-md">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="text-xl font-semibold">John Doe</h3>
              <p className="text-slate-500">CEO at Acme Corp</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <Input defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <Input type="email" defaultValue="john@acmecorp.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <Input type="tel" defaultValue="+1 (555) 000-0000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Role</label>
              <Input defaultValue="Admin" disabled className="bg-slate-50" />
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <Button onClick={handleSaveProfile} className="gap-2">
              {profileSaved ? <><Check className="h-4 w-4" /> Profile Updated!</> : "Update Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Current Password</label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">New Password</label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
              <Input type="password" />
            </div>
            <Button variant="outline" onClick={handleChangePassword} className="gap-2">
              {passwordSaved ? <><Check className="h-4 w-4" /> Password Changed!</> : "Change Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button variant="danger" className="gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
