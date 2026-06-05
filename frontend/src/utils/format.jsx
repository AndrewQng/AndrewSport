import React from 'react';
import { Tag } from 'antd';

/**
 * Định dạng số thành chuỗi tiền tệ VND (ví dụ: 1.000.000 ₫)
 * @param {number} price
 * @returns {string}
 */
export const formatVND = (price) => {
  return (price || 0).toLocaleString('vi-VN') + ' ₫';
};

/**
 * Trả về Tag Antd tương ứng với trạng thái đơn hàng
 * @param {string} status
 * @returns {JSX.Element}
 */
export const getOrderStatusTag = (status) => {
  switch (status) {
    case 'DELIVERED':
      return <Tag color="success">ĐÃ GIAO HÀNG</Tag>;
    case 'SHIPPED':
      return <Tag color="warning">ĐANG GIAO HÀNG</Tag>;
    case 'PROCESSING':
      return <Tag color="processing">ĐANG XỬ LÝ</Tag>;
    case 'CANCELLED':
      return <Tag color="error">ĐÃ HỦY</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};
