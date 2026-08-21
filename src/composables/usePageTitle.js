import { useHead } from '@vueuse/head';

export function usePageTitle(title) {
  useHead({
    title: `${title} | iChing Engine`,
  });
}
