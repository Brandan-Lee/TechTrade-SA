import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { AuthProvider } from "@/features/auth";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return (
  	<MotionConfig reducedMotion="user">
  		<AuthProvider>{children}</AuthProvider>
  	</MotionConfig>
  );
}
