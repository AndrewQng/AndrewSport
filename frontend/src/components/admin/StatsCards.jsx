import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { LineChartOutlined, ShoppingCartOutlined, DatabaseOutlined, UserOutlined } from '@ant-design/icons';
import { formatVND } from '../../utils/format';

export default function StatsCards({ stats, loadingStats }) {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={12} sm={12} lg={6}>
        <Card bordered={false} style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <Statistic 
            title={<span style={{ color: '#64748b', fontWeight: 600 }}>Doanh thu thu về</span>}
            value={stats?.totalRevenue}
            formatter={formatVND}
            valueStyle={{ color: '#DC2626', fontWeight: 850 }}
            prefix={<LineChartOutlined />}
            loading={loadingStats}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} lg={6}>
        <Card bordered={false} style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <Statistic 
            title={<span style={{ color: '#64748b', fontWeight: 600 }}>Tổng đơn hàng</span>}
            value={stats?.totalOrders}
            valueStyle={{ color: '#0f172a', fontWeight: 800 }}
            prefix={<ShoppingCartOutlined style={{ color: '#3b82f6' }} />}
            loading={loadingStats}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} lg={6}>
        <Card bordered={false} style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <Statistic 
            title={<span style={{ color: '#64748b', fontWeight: 600 }}>Vợt & Sản phẩm kho</span>}
            value={stats?.activeProducts}
            valueStyle={{ color: '#10b981', fontWeight: 800 }}
            prefix={<DatabaseOutlined style={{ color: '#10b981' }} />}
            suffix={<span style={{ fontSize: '11px', color: '#94a3b8' }}> ({stats?.outOfStockProducts || 0} hết hàng)</span>}
            loading={loadingStats}
          />
        </Card>
      </Col>
      <Col xs={12} sm={12} lg={6}>
        <Card bordered={false} style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <Statistic 
            title={<span style={{ color: '#64748b', fontWeight: 600 }}>Khách hàng đăng ký</span>}
            value={stats?.totalUsers}
            valueStyle={{ color: '#6366f1', fontWeight: 800 }}
            prefix={<UserOutlined style={{ color: '#6366f1' }} />}
            loading={loadingStats}
          />
        </Card>
      </Col>
    </Row>
  );
}
