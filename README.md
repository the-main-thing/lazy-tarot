# Lazy tarot. POC.

This is a web app that may grow into something big. The main goal is to try new tech, look at some problems and ways to solve them. Basically to educate myself.

But also this app already is used by somebody. The goal of the app is to help a person to self-analyze through vague description of a tarot card.

This is a monorepo. The API is a cloudflare worker with trcp endpoint.
Database - supabase (postgresql)

The mobile part is ionic. Since JIT is available for javascript on mobile only for web view I decided that it will be the best fit for the purpose.

The web app is Remix.

Animations - react-spring

Language - TypeScript.

To run the apps, you should also fill the environment variables. You can find them in the .env.example files, or in env.ts files.

## WEB: It is harder than it seems

1. We have SSR + hydration. Hydration may happen way to late (i.e. slow mobile connection).
2. We use a lot of random values to render UI (deck). So imagine what could happen if we would generate them during both SSR and CSR
3. We want give the user ability to share their card, and keep the APP working even if it has not been hydrated yet. So some of the state should live in the url.
4. We don't want to load all the data to the client, but we also want the client to be able to use the app offline. So some of the state should live on the client.
5. We want random cards appear random, wich means a really small chance of getting the same card twice. So we have to persist some state on the client.
6. We also want to share the code between web and mobile to save some dev time.

These things create a lot (A LOT) of edge cases that we should handle.

Just FYI.
