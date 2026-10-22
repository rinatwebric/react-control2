import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { ProductDetailPage } from "./pages/ProductDetailPage.jsx";
import { FavoritesPage } from "./pages/FavoritesPage.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import { CreateProductPage } from "./pages/CreateProductPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="products/:id/edit" element={<CreateProductPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="create" element={<CreateProductPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
