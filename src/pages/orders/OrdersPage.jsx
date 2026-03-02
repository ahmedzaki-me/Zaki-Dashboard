import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

import { useLoaderData } from "react-router-dom";

const statusConfig = {
  completed:
    "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  pending: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100",
  processing: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
  default: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function OrdersPage() {
  const { orders = [], profiles = [] } = useLoaderData() || {};

  const profilesMap = Object.fromEntries(
    profiles.map((p) => [p.id, p.full_name]),
  );

  const findUserName = (userId) => {
    return profilesMap[userId] ?? "Unknown User";
  };

  const formatDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formatCurrency = new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  });

  const dayTotal = formatCurrency.format(
    orders?.reduce(
      (acc, order) =>
        acc + (order.status !== "cancelled" ? order.total_price || 0 : 0),
      0,
    ),
  );

  return (
    <>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>

        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-25 font-bold text-foreground">
              Invoice
            </TableHead>
            <TableHead className="font-bold text-foreground">Status</TableHead>
            <TableHead className="font-bold text-foreground">Date</TableHead>
            <TableHead className="font-bold text-foreground">Method</TableHead>
            <TableHead className="font-bold text-foreground">
              Employee
            </TableHead>
            <TableHead className="text-right font-bold text-foreground">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.invoice}</TableCell>
              <TableCell>
                <Badge
                  className={`capitalize ${statusConfig[order.status] || statusConfig.default}`}
                >
                  {order.status === "processing" && (
                    <Spinner data-icon="inline-end" />
                  )}
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="">
                {formatDate.format(new Date(order.created_at))}
              </TableCell>
              <TableCell>{order.payment_method}</TableCell>
              <TableCell>{findUserName(order.user_id)}</TableCell>
              <TableCell className="text-right">
                {formatCurrency.format(order.total_price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right">{dayTotal}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
