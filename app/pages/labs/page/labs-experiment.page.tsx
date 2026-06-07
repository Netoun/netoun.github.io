import { Link, useParams } from "react-router";
import { LabsExperimentFrame } from "@/features/labs/components/labs-experiment-frame/labs-experiment-frame.component";
import { labs } from "@/features/labs/data/experiments";
import type { Route } from "./+types/labs-experiment.page";
import { labsNotFound, labsNotFoundLink } from "./labs-experiment.page.css";

export function meta({ params }: Route.MetaArgs) {
  const experiment = labs.getBySlug(params.slug);
  if (!experiment) {
    return [{ title: "Netoun - Labs - Not found" }, { name: "robots", content: "noindex" }];
  }
  return labs.buildMeta(experiment);
}

export default function LabsExperimentPage() {
  const { slug } = useParams();
  const experiment = labs.getBySlug(slug);

  if (!experiment) {
    return (
      <div className={labsNotFound}>
        <p>This experiment doesn't exist (yet).</p>
        <Link to="/labs" className={labsNotFoundLink}>
          ← Back to all experiments
        </Link>
      </div>
    );
  }

  return <LabsExperimentFrame experiment={experiment} />;
}
