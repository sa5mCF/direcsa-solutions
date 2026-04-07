import { ImageResponse } from 'next/og';
import { getProductBySlug } from '@/lib/products';

export const runtime = 'edge';

export const alt = 'Detalle de Producto — Direcsa';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const product = getProductBySlug(slug);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://direcsa.com';

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: '#0F172A',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E2E8F0',
          }}
        >
          Direcsa
        </div>
      ),
      {
        ...size,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0F172A', // audio-bg
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(34, 211, 238, 0.1)',
            color: '#22D3EE',
            fontSize: '24px',
            fontWeight: 'bold',
            padding: '8px 24px',
            borderRadius: '100px',
            marginBottom: '40px',
            width: 'fit-content'
          }}>
            {product.category}
          </div>
          <div style={{
            display: 'flex',
            fontSize: '84px',
            fontWeight: 'bold',
            color: '#E2E8F0',
            lineHeight: 1,
            marginBottom: '20px',
          }}>
            {product.name}
          </div>
          <div style={{
            display: 'flex',
            fontSize: '32px',
            color: 'rgba(226, 232, 240, 0.6)',
            maxWidth: '550px',
            lineHeight: 1.4,
          }}>
            {product.shortDescription}
          </div>
          <div style={{
            display: 'flex',
            marginTop: '60px',
            fontSize: '20px',
            color: '#22D3EE',
            fontWeight: 'bold',
            letterSpacing: '0.1em'
          }}>
            DIRECSA PROFESSIONAL AUDIO
          </div>
        </div>
        <div style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Background Glow */}
          <div style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            backgroundColor: 'rgba(34, 211, 238, 0.1)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${baseUrl}${product.image}`}
            alt={product.name}
            style={{
              width: '550px',
              height: '550px',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
