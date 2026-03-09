import { Suspense } from 'react'
import { QueryProvider } from '@/lib/query-context'
import QueryInputPanel from '@/components/common/QueryInputPanel'
import TabBar from '@/components/common/TabBar'
import QuerySummaryBar from '@/components/common/QuerySummaryBar'
import DisclaimerBanner from '@/components/common/DisclaimerBanner'

const consoleStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  height: '100vh',
  overflow: 'hidden',
}

const contentStyle = {
  flex: 1,
  overflow: 'auto',
  padding: '20px 24px 40px',
}

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <QueryProvider>
        <div style={consoleStyle}>
          <QueryInputPanel />
          <TabBar />
          <QuerySummaryBar />
          <main style={contentStyle}>{children}</main>
          <DisclaimerBanner />
        </div>
      </QueryProvider>
    </Suspense>
  )
}
