import { Outlet } from "react-router";
import { FooterSlim } from "@/components/layouts/footer-slim/footer-slim.component";
import { LabsShell } from "@/features/labs/components/labs-shell/labs-shell.component";
import { contactLinks } from "@/features/site/data/contact-links.data";
import { siteStatus } from "@/features/site/data/site-status.data";

const FOOTER_ID = "contact";

export default function LabsLayout() {
  return (
    <LabsShell
      footerId={FOOTER_ID}
      footer={<FooterSlim id={FOOTER_ID} links={contactLinks} status={siteStatus} />}
    >
      <Outlet />
    </LabsShell>
  );
}
