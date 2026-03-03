import React, { useState, useEffect } from "react";
import OneSignal from "react-onesignal";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function NavSubscribe() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const checkSubscription = () => {
      setIsSubscribed(OneSignal.User.PushSubscription.optedIn);
    };

    checkSubscription();
  }, []);

  const handleToggle = async (checked) => {
    try {
      if (!checked) {
        await OneSignal.User.PushSubscription.optOut();
        setIsSubscribed(false);
        console.log("Notifications disabled");
      } else {
        await OneSignal.User.PushSubscription.optIn();
        setIsSubscribed(true);
        console.log("Notifications enabled");
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
