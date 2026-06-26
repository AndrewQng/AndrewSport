import React from 'react';
import { Table, Tag, Button, Space, Image } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

export default function WarrantyClaimsTable({ warrantyClaims, loading, onAction }) {
  const columns = [
    {
      title: 'Thời gian yêu cầu',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateStr) => new Date(dateStr).toLocaleString('vi-VN'),
    },
    {
      title: 'Mã bảo hành',
      dataIndex: 'warrantyCode',
      key: 'warrantyCode',
      render: (code) => (
        <Tag color="blue" style={{ fontFamily: 'monospace' }}>{code}</Tag>
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Ảnh lỗi (Cloudinary)',
      dataIndex: 'productImage',
      key: 'productImage',
      render: (imgUrl) => (
        <Image
          src={imgUrl}
          alt="Ảnh lỗi sản phẩm"
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Mô tả lỗi',
      dataIndex: 'issueDescription',
      key: 'issueDescription',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'PENDING') return <Tag color="warning">ĐANG XỬ LÝ</Tag>;
        if (status === 'APPROVED') return <Tag color="success">ĐÃ BẢO HÀNH</Tag>;
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
      title: 'Hành động',
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
                onClick={() => onAction('approve_warranty', record.id)}
              >
                Duyệt bảo hành
              </Button>
              <Button
                type="primary"
                danger
                icon={<CloseOutlined />}
                size="small"
                onClick={() => onAction('reject_warranty', record.id)}
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
      dataSource={warrantyClaims}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 5 }}
      scroll={{ x: 'max-content' }}
    />
  );
}
