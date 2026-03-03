import React, { useState, useEffect } from "react";
import OneSignal from "react-onesignal";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";

export default function NavSubscribe() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const hasExternalId = !!OneSignal.User?.externalId;
      setIsSubscribed(hasExternalId);
    };

    checkStatus();
  }, []);

  const handleToggle = async (checked) => {
    try {
      if (checked) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
          console.log("No active session found for OneSignal");
          return;
        }
        await OneSignal.login(userId);
        setIsSubscribed(true);
        console.log("OneSignal Login Success");
      } else {
        await OneSignal.logout();
        setIsSubscribed(false);
        console.log("OneSignal Logout Success");
      }
    } catch (error) {
      console.error("Error toggling OneSignal subscription:", error);
    }
  };

  return (
    <div className="flex items-center gap-4 p-2 ml-2">
      <Label
        htmlFor="notifications-mode"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Subscribe
      </Label>
      <Switch
        size="sm"
        className="cursor-pointer"
        id="notifications-mode"
        checked={isSubscribed}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}
