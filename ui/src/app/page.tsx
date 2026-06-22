import { redirect } from "next/navigation";

/**
 * Main entry point for the root URL ("/").
 * Redirects the user immediately to the dashboard.
 * 
 * @returns {never} Redirects to /dashboard.
 */
export default function HomePage() {
  redirect("/dashboard");
}