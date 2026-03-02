import { useEffect, useRef, useCallback } from "react";
import { useRevalidator } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useOrdersRealtime() {
  const { revalidate } = useRevalidator();
  const channelRef = useRef(null);
  const timeoutRef = useRef(null);

  const triggerRevalidate = useCallback(() => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      revalidate();
    }, 700);
  }, [revalidate]);

  useEffect(() => {
    if (channelRef.current) return;

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          toast.success(
            `New Order! Invoice Number:
            #${payload.new.invoice}`,
            {
              id: "new-order",
            },
          );

          triggerRevalidate();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_items" },
        triggerRevalidate,
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      clearTimeout(timeoutRef.current);
    };
  }, [triggerRevalidate]);
}
