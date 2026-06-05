import React, { useState, useEffect } from 'react';
import { Table, Tabs, Card, Button, Modal, Form, Input, InputNumber, Select, Space, Popconfirm, Tag, Select as StatusSelect, message, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShoppingCartOutlined, UserOutlined, DatabaseOutlined, LineChartOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatVND, getOrderStatusTag } from '../utils/format';
import StatsCards from '../components/admin/StatsCards';
import RevenueChart from '../components/admin/RevenueChart';

const { Option } = Select;

export default function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingProductId, setEditingProductId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchStats();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      message.error('Không thể tải thống kê báo cáo.');
    } finally {
      setLoadingStats(false);
    }
  };

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
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin form.');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      message.success('Đã xóa sản phẩm.');
      fetchProducts();
      fetchStats();
    } catch (error) {
      message.error('Không thể xóa sản phẩm.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status?status=${newStatus}`);
      message.success(`Cập nhật trạng thái đơn hàng sang ${newStatus}.`);
      fetchOrders();
      fetchStats();
    } catch (error) {
      message.error('Không thể cập nhật trạng thái đơn hàng.');
    }
  };

  const handleAdminLogout = () => {
    onLogout();
  };

  const productColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <img src={record.imageUrl} alt={text} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
          <div>
            <span style={{ fontWeight: 600 }}>{text}</span>
            <br />
            <span style={{ fontSize: '11px', color: '#64748b' }}>Hãng {record.brand}</span>
          </div>
        </Space>
      )
    },
    { 
      title: 'Danh mục', 
      dataIndex: 'category', 
      key: 'category',
      render: (val) => val === 'Badminton' ? 'Cầu lông' : val
    },
    { title: 'Giá bán', dataIndex: 'price', key: 'price', render: (val) => formatVND(val) },
    { title: 'Tồn kho', dataIndex: 'stockQuantity', key: 'stockQuantity' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (val) => <Tag color={val === 'ACTIVE' ? 'success' : 'default'}>{val === 'ACTIVE' ? 'HOẠT ĐỘNG' : 'TẠM KHÓA'}</Tag> },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenEditModal(record)} />
          <Popconfirm title="Xác nhận xóa sản phẩm này?" onConfirm={() => handleDeleteProduct(record.id)} okText="Xóa" cancelText="Hủy">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const orderColumns = [
    {
      title: 'Mã đơn hàng / Người mua',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>{id}</span>
          <br />
          <span style={{ fontWeight: 600 }}>{record.customerName}</span>
        </div>
      )
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
      )
    },
    { title: 'Tổng tiền', dataIndex: 'totalAmount', key: 'totalAmount', render: (val) => formatVND(val) },
    { title: 'Trạng thái', dataIndex: 'orderStatus', key: 'orderStatus', render: (status) => getOrderStatusTag(status) },
    {
      title: 'Cập nhật trạng thái',
      key: 'updateStatus',
      render: (_, record) => (
        <StatusSelect
          defaultValue={record.orderStatus}
          style={{ width: 140 }}
          onChange={(val) => handleUpdateOrderStatus(record.id, val)}
        >
          <Option value="PROCESSING">ĐANG XỬ LÝ</Option>
          <Option value="SHIPPED">ĐANG GIAO HÀNG</Option>
          <Option value="DELIVERED">ĐÃ GIAO HÀNG</Option>
          <Option value="CANCELLED">ĐÃ HỦY</Option>
        </StatusSelect>
      )
    }
  ];

  const topProductColumns = [
    { title: 'Tên vợt/sản phẩm', dataIndex: 'name', key: 'name', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { title: 'Số lượng đã bán', dataIndex: 'quantity', key: 'quantity', align: 'center', render: (val) => <Tag color="blue">{val} sản phẩm</Tag> },
    { title: 'Doanh thu thu về', dataIndex: 'revenue', key: 'revenue', render: (val) => <span style={{ color: '#DC2626', fontWeight: 700 }}>{formatVND(val)}</span> }
  ];

  const tabsItems = [
    {
      key: 'stats',
      label: 'Báo cáo & Doanh thu',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <RevenueChart stats={stats} />
          <Card title={<span style={{ fontWeight: 700 }}>🏆 Top 5 sản phẩm bán chạy nhất</span>} styles={{ body: { padding: '0px' } }}>
            <Table dataSource={stats?.topProducts || []} columns={topProductColumns} rowKey="productId" pagination={false} size="middle" scroll={{ x: 'max-content' }} />
          </Card>
        </Space>
      )
    },
    {
      key: '1',
      label: 'Quản lý kho hàng',
      children: (
        <Card styles={{ body: { padding: '16px' } }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAddModal} style={{ background: '#DC2626', borderColor: '#DC2626', fontWeight: 600 }}>
              Thêm sản phẩm mới
            </Button>
          </div>
          <Table dataSource={products} columns={productColumns} rowKey="id" loading={loadingProducts} pagination={{ pageSize: 6 }} scroll={{ x: 'max-content' }} />
        </Card>
      )
    },
    {
      key: '2',
      label: 'Quản lý đơn hàng',
      children: (
        <Card styles={{ body: { padding: '16px' } }}>
          <Table dataSource={orders} columns={orderColumns} rowKey="id" loading={loadingOrders} pagination={{ pageSize: 6 }} scroll={{ x: 'max-content' }} />
        </Card>
      )
    }
  ];

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Top Header Layer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, background: '#ffffff', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div>
          <span style={{ fontSize: '24px', fontWeight: 900, color: '#DC2626' }}>Bảng quản trị (Admin Panel)</span>
          <br />
          <span style={{ color: '#64748b', fontSize: '14px' }}>Hệ thống theo dõi doanh thu, thông số sản phẩm và xử lý đơn hàng</span>
        </div>
        <Button danger type="primary" icon={<LogoutOutlined />} onClick={handleAdminLogout} style={{ fontWeight: 600, borderRadius: '8px' }}>
          Đăng xuất Admin
        </Button>
      </div>

      {/* Stats Cards Section */}
      <StatsCards stats={stats} loadingStats={loadingStats} />

      <Tabs defaultActiveKey="stats" items={tabsItems} type="card" />

      <Modal
        title={editingProductId ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm mới'}
        open={modalOpen}
        onOk={handleModalSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingProductId ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy bỏ"
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'ACTIVE' }}>
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
                <InputNumber min={1} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} parser={value => value.replace(/\./g, '')} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="stockQuantity" label="Số lượng tồn kho" rules={[{ required: true, message: 'Nhập số lượng tồn kho' }]}>
                <InputNumber min={0} precision={0} style={{ width: '100%' }} />
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

          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Option value="ACTIVE">HOẠT ĐỘNG</Option>
              <Option value="INACTIVE">TẠM KHÓA</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
