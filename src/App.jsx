import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
function App() {
  return (
      <AuthProvider>
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
      </AuthProvider>
  );
}

export default App;
