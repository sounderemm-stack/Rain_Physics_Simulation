import { createFileRoute } from "@tanstack/react-router";
import { RainLab } from "@/components/rain/RainLab";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <RainLab />;
}
