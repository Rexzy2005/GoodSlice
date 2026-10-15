# Playground artwork

Status: Partially Verified
Last verified: 2026-10-09
Source: user-provided playground image; built-in image_gen tool through the imagegen skill. Original outputs preserved in public/game alongside optimized WebP files. Alpha verified for fruit artwork.

## Selected assets

- apps/web/public/game/chopping-board-v1.webp (PNG master alongside)
- apps/web/public/game/fruit-splash-v1.webp (PNG master alongside)

## Final prompts

Board: "Use case: precise-object-edit. Asset type: production game-board background. Use supplied image as edit reference. Create a clean, EMPTY wooden chopping board occupying the entire wide image, matching the warm rich walnut horizontal planks, realistic wood grain, inset rounded border, narrow polished brass rim and four brass corner screws from the reference. Remove the entire top HUD, ALL words, numbers, fruit, juice, slash effects, buttons, mouse icons and interface controls. Board only, straight-on orthographic. The usable empty wooden playing surface should occupy 94 percent of image, minimal rim, no surrounding background. Wide landscape about 2:1. This is a game background texture, not a screenshot. No text, logos, watermarks, fruit or objects on the board."

Fruit: "Asset type: transparent foreground artwork for a fruit slicing game ready screen. Use the attached screenshot ONLY as a style/composition reference. Create a standalone cutout of the CENTRAL FRUIT ACTION: sliced orange at upper left, large sliced watermelon in middle, sliced purple plum at right, realistic glossy juicy fruit flesh and droplets, dramatic thin golden-white diagonal sword slash from lower-left to upper-right. Premium polished 3D mobile game illustration, warm lighting. Wide composition. Actual transparent background with alpha; no wood, no board, no shadows on a background, no HUD, no text, no buttons, no border, no logos. Keep all fruit and splash within image with generous transparent margin. This asset overlays an existing wooden board."

## Boundaries

The illustration decorates the ready screen. The interactive cutting preview uses separate original procedural fruit textures, split halves, particles and trails in Phaser. Screenshot scores, hearts, combo multipliers and round counts are not copied as actual state. Visual/device acceptance remains pending.
