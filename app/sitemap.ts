import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { siteUrl } from "@/lib/seo/metadata";

function entry(
  path: string,
  options: { priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; lastModified?: Date }
): MetadataRoute.Sitemap[number] {
  return {
    url: siteUrl(path),
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: options.changeFrequency,
    priority: options.priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    entry("/", { priority: 1, changeFrequency: "daily", lastModified: now }),
    entry("/artists", { priority: 0.9, changeFrequency: "daily", lastModified: now }),
    entry("/events", { priority: 0.85, changeFrequency: "daily", lastModified: now }),
    entry("/book-artist", { priority: 0.8, changeFrequency: "monthly", lastModified: now }),
    entry("/about", { priority: 0.7, changeFrequency: "monthly", lastModified: now }),
    entry("/contact", { priority: 0.7, changeFrequency: "monthly", lastModified: now }),
  ];

  let artistEntries: MetadataRoute.Sitemap = [];
  let categoryEntries: MetadataRoute.Sitemap = [];
  let cityEntries: MetadataRoute.Sitemap = [];
  let eventEntries: MetadataRoute.Sitemap = [];

  try {
    const { getArtists } = await import("@/lib/services/artistService");
    const { getDistinctCategories, getDistinctCities } = await import("@/lib/services/searchService");
    const { getEvents } = await import("@/lib/services/eventService");

    const [artistResponse, categories, cities, eventResponse] = await Promise.all([
      getArtists({ limit: 1000 }),
      getDistinctCategories().catch(() => [] as string[]),
      getDistinctCities().catch(() => [] as string[]),
      getEvents({ limit: 500 }).catch(() => ({ events: [] as { slug: string; updatedAt?: string; status?: string }[] })),
    ]);

    const artists = (artistResponse as { artists?: { slug: string; updatedAt?: string }[] })?.artists ?? [];
    artistEntries = artists.map((artist) =>
      entry(`/artists/${artist.slug}`, {
        priority: 0.8,
        changeFrequency: "weekly",
        lastModified: artist.updatedAt ? new Date(artist.updatedAt) : now,
      })
    );

    categoryEntries = (categories as string[])
      .filter(Boolean)
      .map((category) =>
        entry(`/category/${encodeURIComponent(category)}`, {
          priority: 0.75,
          changeFrequency: "weekly",
          lastModified: now,
        })
      );

    cityEntries = (cities as string[])
      .filter(Boolean)
      .map((city) =>
        entry(`/city/${encodeURIComponent(city)}`, {
          priority: 0.75,
          changeFrequency: "weekly",
          lastModified: now,
        })
      );

    const events = (eventResponse as { events?: { slug: string; updatedAt?: string; status?: string }[] })?.events ?? [];
    eventEntries = events
      .filter((event) => event.status !== "Cancelled")
      .map((event) =>
        entry(`/events/${event.slug}`, {
          priority: 0.8,
          changeFrequency: "weekly",
          lastModified: event.updatedAt ? new Date(event.updatedAt) : now,
        })
      );
  } catch (error) {
    console.error("Sitemap: failed to fetch dynamic routes:", error);
  }

  return [...staticEntries, ...categoryEntries, ...cityEntries, ...artistEntries, ...eventEntries];
}
