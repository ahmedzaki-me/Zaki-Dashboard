import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
    
  return (
    <h1 className="flex justify-center items-center my-auto gap-1.5 flex-wrap">
      Hello To
      <span className="capitalize text-blue-600 font-medium">{user?.role}</span>
      Dashboard Page, Hi
      <span className="capitalize text-blue-600 font-medium">
        {user?.full_name}
      </span>
    </h1>
  );
}
