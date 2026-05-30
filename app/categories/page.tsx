import { getDistinctCategories, getCategoryCounts } from "@/lib/services/searchService";
import CategoryGrid from "@/components/home/CategoryGrid";

export default async function CategoriesPage() {
  const [categories, counts] = await Promise.all([
    getDistinctCategories(),
    getCategoryCounts(),
  ]);

  return <div style={{ paddingTop: '3rem' }}><CategoryGrid categories={categories} counts={counts} /></div>;
}
