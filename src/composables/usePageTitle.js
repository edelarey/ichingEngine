import { useHead } from '@vueuse/head';
import { useRoute } from 'vue-router';
import { SITE_NAME, SITE_TITLE, pageSeo } from '@/const/seo';

export function usePageTitle(title, description) {
  const route = useRoute();
  const seo = pageSeo(route.path);
  const isHome = title === 'Home' || route.path === '/';
  const fullTitle = isHome ? SITE_TITLE : `${title} | ${SITE_NAME}`;
  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: description || seo.description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description || seo.description },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description || seo.description },
    ],
  });
}
