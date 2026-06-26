import React from 'react';
import {
  Modal, Button, Tag, Divider, Descriptions, Badge, Table, Space
} from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { formatVND, getProductImage } from '../../utils/format';

const variationColumns = [
  {
    title: 'Biến thể',
    key: 'label',
    render: (_, r) => {
      const parts = [r.color, r.size, r.weightGrip, r.genderForm, r.type].filter(Boolean);
      return parts.length ? parts.join(' / ') : '—';
    },
  },
  { title: 'Giá', dataIndex: 'price', key: 'price', render: (v) => v ? formatVND(v) : '—' },
  { title: 'Tồn kho', dataIndex: 'stockQuantity', key: 'stockQuantity', render: (v) => v ?? '—' },
  { title: 'SKU', dataIndex: 'sku', key: 'sku', render: (v) => v || '—' },
];

export default function ProductDetailModal({ open, product, onClose, onEdit }) {
  if (!product) return null;

  return (
    <Modal
      title={
        <Space>
          <EyeOutlined style={{ color: '#E95211' }} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>Chi tiết sản phẩm</span>
          {product.isFlashSale && <Tag color="warning" style={{ fontWeight: 700 }}>⚡ FLASH SALE</Tag>}
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="edit"
          type="primary"
          icon={<EditOutlined />}
          style={{ background: '#E95211', borderColor: '#E95211' }}
          onClick={() => { onClose(); onEdit(product); }}
        >
          Chỉnh sửa
        </Button>,
        <Button key="close" onClick={onClose}>Đóng</Button>,
      ]}
      width={740}
      destroyOnClose
    >
      {/* Header: image + name/brand/tags */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, alignItems: 'flex-start' }}>
        <img
          src={getProductImage(product)}
          alt={product.name}
          style={{
            width: 110, height: 110, objectFit: 'cover',
            borderRadius: 10, border: '1px solid #f0f0f0', flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#1e293b', marginBottom: 4, lineHeight: 1.3 }}>
            {product.name}
          </div>
          <div style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>
            Hãng: <strong>{product.brand}</strong>
            &nbsp;|&nbsp;
            Danh mục: <strong>{product.category === 'Badminton' ? 'Cầu lông' : product.category}</strong>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Tag
              color={product.status === 'ACTIVE' ? 'success' : 'default'}
              style={{ fontWeight: 700 }}
            >
              {product.status === 'ACTIVE' ? 'HOẠT ĐỘNG' : 'TẠM KHÓA'}
            </Tag>
            {product.isFlashSale && (
              <Tag color="orange">⚡ Flash Sale: {formatVND(product.flashSalePrice)}</Tag>
            )}
            <Tag color="blue">BH {product.warrantyPeriod || 12} tháng</Tag>
          </div>
        </div>
      </div>

      {/* Giá & tồn kho */}
      <Divider orientation="left" orientationMargin={0}
        style={{ fontWeight: 700, color: '#E95211', fontSize: 13, margin: '12px 0 8px' }}>
        Thông tin giá &amp; tồn kho
      </Divider>
      <Descriptions size="small" bordered column={2}>
        <Descriptions.Item label="Giá bán">
          <span style={{ fontWeight: 700, color: '#DC2626', fontSize: 15 }}>
            {formatVND(product.price)}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Tồn kho">
          <Badge
            status={product.stockQuantity > 0 ? 'success' : 'error'}
            text={
              <span style={{ fontWeight: 600 }}>
                {product.stockQuantity ?? '—'} sản phẩm
              </span>
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label="Flash Sale">
          {product.isFlashSale ? `Có — ${formatVND(product.flashSalePrice)}` : 'Không'}
        </Descriptions.Item>
        <Descriptions.Item label="Bảo hành">
          {product.warrantyPeriod || 12} tháng
        </Descriptions.Item>
      </Descriptions>

      {/* Thông số kỹ thuật */}
      <Divider orientation="left" orientationMargin={0}
        style={{ fontWeight: 700, color: '#E95211', fontSize: 13, margin: '16px 0 8px' }}>
        Thông số kỹ thuật
      </Divider>
      <Descriptions size="small" bordered column={2}>
        <Descriptions.Item label="Trọng lượng">{product.weight || '—'}</Descriptions.Item>
        <Descriptions.Item label="Cân bằng">{product.balance || '—'}</Descriptions.Item>
        <Descriptions.Item label="Độ cứng đũa">{product.stiffness || '—'}</Descriptions.Item>
        <Descriptions.Item label="Swingweight">{product.swingweight || '—'}</Descriptions.Item>
        <Descriptions.Item label="Chiều dài">
          {product.length ? `${product.length} mm` : '—'}
        </Descriptions.Item>
        <Descriptions.Item label="Cán vợt">
          {product.gripLength ? `${product.gripLength} mm` : '—'}
        </Descriptions.Item>
        <Descriptions.Item label="Phong cách">{product.playStyle || '—'}</Descriptions.Item>
        <Descriptions.Item label="Chế độ chơi">{product.gameMode || '—'}</Descriptions.Item>
        <Descriptions.Item label="Cấp độ" span={2}>{product.level || '—'}</Descriptions.Item>
      </Descriptions>

      {/* Công nghệ */}
      {product.technologies?.length > 0 && (
        <>
          <Divider orientation="left" orientationMargin={0}
            style={{ fontWeight: 700, color: '#E95211', fontSize: 13, margin: '16px 0 8px' }}>
            Công nghệ
          </Divider>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {product.technologies.map((tech, i) => (
              <Tag key={i} color="geekblue" style={{ fontWeight: 600, fontSize: 12 }}>{tech}</Tag>
            ))}
          </div>
        </>
      )}

      {/* Biến thể */}
      {product.variations?.length > 0 && (
        <>
          <Divider orientation="left" orientationMargin={0}
            style={{ fontWeight: 700, color: '#E95211', fontSize: 13, margin: '16px 0 8px' }}>
            Biến thể sản phẩm
          </Divider>
          <Table
            size="small"
            dataSource={product.variations}
            rowKey={(_, i) => i}
            pagination={false}
            columns={variationColumns}
          />
        </>
      )}

      {/* Mô tả */}
      {product.description && (
        <>
          <Divider orientation="left" orientationMargin={0}
            style={{ fontWeight: 700, color: '#E95211', fontSize: 13, margin: '16px 0 8px' }}>
            Mô tả chi tiết
          </Divider>
          <div style={{
            background: '#f8fafc', borderRadius: 8, padding: '12px 16px',
            fontSize: 13, color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-line',
          }}>
            {product.description}
          </div>
        </>
      )}
    </Modal>
  );
}
