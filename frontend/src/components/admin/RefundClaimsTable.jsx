import React from 'react';
import { Table, Tag, Button, Space, Image } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

export default function RefundClaimsTable({ refundClaims, loading, onAction }) {
  const columns = [
    {
      title: 'Thời gian yêu cầu',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateStr) => new Date(dateStr).toLocaleString('vi-VN'),
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{id}</span>
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (name, record) => (
        <div>
          <span style={{ fontWeight: 600 }}>{name}</span>
          {record.sku && (
            <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
              SKU: {record.sku}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Ảnh minh chứng',
      dataIndex: 'productImage',
      key: 'productImage',
      render: (imgUrl) => (
        <Image
          src={imgUrl}
          alt="Minh chứng"
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Lý do hoàn tiền',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'PENDING') return <Tag color="warning">CHỜ DUYỆT</Tag>;
        if (status === 'APPROVED') return <Tag color="success">ĐÃ HOÀN TIỀN</Tag>;
        return <Tag color="error">ĐÃ TỪ CHỐI</Tag>;
      },
    },
    {
      title: 'Ghi chú Admin',
      dataIndex: 'adminComment',
      key: 'adminComment',
      render: (comment) => comment || '—',
    },
    {
      title: 'Duyệt / Từ chối',
      key: 'actions',
      render: (_, record) => {
        if (record.status === 'PENDING') {
          return (
            <Space>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                style={{ background: '#52c41a', borderColor: '#52c41a' }}
                onClick={() => onAction('approve_refund', record.id)}
              >
                Duyệt
              </Button>
              <Button
                type="primary"
                danger
                icon={<CloseOutlined />}
                size="small"
                onClick={() => onAction('reject_refund', record.id)}
              >
                Từ chối
              </Button>
            </Space>
          );
        }
        return <span style={{ color: '#94a3b8', fontSize: '12px' }}>Đã xử lý</span>;
      },
    },
  ];

  return (
    <Table
      dataSource={refundClaims}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 5 }}
      scroll={{ x: 'max-content' }}
    />
  );
}
