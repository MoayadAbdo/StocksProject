import { useEffect, useState } from "react";
import { loginUser, registerUser } from "../api/authApi";
import { setAuthToken } from "../auth/tokenStorage";
import ThemeToggle from "./ThemeToggle";

function extractErrorMessage(error, fallback) {
  const details = error?.response?.data?.details;
  if (Array.isArray(details) && details.length > 0) {
    return details[0];
  }

  const message = error?.response?.data?.message;
  if (typeof message === "string" && message.trim()) {
    return message;
  }

  const serverError = error?.response?.data?.error;
  if (typeof serverError === "string" && serverError.trim()) {
    return serverError;
  }

  return fallback;
}

function loginDefaults() {
  return {
    email: "",
    password: ""
  };
}

function registerDefaults() {
  return {
    name: "",
    email: "",
    password: ""
  };
}

export default function AuthPage({ mode, onModeChange, onAuthenticated }) {
  const isLogin = mode !== "register";
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("portfolio-theme");
    if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginForm, setLoginForm] = useState(loginDefaults);
  const [registerForm, setRegisterForm] = useState(registerDefaults);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    setErrorMessage("");
  }, [mode]);

  const completeAuth = (token) => {
    if (!token) {
      throw new Error("No token returned from authentication endpoint.");
    }
    setAuthToken(token);
    onAuthenticated();
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErrorMessage("");

    try {
      const response = await loginUser({
        email: loginForm.email.trim(),
        password: loginForm.password
      });
      completeAuth(response?.token);
    } catch (error) {
      setErrorMessage(extractErrorMessage(error, "Failed to login. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const submitRegister = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErrorMessage("");

    try {
      const response = await registerUser({
        name: registerForm.name.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password
      });
      completeAuth(response?.token);
    } catch (error) {
      setErrorMessage(extractErrorMessage(error, "Failed to register. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full">
          <header className="mb-6 flex items-center justify-between gap-3 sm:mb-8">
            <div>
              <p className="text-sm font-medium text-accent-600 dark:text-accent-100">Portfolio Intelligence</p>
              <h1 className="mt-1 text-xl font-semibold sm:text-2xl">Secure Dashboard Access</h1>
            </div>
            <ThemeToggle theme={theme} onToggle={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))} />
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="surface-card p-6 sm:p-8">
              <h2 className="text-2xl font-semibold sm:text-3xl">Track Your Portfolio With Live Data</h2>
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                Login or create your account to access holdings, P/L trends, top movers, and allocation exposure in
                one dashboard.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-200/90 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <p className="text-sm font-medium">Live Portfolio Metrics</p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Summary, performance, and exposure.</p>
                </div>
                <div className="rounded-xl border border-zinc-200/90 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <p className="text-sm font-medium">Secure JWT Session</p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Stored locally for API requests.</p>
                </div>
              </div>
            </section>

            <section className="surface-card p-6 sm:p-8">
              <div className="inline-flex rounded-full border border-accent-100 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-600 dark:border-accent-500/30 dark:bg-accent-500/10 dark:text-accent-100">
                Secure Access
              </div>
              <h2 className="mt-4 text-2xl font-semibold">{isLogin ? "Login" : "Register"}</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {isLogin
                  ? "Enter your account credentials to continue."
                  : "Create an account to access your portfolio dashboard."}
              </p>

              <div className="mt-5 grid grid-cols-2 rounded-xl border border-zinc-200 p-1 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => onModeChange("login")}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isLogin
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => onModeChange("register")}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    !isLogin
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={isLogin ? submitLogin : submitRegister} className="mt-5 space-y-4">
                {!isLogin ? (
                  <label className="block">
                    <span className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">Name</span>
                    <input
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent-500 dark:border-zinc-800 dark:bg-zinc-900"
                      placeholder="John Doe"
                      value={registerForm.name}
                      onChange={(event) => setRegisterForm((prev) => ({ ...prev, name: event.target.value }))}
                      autoComplete="name"
                    />
                  </label>
                ) : null}

                <label className="block">
                  <span className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">Email</span>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent-500 dark:border-zinc-800 dark:bg-zinc-900"
                    placeholder="name@example.com"
                    value={isLogin ? loginForm.email : registerForm.email}
                    onChange={(event) =>
                      isLogin
                        ? setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                        : setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    autoComplete="email"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm text-zinc-600 dark:text-zinc-300">Password</span>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-accent-500 dark:border-zinc-800 dark:bg-zinc-900"
                    placeholder={isLogin ? "Enter password" : "At least 6 characters"}
                    value={isLogin ? loginForm.password : registerForm.password}
                    onChange={(event) =>
                      isLogin
                        ? setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                        : setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                    }
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                </label>

                {errorMessage ? (
                  <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-700/50 dark:bg-rose-900/20 dark:text-rose-300">
                    {errorMessage}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {busy ? "Please wait..." : isLogin ? "Login to Dashboard" : "Create Account"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
