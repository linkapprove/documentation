# LinkApprove — API Documentation

The public developer docs for `https://api.linkapprove.com/v1`.

React 18 · Vite 5 · TypeScript · Tailwind 3. No UI library, no MDX, no docs framework — pages are
plain TSX composing a small set of documentation primitives.

```bash
pnpm install
pnpm dev        # http://localhost:3004
pnpm build      # tsc -b && vite build → dist/
pnpm preview
```

## Status

Design-only. Every endpoint, field, sample and status code on the site is written by hand. Nothing is
generated from the backend and nothing calls it — the public API service is still a stub, so what is
documented here is a specification to build against rather than a live surface.

The **Try it** runner is part of that: it takes a real API key, lets you edit parameters, and returns
the documented sample response after a simulated round trip. It never opens a socket. Swapping it for
a real `fetch` is a change to one function in `api-runner.tsx`.

## Page shape

The article column is split in two. Spec on the left, code and runner on the right:

```
│ nav 15rem │  spec ……………… │ panel 26rem │ toc 13rem │
                └─ Section grid ─┘
```

The TOC hides under `2xl`, the panel stacks under the spec under `xl`, and the sidebar becomes a sheet
under `lg`. A `Section` with no `panel` spans the full article width.

## Adding a page

1. Add an entry to a `NAV_GROUPS` group in `src/constants/navigation.ts` — path, label, eyebrow,
   summary, icon, and one `sections` entry per anchor on the page.
2. Create `src/pages/<name>.tsx`. Pull the metadata with `pageByPath("/<path>")`, wrap the body in
   `<DocLayout page={PAGE}>`, and give every `<Section>` an `id` matching the nav entry.
3. Register the route in `src/app.tsx`.

The sidebar, ⌘K search index, "on this page" rail and prev/next links all derive from step 1.

## Adding an endpoint

Add a spec to `ENDPOINTS` in `src/constants/endpoints.ts` — method, path, scope, parameters with
default values, the success response and the 401. Then pass it to a `Section`:

```tsx
<Section
  id="create-a-link"
  title="Create a tracking link"
  panel={<ApiRunner endpoint={ENDPOINTS.createTrackingLink} />}
>
  <Endpoint method="POST" path="/tracking-links" scope="links:write" />
  <ParamsTable title="Body parameters" params={CREATE_PARAMS} />
</Section>
```

That one spec produces the cURL / Node / Python / PHP / Go / Ruby samples, the parameter editor, the
request URL and the response — all of which update as the reader edits a field or pastes a key.

## Primitives

| Component | Use |
|---|---|
| `DocLayout` | Page shell — sidebar, article column, TOC rail, prev/next |
| `Section` | The two-column split. Prose as children, code or runner as `panel` |
| `P` `Lead` `Sub` `List` `Code` `Callout` | Prose. Never write raw `<h2>` / `<p>` |
| `ApiRunner` | Generated samples + the interactive Try it console |
| `CodeBlock` | Hand-written samples with language tabs, copy and highlighting |
| `Endpoint` `MethodPill` | The method + path + required-scope header on a reference block |
| `ParamsTable` `StatusRow` | Parameter, field and status-code tables |

## Code generation

`src/constants/code-generators.ts` turns one endpoint spec into six language samples. Adding a
language means a branch there plus a rule list in `RULES_BY_LANGUAGE` in `code-block.tsx`.

Verify generated code actually parses before shipping it. The traps already hit: Go composite
literals need a trailing comma, PHP arrays are `[...]` not `{...}`, and a cURL URL carrying a query
string must be quoted or the shell eats the `&`.

## Theming

Dark by default with a light toggle. Both palettes are token blocks in `src/index.css` — `:root` for
light, `.dark` for dark — exposed to Tailwind as `canvas`, `surface`, `elevated`, `line`, `ink`,
`subtle`, `accent`, `brand`, `code`, `halo`, and the four method colours. Tokens are stored as `R G B`
triplets so opacity modifiers (`bg-accent/10`) work.

Never hardcode a hex in a component. A literal colour will be wrong in one of the two themes — and
note that `--code` is *light* in light mode, so a dark code surface would render light-mode token
colours unreadably.

The inline script in `index.html` applies the stored theme before first paint — removing it makes the
page flash light on load.

## Security note

The runner takes a production API key. It is held in `sessionStorage`, cleared when the tab closes,
never logged and never placed in a URL. Keep it that way if the runner ever starts making real calls.

## Conventions

Kebab-case filenames, `@/` import alias (no `../../`), zero comments — the house rules in the root
`CLAUDE.md` §0.6 and §6 apply here too. `pnpm build` is the gate; a type error fails it.
