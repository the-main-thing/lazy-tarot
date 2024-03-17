import { urlFor } from "./urlFor.server";
import type { schemas } from "./schemas.server";
import type { SanityClient } from "./client.server";

export const getImagesSet = <TBreakpoints extends Record<number, number>>({
  client,
  image,
  breakpoints,
  format,
}: {
  client: SanityClient;
  format?: "png" | "jpg";
  breakpoints: TBreakpoints;
  image: ReturnType<(typeof schemas)["image"]["parse"]>;
}) =>
  Object.fromEntries(
    Object.entries(breakpoints).map(([breakPoint, width]) => [
      breakPoint,
      {
        src: urlFor(client, image)
          .width(width)
          .fit("clip")
          .format(format || "jpg")
          .quality(84)
          .url(),
        width,
      },
    ]),
  ) as {
    [key in keyof TBreakpoints]: {
      src: string;
      width: TBreakpoints[key];
    };
  };
