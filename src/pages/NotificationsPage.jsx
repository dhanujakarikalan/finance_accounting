import { useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { AlertTriangle, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialNotifications = [
  { id: 1, title: "Invoice Due", description: "Invoice #INV-2024-004 from AWS Services is overdue by 3 days.", type: "urgent", icon: AlertCircle, time: "2 hours ago", unread: true },
  { id: 2, title: "Low Cash Alert", description: "Your operating account balance is projected to fall below your $20,000 threshold next week.", type: "warning", icon: AlertTriangle, time: "5 hours ago", unread: true },
  { id: 3, title: "Payment Received", description: "Payment of $1,200.00 received from Acme Corp.", type: "success", icon: CheckCircle2, time: "1 day ago", unread: false },
  { id: 4, title: "GST Reminder", description: "Q2 GST Return is due in 15 days.", type: "info", icon: Clock, time: "2 days ago", unread: false },
];

export function NotificationsPage() {
  const [list, setList] = useState(initialNotifications);
  const navigate = useNavigate();

  const handleMarkAllRead = () => {
    setList(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const getIconColor = (type) => {
    switch (type) {
      case "urgent": return "text-red-500 bg-red-100";
      case "warning": return "text-yellow-500 bg-yellow-100";
      case "success": return "text-green-500 bg-green-100";
      default: return "text-blue-500 bg-blue-100";
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-slate-500">Stay on top of your financial alerts.</p>
        </div>
        <Button variant="outline" onClick={handleMarkAllRead}>Mark all as read</Button>
      </div>

      <div className="space-y-3">
        {list.map((notif) => (
          <Card key={notif.id} className={`transition-all hover:shadow-md ${notif.unread ? 'border-primary/30 bg-primary/5' : 'bg-white'}`}>
            <CardContent className="p-4 flex gap-4 items-start">
              <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getIconColor(notif.type)}`}>
                <notif.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-semibold ${notif.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs text-slate-500 whitespace-nowrap ml-4">{notif.time}</span>
                </div>
                <p className={`text-sm mt-1 ${notif.unread ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                  {notif.description}
                </p>
                {notif.type === 'urgent' && notif.unread && (
                  <Button size="sm" className="mt-3 bg-red-500 hover:bg-red-600" onClick={() => navigate('/invoices')}>
                    Review Now
                  </Button>
                )}
              </div>
              {notif.unread && (
                <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2"></div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
