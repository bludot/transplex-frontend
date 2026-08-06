# transplex-frontend

The web front end for transplex — a Plex companion, paired with
[transplex-api](https://github.com/bludot/transplex-api) and
[transplex-server](https://github.com/bludot/transplex-server).

React 18 and TypeScript on Vite.

## Running it

Requires the Node version in `.nvmrc`.

```sh
yarn install
yarn dev        # dev server
yarn build      # type-check and build
yarn preview    # serve the build locally
```

## How it is put together

- **Components** — one directory each under `src/components`, with an
  `index.ts` re-export, so imports do not reach into a component's internals.
- **Server state** — TanStack Query over an Axios client.
- **Layouts** — `src/layouts` holds the page shells; `src/pages` the screens
  inside them.
- **Config** — `src/config` splits static config (a JSON file per environment,
  under `static/`) from values resolved at runtime (`dynamic/`), behind the
  interfaces in `config/interfaces.ts`.
- **UI** — Headless UI and Popper for the interactive pieces, Font Awesome for
  icons.

## Status

Last worked on in 2023.
