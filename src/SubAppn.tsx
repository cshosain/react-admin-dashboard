import Home from "./pages/home/Home";
import Users from "./pages/users/Users";
import Products from "./pages/products/Porducts";
import Navbar from "./components/navbar/Navbar";
import Menu from "./components/menu/Menu";
import Footer from "./components/footer/Footer";
import Login from "./pages/login/Login";
import "./styles/global.scss";

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Product from "./pages/product/Product";
import User from "./pages/user/User";
import Posts from "./pages/posts/Posts";
import Orders from "./pages/orders/Orders";
import { ThemeContext } from "./utilities/context";
import { useContext } from "react";
import Signup from "./pages/signup/Signup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient()

function SubAppn() {
  const { theme } = useContext(ThemeContext);
  const Layout = () => {
    console.log(theme);
    return (
      <div
        style={{
          maxWidth: "1500px", margin: "0 auto",
          background:
            theme !== "light"
              ? "linear-gradient(110.6deg, rgb(156, 116, 129) -18.3%, rgb(67, 54, 74) 16.4%, rgb(47, 48, 67) 68.2%, rgb(27, 23, 36) 99.1%)"
              : "linear-gradient(99.6deg, rgb(209, 227, 255) 10.6%, rgb(242, 227, 234) 32.9%, rgb(234, 202, 213) 52.7%, rgb(220, 227, 239) 72.8%, rgb(185, 205, 227) 81.1%, rgb(154, 180, 212) 102.4%)",
          color: theme !== "light" ? "white" : "black",
        }}
        className="main"
      >
        <Navbar />
        <div className="container">
          <div
            style={{ borderRight: theme !== "light" ? "#384256" : "#d1def8" }}
            className="menuContainer"
          >
            <Menu />
          </div>
          <div className="outletContainer" style={{ width: "100%" }}>
            <QueryClientProvider client={queryClient}>

              <Outlet />
            </QueryClientProvider>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const PrivateRoute: React.FC = () => {
    const token = localStorage.getItem("jsonwebtoken");

    if (!token) {
      return <Navigate to="/login" />;
    }

    return <Layout />;
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PrivateRoute />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/products/:id",
          element: <Product />,
        },
        {
          path: "/users",
          element: <Users />,
        },
        {
          path: "/users/:id",
          element: <User />,
        },
        {
          path: "/posts",
          element: <Posts />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default SubAppn;
