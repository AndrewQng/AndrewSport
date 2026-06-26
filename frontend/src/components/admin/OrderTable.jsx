import React from 'react';
import { Table, Select, Space } from 'antd';
import { formatVND, getOrderStatusTag } from '../../utils/format';

const { Option } = Select;

export default function OrderTable({ orders, loading, onUpdateStatus }) {
  const columns = [
    {
      title: 'Mã đơn hàng / Người mua',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <div>
          <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>{id}</span>
          <br />
          <span style={{ fontWeight: 600 }}>{record.customerName}</span>
        </div>
      ),
    },
    {
      title: 'Sản phẩm mua',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <Space direction="vertical" size={1}>
          {items.map((item, idx) => (
            <span key={idx} style={{ fontSize: '13px' }}>
              • {item.productName} (x{item.quantity})
            </span>
          ))}
        </Space>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val) => formatVND(val),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status) => getOrderStatusTag(status),
    },
    {
      title: 'Cập nhật trạng thái',
      key: 'updateStatus',
      render: (_, record) => (
        <Select
          defaultValue={record.orderStatus}
          style={{ width: 140 }}
          onChange={(val) => onUpdateStatus(record.id, val)}
        >
          <Option value="PROCESSING">ĐANG XỬ LÝ</Option>
          <Option value="SHIPPED">ĐANG GIAO HÀNG</Option>
          <Option value="DELIVERED">ĐÃ GIAO HÀNG</Option>
          <Option value="CANCELLED">ĐÃ HỦY</Option>
        </Select>
      ),
    },
  ];

  return (
    <Table
      dataSource={orders}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 6 }}
      scroll={{ x: 'max-content' }}
    />
  );
}
