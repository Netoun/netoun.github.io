// 1. Importer des propriétés à partir de `astro:content`
import { z, defineCollection } from 'astro:content';

// 2. Définie le `type` et le `schema` pour chaque collection
const experienceCollection = defineCollection({
    type: 'content', // v2.5.0 et plus
    schema: z.object({
        company: z.string(),
        job: z.string(),
        startDate: z.string(),
        endDate: z.string().optional(),
        image: z.string().optional(),
    }),
});

const schoolCollection = defineCollection({
    type: 'content', // v2.5.0 et plus
    schema: z.object({
        school: z.string(),
        startDate: z.string(),
        endDate: z.string().optional(),
        image: z.string().optional(),
        diploma: z.string()
    }),
});


// 3. Exporter un objet `collections` unique pour enregistrer votre ou vos collection(s)
export const collections = {
    'experience': experienceCollection,
    'school': schoolCollection,
};