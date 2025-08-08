import { useEffect } from 'react';
import { getRouteMetadata } from '@/config/routes';

export function usePageMetadata(pathname: string) {
  useEffect(() => {
    const metadata = getRouteMetadata(pathname);
    
    if (!metadata) {
      // Fallback pour les routes non configurées
      document.title = 'SUTEL Platform';
      return;
    }

    // Title
    document.title = metadata.title;

    // Meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', metadata.description);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = metadata.canonical;

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: metadata.og.title },
      { property: 'og:description', content: metadata.og.description },
      { property: 'og:type', content: metadata.og.type },
      { property: 'og:url', content: metadata.og.url },
    ];

    ogTags.forEach(({ property, content }) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', content);
    });

    // Twitter Card
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.setAttribute('name', 'twitter:card');
      twitterCard.setAttribute('content', 'summary');
      document.head.appendChild(twitterCard);
    }

    // Viewport (mobile optimization)
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      document.head.appendChild(viewport);
    }

    // Structured data pour certaines pages
    addStructuredData(pathname, metadata);

  }, [pathname]);
}

function addStructuredData(pathname: string, metadata: any) {
  // Supprimer l'ancien structured data s'il existe
  const existingLD = document.querySelector('script[type="application/ld+json"]');
  if (existingLD) {
    existingLD.remove();
  }

  let structuredData: any = null;

  // Schema.org pour différents types de pages
  switch (pathname) {
    case '/resources':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": metadata.title,
        "description": metadata.description,
        "url": metadata.canonical,
        "mainEntity": {
          "@type": "ItemList",
          "name": "Documents et ressources",
          "description": "Collection de documents et ressources partagées"
        }
      };
      break;

    case '/events':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "EventSeries",
        "name": metadata.title,
        "description": metadata.description,
        "url": metadata.canonical
      };
      break;

    case '/forum':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "DiscussionForumPosting",
        "name": metadata.title,
        "description": metadata.description,
        "url": metadata.canonical
      };
      break;

    case '/organizations':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "SUTEL Platform",
        "description": metadata.description,
        "url": metadata.canonical
      };
      break;

    default:
      // WebSite général
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "SUTEL Platform",
        "description": metadata.description,
        "url": window.location.origin,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };
  }

  if (structuredData) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
}