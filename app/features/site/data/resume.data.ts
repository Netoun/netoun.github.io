/**
 * The résumé PDF, printed from the /cv/ page by `bun run generate-cv` into `public/`. No imports:
 * the script reads this file too.
 */
export const RESUME_FILE = "nicolas-coulonnier-cv.pdf";
export const RESUME_HREF = `/${RESUME_FILE}`;

/**
 * Whether the site links the PDF: a row in the hero's contact popover and one on the home
 * footer's plate. The PDF embeds PP Neue Montreal; Nicolas published it on 2026-10-04.
 */
export const RESUME_IS_PUBLISHED: boolean = true;
