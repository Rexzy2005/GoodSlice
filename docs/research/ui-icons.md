# UI icons and motion

Verified: 2026-10-09.

Official Lucide SVG geometry is vendored in src/components/icon.tsx under apps/web, from the immutable [0.468.0 repository tag](https://github.com/lucide-icons/lucide/tree/0.468.0/icons). This is an asset revision, not an additional package dependency or a claim about the latest package release. The [official static asset guide](https://lucide.dev/guide/static) supports SVG use without a framework package.

Original geometry is preserved; the React wrapper sets currentColor, stroke width, aria-hidden and focusable=false for decorative icons. The upstream [ISC license](https://github.com/lucide-icons/lucide/blob/0.468.0/LICENSE) is retained at apps/web/src/components/icons/LICENSE. No CDN or runtime icon network request is used.

CSS entry, fruit and slice animations are finite and disabled by prefers-reduced-motion. No animation library was added. Browser acceptance tests cover reduced motion and active mobile navigation visibility; these require the user-started app.

## React package migration (2026-10-15)

User explicitly requested lucide-react across the site/game. The shared Icon component now imports named React icons, including Settings, Volume2 and VolumeX. Direct dependency lucide-react is pinned to 0.468.0, matching the existing asset revision. Verified publisher metadata at https://registry.npmjs.org/lucide-react/0.468.0 and tagged package source https://github.com/lucide-icons/lucide/blob/0.468.0/packages/lucide-react/package.json: React peer range includes ^19.0.0-rc (which includes stable React 19). Official guide https://lucide.dev/guide/react documents named, tree-shakable components. Installation remains user-owned; exact 0.468.0 was subsequently observed installed. The agent did not edit the lockfile. Fruit illustrations remain artwork, not UI icons.
