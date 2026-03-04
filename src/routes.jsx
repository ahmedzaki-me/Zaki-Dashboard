import { createBrowserRouter, Navigate, redirect } from "react-router-dom";
// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import OrdersLayout from "./layouts/OrdersLayout";

// Pages
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import MenuPage from "./pages/menu/MenuPage";
import OrdersPage from "./pages/orders/OrdersPage";
import OrderDetails from "./pages/orders/OrderDetails";
import NewOrder from "./pages/orders/NewOrder";
import EmployeesPage from "./pages/employees/Employees";
import ErrorPage from "./pages/ErrorPage";
// Loaders (Logic)
import { supabase } from "./lib/supabase";
import { menuLoader } from "./pages/menu/menuLoader";
import { ordersLoader } from "./pages/orders/ordersLoader";
import { employeesLoader } from "./pages/employees/employeesLoader";
//Fallback
import MenuFallback from "./pages/menu/MenuFallback";
import OrderFallback from "./pages/orders/OrderFallback";

async function loginAction({ request }) {
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    return { error: error.message };
  }
  return redirect("/dashboard");
}

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: "/login",
      element: <LoginPage />,
      action: loginAction,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: "menu",
          element: <MenuPage />,
          loader: menuLoader,
          hydrateFallbackElement: <MenuFallback />,
        },
        {
          path: "orders",
          element: <OrdersLayout />,
          children: [
            {
              index: true,
              element: <OrdersPage />,
              loader: ordersLoader,
              hydrateFallbackElement: <OrderFallback />,
            },
            {
              path: "new",
              element: <NewOrder />,
              loader: menuLoader,
              hydrateFallbackElement: <MenuFallback />,
            },
            {
              path: ":orderInvoice",
              element: <OrderDetails />,
              loader: ordersLoader,
              hydrateFallbackElement: <OrderFallback />,
            },
          ],
        },

        {
          path: "employees",
          element: <EmployeesPage />,
          loader: employeesLoader,
          hydrateFallbackElement: <OrderFallback />,
        },
      ],
    },
  ],
  // { basename: "/test" },
);
