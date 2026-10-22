import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { getCleanImageUrl } from '../components/ProductCard';

export const CartPage = () => {
  const cart = useCartStore((state) => state.cart);
  const changeQuantity = useCartStore((state) => state.changeQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalPrice = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const count = Number(item.count) || 1;
    return sum + price * count;
  }, 0);

  const totalCount = cart.reduce((sum, item) => sum + (Number(item.count) || 1), 0);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', margin: 0, color: '#111827' }}>Корзина</h1>
        {cart.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Очистить корзину?')) {
                clearCart();
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            Очистить корзину
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
          <p style={{ fontSize: '20px', color: '#4b5563', marginBottom: '16px' }}>
            Ваша корзина пуста
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Перейти к покупкам
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item) => {
              const rawImage = Array.isArray(item.images) ? item.images[0] : item.images;
              const imageUrl = getCleanImageUrl(rawImage);
              const itemTotal = (Number(item.price) || 0) * (Number(item.count) || 1);

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    backgroundColor: '#fff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 300px' }}>
                    <img
                      src={imageUrl}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/100x100?text=No+Image';
                      }}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                    />
                    <div>
                      <Link
                        to={`/products/${item.id}`}
                        style={{ textDecoration: 'none', color: '#111827', fontWeight: '600', fontSize: '16px' }}
                      >
                        {item.title}
                      </Link>
                      <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                        Цена: ${item.price}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px' }}>
                      <button
                        onClick={() => changeQuantity(item.id, -1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: 'none',
                          background: '#f9fafb',
                          cursor: 'pointer',
                          fontSize: '16px',
                          borderTopLeftRadius: '5px',
                          borderBottomLeftRadius: '5px'
                        }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: '36px', textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>
                        {item.count}
                      </span>
                      <button
                        onClick={() => changeQuantity(item.id, 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: 'none',
                          background: '#f9fafb',
                          cursor: 'pointer',
                          fontSize: '16px',
                          borderTopRightRadius: '5px',
                          borderBottomRightRadius: '5px'
                        }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ minWidth: '80px', textAlign: 'right', fontWeight: '700', fontSize: '16px', color: '#059669' }}>
                      ${itemTotal}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      title="Удалить из корзины"
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #fee2e2',
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', color: '#4b5563' }}>
              <span>Всего товаров:</span>
              <span>{totalCount} шт.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
              <span>Итого к оплате:</span>
              <span style={{ color: '#059669' }}>${totalPrice}</span>
            </div>
            <button
              onClick={() => alert(`Заказ успешно оформлен на сумму $${totalPrice}! Спасибо за покупку.`)}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Оформить заказ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
