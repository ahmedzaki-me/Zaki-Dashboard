import React, { useState, useEffect } from "react";
import OneSignal from "react-onesignal";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";

export default function NavSubscribe() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const hasExternalId = !!OneSignal.User?.externalId;
      const isOptedIn = !!OneSignal.User?.PushSubscription?.optedIn;
      setIsSubscribed(hasExternalId && isOptedIn);
    };

    checkStatus();
  }, []);

  const handleToggle = async (checked) => {
    // if (isLoading) return;
    // setIsLoading(true);
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
        await OneSignal.User.PushSubscription.optIn();

        setIsSubscribed(true);
        console.log("OneSignal Login Success");
      } else {
        await OneSignal.logout();
        await OneSignal.User.PushSubscription.optOut();

        setIsSubscribed(false);
        console.log("OneSignal Logout Success");
      }
    } catch (error) {
      console.error("OneSignal Identity Error:", error);
      setIsSubscribed(!checked);
    }
  };

  return (
    <div className="flex items-center gap-4 p-2 ml-2">
      <Label
        htmlFor="onesignal-auth"
        className="text-sm font-semibold text-slate-700 cursor-pointer"
      >
        Subscribe
      </Label>
      <Switch
        id="onesignal-auth"
        checked={isSubscribed}
        onCheckedChange={handleToggle}
        size="sm"
        className="cursor-pointer"
      />
    </div>
  );
}
