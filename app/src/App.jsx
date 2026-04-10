import { RouterProvider } from "react-router-dom";
import "./style.css";
import { router } from "./router";

export default function App() {
  return <RouterProvider router={router} />;
}
