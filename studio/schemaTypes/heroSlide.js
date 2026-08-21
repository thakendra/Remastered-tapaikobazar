import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow Tag',
      type: 'string',
      description: 'e.g. "Electric vans", "The big one", "Electric cars"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'vehicle',
      title: 'Featured Vehicle',
      type: 'reference',
      to: [{ type: 'vehicle' }],
      description: 'Vehicle to feature on this slide (price and link will automatically sync)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Slide Order',
      type: 'number',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'vehicle.name',
      subtitle: 'eyebrow',
      media: 'vehicle.image',
    },
  },
});
