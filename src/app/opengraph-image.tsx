import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({
  searchParams,
}: {
  searchParams: Promise<{ title?: string }>;
}) {
  const { title } = await searchParams;
  const text = (title || 'BreadPan Dev Blog').slice(0, 120);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#0f172a',
          color: 'white',
          padding: 64,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.25,
          }}
        >
          {text}
        </div>
        <div style={{ marginTop: 24, fontSize: 24, opacity: 0.85 }}>BreadPan Dev Blog</div>
      </div>
    ),
    { ...size }
  );
}
