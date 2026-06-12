import './globals.css';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '藥師命運轉盤',
  description: '8 題 MBTI 為你抽出命運醫院。輔大附醫藥劑部出品。',
  openGraph: {
    title: '藥師命運轉盤',
    description: '8 題 MBTI 為你抽出命運醫院',
    type: 'website',
    locale: 'zh_TW',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '藥師命運轉盤',
    description: '8 題 MBTI 為你抽出命運醫院',
    images: ['/og'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
