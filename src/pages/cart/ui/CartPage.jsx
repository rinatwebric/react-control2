import { Link } from 'react-router-dom';
import { useCartStore } from '@/features/cart';
import { getCleanImageUrl } from '@/entities/product';
import styles from './CartPage.module.css';

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Корзина</h1>
        {cart.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Очистить корзину?')) {
                clearCart();
              }
            }}
            className={styles.clearBtn}
          >
            Очистить корзину
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            Ваша корзина пуста
          </p>
          <Link
            to="/"
            className={styles.shopBtn}
          >
            Перейти к покупкам
          </Link>
        </div>
      ) : (
        <div className={styles.cartLayout}>
          <div className={styles.itemsList}>
            {cart.map((item) => {
              const rawImage = Array.isArray(item.images) ? item.images[0] : item.images;
              const imageUrl = getCleanImageUrl(rawImage);
              const itemTotal = (Number(item.price) || 0) * (Number(item.count) || 1);

              return (
                <div key={item.id} className={styles.itemCard}>
                  <div className={styles.itemMain}>
                    <img
                      src={imageUrl}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/100x100?text=No+Image';
                      }}
                      className={styles.itemImage}
                    />
                    <div className={styles.itemInfo}>
                      <Link
                        to={`/products/${item.id}`}
                        className={styles.itemTitle}
                      >
                        {item.title}
                      </Link>
                      <p className={styles.itemPrice}>
                        Цена: ${item.price}
                      </p>
                    </div>
                  </div>

                  <div className={styles.itemControls}>
                    <div className={styles.counter}>
                      <button
                        onClick={() => changeQuantity(item.id, -1)}
                        className={styles.counterBtn}
                      >
                        -
                      </button>
                      <span className={styles.counterCount}>
                        {item.count}
                      </span>
                      <button
                        onClick={() => changeQuantity(item.id, 1)}
                        className={styles.counterBtn}
                      >
                        +
                      </button>
                    </div>

                    <div className={styles.itemTotal}>
                      ${itemTotal}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      title="Удалить из корзины"
                      className={styles.deleteBtn}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Всего товаров:</span>
              <span>{totalCount} шт.</span>
            </div>
            <div className={styles.summaryTotalRow}>
              <span>Итого к оплате:</span>
              <span className={styles.totalPrice}>${totalPrice}</span>
            </div>
            <button
              onClick={() => alert(`Заказ успешно оформлен на сумму $${totalPrice}! Спасибо за покупку.`)}
              className={styles.checkoutBtn}
            >
              Оформить заказ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
