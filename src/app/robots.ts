export default function robots() {
  const baseUrl = 'https://agencija-za-osiguranje.web.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/portal/settings', '/api/'],
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'],
        allow: [
          '/',
          '/dopunsko-zdravstveno',
          '/auto-osiguranje',
          '/imovina',
          '/prijava-stete',
          '/o-nama',
          '/prigovori',
          '/kalkulator-prijepisa',
        ],
        disallow: ['/admin', '/portal', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
