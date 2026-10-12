/** The logo: a ring half full of liquid with a wavy surface. Same drawing as app/icon.svg (the favicon). */
export function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <svg className="brand-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="brand-mark-inside">
          <circle cx="32" cy="32" r="25" />
        </clipPath>
      </defs>
      <circle className="brand-mark-ring" cx="32" cy="32" r="27" strokeWidth="5" />
      <path
        className="brand-mark-liquid"
        clipPath="url(#brand-mark-inside)"
        d="M0 34 C 10 28, 20 28, 32 34 S 54 40, 64 34 V 64 H 0 Z"
      />
    </svg>
  );
}
