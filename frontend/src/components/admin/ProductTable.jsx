import React from 'react';
import {
  Table, Button, Tag, Space, Popconfirm
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { formatVND, getProductImage } from '../../utils/format';

export default function ProductTable({
  products,
  loading,
  onView,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <img
            src={getProductImage(record)}
            alt={text}
            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
          />
          <div>
            <span style={{ fontWeight: 600 }}>{text}</span>
            {record.isFlashSale && (
              <Tag color="warning" style={{ marginLeft: 6, fontSize: '10px', fontWeight: 700 }}>
                ⚡ FLASH SALE
              </Tag>
            )}
            <br />
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Hãng {record.brand} | BH {record.warrantyPeriod || 12} tháng
            </span>
          </div>
        </Space>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (val) => val === 'Badminton' ? 'Cầu lông' : val,
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (val) => formatVND(val),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (val) => (
        <Tag color={val === 'ACTIVE' ? 'success' : 'default'}>
          {val === 'ACTIVE' ? 'HOẠT ĐỘNG' : 'TẠM KHÓA'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            title="Xem chi tiết"
            onClick={(e) => { e.stopPropagation(); onView(record); }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            title="Chỉnh sửa"
            onClick={(e) => { e.stopPropagation(); onEdit(record); }}
          />
          <Popconfirm
            title="Xác nhận xóa sản phẩm này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={products}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 6 }}
      scroll={{ x: 'max-content' }}
      onRow={(record) => ({
        onClick: () => onView(record),
        style: { cursor: 'pointer' },
      })}
    />
  );
}
