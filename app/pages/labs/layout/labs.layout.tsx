import { Outlet } from "react-router";
import { LabsShell } from "@/features/labs/components/labs-shell/labs-shell.component";

export default function LabsLayout() {
  return (
    <LabsShell>
      <Outlet />
    </LabsShell>
  );
}
