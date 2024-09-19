import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import AdminLayout from "layouts/admin";
import Support from "views/admin/settings/support";
import { getCurrentMap, getS3SignUrlApi } from "services/customAPI";
import { setAppData } from "redux/reducers/appDataReducer";

const ProtectedRoute = React.lazy(
  () => import("./views/routes/protectedRoutes")
);
const Login = React.lazy(() => import("./views/login/login"));
const Register = React.lazy(() => import("./views/register/register"));
const ResetPassword = React.lazy(
  () => import("./views/reset-password/resetPass")
);
const PrivacyPolicy = React.lazy(
  () => import("./views/admin/settings/privacyPolicy")
);

const CustomRoutes = () => {
  const token = useSelector((store: any) => store.auth.token);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
      <Route path="/support" element={<Support />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route element={<ProtectedRoute />}>
        <Route path="admin/*" element={<AdminLayout />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  let persistor = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CustomRoutes />
      </PersistGate>
    </Provider>
  );
};

export default App;
