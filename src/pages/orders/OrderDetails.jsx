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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Package,
  User,
  CreditCard,
  Calendar,
  Hash,
  ArrowLeft,
} from "lucide-react";

const statusConfig = {
  completed:
    "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  pending: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100",
  processing: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
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
    Items = [],
    profiles = [],
  } = useLoaderData() || {};

  const profilesMap = Object.fromEntries(
    profiles.map((p) => [p.id, p.full_name]),
  );
  const ordersMap = Object.fromEntries(
    orders.map((order) => [order.invoice, order]),
  );
  const orderItemsMap = Object.fromEntries(
    Items.map((item) => [item.id, item]),
  );

  const findOrder = ordersMap[orderInvoice] ?? null;
  const findUserName = profilesMap[findOrder?.user_id] ?? "Unknown User";

  const findOrderItems = orderItems.filter(
    (item) => item.order_id === findOrder?.id,
  );

  const fullItems = findOrderItems.map((orderItem) => ({
    ...orderItem,
    itemDetails: orderItemsMap[orderItem.item_id],
  }));


  const Total = findOrderItems?.reduce(
    (acc, orderItem) =>
      acc + (orderItem.status !== "cancelled" ? orderItem.quantity || 0 : 0),
    0,
  );
  if (!findOrder) return <div className="p-8 text-center">Order not found</div>;

  return (
    <div
      className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500"
      dir="ltr"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Order Details
          </h1>
          <p className="text-slate-500 mt-1">
            View invoice information and purchased products
          </p>
        </div>
        <Badge
          className={`${statusConfig[findOrder.status] || statusConfig.default} px-4 py-1 text-sm rounded-full border shadow-sm`}
        >
          {findOrder.status.toUpperCase()}
        </Badge>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Hash className="w-4 h-4" /> Invoice Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{findOrder.invoice}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Order Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {formatDate.format(new Date(findOrder.created_at))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-slate-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency.format(findOrder.total_price)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Section */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-slate-400" />
              Attached Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="text-left">Product</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fullItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                          {item.itemDetails?.image_url ? (
                            <img
                              src={item.itemDetails.image_url}
                              alt={item.itemDetails.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                              IMG
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">
                            {item.itemDetails?.name}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1 max-w-50">
                            {item.itemDetails?.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium italic">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-center text-slate-600">
                      {formatCurrency.format(item.unit_price)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatCurrency.format(item.quantity * item.unit_price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Customer Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-slate-400" /> Created By
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Name:</span>
                <span className="font-semibold">{findUserName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Payment Method:</span>
                <Badge
                  variant="outline"
                  className="capitalize bg-white shadow-sm font-medium"
                >
                  {findOrder.payment_method}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg shadow-slate-200">
            <h4 className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-4">
              Invoice Summary
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Items Count</span>
                <span>{Total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-700 flex justify-between items-end">
                <span className="text-lg font-medium">Net Total</span>
                <span className="text-2xl font-bold text-emerald-400">
                  {formatCurrency.format(findOrder.total_price)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
