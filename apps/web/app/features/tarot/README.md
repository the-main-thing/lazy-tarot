## This is harder than it seems

1. We have SSR + hydration. Hydration can happen way to late.
2. We use a lot of random values to render UI. So imagine if we generated them during both SSR and CSR
3. We want to be able to easily share revealed card, and keep the APP working even if it has not been hydrated yet.
4. We don't want to load all the data to the client, but we also want the client to be able to use the app offline.
5. We want to keep the amount of requests to the server as low as possible and utilize CDN

These things create a lot (A LOT) of edge cases that we should handle.

Just FYI.
