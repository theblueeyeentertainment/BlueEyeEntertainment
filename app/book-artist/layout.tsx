import { siteConfig } from "@/lib/config/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Book an Artist",
  description: `Submit a booking enquiry for singers, DJs, comedians, and live performers. ${siteConfig.name} responds with pricing and availability.`,
  path: "/book-artist",
});

export default function BookArtistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
