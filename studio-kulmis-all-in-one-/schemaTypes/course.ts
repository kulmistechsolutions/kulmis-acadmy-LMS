import {defineField, defineType} from 'sanity'

export const courseType = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}}),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({name: 'thumbnail', title: 'Thumbnail', type: 'image'}),
    defineField({name: 'category', title: 'Category', type: 'string'}),
    defineField({name: 'level', title: 'Level', type: 'string'}),
    defineField({
      name: 'accessType',
      title: 'Access type',
      type: 'string',
      options: {list: ['free', 'pro']},
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Title'},
            {name: 'videoUrl', type: 'url', title: 'Video URL'},
            {name: 'description', type: 'text', title: 'Description'},
            {name: 'order', type: 'number', title: 'Order'},
            defineField({
              name: 'pdfFile',
              title: 'Lesson PDF',
              type: 'file',
              options: {accept: 'application/pdf'},
              description: 'Downloadable PDF for this lesson (Pro members only).',
            }),
          ],
        },
      ],
    }),
  ],
})
