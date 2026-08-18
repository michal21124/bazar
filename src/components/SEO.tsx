import { Helmet } from 'react-helmet-async';

const SITE_NAME  = 'Autobazar Platinum Cars';
const SITE_URL   = 'https://platinumcars.cz'; // update after getting final domain
const OG_IMAGE   = `${SITE_URL}/logo.png`;
const DEFAULT_DESC =
  'Autobazar Platinum Cars — prémiová ojetá vozidla v Klíčanech-Vodochodech u Prahy. ' +
  'Výkup, prodej a výměna vozů. ☎ +420 777 876 406';

const BUSINESS = {
  '@type': 'AutoDealer',
  '@id': `${SITE_URL}/#business`,
  name: SITE_NAME,
  alternateName: 'Platinum Cars',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  telephone: '+420777876406',
  email: 'info@platinumcars.cz',
  description: DEFAULT_DESC,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'K pumpě',
    addressLocality: 'Klíčany-Vodochody',
    postalCode: '250 69',
    addressCountry: 'CZ',
    addressRegion: 'Středočeský kraj',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 50.2097,
    longitude: 14.3847,
  },
  hasMap: 'https://maps.google.com/?q=Klíčany-Vodochody+K+pumpě+250+69',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '14:00' },
  ],
  priceRange: '$$',
  currenciesAccepted: 'CZK',
  paymentAccepted: 'Cash, Bank Transfer',
  areaServed: { '@type': 'Country', name: 'CZ' },
  sameAs: [
    'https://www.tiktok.com/@platinumautobazar?_r=1&_t=ZN-98xqcmCfFn4',
    'https://t.me/autonavse',
  ],
};

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESC,
  inLanguage: 'cs-CZ',
  publisher: { '@id': `${SITE_URL}/#business` },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/vozy?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

type BreadcrumbItem = { name: string; item: string };

type Props = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  breadcrumbs?: BreadcrumbItem[];
  faq?: { question: string; answer: string }[];
};

export function SEO({
  title,
  description = DEFAULT_DESC,
  canonical,
  image = OG_IMAGE,
  noIndex = false,
  type = 'website',
  breadcrumbs,
  faq,
}: Props) {
  const pageTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} – Prémiová ojetá auta | Klíčany u Prahy`;
  const canonicalUrl = canonical
    ? canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`
    : SITE_URL;

  /* ── JSON-LD schemas ─────────────────────────────────────────── */
  const schemas: object[] = [
    WEBSITE_SCHEMA,
    { '@context': 'https://schema.org', ...BUSINESS },
  ];

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Domů', item: SITE_URL },
        ...breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 2,
          name: b.name,
          item: b.item.startsWith('http') ? b.item : `${SITE_URL}${b.item}`,
        })),
      ],
    });
  }

  if (faq && faq.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  return (
    <Helmet>
      {/* Primary */}
      <html lang="cs" />
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      {noIndex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      }

      {/* Geo tags — helps local search */}
      <meta name="geo.region"      content="CZ-ST" />
      <meta name="geo.placename"   content="Klíčany-Vodochody, Praha" />
      <meta name="geo.position"    content="50.2097;14.3847" />
      <meta name="ICBM"            content="50.2097, 14.3847" />

      {/* Open Graph */}
      <meta property="og:type"         content={type} />
      <meta property="og:site_name"    content={SITE_NAME} />
      <meta property="og:title"        content={pageTitle} />
      <meta property="og:description"  content={description} />
      <meta property="og:url"          content={canonicalUrl} />
      <meta property="og:image"        content={image} />
      <meta property="og:image:width"  content="1024" />
      <meta property="og:image:height" content="1024" />
      <meta property="og:image:alt"    content="Autobazar Platinum Cars logo" />
      <meta property="og:locale"       content="cs_CZ" />

      {/* Twitter / X */}
      <meta name="twitter:card"        content="summary" />
      <meta name="twitter:title"       content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={image} />
      <meta name="twitter:image:alt"   content="Autobazar Platinum Cars logo" />

      {/* JSON-LD — all schemas */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
