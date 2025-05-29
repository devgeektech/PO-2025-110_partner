import React from "react";
import { Navigate, Route } from "react-router";
import { all_routes } from "./all_routes";
import Error404 from "../pages/error-404";
import Faq from "../pages/faq";
import ForgotPassword from "../auth/forgot-password";
import Login from "../auth/login";
import ChangePassword from "../auth/change-password";
import Orders from "../pages/orders";
import AddServicesTabContent from "../laundryServices/addService";
import CategoriesList from "../laundryServices/services";
import OrderDetails from "../pages/orderDetails";
import Invoice from "../pages/invoice";
import BackPage from "../common/backPage";
const routes = all_routes;

const publicRoutes = [
  // {
  //   path: routes.faq,
  //   element: <Faq />,
  //   route: Route,
  // },
  {
    path: routes.orders,
    element:  <Orders />,
    route: Route
  },
  {
    path: routes.orderDetails,
    element:  <OrderDetails />,
    route: Route
  },
  {
    path: routes.invoice,
    element:  <Invoice />,
    route: Route
  },
  {
    path: routes.addService,
    element: <AddServicesTabContent />,
    route: Route
  },
  {
    path: routes.services,
    element: <CategoriesList />,
    route: Route
  },
  {
    path: routes.servicesRedirect,
    element: <BackPage />,
    route: Route
  },
  {
    path: routes.invoiceRedirect,
    element: <BackPage />,
    route: Route
  },
  {
    path: routes.ordersRedirect,
    element: <BackPage />,
    route: Route
  },
  {
    path: routes.editserviceRedirect,
    element: <AddServicesTabContent />,
    route: Route
  },
  {
    path: routes.invioceDownloadRedirect,
    element: <BackPage />,
    route: Route
  },
];

const withoutHeaderRoutes = [
  {
    path: routes.error404,
    element: <Error404 />,
    route: Route,
  },
  {
    path: routes.login,
    element: <Login />,
    route: Route,
  },
  {
    path: routes.forgotPasssword,
    element: <ForgotPassword />,
    route: Route,
  },
  {
    path: routes.addService,
    element: <ChangePassword />,
    route: Route,
  },

];
export { publicRoutes, withoutHeaderRoutes };
