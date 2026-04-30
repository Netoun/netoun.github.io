import { experiences as staticExperiences } from "../data/experiences-data";
import type { Experience } from "./use-experiences.hook.types";

export function useExperiences(): { experiences: Experience[] } {
  return { experiences: staticExperiences };
}