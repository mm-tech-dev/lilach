import { socials } from '@/lib/site';

const icons: Record<string, React.ReactNode> = {
  facebook: (
    <path d="M17 3h-3a5 5 0 0 0-5 5v3H6v4h3v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1h3V3Z" />
  ),
  youtube: (
    <>
      <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8Z" />
      <path d="M10 9.2v5.6l4.5-2.8L10 9.2Z" fill="currentColor" stroke="none" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z" />
      <path d="M8.6 8.4c-.3.7-.2 1.6.5 2.6a9 9 0 0 0 3.9 3.4c1.1.4 2 .3 2.5-.2l.4-.5-2-1-.7.7a6 6 0 0 1-2.4-2.4l.7-.7-1-2-.6.2Z" />
    </>
  ),
};

/** Icon links to the center's real, verified social profiles. */
export default function SocialLinks({ className = 'socialRow' }: { className?: string }) {
  return (
    <div className={className}>
      {socials.map((s) => (
        <a
          key={s.key}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {icons[s.key]}
          </svg>
          <span>{s.label}</span>
        </a>
      ))}
    </div>
  );
}
