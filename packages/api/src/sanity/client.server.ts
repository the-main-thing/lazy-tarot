import { createClient as createSanityClient } from "@sanity/client";
import { dataset, useCdn, apiVersion } from "./constants.server";

export const createClient = (projectId: string) =>
  createSanityClient({
    dataset,
    projectId,
    useCdn,
    apiVersion,
  });

export type SanityClient = ReturnType<typeof createClient>;
