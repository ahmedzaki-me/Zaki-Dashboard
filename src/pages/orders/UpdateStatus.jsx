"use client";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

import { ChangeStatus } from "./ordersActions";

const handleStatus = async (newStatus, orderId) => {
  const { success, data } = await ChangeStatus(newStatus, orderId);
  if (!(success && data.length > 0)) {
    toast.error("You are Not Allowed");
  }
};
const statuses = ["delivery", "completed", "cancelled", "returned"];
const statusConfig = {
  completed:
    "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  returned: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100",
  delivery: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
  default: "bg-slate-100 text-slate-700 border-slate-200",
};
export function UpdateStatus({ children, orderId }) {
  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        <DropdownMenuContent align="center" className="w-fit">
          <DropdownMenuGroup>
            {statuses.map((status) => {
              return (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatus(status, orderId)}
                >
                  <Badge
                    className={`capitalize ${statusConfig[status] || statusConfig.default}`}
                  >
                    {status === "delivery" && (
                      <Spinner data-icon="inline-end" />
                    )}
                    {status}
                  </Badge>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
