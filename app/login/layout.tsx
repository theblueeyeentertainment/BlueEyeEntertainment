import { noIndexRobots } from "@/lib/seo/metadata";

export const metadata = {
  title: "Sign In",
  robots: noIndexRobots,
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
