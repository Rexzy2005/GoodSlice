# Site typography

Verified 2026-10-09. User requested replacement of Phantom Guardians. Space Grotesk is self-hosted from the [official Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/spacegrotesk), with its SIL Open Font License retained beside the font. Variable weight range: 300 to 700. Downloaded font Git blob: a1b2e6c26093066510a31147e7aec9abdc8d6c5e. No runtime Google Fonts request or package dependency.

The shared public/font/typography.css controls application, RainbowKit and offline typography. Only the selected font and stylesheet are eligible for static font precaching. The user-provided Phantom font file is preserved but no longer referenced or cached.

## Game typography

Verified 2026-10-15: the lobby and arena use self-hosted Rajdhani Medium (500) and Bold (700), sourced from the [official Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/rajdhani). [Publisher metadata](https://github.com/google/fonts/blob/main/ofl/rajdhani/METADATA.pb) identifies Indian Type Foundry and the SIL Open Font License. The license is retained as public/font/Rajdhani-OFL.txt. Marketing and offline pages retain Space Grotesk. Only the two named Rajdhani files are added to the static precache allowlist. No font package or remote runtime request is required.

2026-10-15 user-directed scope update: Rajdhani is now the root site font, including marketing, wallet typography and offline fallback. Space Grotesk files remain preserved but are not the active font. No font source or license change.
