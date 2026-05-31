import type { LabExperiment } from "./labs.types";

/** Production origin used for canonical + Open Graph URLs. */
export const SITE_URL = "https://www.netoun.com";

const LABS_DESCRIPTION =
  "An interactive playground of the 3D, canvas and shader experiments powering netoun.com — live demos with their source code.";

type MetaDescriptor =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { tagName: "link"; rel: string; href: string };

/** Per-experiment SEO meta: title, description, keywords, OG, Twitter, canonical. */
export function buildExperimentMeta(experiment: LabExperiment): MetaDescriptor[] {
  const url = `${SITE_URL}/labs/${experiment.slug}`;
  const title = `Netoun - Labs - ${experiment.title}`;

  return [
    { title },
    { name: "description", content: experiment.description },
    { name: "keywords", content: experiment.tags.join(", ") },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: title },
    { property: "og:description", content: experiment.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: experiment.description },
    { tagName: "link", rel: "canonical", href: url },
  ];
}

/** SEO meta for the `/labs` index. */
export function buildLabsIndexMeta(): MetaDescriptor[] {
  const url = `${SITE_URL}/labs`;
  const title = "Netoun - Labs";

  return [
    { title },
    { name: "description", content: LABS_DESCRIPTION },
    {
      name: "keywords",
      content:
        "Labs, playground, WebGL, shaders, canvas, 3D CSS, creative coding, React, experiments, Netoun",
    },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: title },
    { property: "og:description", content: LABS_DESCRIPTION },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: LABS_DESCRIPTION },
    { tagName: "link", rel: "canonical", href: url },
  ];
}
