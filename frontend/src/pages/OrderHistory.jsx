import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Empty, Button, Spin, List, message } from 'antd';
import { HistoryOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatVND, getOrderStatusTag } from '../utils/format';

const { Title, Text } = Typography;

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/my-history');
      setOrders(response.data);
    } catch (error) {
      message.error('Không thể tải lịch sử mua hàng.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text copyable style={{ fontSize: '13px' }}>{id}</Text>
    },
    {
      title: 'Sản phẩm đã mua',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <List
          size="small"
          dataSource={items}
          renderItem={(item) => (
            <List.Item style={{ padding: '4px 0', border: 'none' }}>
              <Text style={{ fontSize: '13px' }}>
                • {item.productName} <Text type="secondary">x{item.quantity}</Text>
              </Text>
            </List.Item>
          )}
        />
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => <Text strong style={{ color: '#DC2626' }}>{formatVND(amount)}</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => getOrderStatusTag(status)
    }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Đang tải lịch sử mua hàng..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <HistoryOutlined style={{ color: '#DC2626' }} /> Lịch sử mua hàng
      </Title>

      {orders.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px 0' }}>
          <Empty description="Bạn chưa thực hiện bất kỳ đơn hàng nào.">
            <Button type="primary" icon={<ShoppingOutlined />} onClick={() => navigate('/')} style={{ background: '#DC2626', borderColor: '#DC2626' }}>
              Mua sắm ngay
            </Button>
          </Empty>
        </Card>
      ) : (
        <Card styles={{ body: { padding: 0 } }} style={{ overflow: 'hidden' }}>
          <Table 
            dataSource={orders} 
            columns={columns} 
            rowKey="id" 
            pagination={{ pageSize: 5 }} 
            scroll={{ x: 'max-content' }}
          />
        </Card>
      )}
    </div>
  );
}
