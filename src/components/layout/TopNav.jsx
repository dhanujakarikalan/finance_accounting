import { Search, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md shadow-sm">
      <div className="flex flex-1 items-center gap-4 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-slate-50 pl-9 rounded-full border-transparent focus-visible:ring-primary focus-visible:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
        </Link>
        <div className="h-6 w-px bg-slate-200 mx-1"></div>
        <Link to="/profile">
          <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 hover:bg-slate-200">
            <User className="h-5 w-5 text-slate-600" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
