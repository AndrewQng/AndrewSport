import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Input, Button, Space, Typography, FloatButton } from 'antd';
import { MessageOutlined, SendOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Text } = Typography;

export default function ChatbotDrawer() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'bot', text: 'Xin chào! Tôi là Trợ lý Ảo AndrewSport. Hãy hỏi tôi bất kỳ điều gì về dụng cụ Cầu lông (như các dòng Yonex Astrox, Lining Axforce), Tennis hoặc Pickleball!' }
  ]);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const logEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog, open]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userText = message;
    setMessage('');
    setChatLog(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await api.post('/chat', { message: userText });
      const botText = response.data.reply;
      setChatLog(prev => [...prev, { sender: 'bot', text: botText }]);
    } catch (error) {
      setChatLog(prev => [...prev, { sender: 'bot', text: "Xin lỗi, hiện tại hệ thống AI đang bận. Bạn có thể hỏi tôi về các thông số vợt Yonex Astrox, Lining Axforce hay vợt Pickleball nhé!" }]);
    } finally {
      setLoading(false);
    }
  };

  const drawerWidth = width < 576 ? '100%' : 380;

  return (
    <>
      {/* Custom Premium Floating AI Chatbot Trigger */}
      <div 
        onClick={() => setOpen(true)}
        className="chatbot-float-trigger"
      >
        <MessageOutlined style={{ fontSize: '20px' }} />
        <span className="hide-on-mobile">Hỏi Trợ lý AI</span>
      </div>

      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🤖 Trợ lý AndrewSport</span>
            {loading && <Text type="secondary" style={{ fontSize: '12px' }}>(Đang soạn tin...)</Text>}
          </div>
        }
        placement="right"
        width={drawerWidth}
        onClose={() => setOpen(false)}
        open={open}
        styles={{ body: { display: 'flex', flexDirection: 'column', padding: '16px' } }}
      >
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
          {chatLog.map((chat, idx) => (
            <div 
              key={idx} 
              className={chat.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}
            >
              {chat.text}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input 
              placeholder="Hỏi về sản phẩm, giá bán..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onPressEnter={handleSend}
              disabled={loading}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              onClick={handleSend}
              loading={loading}
              style={{ background: '#DC2626', borderColor: '#DC2626' }}
            />
          </Space.Compact>
        </div>
      </Drawer>
    </>
  );
}
