import React from 'react';
import { Card, Row, Col, Progress, Space } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import { formatVND } from '../../utils/format';

export default function RevenueChart({ stats }) {
  // SVG Line Chart rendering helper
  const renderLineChart = (dataPoints) => {
    if (!dataPoints || dataPoints.length === 0) {
      return (
        <div style={{ height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8' }}>
          Chưa có dữ liệu doanh số theo ngày
        </div>
      );
    }

    const width = 600;
    const height = 220;
    const padding = 30;

    const maxVal = Math.max(...dataPoints.map(p => p.revenue), 1000000); // min height representation
    const minVal = 0;

    const points = dataPoints.map((p, idx) => {
      const x = padding + (idx * (width - 2 * padding)) / Math.max(dataPoints.length - 1, 1);
      const y = height - padding - ((p.revenue - minVal) * (height - 2 * padding)) / maxVal;
      return { x, y, label: p.date, val: p.revenue };
    });

    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ background: '#f8fafc', borderRadius: '8px' }}>
        {/* Horizontal grids */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e2e8f0" strokeDasharray="3,3" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#e2e8f0" strokeDasharray="3,3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#cbd5e1" strokeWidth="2" />

        {/* Line */}
        <polyline fill="none" stroke="#DC2626" strokeWidth="3" points={polylinePoints} />

        {/* Markers */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="5" fill="#DC2626" stroke="#ffffff" strokeWidth="2" />
            {/* Tooltip revenue text */}
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fill="#0f172a" fontWeight="bold">
              {idx === 0 || idx === points.length - 1 || dataPoints.length < 8 ? (p.val / 1000000).toFixed(1) + 'M' : ''}
            </text>
            {/* Date label */}
            <text x={p.x} y={height - 10} textAnchor="middle" fontSize="9" fill="#64748b">
              {p.label.substring(5)}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <Row gutter={[16, 16]}>
      {/* Left Col: Line Chart */}
      <Col xs={24} lg={15}>
        <Card title={<span style={{ fontWeight: 700 }}><LineChartOutlined /> Biểu đồ xu hướng doanh thu hàng ngày</span>} styles={{ body: { padding: '16px' } }}>
          {stats ? renderLineChart(stats.revenueTimeSeries) : <div style={{ height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Đang tải biểu đồ...</div>}
        </Card>
      </Col>

      {/* Right Col: Category breakdown */}
      <Col xs={24} lg={9}>
        <Card title={<span style={{ fontWeight: 700 }}>Doanh số theo phân mục</span>} styles={{ body: { padding: '24px 16px' } }} style={{ height: '100%' }}>
          {stats ? (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>Cầu lông (Badminton)</span>
                  <span style={{ fontWeight: 700 }}>{formatVND(stats.categorySales?.Badminton)}</span>
                </div>
                <Progress 
                  percent={
                    stats.totalRevenue > 0 
                      ? Math.round((stats.categorySales?.Badminton || 0) * 100 / stats.totalRevenue) 
                      : 0
                  } 
                  strokeColor="#DC2626" 
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>Quần vợt (Tennis)</span>
                  <span style={{ fontWeight: 700 }}>{formatVND(stats.categorySales?.Tennis)}</span>
                </div>
                <Progress 
                  percent={
                    stats.totalRevenue > 0 
                      ? Math.round((stats.categorySales?.Tennis || 0) * 100 / stats.totalRevenue) 
                      : 0
                  } 
                  strokeColor="#0284c7" 
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>Pickleball</span>
                  <span style={{ fontWeight: 700 }}>{formatVND(stats.categorySales?.Pickleball)}</span>
                </div>
                <Progress 
                  percent={
                    stats.totalRevenue > 0 
                      ? Math.round((stats.categorySales?.Pickleball || 0) * 100 / stats.totalRevenue) 
                      : 0
                  } 
                  strokeColor="#16a34a" 
                />
              </div>
            </Space>
          ) : (
            <div>Đang tải thống kê...</div>
          )}
        </Card>
      </Col>
    </Row>
  );
}
