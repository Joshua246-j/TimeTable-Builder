/**
 * Global loading state component for the Next.js application.
 * Automatically rendered by Next.js when navigating between routes that require data fetching.
 * 
 * @returns {React.ReactElement} A full-screen centered loading indicator.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-sm text-slate-500">
        Loading...
      </div>
    </div>
  );
}