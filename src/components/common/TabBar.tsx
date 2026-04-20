'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './TabBar.module.css'

const TABS = [
  { href: '/console/overview', label: '개요', num: 1 },
  { href: '/console/evidence', label: '근거', num: 2 },
  { href: '/console/trials', label: '임상 동향', num: 3 },
  { href: '/console/poc', label: 'PoC 설계', num: 4 },
  { href: '/console/architecture', label: '참조 아키텍처', num: 5 },
]

export default function TabBar() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      {TABS.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.number}>{tab.num}</span>
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
