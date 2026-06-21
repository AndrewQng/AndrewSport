import React from 'react';
import { Card, Button, Tag, Typography, Space, Rate } from 'antd';
import { ShoppingCartOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatVND } from '../utils/format';

const { Text, Title } = Typography;

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  const totalStock = React.useMemo(() => {
    if (product.variations && product.variations.length > 0) {
      return product.variations.reduce((sum, v) => sum + v.stockQuantity, 0);
    }
    return product.stockQuantity;
  }, [product.stockQuantity, product.variations]);

  const isOutOfStock = totalStock <= 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;

  const priceDisplay = React.useMemo(() => {
    if (product.variations && product.variations.length > 0) {
      const prices = product.variations.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice === maxPrice) {
        return formatVND(minPrice);
      } else {
        return `Từ ${formatVND(minPrice)}`;
      }
    }
    return formatVND(product.price);
  }, [product.price, product.variations]);

  const handleCartClick = (e) => {
    e.stopPropagation();
    if (product.variations && product.variations.length > 0) {
      navigate(`/product/${product.id}`);
    } else {
      onAddToCart(product);
    }
  };

  // Consistent rating based on name to make catalog look premium and alive
  const mockRating = React.useMemo(() => {
    const code = (product.name || '').charCodeAt(0) || 45;
    return 4.0 + (code % 11) * 0.1;
  }, [product.name]);

  const mockReviewsCount = React.useMemo(() => {
    const code = (product.name || '').length || 15;
    return (code * 3) % 27 + 5;
  }, [product.name]);

  return (
    <Card
      hoverable
      className="hover-scale"
      style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '12px', overflow: 'hidden' }}
      cover={
        <div 
          onClick={() => navigate(`/product/${product.id}`)}
          className="product-card-image-container"
        >
          <img
            alt={product.name}
            src={product.imageUrl || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            className="card-image"
          />
          <Tag 
            color="#DC2626" 
            style={{ position: 'absolute', top: '12px', left: '12px', borderRadius: '4px', border: 'none', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase' }}
          >
            {product.category === 'Badminton' ? 'Cầu Lông' : product.category === 'Tennis' ? 'Quần Vợt' : product.category}
          </Tag>
          {isOutOfStock && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255, 255, 255, 0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag color="error" style={{ fontSize: '14px', padding: '6px 14px', fontWeight: 700, borderRadius: '4px' }}>HẾT HÀNG</Tag>
            </div>
          )}
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
            <Space align="center">
              <TrophyOutlined style={{ color: '#DC2626' }} />
              <Text type="secondary" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Hãng {product.brand}
              </Text>
            </Space>
            <Space size={4} align="center">
              <Rate disabled allowHalf defaultValue={mockRating} style={{ fontSize: '12px', color: '#FADB14' }} />
              <span style={{ fontSize: '12px', color: '#8C8C8C' }}>({mockReviewsCount})</span>
            </Space>
          </div>
          
          <Title 
            level={5} 
            ellipsis={{ rows: 2 }} 
            onClick={() => navigate(`/product/${product.id}`)}
            className="product-card-title"
          >
            {product.name}
          </Title>
          
          <Text 
            type="secondary" 
            ellipsis={{ rows: 2 }} 
            className="hide-on-mobile"
            style={{ fontSize: '14px', display: 'block', height: '40px', marginBottom: '16px', lineHeight: '1.4' }}
          >
            {product.description}
          </Text>
        </div>

        <div>
          <div className="product-card-price-row">
            <Title level={4} className="product-card-price">
              {priceDisplay}
            </Title>
            
            {isLowStock && (
              <Tag color="warning" style={{ margin: 0, fontWeight: 600 }}>Chỉ còn {totalStock}!</Tag>
            )}
            {!isOutOfStock && !isLowStock && (
              <Tag color="success" style={{ margin: 0, fontWeight: 600 }}>Còn hàng</Tag>
            )}
          </div>

          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            block
            disabled={isOutOfStock}
            onClick={handleCartClick}
            className="product-card-button"
          >
            {product.variations && product.variations.length > 0 ? "Chọn tùy chọn" : "Thêm vào giỏ"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
