import { useSyncExternalStore } from "react";

export interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const hasMounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
