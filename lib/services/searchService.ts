import Artist from "@/lib/models/Artist";
import { connectToDatabase } from "@/lib/db/connect";

export async function searchArtists(
  q: string,
  filters?: { category?: string; city?: string },
  pagination?: { page?: number; limit?: number }
) {
  await connectToDatabase();
  const query: any = { $text: { $search: q } };
  if (filters?.category) query["search.category_lower"] = filters.category.toLowerCase();
  if (filters?.city) query["search.city_lower"] = filters.city.toLowerCase();
  
  const page = Math.max(1, pagination?.page || 1);
  const limit = Math.max(1, Math.min(100, pagination?.limit || 12));
  const skip = (page - 1) * limit;

  const [artists, total] = await Promise.all([
    Artist.find(query, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limit)
      .lean(),
    Artist.countDocuments(query)
  ]);

  return {
    artists: JSON.parse(JSON.stringify(artists)),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getDistinctCategories() {
  await connectToDatabase();
  return Artist.distinct("category");
}

export async function getDistinctCities() {
  await connectToDatabase();
  return Artist.distinct("location.city");
}

export async function getCategoryCounts() {
  await connectToDatabase();
  const counts = await Artist.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);
  return counts.reduce((acc: any, cur) => {
    acc[cur._id] = cur.count;
    return acc;
  }, {});
}
