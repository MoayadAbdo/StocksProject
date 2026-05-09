export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200/90 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      aria-label="Toggle color theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3V5M12 19V21M5.64 5.64L7.05 7.05M16.95 16.95L18.36 18.36M3 12H5M19 12H21M5.64 18.36L7.05 16.95M16.95 7.05L18.36 5.64M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1585 17.4649C18.1131 18.8154 16.7048 19.8391 15.0975 20.416C13.4901 20.9929 11.7515 21.0987 10.0868 20.7211C8.42214 20.3435 6.89781 19.4972 5.69378 18.2872C4.48975 17.0771 3.65142 15.5485 3.28204 13.8821C2.91267 12.2156 3.02653 10.4775 3.6097 8.87294C4.19287 7.2684 5.22329 5.86486 6.5786 4.82578C7.93391 3.7867 9.55908 3.15557 11.262 3.00699C10.264 4.35686 9.78382 6.02056 9.90714 7.69665C10.0305 9.37274 10.749 10.9514 11.9357 12.1381C13.1224 13.3248 14.7011 14.0433 16.3771 14.1666C18.0532 14.29 19.7169 13.8098 21.0668 12.8118L21 12.79Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
