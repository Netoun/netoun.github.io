import { Link, useParams } from "react-router";
import { LabsExperimentFrame } from "@/features/labs/components/labs-experiment-frame/labs-experiment-frame.component";
import { getExperiment } from "@/features/labs/data/experiments";
import { buildExperimentMeta } from "@/features/labs/data/labs-seo";
import type { Route } from "./+types/labs-experiment.page";
import { labsNotFound, labsNotFoundLink } from "./labs-experiment.page.css";

export function meta({ params }: Route.MetaArgs) {
  const experiment = getExperiment(params.slug);
  if (!experiment) {
    return [{ title: "Netoun - Labs - Not found" }, { name: "robots", content: "noindex" }];
  }
  return buildExperimentMeta(experiment);
}

export default function LabsExperimentPage() {
  const { slug } = useParams();
  const experiment = getExperiment(slug);

  if (!experiment) {
    return (
      <div className={labsNotFound}>
        <p>This experiment doesn’t exist (yet).</p>
        <Link to="/labs" className={labsNotFoundLink}>
          ← Back to all experiments
        </Link>
      </div>
    );
  }

  return <LabsExperimentFrame experiment={experiment} />;
}
