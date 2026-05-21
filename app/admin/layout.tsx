import { noIndexRobots } from "@/lib/seo/metadata";

export const metadata = {
  title: "Admin",
  robots: noIndexRobots,
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
