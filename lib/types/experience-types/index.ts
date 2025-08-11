import { JsonValue } from '@prisma/client/runtime/library';
import * as z from 'zod';

export type ExperienceType = {
    id: string,
    positionName: string,
    companyName: string,
    companyLocation: string,
    workMode?: 'remote' | 'hybrid' | 'onsite',
    startDate: Date,
    endDate: Date | null,
    isCurrentlyWorking: boolean,
    learned: JsonValue[],
};
const minDate: Date = new Date("2000-01-01")

// Helpers to coerce form string dates (yyyy-MM-dd) to Date/null
const coerceDate = (val: unknown) => {
  if (typeof val === 'string') {
    return val ? new Date(val) : undefined
  }
  return val
}
const coerceNullableDate = (val: unknown) => {
  if (typeof val === 'string') {
    return val ? new Date(val) : null
  }
  return val
}

export const createAndEditExperienceSchema = z.object({
    positionName: z.string().min(1, {
        message: "Position Name is required!"
    }),
    companyName: z.string().min(1, {
        message: "Company Name is required!"
    }),
    companyLocation: z.string().min(1, {
        message: "Location is required!"
    }),
    workMode: z.enum(['remote','hybrid','onsite']).optional(),
    startDate: z.preprocess(coerceDate, z.date().min(minDate, {
        message: "Start date is required."
    })),
    isCurrentlyWorking: z.boolean().default(false),
    endDate: z.preprocess(coerceNullableDate, z.date().min(minDate, {
        message: "End date is required."
    }).nullable()),
    learned: z.array(z.object({
        id: z.string(),
        text: z.string(),
    })).min(1, {
        message: "What I did is required."
    }),
}).refine((data) => {
    // If not currently working, end date is required
    if (!data.isCurrentlyWorking && !data.endDate) {
        return false;
    }
    return true;
}, {
    message: "End date is required when not currently working",
    path: ["endDate"]
});
export type CreateAndEditExperienceType = z.infer<typeof createAndEditExperienceSchema>;
