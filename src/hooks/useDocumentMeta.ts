import { useEffect } from 'react';

export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    // Standard Title Update
    document.title = title ? `${title} | F1 Stats` : 'F1 Stats Engine';

    // OpenGraph & Meta Description update
    if (description) {
      // Update standard meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);

      // Update OpenGraph description
      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (!ogDescription) {
        ogDescription = document.createElement('meta');
        ogDescription.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescription);
      }
      ogDescription.setAttribute('content', description);
    }
  }, [title, description]);
}
