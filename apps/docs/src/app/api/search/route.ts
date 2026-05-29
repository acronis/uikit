import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

// Use staticGET so the route can be pre-rendered for static export.
// The search dialog is configured with type: 'static' to match.
export const dynamic = 'force-static';
export const { staticGET: GET } = createFromSource(source);
