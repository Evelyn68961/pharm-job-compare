import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '藥師職缺比較',
  description: '醫院藥師職缺，並排比較。',
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
