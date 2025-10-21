export type OrganizationJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
};

export function buildOrganizationJsonLd(opts: {
  name: string;
  url: string;
  logoUrl?: string;
}): OrganizationJsonLd {
  const { name, url, logoUrl } = opts;
  const json: OrganizationJsonLd = {
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

export type BlogPostingJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: string;
  author: { '@type': 'Person'; name: string };
  publisher: { '@type': 'Organization'; name: string };
  url: string;
  image?: string;
};

export function buildBlogPostingJsonLd(opts: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  url: string;
  imageUrl?: string;
}): BlogPostingJsonLd {
  const { headline, description, datePublished, dateModified, authorName, url, imageUrl } = opts;
  const json: BlogPostingJsonLd = {
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

export type BreadcrumbListJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
};

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): BreadcrumbListJsonLd {
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
