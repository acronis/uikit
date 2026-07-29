import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { componentStatusBadgesPlugin } from './component-status-badges-plugin';

export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
  plugins: [componentStatusBadgesPlugin()],
}) as any;
