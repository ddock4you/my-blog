export function buildOrganizationJsonLd(opts: {
  name: string;
  url: string;
  logoUrl?: string;
}): object {
  const { name, url, logoUrl } = opts;
  const json: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
  };
  if (logoUrl) {
    json.logo = logoUrl;
  }
  return json;
}

export function buildBlogPostingJsonLd(opts: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  url: string;
  imageUrl?: string;
}): object {
  const { headline, description, datePublished, dateModified, authorName, url, imageUrl } = opts;
  const json: any = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: url,
    author: { '@type': 'Person', name: authorName },
    publisher: { '@type': 'Organization', name: authorName },
    url,
  };
  if (imageUrl) json.image = imageUrl;
  return json;
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
