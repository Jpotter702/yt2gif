// Structured data for SEO

export function getWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'yt2gif.app',
    description: 'Convert any YouTube video into a shareable GIF in seconds',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://yt2gif.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yt2gif.app'}/?url={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      // Add social media URLs when available
      // 'https://twitter.com/yt2gif',
      // 'https://github.com/yt2gif',
    ],
  }
}

export function getWebApplicationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'yt2gif.app',
    description: 'Convert any YouTube video into a shareable GIF in seconds',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://yt2gif.app',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        name: 'Free Plan',
        description: 'Convert YouTube videos to GIFs with watermark',
      },
      {
        '@type': 'Offer',
        price: '9.99',
        priceCurrency: 'USD',
        name: 'Premium Plan',
        description: 'Unlimited GIF conversions without watermark',
      },
    ],
    featureList: [
      'YouTube video to GIF conversion',
      'Custom time range selection',
      'Multiple quality options',
      'Free and premium plans',
      'No software installation required',
    ],
  }
}

export function getSoftwareApplicationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'yt2gif.app',
    description: 'Convert any YouTube video into a shareable GIF in seconds',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://yt2gif.app',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }
}

export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'yt2gif.app',
    description: 'The easiest way to convert YouTube videos to GIFs',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://yt2gif.app',
    logo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yt2gif.app'}/icon-512x512.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  }
}

export function getFAQStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I convert a YouTube video to GIF?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Simply paste the YouTube video URL into our converter, select the time range you want, and click convert. Your GIF will be ready for download in seconds.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is yt2gif.app free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We offer a free plan that allows you to convert YouTube videos to GIFs with a watermark. Premium plans are available for unlimited conversions without watermarks.',
        },
      },
      {
        '@type': 'Question',
        name: 'What video formats are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We support all YouTube video formats. Simply paste any YouTube video URL and we will handle the conversion automatically.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long can my GIF be?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Free users can create GIFs up to 10 seconds long. Premium users can create GIFs up to 30 seconds long.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to install any software?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No! yt2gif.app works entirely in your web browser. No downloads or installations required.',
        },
      },
    ],
  }
}

export function getBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}