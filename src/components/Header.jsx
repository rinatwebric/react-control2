import { NavLink } from 'react-router-dom';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useCartStore } from '../store/useCartStore';

export const Header = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const cart = useCartStore((state) => state.cart);

  const favoritesCount = favorites.length;
  const cartCount = cart.reduce((total, item) => total + (item.count || 0), 0);

  return (
    <header className="header" style={{ padding: '16px 24px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
      <NavLink to="/" style={{ textDecoration: 'none', color: '#111', fontSize: '20px', fontWeight: 'bold' }}>
        🛍️ ReactShop
      </NavLink>
      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <NavLink 
          to="/" 
          style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? '#0070f3' : '#333', fontWeight: isActive ? '600' : '400' })}
        >
          Каталог
        </NavLink>
        <NavLink 
          to="/favorites"
          style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? '#0070f3' : '#333', fontWeight: isActive ? '600' : '400' })}
        >
          Избранное {favoritesCount > 0 && <span style={{ background: '#ff4d4f', color: '#fff', borderRadius: '10px', padding: '2px 8px', fontSize: '12px', marginLeft: '4px' }}>{favoritesCount}</span>}
        </NavLink>
        <NavLink 
          to="/cart"
          style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? '#0070f3' : '#333', fontWeight: isActive ? '600' : '400' })}
        >
          Корзина {cartCount > 0 && <span style={{ background: '#52c41a', color: '#fff', borderRadius: '10px', padding: '2px 8px', fontSize: '12px', marginLeft: '4px' }}>{cartCount}</span>}
        </NavLink>
        <NavLink 
          to="/create"
          style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? '#0070f3' : '#333', fontWeight: isActive ? '600' : '400' })}
        >
          + Создать товар
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;

