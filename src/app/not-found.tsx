import Link from "next/link";

/**
 * Global Not Found (404) page component.
 * Rendered when a user navigates to a route that does not exist.
 * 
 * @returns {React.ReactElement} The 404 error page with a link to the dashboard.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">
        404
      </h1>

      <p className="text-slate-500">
        Page not found
      </p>

      <Link
        href="/dashboard"
        className="
          rounded-lg
          bg-blue-600
          px-4
          py-2
          text-white
        "
      >
        Go Dashboard
      </Link>
    </div>
  );
}