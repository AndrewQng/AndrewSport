import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Badge, Dropdown, Space, Button, Drawer } from 'antd';
import { 
  ShoppingCartOutlined, UserOutlined, LogoutOutlined, 
  HistoryOutlined, AppstoreOutlined, DownOutlined, 
  PhoneOutlined, MenuOutlined, SearchOutlined
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Header } = Layout;
const { Search } = Input;

export default function Navbar({ user, cart, onLogout, onSearch, onCategoryBrandSelect }) {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchUrlVal = searchParams.get('search') || '';
  const [searchValue, setSearchValue] = useState(searchUrlVal);

  useEffect(() => {
    setSearchValue(searchUrlVal);
  }, [searchUrlVal]);

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      onLogout();
    } else if (e.key === 'admin') {
      navigate('/admin');
    } else if (e.key === 'history') {
      navigate('/order-history');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: <span style={{ fontWeight: 600 }}>Xin chào, {user?.fullName || 'User'}</span>,
      disabled: true,
    },
    {
      type: 'divider',
    },
    user?.role === 'ADMIN' && {
      key: 'admin',
      label: 'Bảng quản trị (Admin)',
      icon: <AppstoreOutlined />,
    },
    {
      key: 'history',
      label: 'Lịch sử mua hàng',
      icon: <HistoryOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ].filter(Boolean);

  const menuColumns = [
    {
      title: 'VỢT CẦU LÔNG',
      category: 'Badminton',
      subCategory: 'vợt',
      items: [
        { label: 'Vợt cầu lông Yonex', category: 'Badminton', brand: 'Yonex', subCategory: 'vợt' },
        { label: 'Vợt cầu lông Victor', category: 'Badminton', brand: 'Victor', subCategory: 'vợt' },
        { label: 'Vợt cầu lông Lining', category: 'Badminton', brand: 'Lining', subCategory: 'vợt' },
        { label: 'Vợt Cầu Lông VS', category: 'Badminton', brand: 'VS', subCategory: 'vợt' },
        { label: 'Vợt Cầu Lông Mizuno', category: 'Badminton', brand: 'Mizuno', subCategory: 'vợt' },
        { label: 'Vợt Cầu Lông Apacs', category: 'Badminton', brand: 'Apacs', subCategory: 'vợt' },
        { label: 'Xem thêm', category: 'Badminton', brand: '', subCategory: 'vợt' },
      ],
    },
    {
      title: 'GIÀY CẦU LÔNG',
      category: 'Badminton',
      subCategory: 'giày',
      items: [
        { label: 'Giày cầu lông Yonex', category: 'Badminton', brand: 'Yonex', subCategory: 'giày' },
        { label: 'Giày cầu lông Victor', category: 'Badminton', brand: 'Victor', subCategory: 'giày' },
        { label: 'Giày cầu lông Lining', category: 'Badminton', brand: 'Lining', subCategory: 'giày' },
        { label: 'Giày cầu lông VS', category: 'Badminton', brand: 'VS', subCategory: 'giày' },
        { label: 'Giày cầu lông Kawasaki', category: 'Badminton', brand: 'Kawasaki', subCategory: 'giày' },
        { label: 'Giày Cầu Lông Mizuno', category: 'Badminton', brand: 'Mizuno', subCategory: 'giày' },
        { label: 'Xem thêm', category: 'Badminton', brand: '', subCategory: 'giày' },
      ],
    },
    {
      title: 'ÁO CẦU LÔNG',
      category: 'Badminton',
      subCategory: 'áo',
      items: [
        { label: 'Áo cầu lông Yonex', category: 'Badminton', brand: 'Yonex', subCategory: 'áo' },
        { label: 'Áo cầu lông Kamito', category: 'Badminton', brand: 'Kamito', subCategory: 'áo' },
        { label: 'Áo cầu lông VS', category: 'Badminton', brand: 'VS', subCategory: 'áo' },
        { label: 'Áo cầu lông Victor', category: 'Badminton', brand: 'Victor', subCategory: 'áo' },
        { label: 'Áo cầu lông Lining', category: 'Badminton', brand: 'Lining', subCategory: 'áo' },
        { label: 'Xem thêm', category: 'Badminton', brand: '', subCategory: 'áo' },
      ],
    },
    {
      title: 'VÁY & QUẦN CẦU LÔNG',
      category: 'Badminton',
      subCategory: 'váy_quần',
      items: [
        { label: 'Váy cầu lông Yonex', category: 'Badminton', brand: 'Yonex', subCategory: 'váy' },
        { label: 'Váy cầu lông Lining', category: 'Badminton', brand: 'Lining', subCategory: 'váy' },
        { label: 'Quần cầu lông Yonex', category: 'Badminton', brand: 'Yonex', subCategory: 'quần' },
        { label: 'Quần cầu lông Victor', category: 'Badminton', brand: 'Victor', subCategory: 'quần' },
        { label: 'Quần cầu lông Lining', category: 'Badminton', brand: 'Lining', subCategory: 'quần' },
        { label: 'Xem thêm', category: 'Badminton', brand: '', subCategory: 'quần' },
      ],
    },
    {
      title: 'TENNIS & PICKLEBALL',
      category: '',
      subCategory: '',
      items: [
        { label: 'Vợt Tennis Wilson', category: 'Tennis', brand: 'Wilson', subCategory: 'vợt' },
        { label: 'Vợt Tennis Babolat', category: 'Tennis', brand: 'Babolat', subCategory: 'vợt' },
        { label: 'Bóng Tennis Wilson', category: 'Tennis', brand: 'Wilson', subCategory: 'bóng' },
        { label: 'Vợt Pickleball Head', category: 'Pickleball', brand: 'Head', subCategory: 'vợt' },
        { label: 'Vợt Pickleball Joola', category: 'Pickleball', brand: 'Joola', subCategory: 'vợt' },
        { label: 'Giày Pickleball Asics', category: 'Pickleball', brand: 'Asics', subCategory: 'giày' },
        { label: 'Xem thêm', category: 'Pickleball', brand: '', subCategory: '' },
      ],
    },
  ];

  const handleMegaMenuClick = (category, brand, subCategory = '') => {
    onCategoryBrandSelect(category, brand, subCategory);
  };

  const handleMobileMenuClick = (e) => {
    setMobileMenuOpen(false);
    if (e.key === 'home') {
      onCategoryBrandSelect('', '');
    } else if (e.key === 'badminton') {
      onCategoryBrandSelect('Badminton', '');
    } else if (e.key === 'tennis') {
      onCategoryBrandSelect('Tennis', '');
    } else if (e.key === 'pickleball') {
      onCategoryBrandSelect('Pickleball', '');
    } else if (e.key === 'sale') {
      onCategoryBrandSelect('', '');
    } else if (e.key === 'history') {
      navigate('/order-history');
    } else if (e.key === 'admin') {
      navigate('/admin');
    } else if (e.key === 'login') {
      navigate('/login');
    } else if (e.key === 'register') {
      navigate('/register');
    } else if (e.key === 'logout') {
      onLogout();
    }
  };

  const mobileMenuItems = [
    { key: 'home', label: 'Trang Chủ' },
    {
      key: 'products',
      label: 'Sản Phẩm',
      children: [
        { key: 'badminton', label: 'Cầu Lông (Badminton)' },
        { key: 'tennis', label: 'Quần Vợt (Tennis)' },
        { key: 'pickleball', label: 'Pickleball' },
      ]
    },
    { key: 'sale', label: 'Sale Off' },
    { key: 'news', label: 'Tin Tức' },
    { key: 'about', label: 'Giới Thiệu' },
    { key: 'contact', label: 'Liên Hệ' },
    { type: 'divider' },
    user ? {
      key: 'user-section',
      label: `Tài khoản: ${user.username}`,
      children: [
        user.role === 'ADMIN' && { key: 'admin', label: 'Bảng quản trị (Admin)', icon: <AppstoreOutlined /> },
        { key: 'history', label: 'Lịch sử mua hàng', icon: <HistoryOutlined /> },
        { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true }
      ].filter(Boolean)
    } : {
      key: 'auth-section',
      label: 'Tài khoản',
      children: [
        { key: 'login', label: 'Đăng nhập' },
        { key: 'register', label: 'Đăng ký' }
      ]
    }
  ];

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      {/* Top Header Layer */}
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', mdPadding: '0 32px', height: '70px', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        
        {/* Mobile Hamburger Icon */}
        <Button 
          type="text" 
          icon={<MenuOutlined style={{ fontSize: '20px' }} />} 
          onClick={() => setMobileMenuOpen(true)}
          className="show-on-mobile-flex"
          style={{ padding: 0, width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center' }}
        />

        {/* Logo */}
        <div 
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => {
            onCategoryBrandSelect('', '');
          }}
        >
          <span className="navbar-logo-text" style={{ fontSize: '20px', mdFontSize: '24px', fontWeight: 900, color: '#DC2626', letterSpacing: '0.8px' }}>
            🏸 ANDREW<span style={{ color: '#0f172a' }} className="hide-on-mobile">SPORT</span>
          </span>
        </div>

        {/* Search Bar - Desktop Only */}
        <div style={{ flex: 1, maxWidth: '500px', margin: '0 40px', display: 'flex', alignItems: 'center' }} className="hide-on-mobile">
          <Search 
            placeholder="Tìm kiếm vợt cầu lông, giày, phụ kiện thể thao..." 
            allowClear
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={onSearch}
            enterButton="Tìm kiếm"
            size="large"
          />
        </div>

        {/* Actions (Hotline, Cart, User) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', mdGap: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px' }} className="hide-on-mobile">
            <PhoneOutlined style={{ color: '#DC2626', fontSize: '16px' }} />
            <span>Hotline: <strong style={{ color: '#0f172a' }}>1900 6979</strong></span>
          </div>

          {/* Cart Icon */}
          <div 
            onClick={() => navigate('/cart')} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Badge count={cartItemCount} showZero color="#DC2626" offset={[5, -5]}>
              <Button 
                type="text" 
                icon={<ShoppingCartOutlined style={{ fontSize: '22px' }} />} 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
              />
            </Badge>
          </div>

          {/* User Profile - Desktop Only */}
          <div className="hide-on-mobile">
            {user ? (
              <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight" trigger={['click']}>
                <Button 
                  type="primary" 
                  shape="round" 
                  icon={<UserOutlined />} 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#DC2626', borderColor: '#DC2626' }}
                >
                  {user.username}
                </Button>
              </Dropdown>
            ) : (
              <Space>
                <Button type="text" onClick={() => navigate('/login')}>Đăng nhập</Button>
                <Button type="primary" shape="round" style={{ background: '#DC2626', borderColor: '#DC2626' }} onClick={() => navigate('/register')}>Đăng ký</Button>
              </Space>
            )}
          </div>
        </div>
      </Header>

      {/* Mobile Search Bar Row */}
      <div className="show-on-mobile" style={{ padding: '8px 16px', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <Search 
          placeholder="Tìm kiếm sản phẩm..." 
          allowClear
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={onSearch}
          enterButton={<SearchOutlined />}
          size="middle"
        />
      </div>

      {/* Secondary Navigation Bar (Desktop Only) */}
      <div 
        onMouseLeave={() => setMegaMenuOpen(false)}
        className="hide-on-mobile"
        style={{
          background: '#DC2626',
          height: '45px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <span 
            onMouseEnter={() => setMegaMenuOpen(false)}
            onClick={() => {
              onCategoryBrandSelect('', '');
            }}
            className="nav-link"
          >
            TRANG CHỦ
          </span>

          <span 
            onMouseEnter={() => setMegaMenuOpen(true)}
            className="nav-link"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            SẢN PHẨM <DownOutlined style={{ fontSize: '10px' }} />
          </span>

          <span 
            onMouseEnter={() => setMegaMenuOpen(false)}
            onClick={() => {
              onCategoryBrandSelect('', '');
            }}
            className="nav-link"
          >
            SALE OFF
          </span>

          <span 
            onMouseEnter={() => setMegaMenuOpen(false)}
            className="nav-link"
          >
            TIN TỨC
          </span>

          <span 
            onMouseEnter={() => setMegaMenuOpen(false)}
            className="nav-link"
          >
            GIỚI THIỆU
          </span>

          <span 
            onMouseEnter={() => setMegaMenuOpen(false)}
            className="nav-link"
          >
            LIÊN HỆ
          </span>
        </div>

        {/* Custom Perfectly Centered Hover Mega Menu */}
        {megaMenuOpen && (
          <div 
            onMouseEnter={() => setMegaMenuOpen(true)}
            onMouseLeave={() => setMegaMenuOpen(false)}
            style={{
              position: 'absolute',
              top: '45px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#ffffff',
              padding: '24px 32px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              borderRadius: '0 0 12px 12px',
              borderTop: '4px solid #DC2626',
              width: '1200px',
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '20px',
              zIndex: 1000,
            }}
          >
            {menuColumns.map((col, index) => (
              <div key={index}>
                <div 
                  onClick={() => {
                    if (col.category) {
                      handleMegaMenuClick(col.category, '', col.subCategory);
                      setMegaMenuOpen(false);
                    }
                  }}
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#DC2626',
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '8px',
                    marginBottom: '12px',
                    letterSpacing: '0.5px',
                    cursor: col.category ? 'pointer' : 'default',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (col.category) e.target.style.color = '#0f172a';
                  }}
                  onMouseLeave={(e) => {
                    if (col.category) e.target.style.color = '#DC2626';
                  }}
                >
                  {col.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {col.items.map((item, itemIdx) => (
                    <span
                       key={itemIdx}
                       onClick={() => {
                          handleMegaMenuClick(item.category, item.brand, item.subCategory);
                          setMegaMenuOpen(false);
                       }}
                       style={{
                         fontSize: '13px',
                         color: '#475569',
                         cursor: 'pointer',
                         transition: 'color 0.2s',
                       }}
                       onMouseEnter={(e) => e.target.style.color = '#DC2626'}
                       onMouseLeave={(e) => e.target.style.color = '#475569'}
                     >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Hamburger Drawer Menu */}
      <Drawer
        title={<span style={{ fontWeight: 800, color: '#DC2626' }}>ANDREWSPORT</span>}
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="inline"
          items={mobileMenuItems}
          onClick={handleMobileMenuClick}
          style={{ borderRight: 0 }}
        />
      </Drawer>
    </div>
  );
}
