import React from 'react';
import { Table, Button, InputNumber, Space, Typography, Card, Row, Col, Empty } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formatVND } from '../utils/format';

const { Title, Text } = Typography;

export default function Cart({ cart, onUpdateCartQty, onRemoveFromCart }) {
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <img src={record.imageUrl} alt={text} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} />
          <div>
            <Text strong style={{ fontSize: 14 }}>{text}</Text>
            {record.variationDetail && (
              <>
                <br />
                <Text type="danger" style={{ fontSize: 12, fontWeight: 600 }}>Biến thể: {record.variationDetail}</Text>
              </>
            )}
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.category === 'Badminton' ? 'Cầu lông' : record.category}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatVND(price),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty, record) => (
        <InputNumber 
          min={1} 
          max={record.stockQuantity} 
          value={qty} 
          onChange={(val) => onUpdateCartQty(record.id, record.sku, val)}
          style={{ width: 70 }}
        />
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, record) => formatVND(record.price * record.quantity),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => onRemoveFromCart(record.id, record.sku)} 
        />
      ),
    },
  ];

  if (cart.length === 0) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Text type="secondary" style={{ fontSize: 16 }}>Giỏ hàng của bạn đang trống.</Text>}
        >
          <Button type="primary" size="large" onClick={() => navigate('/')} style={{ marginTop: 12, background: '#DC2626', borderColor: '#DC2626' }}>
            Mua sắm ngay
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <ShoppingCartOutlined style={{ color: '#DC2626' }} /> Giỏ hàng của bạn
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card styles={{ body: { padding: 0 } }} style={{ overflow: 'hidden' }}>
            <Table 
              dataSource={cart} 
              columns={columns} 
              rowKey={(record) => `${record.id}_${record.sku || ''}`} 
              pagination={false} 
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={<span style={{ fontWeight: 700 }}>Tóm tắt đơn hàng</span>} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text type="secondary">Tạm tính</Text>
              <Text strong>{formatVND(totalPrice)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text type="secondary">Phí vận chuyển</Text>
              <Text type="success" strong>Miễn phí</Text>
            </div>
            <div style={{ borderTop: '1px solid #f1f5f9', margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <Title level={4} style={{ margin: 0 }}>Tổng cộng</Title>
              <Title level={4} style={{ margin: 0, color: '#DC2626', fontWeight: 800 }}>
                {formatVND(totalPrice)}
              </Title>
            </div>

            <Button 
              type="primary" 
              size="large" 
              block 
              icon={<ArrowRightOutlined />}
              onClick={() => navigate('/checkout')}
              style={{ height: 48, borderRadius: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#DC2626', borderColor: '#DC2626' }}
            >
              Tiến hành thanh toán
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
