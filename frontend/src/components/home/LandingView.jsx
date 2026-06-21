import React, { useRef } from 'react';
import { Row, Col, Typography, Empty, Button } from 'antd';
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      {/* Simple Banner Image */}
      <div style={{ width: '100%', height: '350px', background: 'linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, overflow: 'hidden', position: 'relative' }}>
        <div style={{ padding: '0 60px', zIndex: 2 }}>
          <Title level={1} style={{ color: '#DC2626', fontWeight: 900, fontSize: '42px', margin: '0 0 16px 0' }}>ANDREWSPORT</Title>
          <Title level={3} style={{ color: '#0f172a', fontWeight: 700, margin: 0 }}>Hệ thống cửa hàng dụng cụ thể thao lớn nhất Việt Nam</Title>
          <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginTop: '12px' }}>Chuyên cung cấp vợt cầu lông, vợt tennis, vợt pickleball và phụ kiện chính hãng.</Text>
        </div>
        <div style={{ position: 'absolute', right: '5%', bottom: '-10%', width: '400px', height: '400px', background: '#DC2626', opacity: 0.05, borderRadius: '50%' }}></div>
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
