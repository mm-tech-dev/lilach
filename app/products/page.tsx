import type { Metadata } from 'next';
import Image from 'next/image';

import CtaStrip from '@/components/CtaStrip';
import PageHead from '@/components/PageHead';
import { contact } from '@/lib/site';
import { formatPrice } from '@/lib/format';
import { getProducts, resolveMediaMap } from '@/lib/vision-os/server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'מוצרים',
  description:
    'קריסטלים, מטוטלות, תליונים וקורס דיגיטלי — כלי עבודה והגנה מהמרכז להפצת אור.',
  alternates: { canonical: '/products' },
};

export default async function ProductsPage() {
  const products = await getProducts();
  const media = await resolveMediaMap(products.map((p) => p.image));

  return (
    <>
      <PageHead
        crumbs={[{ label: 'מוצרים' }]}
        title="כלים קטנים,"
        accent="שינוי גדול."
        lead="קריסטלים, מטוטלות וכלי עבודה שמלווים את התהליך — ולרכישה פנו אלינו בטלפון או בוואטסאפ."
      />

      <section className="section wrap" style={{ paddingTop: 60 }}>
        {products.length === 0 ? (
          <p className="emptyState">המוצרים יעלו לאתר בקרוב.</p>
        ) : (
          <div className="productGrid">
            {products.map((product) => {
              const img = product.image ? media.get(product.image) : null;
              const price = formatPrice(product.price);
              return (
                <article key={product.id} className="productCard">
                  {img ? (
                    <div className="productMedia">
                      <Image
                        src={img.url}
                        alt={img.alt || product.title}
                        width={img.width ?? 800}
                        height={img.height ?? 600}
                        sizes="(max-width: 700px) 100vw, 300px"
                      />
                    </div>
                  ) : (
                    <div className="mark" aria-hidden="true">
                      ✦
                    </div>
                  )}

                  <h3>{product.title}</h3>
                  {product.description ? <p>{product.description}</p> : null}

                  <div className="foot">
                    <span className="price">{price ?? 'לפרטים'}</span>
                    <a
                      className="buyLink"
                      href={`https://api.whatsapp.com/send/?phone=972545931208&text=${encodeURIComponent(
                        `היי, אני מעוניין/ת ב${product.title}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      לרכישה <span aria-hidden="true">←</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <p className="pageLead" style={{ marginTop: 40 }}>
          לרכישה או לשאלות ניתן להתקשר ל
          <a href={contact.phoneHref} style={{ fontWeight: 700 }}>
            {contact.phoneDisplay}
          </a>{' '}
          או לשלוח הודעה בוואטסאפ.
        </p>
      </section>

      <CtaStrip
        title="לא מצאתם את מה שחיפשתם?"
        body="ספרו לנו מה אתם מחפשים ונשמח לעזור להתאים את הכלי הנכון עבורכם."
      />
      <div style={{ height: 100 }} />
    </>
  );
}
