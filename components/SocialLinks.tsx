import { contact, socials } from '@/lib/site';

const icons: Record<string, React.ReactNode> = {
  facebook: <path d="M17 3h-3a5 5 0 0 0-5 5v3H6v4h3v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1h3V3Z" />,
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
  phone: (
    <path d="M6.5 3h3l1.5 4-2 1.4a12 12 0 0 0 5.6 5.6L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6.2 2 2 0 0 1 6.5 3Z" />
  ),
};

function Glyph({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

interface Props {
  className?: string;
  /** Appends a call button alongside the social icons. */
  withPhone?: boolean;
}

/**
 * Icon links to the centre's real, verified profiles. The network names are
 * carried by aria-label and title rather than visible text.
 */
export default function SocialLinks({ className = 'socialRow', withPhone = false }: Props) {
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
          <Glyph name={s.key} />
        </a>
      ))}

      {withPhone ? (
        <a href={contact.phoneHref} aria-label={`חיוג ל${contact.phoneDisplay}`} title={contact.phoneDisplay}>
          <Glyph name="phone" />
        </a>
      ) : null}
    </div>
  );
}
