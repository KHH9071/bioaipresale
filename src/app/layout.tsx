import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bio AI Presales 데모 콘솔',
  description: '공개 근거 데이터를 바탕으로 고객 과제를 PoC 제안으로 구조화하는 데모',
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
