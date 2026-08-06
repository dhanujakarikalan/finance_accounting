import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { cn } from "../../utils/cn";

export function StatCard({ title, value, icon: Icon, trend, trendValue, className }) {
  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={cn("text-xs mt-1", trend === "up" ? "text-secondary" : "text-red-500")}>
            {trend === "up" ? "+" : "-"}{trendValue}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
