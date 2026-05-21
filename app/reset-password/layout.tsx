import { noIndexRobots } from "@/lib/seo/metadata";

export const metadata = {
  title: "Reset Password",
  robots: noIndexRobots,
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
