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
import { ChevronDownIcon } from "lucide-react";

import { useSearchParams, useNavigate } from "react-router-dom";
import { UpdateStatus } from "./UpdateStatus";
import { OrdersFilter } from "./OrdersFilter";

import { useOrders } from "@/hooks/useOrdersQuery";
import { useProfiles } from "@/hooks/useOrdersQuery";

const statusConfig = {
  completed:
    "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  returned: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100",
  delivery: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
  default: "bg-slate-100 text-slate-700 border-slate-200",
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

const getDateRange = (filter) => {
  const now = new Date();

  switch (filter) {
    case "today": {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return { start, end: now };
    }
    case "yesterday": {
      const start = new Date(now);
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    case "week": {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      return { start, end: now };
    }
    case "month": {
      const start = new Date(now);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      return { start, end: now };
    }
    default:
      return null;
  }
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: orders = [] } = useOrders();
  const { data: profiles = [] } = useProfiles();

  const profilesMap = Object.fromEntries(
    profiles.map((p) => [p.id, p.full_name]),
  );

  const findUserName = (userId) => {
    return profilesMap[userId] ?? "Unknown User";
  };

  const filter = searchParams.get("filter") || "today";
  const employeeFilter = searchParams.get("employee") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const methodsFilter = searchParams.get("methods") || "all";
  const query = searchParams.get("q") || "";

  const getFilteredOrders = (
    orders,
    { filter, employeeFilter, statusFilter, methodsFilter, query },
  ) => {
    let result = orders;

    const range = getDateRange(filter);

    if (range) {
      result = result.filter((order) => {
        const date = new Date(order.created_at);
        return date >= range.start && date <= range.end;
      });
    }

    if (employeeFilter !== "all") {
      result = result.filter(
        (order) => profilesMap[order.user_id] === employeeFilter,
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    if (methodsFilter !== "all") {
      result = result.filter((order) => order.payment_method === methodsFilter);
    }
    if (query) {
      result = result.filter((order) =>
        order.invoice.toString().includes(query.trim()),
      );
    }
    return result;
  };

  const filteredOrders = getFilteredOrders(orders, {
    filter,
    employeeFilter,
    statusFilter,
    methodsFilter,
    query,
  });

  const dayTotal = formatCurrency.format(
    filteredOrders?.reduce(
      (acc, order) =>
        acc + (order.status === "completed" ? order.total_price || 0 : 0),
      0,
    ),
  );

  return (
    <>
      <OrdersFilter profiles={profiles} />
      <Table>
        <TableCaption>{filteredOrders.length} orders found</TableCaption>

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
          {filteredOrders?.map((order) => (
            <TableRow
              onClick={() =>
                navigate(`${order.invoice}`, {
                  state: { from: location.search },
                })
              }
              key={order.id}
              className="cursor-pointer group"
            >
              <TableCell className="font-medium py-3 transition-colors">
                <span className="text-slate-400 group-hover:text-primary transition-colors">
                  #
                </span>
                {order.invoice}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                {order.status === "cancelled" || order.status === "returned" ? (
                  <Badge
                    className={`capitalize ${statusConfig[order.status] || statusConfig.default}`}
                  >
                    {order.status}
                  </Badge>
                ) : (
                  <UpdateStatus orderId={order.id}>
                    <Badge
                      className={`capitalize ${statusConfig[order.status] || statusConfig.default}`}
                    >
                      {order.status === "delivery" && (
                        <Spinner data-icon="inline-end" />
                      )}
                      {order.status}
                      <ChevronDownIcon />
                    </Badge>
                  </UpdateStatus>
                )}
              </TableCell>
              <TableCell>
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
