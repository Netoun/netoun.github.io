import { useSyncExternalStore } from "react";

export interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const ClientOnly: React.FC<ClientOnlyProps> = ({ children, fallback = null }) => {
  const hasMounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
