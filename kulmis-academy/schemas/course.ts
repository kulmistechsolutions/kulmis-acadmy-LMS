export default {
  name: "course",
  title: "Course",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "description", title: "Description", type: "text" },
    { name: "thumbnail", title: "Thumbnail", type: "image" },
    { name: "category", title: "Category", type: "string" },
    { name: "level", title: "Level", type: "string" },
    { name: "accessType", title: "Access type", type: "string", options: { list: ["free", "pro"] } },
    {
      name: "lessons",
      title: "Lessons",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "videoUrl", type: "url" },
            { name: "description", type: "text" },
            { name: "order", type: "number" },
            {
              name: "pdfFile",
              title: "Lesson PDF",
              type: "file",
              options: { accept: "application/pdf" },
              description: "Downloadable PDF for this lesson (Pro members only).",
            },
          ],
        },
      ],
    },
  ],
};
