import React, { useState, useEffect } from 'react';
import { Layout, message, ConfigProvider, Modal } from 'antd';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatbotDrawer from './components/ChatbotDrawer';
import ChatSupportBubble from './components/ChatSupportBubble';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ProductDetail from './pages/ProductDetail';
import api from './services/api';
import { themeConfig } from './theme';

const { Content, Footer } = Layout;

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [modal, modalContextHolder] = Modal.useModal();

  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPath = location.pathname.startsWith('/admin');

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // Load authentication status on mount
    checkAuth();
    // Load local storage cart
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data;

      // Admin account should only be active on /admin path
      if (userData.role === 'ADMIN' && !location.pathname.startsWith('/admin')) {
        setUser(null);
      } else {
        setUser(userData);
      }
    } catch (e) {
      setUser(null);
      
      // Hiển thị thông báo thân thiện cho khách vãng lai truy cập lần đầu trong phiên
      const hasWelcomed = sessionStorage.getItem('guest_welcomed');
      const isLoginOrRegister = location.pathname === '/login' || 
                                location.pathname === '/register' || 
                                location.pathname.startsWith('/admin');
                                
      if (!hasWelcomed && !isLoginOrRegister) {
        modal.info({
          title: 'Chào mừng bạn đến với AndrewSport!',
          content: 'Bạn hiện chưa đăng nhập tài khoản. Bạn vẫn có thể tự do xem sản phẩm và thêm vào giỏ hàng, hãy đăng nhập khi đặt hàng để nhận thêm nhiều ưu đãi nhé!',
          okText: 'Đăng nhập ngay',
          cancelText: 'Trải nghiệm tiếp',
          okCancel: true,
          maskClosable: true,
          closable: true,
          styles: {
            body: { padding: '12px' }
          },
          onOk: () => {
            navigate('/login');
          }
        });
        sessionStorage.setItem('guest_welcomed', 'true');
      }
    }
    setInitializing(false);
  };

  const handleAddToCart = (product, qty = 1, sku = null, variationDetail = null, customPrice = null) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id && item.sku === sku);
      let updatedCart;

      let maxStock = product.stockQuantity;
      if (sku && product.variations) {
        const matchingVar = product.variations.find(v => v.sku === sku);
        if (matchingVar) maxStock = matchingVar.stockQuantity;
      }

      const itemPrice = customPrice !== null ? customPrice : product.price;

      if (existingItem) {
        const newQty = existingItem.quantity + qty;
        if (newQty > maxStock) {
          message.warning(`Chỉ còn ${maxStock} sản phẩm biến thể trong kho.`);
          return prevCart;
        }
        updatedCart = prevCart.map((item) =>
          (item.id === product.id && item.sku === sku) ? { ...item, quantity: newQty } : item
        );
      } else {
        updatedCart = [...prevCart, { 
          ...product, 
          price: itemPrice, 
          quantity: qty, 
          sku: sku, 
          variationDetail: variationDetail 
        }];
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      message.success(`Đã thêm ${product.name} ${variationDetail ? `(${variationDetail})` : ''} vào giỏ hàng.`);
      return updatedCart;
    });
  };

  const handleUpdateCartQty = (productId, sku, qty) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        (item.id === productId && item.sku === sku) ? { ...item, quantity: qty } : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleRemoveFromCart = (productId, sku) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => !(item.id === productId && item.sku === sku));
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      message.success('Đã xóa sản phẩm khỏi giỏ hàng.');
      return updatedCart;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/');
    message.success('Đăng xuất thành công.');
  };

  const handleAdminLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refreshToken');
    navigate('/admin/login');
    message.success('Đăng xuất quản trị thành công.');
  };

  const handleSearch = (query) => {
    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/');
    }
  };

  const handleCategoryBrandSelect = (category, brand, subCategory = '') => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (brand) params.set('brand', brand);
    if (subCategory) params.set('subCategory', subCategory);

    const queryString = params.toString();
    navigate(queryString ? `/?${queryString}` : '/');
  };

  if (initializing) return null;

  if (isAdminPath) {
    return (
      <ConfigProvider theme={themeConfig}>
        {modalContextHolder}
        <Routes>
          <Route path="/admin/login" element={<AdminLogin onLoginSuccess={setUser} />} />
          <Route
            path="/admin"
            element={
              user && user.role === 'ADMIN' ? (
                <AdminDashboard onLogout={handleAdminLogout} />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={themeConfig}>
      {modalContextHolder}
      <Layout style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar
          user={user}
          cart={cart}
          onLogout={handleLogout}
          onSearch={handleSearch}
          onCategoryBrandSelect={handleCategoryBrandSelect}
        />
        <Content style={{ padding: '24px 0', background: '#f8fafc' }}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onAddToCart={handleAddToCart}
                />
              }
            />
            <Route
              path="/product/:productId"
              element={
                <ProductDetail
                  onAddToCart={handleAddToCart}
                  user={user}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  onUpdateCartQty={handleUpdateCartQty}
                  onRemoveFromCart={handleRemoveFromCart}
                />
              }
            />
            <Route
              path="/checkout"
              element={
                user ? (
                  <Checkout
                    cart={cart}
                    user={user}
                    onClearCart={handleClearCart}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/order-history"
              element={
                user ? (
                  <OrderHistory />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login onLoginSuccess={setUser} />
                )
              }
            />
            <Route
              path="/register"
              element={
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <Register onLoginSuccess={setUser} />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#64748b', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
          🏸 AndrewSport © 2026.
        </Footer>
        <ChatbotDrawer />
        <ChatSupportBubble user={user} />
      </Layout>
    </ConfigProvider>
  );
}
