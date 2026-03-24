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
      <head>
        {/* FOUC 방지: 렌더 전에 저장된 테마를 즉시 적용 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
