import { noIndexRobots } from "@/lib/seo/metadata";

export const metadata = {
  title: "Your Profile",
  robots: noIndexRobots,
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
