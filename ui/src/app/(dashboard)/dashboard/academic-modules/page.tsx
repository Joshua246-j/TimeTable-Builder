import { Metadata } from "next";
import { AcademicModulesClient } from "@/features/academic-modules/components/AcademicModulesClient";

export const metadata: Metadata = {
  title: "Academic Modules | Campus Management",
  description: "Manage all academic subjects and modules",
};

export default function AcademicModulesPage() {
  return <AcademicModulesClient />;
}
