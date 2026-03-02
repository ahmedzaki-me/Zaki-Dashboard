import { useState, useEffect } from "react";
import { getCurrentUser, supabase } from "../lib/supabase";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshFullUserData = async () => {
    const fullData = await getCurrentUser();
    if (fullData) setUser(fullData);
  };

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        setLoading(false);
        refreshFullUserData();
      } else {
        setLoading(false);
      }
    };
    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        setLoading(false);

        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          refreshFullUserData();
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshFullUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
