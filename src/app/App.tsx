import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { HomePage } from '@/pages/home';
import { ProductDetailPage } from '@/pages/product-detail';
import { FavoritesPage } from '@/pages/favorites';
import { CartPage } from '@/pages/cart';
import { ProductFormPage } from '@/pages/product-form';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="create" element={<ProductFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
