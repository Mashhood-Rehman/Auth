import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import VerifyEmail from "./Pages/VerifyEmail";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import DashboardPage from "./Pages/DashboardPage";
import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticating, user } = useAuthStore();
  if (!isAuthenticating) {
    return <Navigate to="/Login" replace />;
  }
  return children;
};

const RedirectingAuthenticatedUser = ({ children }) => {
  const { isAuthenticating, user } = useAuthStore();

  if (isAuthenticating && user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  // if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectingAuthenticatedUser>
              <Signup />
            </RedirectingAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectingAuthenticatedUser>
              <Login />
            </RedirectingAuthenticatedUser>
          }
        />
        <Route path="/verifyemail" element={<VerifyEmail />} />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectingAuthenticatedUser>
              <ResetPassword />
            </RedirectingAuthenticatedUser>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <RedirectingAuthenticatedUser>
              <ForgotPassword />
            </RedirectingAuthenticatedUser>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
