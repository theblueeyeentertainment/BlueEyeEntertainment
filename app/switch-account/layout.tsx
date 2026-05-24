import { noIndexRobots } from "@/lib/seo/metadata";

export const metadata = {
  title: "Switch Account",
  robots: noIndexRobots,
};

export default function SwitchAccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
