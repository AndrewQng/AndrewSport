import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Space } from 'antd';
import { MessageOutlined, SendOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import api from '../services/api';

export default function ChatbotDrawer() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState(() => {
    const savedLog = localStorage.getItem('assistant_chat_log');
    return savedLog ? JSON.parse(savedLog) : [
      { sender: 'bot', text: 'Xin chào! Tôi là Trợ lý AI AndrewSport. Hãy hỏi tôi bất kỳ điều gì về dụng cụ Cầu lông (như các dòng Yonex Astrox, Lining Axforce), Tennis hoặc Pickleball!' }
    ];
  });
  const [loading, setLoading] = useState(false);
  
  const logEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('assistant_chat_log', JSON.stringify(chatLog));
  }, [chatLog]);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog, open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatWindowRef.current && 
        !chatWindowRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

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

  const handleClearHistory = () => {
    const defaultLog = [
      { sender: 'bot', text: 'Xin chào! Tôi là Trợ lý AI AndrewSport. Hãy hỏi tôi bất kỳ điều gì về dụng cụ Cầu lông (như các dòng Yonex Astrox, Lining Axforce), Tennis hoặc Pickleball!' }
    ];
    setChatLog(defaultLog);
  };

  return (
    <>
      {/* Custom Premium Floating AI Chatbot Trigger */}
      <div 
        ref={triggerRef}
        onClick={() => setOpen(prev => !prev)}
        className="chatbot-float-trigger"
      >
        <MessageOutlined style={{ fontSize: '20px' }} />
        <span className="hide-on-mobile">Hỏi Trợ lý AI</span>
      </div>

      {/* Floating Chatbot Window */}
      <div 
        ref={chatWindowRef}
        className={`chatbot-window ${open ? 'open' : ''}`}
      >
        <div className="chatbot-header">
          <div className="chatbot-header-title">
            <span>🤖 Trợ lý AI AndrewSport</span>
            {loading && <span style={{ fontSize: '11px', opacity: 0.8 }}>(Đang soạn...)</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {chatLog.length > 1 && (
              <button 
                className="chatbot-header-close"
                onClick={handleClearHistory}
                title="Xóa lịch sử chat"
                style={{ fontSize: '14px' }}
              >
                <DeleteOutlined />
              </button>
            )}
            <button 
              className="chatbot-header-close"
              onClick={() => setOpen(false)}
              title="Đóng"
            >
              <CloseOutlined />
            </button>
          </div>
        </div>

        <div className="chatbot-body">
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

        <div className="chatbot-footer">
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
      </div>
    </>
  );
}
