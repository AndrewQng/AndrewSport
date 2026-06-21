import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Empty, Button, Spin, List, message, Popconfirm } from 'antd';
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

  const handleCancelOrder = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/cancel`);
      message.success('Đơn hàng đã được hủy thành công!');
      fetchOrders();
    } catch (error) {
      message.error(error.response?.data?.message || 'Hủy đơn hàng thất bại.');
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
              <div>
                <Text style={{ fontSize: '13px' }}>
                  • {item.productName} <Text type="secondary">x{item.quantity}</Text>
                </Text>
                {item.variationDetail && (
                  <div style={{ paddingLeft: '12px', fontSize: '11px', color: '#dc2626', fontWeight: 600 }}>
                    Biến thể: {item.variationDetail}
                  </div>
                )}
              </div>
            </List.Item>
          )}
        />
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount, record) => (
        <div>
          <Text strong style={{ color: '#DC2626' }}>{formatVND(amount)}</Text>
          {record.couponCode && (
            <div style={{ fontSize: '11px', marginTop: '2px', lineHeight: '1.4' }}>
              <span style={{ color: '#6b7280' }}>Mã: </span>
              <Text code style={{ fontSize: '10px', padding: '0 4px' }}>{record.couponCode}</Text>
              <div style={{ color: '#52c41a' }}>Giảm: -{formatVND(record.discountAmount)}</div>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => getOrderStatusTag(status)
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => {
        if (record.orderStatus === 'PROCESSING') {
          return (
            <Popconfirm
              title="Xác nhận hủy đơn hàng?"
              description="Hành động này sẽ khôi phục lại số lượng sản phẩm trong kho."
              onConfirm={() => handleCancelOrder(record.id)}
              okText="Hủy đơn"
              cancelText="Quay lại"
              okButtonProps={{ danger: true }}
            >
              <Button type="primary" danger size="small" style={{ borderRadius: '4px' }}>
                Hủy đơn
              </Button>
            </Popconfirm>
          );
        }
        return null;
      }
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
