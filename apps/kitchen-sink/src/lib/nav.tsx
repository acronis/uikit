import {
  Link,
  NavLink,
  useLocation,
  type LinkProps,
  type NavLinkProps,
} from 'react-router-dom';

// react-router drops the current query string on navigation, but brand/theme
// live there (so a view is shareable). These wrappers carry the active search
// across every internal link, keeping the selection — and the URL — intact.

function pathOf(to: LinkProps['to']): string {
  return typeof to === 'string' ? to : (to.pathname ?? '');
}

export function KsLink({ to, ...rest }: LinkProps) {
  const { search } = useLocation();
  return <Link to={{ pathname: pathOf(to), search }} {...rest} />;
}

export function KsNavLink({ to, ...rest }: NavLinkProps) {
  const { search } = useLocation();
  return <NavLink to={{ pathname: pathOf(to), search }} {...rest} />;
}
