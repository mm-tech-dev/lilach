interface Props {
  /** 'youtube' embeds by id; 'file' plays an mp4 from /public. */
  type: 'youtube' | 'file';
  id?: string;
  src?: string;
  title: string;
  caption?: string;
}

/**
 * One video in a strip. YouTube is lazily embedded so it costs nothing until
 * scrolled to; local files use the native player with metadata-only preload,
 * which keeps large mp4s from downloading on page load.
 */
export default function VideoCard({ type, id, src, title, caption }: Props) {
  return (
    <figure className="videoCard">
      <div className="videoFrame">
        {type === 'youtube' && id ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : null}
        {type === 'file' && src ? (
          <video controls preload="metadata" playsInline aria-label={title}>
            <source src={src} type="video/mp4" />
            הדפדפן שלכם אינו תומך בנגן הווידאו.
          </video>
        ) : null}
      </div>
      <figcaption>
        {caption ? <span className="videoTag">{caption}</span> : null}
        <strong>{title}</strong>
      </figcaption>
    </figure>
  );
}
