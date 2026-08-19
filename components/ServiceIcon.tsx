import type { IconKey } from '@/lib/vision-os/types';

/** Line icons taken verbatim from the approved design. */
const paths: Record<IconKey, React.ReactNode> = {
  lectures: (
    <>
      <rect x="17" y="7" width="14" height="25" rx="7" />
      <path d="M11 24v2a13 13 0 0 0 26 0v-2M24 39v5M18 44h12" />
      <path d="M17 17h5M26 17h5M17 23h5M26 23h5" />
    </>
  ),
  workshops: (
    <>
      <circle cx="24" cy="24" r="8" />
      <path d="M24 7v5M24 36v5M7 24h5M36 24h5M12 12l4 4M32 32l4 4M36 12l-4 4M16 32l-4 4" />
    </>
  ),
  therapy: (
    <>
      <path d="M24 38S9 30 9 19a8 8 0 0 1 15-4 8 8 0 0 1 15 4c0 11-15 19-15 19Z" />
      <path d="M24 18v12M18 24h12" />
    </>
  ),
  courses: (
    <>
      <path d="M24 14c-4-3-9-4-15-3v25c6-1 11 0 15 3 4-3 9-4 15-3V11c-6-1-11 0-15 3Z" />
      <path d="M24 14v25M14 18c3 0 5 .5 7 2M27 20c2-1.5 4-2 7-2" />
    </>
  ),
};

export default function ServiceIcon({ icon }: { icon: IconKey | null }) {
  return (
    <div className="serviceIcon">
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[icon ?? 'courses'] ?? paths.courses}
      </svg>
    </div>
  );
}
