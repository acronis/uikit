import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ComponentsIndex } from '@/components/components-index';
import { ComponentRoute } from '@/routes/component';
import { IconsRoute } from '@/routes/icons';
import { Layout } from '@/routes/layout';
import { Overview } from '@/routes/overview';
import { TokensRoute } from '@/routes/tokens';
import { TypographyRoute } from '@/routes/typography';

// HashRouter keeps deep links working under static preview/deploy with no
// server rewrites. Brand/theme ride along as search params (after the hash).
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="tokens" element={<TokensRoute />} />
          <Route path="typography" element={<TypographyRoute />} />
          <Route path="icons" element={<IconsRoute />} />
          <Route path="components" element={<ComponentsIndex />} />
          <Route path="components/:slug" element={<ComponentRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
