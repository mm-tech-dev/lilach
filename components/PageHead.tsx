import Link from 'next/link';

export interface Crumb {
  href?: string;
  label: string;
}

interface Props {
  crumbs?: Crumb[];
  /** Rendered before the highlighted part of the title. */
  title: string;
  /** Shown in the accent colour after the title. */
  accent?: string;
  lead?: string;
}

export default function PageHead({ crumbs = [], title, accent, lead }: Props) {
  return (
    <section className="pageHead">
      <div className="halo" aria-hidden="true" />
      <div className="wrap">
        {crumbs.length > 0 ? (
          <nav className="breadcrumbs" aria-label="מסלול ניווט">
            <Link href="/">ראשי</Link>
            {crumbs.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`}>
                {' / '}
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span className="current" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        ) : null}

        <h1>
          {title}
          {accent ? (
            <>
              {' '}
              <span>{accent}</span>
            </>
          ) : null}
        </h1>

        {lead ? <p className="pageLead">{lead}</p> : null}
      </div>
    </section>
  );
}
