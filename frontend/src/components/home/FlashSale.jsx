import React, { useState, useEffect, useRef } from 'react';
import { Button, Tag, Typography, Rate, Space } from 'antd';
import { FireFilled, TrophyOutlined, ShoppingCartOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatVND } from '../../utils/format';

const { Text, Title } = Typography;

export default function FlashSale({ products, onAddToCart }) {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [activeTab, setActiveTab] = useState('flashsale');
  
  // Fake countdown timer targeting the end of the current 4-hour slot
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfSlot = new Date(now);
      // Let's set the end of slot to the next even 4-hour mark (e.g. 12:00, 16:00, 20:00, 24:00)
      const currentHour = now.getHours();
      const targetHour = currentHour + (4 - (currentHour % 4));
      endOfSlot.setHours(targetHour, 0, 0, 0);
      
      const diffMs = endOfSlot - now;
      setTimeLeft(Math.max(0, diffMs));
    };

    calculateTimeLeft();
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    
    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(mins).padStart(2, '0'),
      seconds: String(secs).padStart(2, '0'),
    };
  };

  const timeParts = formatTime(timeLeft);

  // Filter products for each tab
  const getTabProducts = () => {
    const flashDbProducts = products.filter(p => p.isFlashSale === true);

    if (activeTab === 'flashsale') {
      return flashDbProducts.length > 0 ? flashDbProducts : products.slice(0, 4);
    }
    // Rackets deal tab
    if (activeTab === 'rackets') {
      const rackets = flashDbProducts.filter(p => p.category === 'Badminton' && p.subCategory === 'vợt');
      return rackets.length > 0 ? rackets : products.filter(p => p.category === 'Badminton' && p.subCategory === 'vợt').slice(0, 4);
    }
    // Shoes deal tab
    const shoes = flashDbProducts.filter(p => p.category === 'Badminton' && p.subCategory === 'giày');
    return shoes.length > 0 ? shoes : products.filter(p => p.category === 'Badminton' && p.subCategory === 'giày').slice(0, 4);
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmt = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  const activeProducts = getTabProducts();

  return (
    <div style={{ marginBottom: 40 }}>
      {/* 1. Folder tabs header */}
      <div className="flashsale-tabs">
        <div 
          onClick={() => setActiveTab('flashsale')}
          className={`flashsale-tab ${activeTab === 'flashsale' ? 'active' : ''}`}
        >
          <FireFilled style={{ color: '#F59E0B' }} />
          <span>⚡ SPORT FLASHSALE</span>
        </div>
        <div 
          onClick={() => setActiveTab('rackets')}
          className={`flashsale-tab ${activeTab === 'rackets' ? 'active' : ''}`}
        >
          <span>🏸 VỢT GIÁ SỐC</span>
        </div>
        <div 
          onClick={() => setActiveTab('shoes')}
          className={`flashsale-tab ${activeTab === 'shoes' ? 'active' : ''}`}
        >
          <span>👟 GIÀY SIÊU MƯỢT</span>
        </div>
      </div>

      {/* 2. Main Flash Sale Container */}
      <div className="flashsale-container">
        {/* Pills row (Dates & Countdown) */}
        <div className="flashsale-pills-row">
          <div className="flashsale-date-pills">
            <span className="flashsale-date-pill active">ĐANG DIỄN RA</span>
            <span className="flashsale-date-pill" onClick={() => setActiveTab('rackets')}>TIẾP THEO 20:00</span>
          </div>

          <div className="flashsale-countdown">
            <span className="countdown-label">KẾT THÚC SAU</span>
            <div className="countdown-timer-box">
              <span className="countdown-num">{timeParts.hours}</span>
              <span className="countdown-colon">:</span>
              <span className="countdown-num">{timeParts.minutes}</span>
              <span className="countdown-colon">:</span>
              <span className="countdown-num">{timeParts.seconds}</span>
            </div>
          </div>
        </div>

        {/* 3. Product Carousel */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Button 
            shape="circle" 
            icon={<LeftOutlined />} 
            onClick={() => scrollCarousel('left')} 
            className="hide-on-mobile"
            style={{ position: 'absolute', left: -16, zIndex: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          />

          <div 
            ref={carouselRef}
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              padding: '8px 4px',
              width: '100%',
            }}
            className="hide-scrollbar"
          >
            {activeProducts.map((product) => {
              // Calculate custom mock progress sold count for gamified feel
              const code = (product.name || '').length;
              const maxUnits = 10;
              const soldUnits = (code % 7) + 2; // e.g. sold 2 to 8 units
              const percentSold = (soldUnits / maxUnits) * 100;
              
              // Get price display (calculate range if variations exist)
              let salePrice = product.price;
              if (product.isFlashSale && product.flashSalePrice) {
                salePrice = product.flashSalePrice;
              } else if (product.variations && product.variations.length > 0) {
                salePrice = Math.min(...product.variations.map(v => v.price));
              }
              const oldPrice = salePrice * 1.25;

              return (
                <div 
                  key={product.id} 
                  style={{ 
                    minWidth: '270px', 
                    width: '270px', 
                    background: '#ffffff', 
                    borderRadius: '12px', 
                    padding: '16px', 
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                  className="hover-scale"
                >
                  {/* Fire Glow Discount Badge */}
                  <div className="flashsale-badge">
                    GIẢM 20%
                  </div>

                  <div>
                    {/* Image Area */}
                    <div 
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{ height: '160px', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', cursor: 'pointer', background: '#f8fafc', marginBottom: 12 }}
                    >
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        style={{ height: '100%', objectFit: 'contain', transition: 'transform 0.3s ease' }} 
                        className="card-image"
                      />
                    </div>

                    {/* Meta info */}
                    <Space align="center" style={{ marginBottom: 6 }}>
                      <TrophyOutlined style={{ color: '#DC2626' }} />
                      <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
                        {product.brand}
                      </Text>
                    </Space>

                    {/* Product Name */}
                    <Title 
                      level={5} 
                      ellipsis={{ rows: 2 }} 
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 10px 0', cursor: 'pointer', height: '40px', lineHeight: '1.3' }}
                    >
                      {product.name}
                    </Title>
                  </div>

                  <div>
                    {/* Prices */}
                    <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 12 }}>
                      <span className="flashsale-card-price">
                        {formatVND(salePrice)}
                      </span>
                      <span className="flashsale-card-oldprice">
                        {formatVND(oldPrice)}
                      </span>
                    </div>

                    {/* Gamified Fire Progress Bar */}
                    <div style={{ marginBottom: 14 }}>
                      <div className="flashsale-progress">
                        <div className="flashsale-progress-fill" style={{ width: `${percentSold}%` }} />
                        <span className="flashsale-progress-text">
                          <FireFilled style={{ color: '#F59E0B' }} />
                          ĐÃ BÁN {soldUnits}/{maxUnits} SẢN PHẨM
                        </span>
                      </div>
                    </div>

                    {/* Buy Button */}
                    <Button 
                      type="primary" 
                      danger 
                      block 
                      icon={<ShoppingCartOutlined />}
                      onClick={() => {
                        if (product.variations && product.variations.length > 0) {
                          navigate(`/product/${product.id}`);
                        } else {
                          onAddToCart(product);
                        }
                      }}
                      style={{ fontWeight: 700, borderRadius: '8px', height: '36px' }}
                    >
                      MUA NGAY
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Button 
            shape="circle" 
            icon={<RightOutlined />} 
            onClick={() => scrollCarousel('right')} 
            className="hide-on-mobile"
            style={{ position: 'absolute', right: -16, zIndex: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          />
        </div>

        {/* 4. Footer Promo Text */}
        <div style={{ textAlign: 'center', marginTop: 16, color: '#fef08a', fontSize: '12px', fontWeight: 600 }}>
          ⚡ Chỉ áp dụng thanh toán online thành công — Mỗi SĐT chỉ được mua tối đa 1 sản phẩm Flash Sale cùng loại
        </div>
      </div>
    </div>
  );
}
