import { SITE_URL } from "@/features/site/data/site";
import { CvSheetSection } from "../sections/cv-sheet/cv-sheet.section";
import { CvToolbarSection } from "../sections/cv-toolbar/cv-toolbar.section";
import * as styles from "./cv.page.css";

const PAGE_TITLE = "Netoun - CV";
const PAGE_DESCRIPTION =
  "Nicolas Coulonnier's résumé on one page: full-stack engineer & creative developer in Nantes, built from this site's own data.";
const PAGE_URL = `${SITE_URL}/cv/`;

export function meta() {
  return [
    { title: PAGE_TITLE },
    { name: "description", content: PAGE_DESCRIPTION },
    // The source of the PDF and its HTML twin for whoever has the link; the home is what search
    // should show.
    { name: "robots", content: "noindex, follow" },
    { property: "og:title", content: PAGE_TITLE },
    { property: "og:description", content: PAGE_DESCRIPTION },
    { property: "og:url", content: PAGE_URL },
    { name: "twitter:title", content: PAGE_TITLE },
    { name: "twitter:description", content: PAGE_DESCRIPTION },
    { tagName: "link", rel: "canonical", href: PAGE_URL },
  ];
}

export default function CvPage() {
  return (
    <main className={styles.page}>
      <CvToolbarSection />
      <CvSheetSection />
    </main>
  );
}
