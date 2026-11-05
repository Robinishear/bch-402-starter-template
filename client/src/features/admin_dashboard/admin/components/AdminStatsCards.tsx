import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, DollarSign, ShieldAlert } from "lucide-react";
import { IStats } from "../_core/admin.interface";

interface AdminStatsCardsProps {
  stats: IStats;
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.users.total}</div>
          <p className="text-xs text-muted-foreground">
            Active: {stats.users.active} | Blocked: {stats.users.blocked}
          </p>
        </CardContent>
      </Card>

      {/* Total Invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.invoices.total}</div>
          <p className="text-xs text-muted-foreground">
            Paid: {stats.invoices.paid} | Pending: {stats.invoices.pending}
          </p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.revenue.usd}</div>
          <p className="text-xs text-muted-foreground">
            {stats.revenue.paidInvoices} paid invoices
          </p>
        </CardContent>
      </Card>

      {/* AI Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Generations</CardTitle>
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.ai.totalUses}</div>
          <p className="text-xs text-muted-foreground">
            Tokens used: {stats.ai.totalTokens}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}