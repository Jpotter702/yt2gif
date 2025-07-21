'use client'

import { usePathname } from 'next/navigation'
import {
  getWebsiteStructuredData,
  getWebApplicationStructuredData,
  getSoftwareApplicationStructuredData,
  getOrganizationStructuredData,
  getFAQStructuredData,
  getBreadcrumbStructuredData,
} from '@/lib/structured-data'

interface StructuredDataProps {
  type?: 'website' | 'application' | 'organization' | 'faq' | 'breadcrumb'
  breadcrumbItems?: Array<{ name: string; url: string }>
}

export function StructuredData({ type = 'website', breadcrumbItems }: StructuredDataProps) {
  const pathname = usePathname()

  const getStructuredData = () => {
    switch (type) {
      case 'application':
        return [getWebApplicationStructuredData(), getSoftwareApplicationStructuredData()]
      case 'organization':
        return getOrganizationStructuredData()
      case 'faq':
        return getFAQStructuredData()
      case 'breadcrumb':
        if (breadcrumbItems) {
          return getBreadcrumbStructuredData(breadcrumbItems)
        }
        return null
      case 'website':
      default:
        return getWebsiteStructuredData()
    }
  }

  const structuredData = getStructuredData()

  if (!structuredData) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData]),
      }}
    />
  )
}

// Auto-inject structured data based on current page
export function AutoStructuredData() {
  const pathname = usePathname()

  const getBreadcrumbItems = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yt2gif.app'
    const items = [{ name: 'Home', url: baseUrl }]

    if (pathname === '/dashboard') {
      items.push({ name: 'Dashboard', url: `${baseUrl}/dashboard` })
    } else if (pathname === '/convert') {
      items.push({ name: 'Convert', url: `${baseUrl}/convert` })
    } else if (pathname === '/upgrade') {
      items.push({ name: 'Upgrade', url: `${baseUrl}/upgrade` })
    } else if (pathname === '/settings') {
      items.push({ name: 'Settings', url: `${baseUrl}/settings` })
    }

    return items.length > 1 ? items : null
  }

  const breadcrumbItems = getBreadcrumbItems()

  return (
    <>
      {/* Always include website and organization data */}
      <StructuredData type="website" />
      <StructuredData type="organization" />
      
      {/* Include application data on main pages */}
      {(pathname === '/' || pathname === '/convert') && (
        <StructuredData type="application" />
      )}

      {/* Include FAQ data on home page */}
      {pathname === '/' && <StructuredData type="faq" />}

      {/* Include breadcrumb data when available */}
      {breadcrumbItems && (
        <StructuredData type="breadcrumb" breadcrumbItems={breadcrumbItems} />
      )}
    </>
  )
}