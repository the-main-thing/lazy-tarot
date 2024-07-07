import { q, makeSafeQueryRunner } from "groqd";
import type { SanityClient } from "./client.server";

export const getRunQuery = (client: SanityClient) =>
  makeSafeQueryRunner((query) => {
    return client.fetch(query);
  });

export { q };
