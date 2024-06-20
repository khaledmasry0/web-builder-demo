import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home.tsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      // element: <Home />,
      errorElement: <>error</>,
      children: [
        { index: true, element: <Home /> },

        // { path: ":funnelPageId", element: <Flow /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
