import React, { useState, useEffect } from 'react';
import { 
  Table, Tabs, Card, Button, Modal, Form, Input, InputNumber, 
  Select, Space, Popconfirm, Tag, Select as StatusSelect, message, 
  Row, Col, Image, Divider 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, ShoppingCartOutlined, 
  UserOutlined, DatabaseOutlined, LineChartOutlined, LogoutOutlined,
  DollarCircleOutlined, SafetyCertificateOutlined, CheckOutlined, CloseOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatVND, getOrderStatusTag, getProductImage } from '../utils/format';
import StatsCards from '../components/admin/StatsCards';
import RevenueChart from '../components/admin/RevenueChart';

const { Option } = Select;
const { TextArea } = Input;

export default function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  
  // Claims states
  const [refundClaims, setRefundClaims] = useState([]);
  const [warrantyClaims, setWarrantyClaims] = useState([]);
  const [loadingRefunds, setLoadingRefunds] = useState(false);
  const [loadingWarranties, setLoadingWarranties] = useState(false);

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  // Product modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingProductId, setEditingProductId] = useState(null);
  
  // Action Modal State (for entering admin comment during approve/reject)
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve_refund', 'reject_refund', 'approve_warranty', 'reject_warranty'
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

  const fetchRefundClaims = async () => {
    try {
      setLoadingRefunds(true);
      const response = await api.get('/refunds/admin/all');
      setRefundClaims(response.data);
    } catch (error) {
      console.error('Không thể tải yêu cầu hoàn tiền:', error);
    } finally {
      setLoadingRefunds(false);
    }
  };

  const fetchWarrantyClaims = async () => {
    try {
      setLoadingWarranties(true);
      const response = await api.get('/warranties/admin/all');
      setWarrantyClaims(response.data);
    } catch (error) {
      console.error('Không thể tải yêu cầu bảo hành:', error);
    } finally {
      setLoadingWarranties(false);
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

  // Open action modal
  const openActionModal = (type, claimId) => {
    setActionType(type);
    setSelectedClaimId(claimId);
    actionForm.resetFields();
    setActionModalOpen(true);
  };

  // Submit Claim Action (Approve/Reject)
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
          <img src={getProductImage(record)} alt={text} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
          <div>
            <span style={{ fontWeight: 600 }}>{text}</span>
            {record.isFlashSale && <Tag color="warning" style={{ marginLeft: 6, fontSize: '10px', fontWeight: 700 }}>⚡ FLASH SALE</Tag>}
            <br />
            <span style={{ fontSize: '11px', color: '#64748b' }}>Hãng {record.brand} | BH {record.warrantyPeriod || 12} tháng</span>
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
          <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>{id}</span>
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

  const refundClaimColumns = [
    {
      title: 'Thời gian yêu cầu',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateStr) => new Date(dateStr).toLocaleString('vi-VN')
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (id) => <Text style={{ fontFamily: 'monospace', fontSize: '12px' }}>{id}</Text>
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (name, record) => (
        <div>
          <span style={{ fontWeight: 600 }}>{name}</span>
          {record.sku && <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>SKU: {record.sku}</div>}
        </div>
      )
    },
    {
      title: 'Ảnh minh chứng (Cloudinary)',
      dataIndex: 'productImage',
      key: 'productImage',
      render: (imgUrl) => (
        <Image 
          src={imgUrl} 
          alt="Product intact" 
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} 
        />
      )
    },
    {
      title: 'Lý do hoàn tiền',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'PENDING') return <Tag color="warning">CHỜ DUYỆT</Tag>;
        if (status === 'APPROVED') return <Tag color="success">ĐÃ HOÀN TIỀN</Tag>;
        return <Tag color="error">ĐÃ TỪ CHỐI</Tag>;
      }
    },
    {
      title: 'Ghi chú Admin',
      dataIndex: 'adminComment',
      key: 'adminComment',
      render: (comment) => comment || '—'
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
                onClick={() => openActionModal('approve_refund', record.id)}
              >
                Duyệt
              </Button>
              <Button 
                type="primary" 
                danger 
                icon={<CloseOutlined />} 
                size="small" 
                onClick={() => openActionModal('reject_refund', record.id)}
              >
                Từ chối
              </Button>
            </Space>
          );
        }
        return <span style={{ color: '#94a3b8', fontSize: '12px' }}>Đã xử lý</span>;
      }
    }
  ];

  const warrantyClaimColumns = [
    {
      title: 'Thời gian yêu cầu',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateStr) => new Date(dateStr).toLocaleString('vi-VN')
    },
    {
      title: 'Mã bảo hành',
      dataIndex: 'warrantyCode',
      key: 'warrantyCode',
      render: (code) => <Tag color="blue" style={{ fontFamily: 'monospace' }}>{code}</Tag>
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Ảnh lỗi (Cloudinary)',
      dataIndex: 'productImage',
      key: 'productImage',
      render: (imgUrl) => (
        <Image 
          src={imgUrl} 
          alt="Product broken" 
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} 
        />
      )
    },
    {
      title: 'Mô tả lỗi',
      dataIndex: 'issueDescription',
      key: 'issueDescription'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'PENDING') return <Tag color="warning">ĐANG XỬ LÝ</Tag>;
        if (status === 'APPROVED') return <Tag color="success">ĐÃ BẢO HÀNH</Tag>;
        return <Tag color="error">ĐÃ TỪ CHỐI</Tag>;
      }
    },
    {
      title: 'Ghi chú Admin',
      dataIndex: 'adminComment',
      key: 'adminComment',
      render: (comment) => comment || '—'
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
                onClick={() => openActionModal('approve_warranty', record.id)}
              >
                Duyệt bảo hành
              </Button>
              <Button 
                type="primary" 
                danger 
                icon={<CloseOutlined />} 
                size="small" 
                onClick={() => openActionModal('reject_warranty', record.id)}
              >
                Từ chối
              </Button>
            </Space>
          );
        }
        return <span style={{ color: '#94a3b8', fontSize: '12px' }}>Đã xử lý</span>;
      }
    }
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
    },
    {
      key: '3',
      label: (
        <span>
          <DollarCircleOutlined /> Duyệt Hoàn tiền
        </span>
      ),
      children: (
        <Card styles={{ body: { padding: '16px' } }} title="Yêu cầu hoàn trả tiền từ người dùng (trong 7 ngày)">
          <Table 
            dataSource={refundClaims} 
            columns={refundClaimColumns} 
            rowKey="id" 
            loading={loadingRefunds} 
            pagination={{ pageSize: 5 }} 
            scroll={{ x: 'max-content' }}
          />
        </Card>
      )
    },
    {
      key: '4',
      label: (
        <span>
          <SafetyCertificateOutlined /> Duyệt Bảo hành
        </span>
      ),
      children: (
        <Card styles={{ body: { padding: '16px' } }} title="Yêu cầu dịch vụ bảo hành sản phẩm">
          <Table 
            dataSource={warrantyClaims} 
            columns={warrantyClaimColumns} 
            rowKey="id" 
            loading={loadingWarranties} 
            pagination={{ pageSize: 5 }} 
            scroll={{ x: 'max-content' }}
          />
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
          <span style={{ color: '#64748b', fontSize: '14px' }}>Hệ thống theo dõi doanh thu, thông số sản phẩm, bảo hành, hoàn tiền và xử lý đơn hàng</span>
        </div>
        <Button danger type="primary" icon={<LogoutOutlined />} onClick={handleAdminLogout} style={{ fontWeight: 600, borderRadius: '8px' }}>
          Đăng xuất Admin
        </Button>
      </div>

      {/* Stats Cards Section */}
      <StatsCards stats={stats} loadingStats={loadingStats} />

      <Tabs defaultActiveKey="stats" items={tabsItems} type="card" onChange={(key) => {
        if (key === '3') fetchRefundClaims();
        if (key === '4') fetchWarrantyClaims();
      }} />

      {/* PRODUCT ADD/EDIT MODAL */}
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
                <InputNumber min={1} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} parser={value => value.replace(/\./g, '')} style={{ width: '100%' }} />
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
              <Form.Item 
                noStyle 
                shouldUpdate={(prevValues, currentValues) => prevValues.isFlashSale !== currentValues.isFlashSale}
              >
                {({ getFieldValue }) => 
                  getFieldValue('isFlashSale') === true ? (
                    <Form.Item name="flashSalePrice" label="Giá bán Flash Sale (VND)" rules={[{ required: true, message: 'Nhập giá bán Flash Sale' }]}>
                      <InputNumber min={1} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} parser={value => value.replace(/\./g, '')} style={{ width: '100%' }} />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* --- ACTION PROCESSING MODAL (FOR REFUNDS AND WARRANTIES) --- */}
      <Modal
        title={
          <strong>
            {actionType.startsWith('approve') ? <Tag color="success">DUYỆT YÊU CẦU</Tag> : <Tag color="error">TỪ CHỐI YÊU CẦU</Tag>}
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
            rules={[{ required: actionType.startsWith('reject'), message: 'Vui lòng nhập lý do nếu từ chối yêu cầu!' }]}
          >
            <TextArea rows={4} placeholder="Nhập nhận xét, hướng dẫn gửi trả sản phẩm hoặc lý do từ chối..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
