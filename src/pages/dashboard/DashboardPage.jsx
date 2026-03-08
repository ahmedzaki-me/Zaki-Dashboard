import { useLoaderData } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Award,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (v) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(v);

const MEDALS = ["🥇", "🥈", "🥉"];
const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

// ─── summary cards ───────────────────────────────────────────────────────────

function SummaryCards({ summary, topCashier }) {
  const growth = parseFloat(summary.growthRate);
  const isUp = growth >= 0;

  const cards = [
    {
      title: "Monthly Sales",
      value: fmt(summary.currentMonthSales),
      desc: "Total revenue this month",
      icon: DollarSign,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "Total Orders",
      value: summary.currentMonthOrders,
      desc: "Completed orders this month",
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Growth Rate",
      value: `${isUp ? "+" : ""}${growth.toFixed(1)}%`,
      desc: "Compared to last month",
      icon: isUp ? TrendingUp : TrendingDown,
      color: isUp ? "text-green-500" : "text-red-500",
      bg: isUp ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "Top Cashier",
      value: topCashier?.name ?? "—",
      desc: topCashier ? fmt(topCashier.totalSales) + " in sales" : "No data",
      icon: Award,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${c.bg}`}>
                <Icon className={`h-4 w-4 ${c.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── yearly bar chart ────────────────────────────────────────────────────────

const barChartConfig = {
  totalSales: { label: "Sales (EGP)", color: "var(--chart-1)" },
};

function YearlyBarChart({ yearlyBreakdown }) {
  const data = yearlyBreakdown.map((m) => ({
    ...m,
    month: m.month.slice(0, 3),
  }));

  const totalYearlySales = yearlyBreakdown.reduce(
    (s, m) => s + m.totalSales,
    0,
  );
  const activeMonths = yearlyBreakdown.filter((m) => m.totalSales > 0).length;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Monthly Sales</CardTitle>
        <CardDescription>
          Full year breakdown — {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ChartContainer config={barChartConfig} className="h-65 min-w-[500px] w-full">
            <BarChart data={data} barSize={28}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent formatter={(value) => fmt(value)} />
                }
              />
              <Bar
                dataKey="totalSales"
                fill="var(--chart-1)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {fmt(totalYearlySales)} total this year
        </div>
        <div className="text-muted-foreground leading-none">
          Active in {activeMonths} out of 12 months
        </div>
      </CardFooter>
    </Card>
  );
}

// ─── cashier pie chart ────────────────────────────────────────────────────────

function CashierPieChart({ cashierStats }) {
  const pieConfig = Object.fromEntries(
    cashierStats.map((c, i) => [
      c.name,
      { label: c.name, color: PIE_COLORS[i % PIE_COLORS.length] },
    ]),
  );

  const pieData = cashierStats.map((c, i) => ({
    name: c.name,
    value: c.totalSales,
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const total = cashierStats.reduce((s, c) => s + c.totalSales, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Cashier</CardTitle>
        <CardDescription>Distribution this month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={pieConfig} className="h-65 w-full">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent formatter={(value) => fmt(value)} />
              }
            />
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Total: {fmt(total)} across {cashierStats.length} cashiers
      </CardFooter>
    </Card>
  );
}

// ─── cashier table ────────────────────────────────────────────────────────────

function CashierTable({ cashierStats }) {
  const sorted = [...cashierStats].sort((a, b) => b.totalSales - a.totalSales);
  const total = cashierStats.reduce((s, c) => s + c.totalSales, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Users className="h-5 w-5 text-muted-foreground" />
        <div>
          <CardTitle>Cashier Performance</CardTitle>
          <CardDescription>Ranked by total sales this month</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Orders</TableHead>
              <TableHead className="text-right">Total Sales</TableHead>
              <TableHead className="text-right">Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((c, i) => {
              const share =
                total > 0 ? ((c.totalSales / total) * 100).toFixed(1) : "0";
              return (
                <TableRow key={c.name}>
                  <TableCell className="text-lg">
                    {MEDALS[i] ?? i + 1}
                  </TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{c.visitors}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-orange-500">
                    {fmt(c.totalSales)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-orange-400"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-10">
                        {share}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const data = useLoaderData();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        No data available.
      </div>
    );
  }

  const { summary, yearlyBreakdown, cashierStats } = data;
  const topCashier = [...cashierStats].sort(
    (a, b) => b.totalSales - a.totalSales,
  )[0];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Zaki Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Sales overview for {new Date().getFullYear()}
        </p>
      </div>

      <SummaryCards summary={summary} topCashier={topCashier} />

      {/* <div className="grid gap-6 max-sm:max-w-50 lg:grid-cols-3">
        <div className="lg:col-span-2"> */}
      <YearlyBarChart yearlyBreakdown={yearlyBreakdown} />
      {/* </div> */}
      <CashierPieChart cashierStats={cashierStats} />
      {/* </div> */}

      <CashierTable cashierStats={cashierStats} />
    </div>
  );
}
