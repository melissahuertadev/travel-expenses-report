'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface NavigationProps {
  locale: string
}

export default function Navigation({ locale }: NavigationProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const router = useRouter()

  const switchLanguage = (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, '')
    router.push(`/${newLocale}${currentPath}`)
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-2xl font-bold text-blue-900">
          TravelTrack
        </Link>

        <div className="hidden md:flex gap-2">
          <Link href={`/${locale}/expenses`}>
            <Button variant="ghost" className="text-blue-700 hover:bg-blue-100 rounded-full">
              {t('nav.expenses')}
            </Button>
          </Link>
          <Link href={`/${locale}/reports`}>
            <Button variant="ghost" className="text-blue-700 hover:bg-blue-100 rounded-full">
              {t('nav.reports')}
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full border-blue-200 text-blue-700">
                {locale === 'en' ? '🇬🇧' : '🇪🇸'} {locale.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchLanguage('en')}>
                {t('english')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLanguage('es')}>
                {t('spanish')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-blue-100 bg-white/40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 flex-wrap">
          <Link href={`/${locale}/expenses`} className="flex-1 min-w-max">
            <Button variant="ghost" className="w-full text-blue-700 hover:bg-blue-100 rounded-full text-sm">
              {t('nav.expenses')}
            </Button>
          </Link>
          <Link href={`/${locale}/reports`} className="flex-1 min-w-max">
            <Button variant="ghost" className="w-full text-blue-700 hover:bg-blue-100 rounded-full text-sm">
              {t('nav.reports')}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
