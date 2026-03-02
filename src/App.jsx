import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthProvider";



function App() {
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     OneSignal.init({
  //       appId: "2b1a2a08-fa45-43cd-b4ca-33e02f06a317",
  //       notifyButton: {
  //         enable: true,
  //       },
  //     });
  //   }
  // }, []);


  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
