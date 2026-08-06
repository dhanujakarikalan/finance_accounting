import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Moon, Sun, Check } from "lucide-react";
import { useGlobalState } from "../context/GlobalStateContext";

export function SettingsPage() {
  const { theme, changeTheme } = useGlobalState();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-500">Manage your business preferences and configurations.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Business Name</label>
                <Input defaultValue="Acme Corp" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">GST Number</label>
                <Input defaultValue="GST123456789" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Currency</label>
                <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>INR (₹)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Timezone</label>
                <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <option>America/New_York (EST)</option>
                  <option>America/Los_Angeles (PST)</option>
                  <option>Europe/London (GMT)</option>
                  <option>Asia/Kolkata (IST)</option>
                </select>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button onClick={handleSave} className="gap-2">
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4" /> Saved!
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Theme</h4>
                <p className="text-sm text-slate-500">Toggle between light and dark mode.</p>
              </div>
              <div className="flex items-center gap-2 p-1 border border-slate-200 rounded-lg bg-slate-50">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => changeTheme("light")}
                  className={theme === "light" ? "bg-white shadow-sm gap-2 text-slate-900" : "text-slate-500 hover:text-slate-900 gap-2"}
                >
                  <Sun className="h-4 w-4" /> Light
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => changeTheme("dark")}
                  className={theme === "dark" ? "bg-white shadow-sm gap-2 text-slate-900" : "text-slate-500 hover:text-slate-900 gap-2"}
                >
                  <Moon className="h-4 w-4" /> Dark
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
