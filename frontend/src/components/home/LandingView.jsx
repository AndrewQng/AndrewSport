import React, { useRef } from 'react';
import { Row, Col, Typography, Empty, Button, Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import ProductCard from '../ProductCard';
import { categoryBanners } from '../../constants/productFilters';
import FlashSale from './FlashSale';

const { Title, Text } = Typography;

export default function LandingView({
  products,
  onAddToCart,
  activeNewTab,
  setActiveNewTab,
  getTabProducts,
  setSearchParams,
}) {
  const carouselRef = useRef(null);
  const saleCarouselRef = useRef(null);
  const bannerCarouselRef = useRef(null);

  const banners = [
    {
      image: '/images/astrox99_banner.png',
      title: 'YONEX ASTROX 99 PRO',
      subtitle: 'Sức mạnh đập cầu bộc phá - Sự lựa chọn tối thượng của các nhà vô địch tấn công',
      category: 'Badminton',
      search: 'Astrox'
    },
    {
      image: '/images/astrox100zz_banner.png',
      title: 'YONEX ASTROX 100ZZ',
      subtitle: 'Tốc độ vung vợt đỉnh cao cùng độ chính xác tuyệt đối trên từng pha cầu',
      category: 'Badminton',
      search: 'Astrox'
    },
    {
      image: '/images/apparel_banner_1.png',
      title: 'THỜI TRANG BẢN LĨNH',
      subtitle: 'Bộ sưu tập quần áo cầu lông cao cấp, thoáng khí và co giãn vượt trội',
      category: 'Badminton',
      subCategory: 'áo'
    },
    {
      image: '/images/apparel_banner_2.png',
      title: 'NĂNG ĐỘNG BẤT TẬN',
      subtitle: 'Trang phục thể thao cá tính mang lại sự tự tin bứt phá mọi giới hạn trên sân đấu',
      category: 'Badminton',
      subCategory: 'quần'
    }
  ];

  const scrollCarousel = (direction, refObj) => {
    if (refObj.current) {
      const scrollAmt = direction === 'left' ? -320 : 320;
      refObj.current.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  const handleBannerClick = (category, sub) => {
    const params = {};
    if (category) params.category = category;
    if (sub) params.subCategory = sub;
    setSearchParams(params);
  };

  const handlePromoClick = (banner) => {
    const params = {};
    if (banner.category) params.category = banner.category;
    if (banner.subCategory) params.subCategory = banner.subCategory;
    if (banner.search) params.search = banner.search;
    setSearchParams(params);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      {/* Dynamic Banner Carousel */}
      <div 
        className="banner-carousel-container"
        style={{ 
          marginBottom: 40, 
          borderRadius: '16px', 
          overflow: 'hidden', 
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
          position: 'relative'
        }}
      >
        {/* Custom Left Arrow Button */}
        <Button 
          shape="circle" 
          icon={<LeftOutlined />} 
          onClick={(e) => {
            e.stopPropagation();
            bannerCarouselRef.current?.prev();
          }}
          className="banner-arrow-btn"
          style={{
            position: 'absolute',
            left: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            border: 'none',
            background: 'rgba(15, 23, 42, 0.45)',
            color: '#ffffff',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)'
          }}
        />

        {/* Custom Right Arrow Button */}
        <Button 
          shape="circle" 
          icon={<RightOutlined />} 
          onClick={(e) => {
            e.stopPropagation();
            bannerCarouselRef.current?.next();
          }}
          className="banner-arrow-btn"
          style={{
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            border: 'none',
            background: 'rgba(15, 23, 42, 0.45)',
            color: '#ffffff',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)'
          }}
        />

        <Carousel 
          ref={bannerCarouselRef}
          autoplay 
          effect="scrollx" 
          speed={800} 
          autoplaySpeed={5000}
          draggable
          swipeToSlide
        >
          {banners.map((banner, idx) => {
            return (
              <div key={idx}>
                <div 
                  style={{ 
                    position: 'relative', 
                    height: '380px', 
                    width: '100%',
                    backgroundImage: 'url(' + banner.image + ')',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '16px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Premium Dark Gradient Overlay */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.45) 50%, rgba(15, 23, 42, 0) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 80px',
                      zIndex: 2
                    }}
                  >
                    <div className="banner-text-container">
                      <Text style={{ color: '#E95211', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                        Sản Phẩm Cao Cấp
                      </Text>
                      <Title level={1} style={{ color: '#ffffff', fontWeight: 900, fontSize: '38px', margin: '0 0 12px 0', lineHeight: '1.2', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        {banner.title}
                      </Title>
                      <Text style={{ color: '#cbd5e1', fontSize: '16px', display: 'block', marginBottom: '24px', fontWeight: 500, lineHeight: '1.6' }}>
                        {banner.subtitle}
                      </Text>
                      <Button 
                        type="primary" 
                        size="large" 
                        onClick={() => handlePromoClick(banner)}
                        style={{ 
                          background: '#E95211', 
                          borderColor: '#E95211', 
                          fontWeight: 700, 
                          borderRadius: '8px',
                          padding: '0 32px',
                          height: '46px',
                          fontSize: '15px',
                          boxShadow: '0 4px 14px rgba(233, 82, 17, 0.4)'
                        }}
                      >
                        Khám phá ngay
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Carousel>
      </div>

      {/* 0. Flash Sale Section */}
      <FlashSale products={products} onAddToCart={onAddToCart} />

      {/* 1. Sản Phẩm Mới Section */}
      <div style={{ marginBottom: 48, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Sản phẩm mới</Title>
          <div style={{ width: '80px', height: '4px', background: '#DC2626', margin: '8px auto 0' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
          {['Tất cả', 'Vợt Cầu Lông', 'Giày Cầu Lông', 'Áo Cầu Lông', 'Váy cầu lông', 'Quần Cầu Lông'].map((tab) => (
            <span
              key={tab}
              onClick={() => setActiveNewTab(tab)}
              className={`product-tab ${activeNewTab === tab ? 'active' : ''}`}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Tab Slider Wrapper with Custom Arrows */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Button 
            shape="circle" 
            icon={<LeftOutlined />} 
            onClick={() => scrollCarousel('left', carouselRef)} 
            className="hide-on-mobile"
            style={{ position: 'absolute', left: -20, zIndex: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          
          <div 
            ref={carouselRef}
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              padding: '16px 8px',
              width: '100%',
              background: '#FEE2E2',
              borderRadius: '12px',
              border: '4px solid #DC2626'
            }}
            className="hide-scrollbar"
          >
            {getTabProducts().length === 0 ? (
              <div style={{ width: '100%', padding: '40px 0', textAlign: 'center' }}>
                <Empty description="Đang cập nhật sản phẩm..." />
              </div>
            ) : (
              getTabProducts().map(product => (
                <div key={product.id} style={{ minWidth: '270px', width: '270px' }}>
                  <ProductCard product={product} onAddToCart={onAddToCart} />
                </div>
              ))
            )}
          </div>

          <Button 
            shape="circle" 
            icon={<RightOutlined />} 
            onClick={() => scrollCarousel('right', carouselRef)} 
            className="hide-on-mobile"
            style={{ position: 'absolute', right: -20, zIndex: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>

      {/* 2. Danh mục sản phẩm Grid */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Danh mục sản phẩm</Title>
          <div style={{ width: '80px', height: '4px', background: '#DC2626', margin: '8px auto 0' }} />
        </div>

        <Row gutter={[16, 16]}>
          {categoryBanners.map((banner, index) => (
            <Col xs={12} sm={12} md={6} key={index}>
              <div 
                onClick={() => handleBannerClick(banner.category, banner.sub)}
                className="banner-card"
                style={{ height: '220px' }}
              >
                <img 
                  src={banner.img} 
                  alt={banner.title} 
                  className="banner-img"
                />
                <div className="banner-overlay" />
                
                {/* Angled Ribbon Overlap */}
                <div className="banner-ribbon">
                  {banner.title}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 3. Sale Off Section */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Sale off</Title>
          <div style={{ width: '80px', height: '4px', background: '#DC2626', margin: '8px auto 0' }} />
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Button 
            shape="circle" 
            icon={<LeftOutlined />} 
            onClick={() => scrollCarousel('left', saleCarouselRef)} 
            className="hide-on-mobile"
            style={{ position: 'absolute', left: -20, zIndex: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          
          <div 
            ref={saleCarouselRef}
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              padding: '12px 4px',
              width: '100%',
            }}
            className="hide-scrollbar"
          >
            {products.slice(0, 5).map(product => (
              <div key={product.id} style={{ minWidth: '270px', width: '270px' }}>
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            ))}
          </div>

          <Button 
            shape="circle" 
            icon={<RightOutlined />} 
            onClick={() => scrollCarousel('right', saleCarouselRef)} 
            className="hide-on-mobile"
            style={{ position: 'absolute', right: -20, zIndex: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
        </div>
      </div>
    </div>
  );
}
