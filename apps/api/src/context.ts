import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { createClient, getRunQuery } from "./sanity";

export function createContext(
  { req, resHeaders }: FetchCreateContextFnOptions,
  env: {
    SANITY_STUDIO_PROJECT_ID: string;
  },
) {
  const client = createClient(env.SANITY_STUDIO_PROJECT_ID);
  return {
    req,
    resHeaders,
    sanity: {
      client,
      runQuery: getRunQuery(client),
    },
  };
}
export type Context = Awaited<ReturnType<typeof createContext>>;
