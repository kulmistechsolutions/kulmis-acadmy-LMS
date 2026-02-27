import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/** Only created when NEXT_PUBLIC_SANITY_PROJECT_ID is set; null otherwise. */
export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: process.env.NODE_ENV === "production",
    })
  : null;

const courseFields = `
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  description,
  "thumbnailUrl": thumbnail.asset->url,
  category,
  level,
  accessType,
  "lessons": lessons[] {
    title,
    videoUrl,
    description,
    order,
    "pdfUrl": pdfFile.asset->url,
    "pdfSize": pdfFile.asset->size
  }
`;

export async function getCourses(): Promise<SanityCourse[]> {
  if (!client) return [];
  return client.fetch(
    `*[_type == "course"] | order(_createdAt desc) { ${courseFields} }`
  );
}

export async function getCourseBySlug(slug: string): Promise<SanityCourse | null> {
  if (!client) return null;
  const courses = await client.fetch<SanityCourse[]>(
    `*[_type == "course" && (slug.current == $slug || _id == $slug)] { ${courseFields} }`,
    { slug }
  );
  return courses[0] ?? null;
}

export async function getCourseById(id: string): Promise<SanityCourse | null> {
  return getCourseBySlug(id);
}

export type SanityCourse = {
  _id: string;
  _createdAt?: string;
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string | null;
  category?: string;
  level?: string;
  accessType?: string;
  lessons?: {
    title?: string;
    videoUrl?: string;
    description?: string;
    order?: number;
    pdfUrl?: string | null;
    pdfSize?: number | null;
  }[];
};
