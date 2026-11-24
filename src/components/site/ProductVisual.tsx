import type { ProductSlug } from '@/lib/content';
import { SoftwareIllustration } from './SoftwareIllustration';
import { EyerTypeIllustration } from './EyerTypeIllustration';

/** Decorative, product-specific vector illustrations. */
export function ProductVisual({ slug }: { slug: ProductSlug }) {
  return slug === 'eyertype' ? <EyerTypeIllustration /> : <SoftwareIllustration slug={slug} />;
}
