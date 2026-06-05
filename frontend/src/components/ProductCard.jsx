import React from 'react';
import { Card, Button, Tag, Typography, Space } from 'antd';
import { ShoppingCartOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatVND } from '../utils/format';

const { Text, Title } = Typography;

export default function ProductCard({ product, onAddToCart }) {
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
  const navigate = useNavigate();

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
          <Space align="center" style={{ marginBottom: '6px' }}>
            <TrophyOutlined style={{ color: '#DC2626' }} />
            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Hãng {product.brand}
            </Text>
          </Space>
          
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
            style={{ fontSize: '13px', display: 'block', height: '36px', marginBottom: '16px', lineHeight: '1.4' }}
          >
            {product.description}
          </Text>
        </div>

        <div>
          <div className="product-card-price-row">
            <Title level={4} className="product-card-price">
              {formatVND(product.price)}
            </Title>
            
            {isLowStock && (
              <Tag color="warning" style={{ margin: 0, fontWeight: 600 }}>Chỉ còn {product.stockQuantity}!</Tag>
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
            onClick={() => onAddToCart(product)}
            className="product-card-button"
          >
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </Card>
  );
}
