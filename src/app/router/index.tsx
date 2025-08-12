import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // You can add children routes here
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
