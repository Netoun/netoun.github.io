import { redirect } from "react-router";

// Legacy `/misc` route → Labs. Client-side redirect (app is `ssr: false`).
export function clientLoader() {
  return redirect("/labs");
}

export default function MiscRedirect() {
  return null;
}
