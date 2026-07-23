import { z } from "zod";

export const opportunitySchema = z.object({
  type: z.enum(["Internship", "Placement"]),
  status: z.enum(["Applications Open", "Applications Closed"]).default("Applications Open"),
  company: z.string().min(2),
  description: z.string().min(10),
  applicationLink: z.string().url().optional().or(z.literal("")),
  applicationLinks: z.array(z.object({
    name: z.string().min(1),
    url: z.string().url()
  })).min(1, "At least one application link is required"),
  deadline: z.string().min(4),
  compensation: z.array(z.object({
    label: z.string().min(1),
    amount: z.coerce.number().nonnegative()
  })).default([]),
  documents: z.array(z.object({
    name: z.string().min(1),
    url: z.string().min(1)
  })).default([]),
  logo: z.string().nullable().optional()
});

export const statisticSchema = z.object({
  company: z.string().min(2),
  package: z.preprocess((value) => value === "" || value === null || value === undefined ? null : value, z.coerce.number().positive().nullable()),
  placementMode: z.enum(["On Campus", "Off Campus"]).default("On Campus"),
  years: z.array(z.coerce.number().int().min(2000).max(2100)).min(1),
  notes: z.string().nullable().optional()
});

export const alumniSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  passoutYear: z.coerce.number().int().min(1950).max(2100),
  position: z.string().min(2),
  placementMode: z.enum(["On Campus", "Off Campus"]).default("On Campus"),
  ctc: z.preprocess((value) => value === "" || value === null || value === undefined ? null : value, z.coerce.number().nonnegative().nullable()),
  review: z.string().min(10),
});

export const opportunityUpdateSchema = z.object({
  message: z.string().min(2).max(2000)
});
