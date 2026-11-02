import { NavLink } from 'react-router-dom';
import { useFavoritesStore } from '@/features/favorites';
import { useCartStore } from '@/features/cart';
import styles from './Header.module.css';

export const Header = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const cart = useCartStore((state) => state.cart);

  const favoritesCount = favorites.length;
  const cartCount = cart.reduce((total, item) => total + (item.count || 0), 0);

  const getNavLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.logo}>
        ReactShop
      </NavLink>
      <nav className={styles.nav}>
        <NavLink to="/" className={getNavLinkClass}>
          Каталог
        </NavLink>
        <NavLink to="/favorites" className={getNavLinkClass}>
          Избранное{' '}
          {favoritesCount > 0 && (
            <span className={styles.badgeFavorites}>{favoritesCount}</span>
          )}
        </NavLink>
        <NavLink to="/cart" className={getNavLinkClass}>
          Корзина{' '}
          {cartCount > 0 && (
            <span className={styles.badgeCart}>{cartCount}</span>
          )}
        </NavLink>
        <NavLink to="/create" className={getNavLinkClass}>
          Создать товар
        </NavLink>
      </nav>
    </header>
  );
};
