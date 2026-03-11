import { useParams, useLoaderData } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, User, CreditCard, Calendar, Hash } from "lucide-react";

const statusVariantMap = {
  completed: "default",
  delivery: "secondary",
  returned: "outline",
  cancelled: "outline",
};
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

export default function OrderDetails() {
  const { orderInvoice } = useParams();
  const {
    orders = [],
    orderItems = [],
    profiles = [],
  } = useLoaderData() || {};

  const profilesMap = Object.fromEntries(
    profiles.map((p) => [p.id, p.full_name]),
  );
  const ordersMap = Object.fromEntries(
    orders.map((order) => [order.invoice, order]),
  );


  const findOrder = ordersMap[orderInvoice] ?? null;
  const findUserName = profilesMap[findOrder?.user_id] ?? "Unknown User";

  const findOrderItems = orderItems.filter(
    (item) => item.order_id === findOrder?.id,
  );

  const totalQuantity = findOrderItems.reduce(
    (acc, item) => acc + (item.status === "completed" ? item.quantity || 0 : 0),
    0,
  );

  if (!findOrder)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Order not found
      </div>
    );

  const statusVariant = statusVariantMap[findOrder.status] ?? "secondary";

  return (
    <div
      className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500"
      dir="ltr"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Order Details
          </h1>
          <p className="text-muted-foreground mt-1">
            View invoice information and purchased Items
          </p>
        </div>

        <Badge
          variant={statusVariant}
          className={`px-4 py-1 text-sm rounded-full capitalize ${statusConfig[findOrder.status] || statusConfig.default}`}
        >
          {findOrder.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Invoice Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              #{findOrder.invoice}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Order Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-foreground">
              {formatDate.format(new Date(findOrder.created_at))}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency.format(findOrder.total_price)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Package className="w-5 h-5 text-muted-foreground" />
              Attached Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-left">Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {findOrderItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden border border-border shrink-0">
                          {item?.image_url ? (
                            <img
                              src={item?.image_url}
                              alt={item?.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-bold">
                              IMG
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 w-50">
                          <p className="font-semibold text-foreground">
                            {item?.name}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground wrap-break-word max-w-58 whitespace-normal ">
                              Notes: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center font-medium italic text-foreground">
                      {item.quantity}
                    </TableCell>

                    <TableCell className="text-center text-muted-foreground">
                      {formatCurrency.format(item.unit_price)}
                    </TableCell>

                    <TableCell className="text-right font-bold text-foreground">
                      {formatCurrency.format(item.quantity * item.unit_price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <User className="w-5 h-5 text-muted-foreground" />
                Created By
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Name</span>
                <span className="font-semibold text-foreground">
                  {findUserName}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Payment Method</span>
                <Badge variant="outline" className="capitalize font-medium">
                  {findOrder.payment_method}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-foreground text-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                Invoice Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Items Count</span>
                <span className="font-medium">{totalQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <Separator className="bg-muted-foreground/20 my-2" />
              <div className="flex justify-between items-end pt-1">
                <span className="text-base font-medium">Net Total</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency.format(findOrder.total_price)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
