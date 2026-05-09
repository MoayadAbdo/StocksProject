import { useEffect, useState } from "react";
import App from "./App";
import AuthPage from "./components/AuthPage";
import { clearAuthToken, hasAuthToken } from "./auth/tokenStorage";

const LOGIN_PATH = "/login";
const REGISTER_PATH = "/register";
const DASHBOARD_PATH = "/dashboard";

function normalizePath(pathname) {
  if (pathname === LOGIN_PATH || pathname === REGISTER_PATH || pathname === DASHBOARD_PATH) {
    return pathname;
  }
  return LOGIN_PATH;
}

export default function RootApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthToken);
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  const navigate = (target, replace = false) => {
    const normalized = normalizePath(target);
    if (normalized === path) return;

    if (replace) {
      window.history.replaceState(null, "", normalized);
    } else {
      window.history.pushState(null, "", normalized);
    }

    setPath(normalized);
  };

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (path !== DASHBOARD_PATH) navigate(DASHBOARD_PATH, true);
      return;
    }

    if (path === DASHBOARD_PATH || (path !== LOGIN_PATH && path !== REGISTER_PATH)) {
      navigate(LOGIN_PATH, true);
    }
  }, [isAuthenticated, path]);

  const logout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <AuthPage
        mode={path === REGISTER_PATH ? "register" : "login"}
        onModeChange={(nextMode) => navigate(nextMode === "register" ? REGISTER_PATH : LOGIN_PATH)}
        onAuthenticated={() => setIsAuthenticated(true)}
      />
    );
  }

  return <App onLogout={logout} onUnauthorized={logout} />;
}
