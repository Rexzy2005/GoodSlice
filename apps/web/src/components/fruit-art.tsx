/** Decorative vector artwork uses the canonical theme variables. */
export function FruitArt() {
  return <svg className="fruit-art" viewBox="0 0 480 390" fill="none" aria-hidden="true">
    <circle cx="250" cy="195" r="165" stroke="var(--color-vine)" strokeDasharray="3 9" />
    <circle cx="250" cy="195" r="125" stroke="var(--color-vine)" />
    <g transform="rotate(-24 245 195)"><path d="M85 175a160 160 0 0 0 320 0Z" fill="var(--color-leaf)" /><path d="M100 175a145 145 0 0 0 290 0Z" fill="var(--color-cream)" /><path d="M114 175a131 131 0 0 0 262 0Z" fill="var(--color-melon)" />
    <g fill="var(--color-night)"><ellipse cx="159" cy="204" rx="4" ry="9" transform="rotate(-40 159 204)" /><ellipse cx="207" cy="245" rx="4" ry="9" transform="rotate(-20 207 245)" /><ellipse cx="263" cy="255" rx="4" ry="9" /><ellipse cx="316" cy="220" rx="4" ry="9" transform="rotate(30 316 220)" /></g></g>
    <g transform="rotate(18 316 89)"><circle cx="316" cy="89" r="55" fill="var(--color-mango)" /><circle cx="316" cy="89" r="44" stroke="var(--color-cream)" strokeWidth="3" /><path d="m316 45 0 88m-44-44h88m-75-31 62 62m-62 0 62-62" stroke="var(--color-cream)" strokeWidth="3" /></g>
    <path d="M88 111c30-45 56-28 48-1-19 11-35 9-48 1Zm286 172c26-3 43 15 35 37-25 0-42-18-35-37Z" fill="var(--color-leaf)" />
    <path d="m62 299 356-181" stroke="var(--color-cream)" strokeWidth="4" strokeLinecap="round" />
    <path d="m60 312 217-110" stroke="var(--color-mango)" strokeWidth="2" strokeLinecap="round" />
    <g fill="var(--color-mango)"><circle cx="116" cy="55" r="5" /><circle cx="416" cy="251" r="4" /><path d="m401 51 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" /></g>
  </svg>;
}
