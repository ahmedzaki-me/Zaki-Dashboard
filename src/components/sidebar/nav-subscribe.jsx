import React, { useState, useEffect } from "react";
import OneSignal from "react-onesignal";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function NavSubscribe() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); 

  useEffect(() => {
    const updateSubscriptionStatus = () => {
      const status = OneSignal.User?.PushSubscription?.optedIn;
      setIsSubscribed(!!status);
      setIsLoaded(true);
    };

    if (OneSignal.User?.PushSubscription) {
      updateSubscriptionStatus();
    }

    const listener = (event) => {
      setIsSubscribed(event.current.optedIn);
    };

    OneSignal.User?.PushSubscription?.addEventListener("change", listener);

    return () => {
      OneSignal.User?.PushSubscription?.removeEventListener("change", listener);
    };
  }, []);

  const handleToggle = async (checked) => {
    const previousState = isSubscribed;
    setIsSubscribed(checked);

    try {
      if (checked) {
        await OneSignal.User.PushSubscription.optIn();
      } else {
        await OneSignal.User.PushSubscription.optOut();
      }
      setIsSubscribed(!!OneSignal.User.PushSubscription.optedIn);
    } catch (error) {
      console.error("OneSignal Error:", error);
      setIsSubscribed(previousState);
    }
  };

  if (!isLoaded)
    return <div className="h-6 w-12 animate-pulse bg-gray-200 rounded-full" />;

  return (
    <div className="flex items-center gap-4 p-2 ml-2 transition-opacity duration-300">
      <Label
        htmlFor="notifications-mode"
        className="text-sm font-medium leading-none cursor-pointer peer-disabled:opacity-70"
      >
        Subscribe
      </Label>
      <Switch
        size="sm"
        id="notifications-mode"
        className="cursor-pointer"
        checked={isSubscribed}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}
