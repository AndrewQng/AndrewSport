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

/**
 * Trả về ảnh mặc định tương ứng với danh mục sản phẩm nếu ảnh từ DB bị trống/lỗi
 * @param {Object} product
 * @returns {string}
 */
export const getProductImage = (product) => {
  if (product && product.imageUrl && product.imageUrl.trim() !== '' && product.imageUrl !== 'none' && !product.imageUrl.includes('photo-1626224583764-f87db24ac4ea')) {
    return product.imageUrl;
  }

  const category = (product?.category || '').toLowerCase();
  const name = (product?.name || '').toLowerCase();

  // 1. Giày cầu lông
  if (category === 'badminton' && (name.includes('giày') || name.includes('shoes') || name.includes('footwear'))) {
    return '/images/giay_cau_long.png';
  }

  // 2. Thời trang thể thao (áo, quần, váy...)
  if (name.includes('áo') || name.includes('quần') || name.includes('váy') || name.includes('thời trang') || name.includes('t-shirt') || name.includes('shirt') || name.includes('shorts') || name.includes('skirt') || name.includes('jersey') || name.includes('pant')) {
    return '/images/thoi_trang_the_thao.png';
  }

  // 3. Balo & phụ kiện (túi, balo, cước, quấn cán, phụ kiện khác...)
  if (name.includes('balo') || name.includes('túi') || name.includes('cước') || name.includes('quấn cán') || name.includes('phụ kiện') || name.includes('bag') || name.includes('string') || name.includes('grip') || name.includes('socks') || name.includes('vớ') || name.includes('hộp cầu') || name.includes('quả cầu')) {
    return '/images/balo_phu_kien.png';
  }

  // 4. Các danh mục cụ thể
  if (category === 'badminton') {
    return '/images/vot_cau_long.png';
  }

  if (category === 'tennis') {
    if (name.includes('giày') || name.includes('bóng') || name.includes('shoes') || name.includes('ball')) {
      return '/images/giay_bong_tennis.png';
    }
    return '/images/vot_tennis.png';
  }

  if (category === 'pickleball') {
    if (name.includes('bóng') || name.includes('ball')) {
      return '/images/bong_pickleball.png';
    }
    return '/images/vot_pickleball.png';
  }

  // Mặc định chung
  return '/images/vot_cau_long.png';
};

