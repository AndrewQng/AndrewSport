import React, { useState, useEffect } from 'react';
import {
  Tabs, Card, Button, Modal, Form, Input, InputNumber,
  Select, Space, Tag, Table, message, Row, Col, Divider,
} from 'antd';
import {
  PlusOutlined, EditOutlined, LogoutOutlined,
  DollarCircleOutlined, SafetyCertificateOutlined, CheckOutlined, CloseOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatVND } from '../utils/format';

import StatsCards from '../components/admin/StatsCards';
import RevenueChart from '../components/admin/RevenueChart';
import ProductTable from '../components/admin/ProductTable';
import ProductDetailModal from '../components/admin/ProductDetailModal';
import OrderTable from '../components/admin/OrderTable';
import RefundClaimsTable from '../components/admin/RefundClaimsTable';
import WarrantyClaimsTable from '../components/admin/WarrantyClaimsTable';

const { Option } = Select;
const { TextArea } = Input;

export default function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [refundClaims, setRefundClaims] = useState([]);
  const [warrantyClaims, setWarrantyClaims] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingRefunds, setLoadingRefunds] = useState(false);
  const [loadingWarranties, setLoadingWarranties] = useState(false);

  // Product add/edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingProductId, setEditingProductId] = useState(null);

  // Product detail view modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Claim action modal
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [actionForm] = Form.useForm();

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchStats();
    fetchRefundClaims();
    fetchWarrantyClaims();
  }, []);

  // ── Fetchers ──────────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch {
      message.error('Không thể tải thống kê báo cáo.');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRefundClaims = async () => {
    try {
      setLoadingRefunds(true);
      const res = await api.get('/refunds/admin/all');
      setRefundClaims(res.data);
    } catch (err) {
      console.error('Không thể tải yêu cầu hoàn tiền:', err);
    } finally {
      setLoadingRefunds(false);
    }
  };

  const fetchWarrantyClaims = async () => {
    try {
      setLoadingWarranties(true);
      const res = await api.get('/warranties/admin/all');
      setWarrantyClaims(res.data);
    } catch (err) {
      console.error('Không thể tải yêu cầu bảo hành:', err);
    } finally {
      setLoadingWarranties(false);
    }
  };

  // ── Product handlers ──────────────────────────────────────
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleOpenEditModal = (record) => {
    setEditingProductId(record.id);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleViewDetail = (record) => {
    setSelectedProduct(record);
    setDetailModalOpen(true);
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, values);
        message.success('Cập nhật sản phẩm thành công.');
      } else {
        await api.post('/products', values);
        message.success('Đã thêm sản phẩm mới.');
      }
      setModalOpen(false);
      fetchProducts();
      fetchStats();
    } catch {
      message.error('Vui lòng kiểm tra lại thông tin form.');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      message.success('Đã xóa sản phẩm.');
      fetchProducts();
      fetchStats();
    } catch {
      message.error('Không thể xóa sản phẩm.');
    }
  };

  // ── Order handlers ────────────────────────────────────────
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status?status=${newStatus}`);
      message.success(`Cập nhật trạng thái đơn hàng sang ${newStatus}.`);
      fetchOrders();
      fetchStats();
    } catch {
      message.error('Không thể cập nhật trạng thái đơn hàng.');
    }
  };

  // ── Claim handlers ────────────────────────────────────────
  const openActionModal = (type, claimId) => {
    setActionType(type);
    setSelectedClaimId(claimId);
    actionForm.resetFields();
    setActionModalOpen(true);
  };

  const handleActionSubmit = async (values) => {
    const comment = values.adminComment || '';
    try {
      if (actionType === 'approve_refund') {
        await api.put(`/refunds/admin/${selectedClaimId}/approve`, { adminComment: comment });
        message.success('Đã duyệt hoàn tiền cho khách hàng.');
        fetchRefundClaims();
      } else if (actionType === 'reject_refund') {
        await api.put(`/refunds/admin/${selectedClaimId}/reject`, { adminComment: comment });
        message.warning('Đã từ chối yêu cầu hoàn tiền.');
        fetchRefundClaims();
      } else if (actionType === 'approve_warranty') {
        await api.put(`/warranties/admin/${selectedClaimId}/approve`, { adminComment: comment });
        message.success('Đã duyệt bảo hành sản phẩm.');
        fetchWarrantyClaims();
      } else if (actionType === 'reject_warranty') {
        await api.put(`/warranties/admin/${selectedClaimId}/reject`, { adminComment: comment });
        message.warning('Đã từ chối yêu cầu bảo hành.');
        fetchWarrantyClaims();
      }
      setActionModalOpen(false);
    } catch (error) {
      message.error(error.response?.data?.message || 'Thao tác thất bại.');
    }
  };

  // ── Top-products columns (local — small, no extraction needed) ──
  const topProductColumns = [
    {
      title: 'Tên vợt/sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>,
    },
    {
      title: 'Số lượng đã bán',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (val) => <Tag color="blue">{val} sản phẩm</Tag>,
    },
    {
      title: 'Doanh thu thu về',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (val) => (
        <span style={{ color: '#DC2626', fontWeight: 700 }}>{formatVND(val)}</span>
      ),
    },
  ];

  const tabsItems = [
    {
      key: 'stats',
      label: 'Báo cáo & Doanh thu',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <RevenueChart stats={stats} />
          <Card
            title={<span style={{ fontWeight: 700 }}>🏆 Top 5 sản phẩm bán chạy nhất</span>}
            styles={{ body: { padding: '0px' } }}
          >
            <Table
              dataSource={stats?.topProducts || []}
              columns={topProductColumns}
              rowKey="productId"
              pagination={false}
              size="middle"
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Space>
      ),
    },
    {
      key: '1',
      label: 'Quản lý kho hàng',
      children: (
        <Card styles={{ body: { padding: '16px' } }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenAddModal}
              style={{ background: '#DC2626', borderColor: '#DC2626', fontWeight: 600 }}
            >
              Thêm sản phẩm mới
            </Button>
          </div>
          <ProductTable
            products={products}
            loading={loadingProducts}
            onView={handleViewDetail}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteProduct}
          />
        </Card>
      ),
    },
    {
      key: '2',
      label: 'Quản lý đơn hàng',
      children: (
        <Card styles={{ body: { padding: '16px' } }}>
          <OrderTable
            orders={orders}
            loading={loadingOrders}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        </Card>
      ),
    },
    {
      key: '3',
      label: <span><DollarCircleOutlined /> Duyệt Hoàn tiền</span>,
      children: (
        <Card
          styles={{ body: { padding: '16px' } }}
          title="Yêu cầu hoàn trả tiền từ người dùng (trong 7 ngày)"
        >
          <RefundClaimsTable
            refundClaims={refundClaims}
            loading={loadingRefunds}
            onAction={openActionModal}
          />
        </Card>
      ),
    },
    {
      key: '4',
      label: <span><SafetyCertificateOutlined /> Duyệt Bảo hành</span>,
      children: (
        <Card
          styles={{ body: { padding: '16px' } }}
          title="Yêu cầu dịch vụ bảo hành sản phẩm"
        >
          <WarrantyClaimsTable
            warrantyClaims={warrantyClaims}
            loading={loadingWarranties}
            onAction={openActionModal}
          />
        </Card>
      ),
    },
  ];

  return (
    <div style={{
      padding: '24px 32px', maxWidth: '1400px', margin: '0 auto',
      minHeight: '100vh', background: '#f8fafc',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 28, background: '#ffffff', padding: '16px 24px',
        borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        <div>
          <span style={{ fontSize: '24px', fontWeight: 900, color: '#DC2626' }}>
            Bảng quản trị (Admin Panel)
          </span>
          <br />
          <span style={{ color: '#64748b', fontSize: '14px' }}>
            Hệ thống theo dõi doanh thu, thông số sản phẩm, bảo hành, hoàn tiền và xử lý đơn hàng
          </span>
        </div>
        <Button
          danger
          type="primary"
          icon={<LogoutOutlined />}
          onClick={onLogout}
          style={{ fontWeight: 600, borderRadius: '8px' }}
        >
          Đăng xuất Admin
        </Button>
      </div>

      <StatsCards stats={stats} loadingStats={loadingStats} />

      <Tabs
        defaultActiveKey="stats"
        items={tabsItems}
        type="card"
        onChange={(key) => {
          if (key === '3') fetchRefundClaims();
          if (key === '4') fetchWarrantyClaims();
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        open={detailModalOpen}
        product={selectedProduct}
        onClose={() => setDetailModalOpen(false)}
        onEdit={handleOpenEditModal}
      />

      {/* Product Add/Edit Modal */}
      <Modal
        title={editingProductId ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm mới'}
        open={modalOpen}
        onOk={handleModalSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingProductId ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy bỏ"
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'ACTIVE', warrantyPeriod: 12 }}>
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Nhập tên sản phẩm' }]}>
            <Input placeholder="Vợt cầu lông Yonex Astrox 88D Play" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="brand" label="Thương hiệu" rules={[{ required: true, message: 'Nhập thương hiệu' }]}>
                <Input placeholder="Yonex" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Danh mục sản phẩm" rules={[{ required: true, message: 'Chọn danh mục' }]}>
                <Select placeholder="Chọn danh mục">
                  <Option value="Badminton">Cầu lông (Badminton)</Option>
                  <Option value="Tennis">Tennis</Option>
                  <Option value="Pickleball">Pickleball</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="Giá bán (VND)" rules={[{ required: true, message: 'Nhập giá bán' }]}>
                <InputNumber
                  min={1}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  parser={(value) => value.replace(/\./g, '')}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="stockQuantity" label="Số lượng tồn kho" rules={[{ required: true, message: 'Nhập số lượng tồn kho' }]}>
                <InputNumber min={0} precision={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="warrantyPeriod" label="Thời gian bảo hành (tháng)" rules={[{ required: true, message: 'Nhập số tháng bảo hành' }]}>
                <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder="12" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái">
                <Select>
                  <Option value="ACTIVE">HOẠT ĐỘNG</Option>
                  <Option value="INACTIVE">TẠM KHÓA</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="imageUrl" label="Đường dẫn hình ảnh (URL)" rules={[{ required: true, message: 'Nhập đường dẫn hình ảnh' }]}>
            <Input placeholder="https://images.unsplash.com/photo-...webp" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả chi tiết sản phẩm">
            <Input.TextArea rows={3} placeholder="Nhập thông số chi tiết vợt cầu lông hoặc mô tả khác..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="weight" label="Trọng lượng">
                <Select placeholder="Chọn">
                  <Option value="2U">2U</Option>
                  <Option value="3U">3U</Option>
                  <Option value="4U">4U</Option>
                  <Option value="5U">5U</Option>
                  <Option value="F">F</Option>
                  <Option value="2F">2F</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="balance" label="Điểm cân bằng">
                <Select placeholder="Chọn">
                  <Option value="Nhẹ Đầu">Nhẹ Đầu</Option>
                  <Option value="Cân Bằng">Cân Bằng</Option>
                  <Option value="Hơi Nặng Đầu">Hơi Nặng Đầu</Option>
                  <Option value="Nặng Đầu">Nặng Đầu</Option>
                  <Option value="Siêu Nặng Đầu">Siêu Nặng Đầu</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="stiffness" label="Độ cứng đũa">
                <Select placeholder="Chọn">
                  <Option value="Dẻo">Dẻo</Option>
                  <Option value="Trung Bình">Trung Bình</Option>
                  <Option value="Cứng">Cứng</Option>
                  <Option value="Siêu Cứng">Siêu Cứng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="length" label="Chiều dài (mm)">
                <Input placeholder="675" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gripLength" label="Cán vợt (mm)">
                <Input placeholder="205" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="isFlashSale" label="Tham gia Flash Sale">
                <Select placeholder="Chọn trạng thái">
                  <Option value={false}>Không tham gia</Option>
                  <Option value={true}>Tham gia Flash Sale</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item noStyle shouldUpdate={(prev, cur) => prev.isFlashSale !== cur.isFlashSale}>
                {({ getFieldValue }) =>
                  getFieldValue('isFlashSale') === true ? (
                    <Form.Item
                      name="flashSalePrice"
                      label="Giá bán Flash Sale (VND)"
                      rules={[{ required: true, message: 'Nhập giá bán Flash Sale' }]}
                    >
                      <InputNumber
                        min={1}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={(value) => value.replace(/\./g, '')}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Claim Action Modal */}
      <Modal
        title={
          <strong>
            {actionType.startsWith('approve')
              ? <Tag color="success">DUYỆT YÊU CẦU</Tag>
              : <Tag color="error">TỪ CHỐI YÊU CẦU</Tag>}
          </strong>
        }
        open={actionModalOpen}
        onOk={() => actionForm.submit()}
        onCancel={() => setActionModalOpen(false)}
        okText="Xác nhận"
        cancelText="Quay lại"
        destroyOnClose
      >
        <Divider style={{ margin: '12px 0' }} />
        <Form form={actionForm} layout="vertical" onFinish={handleActionSubmit}>
          <Form.Item
            name="adminComment"
            label="Ghi chú phản hồi gửi tới khách hàng"
            rules={[{
              required: actionType.startsWith('reject'),
              message: 'Vui lòng nhập lý do nếu từ chối yêu cầu!',
            }]}
          >
            <TextArea rows={4} placeholder="Nhập nhận xét, hướng dẫn gửi trả sản phẩm hoặc lý do từ chối..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
