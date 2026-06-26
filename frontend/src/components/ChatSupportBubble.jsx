import React, { useState, useRef, useEffect } from 'react';
import { Badge, Input, Button, Spin, Tooltip } from 'antd';
import { MessageOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons';
import { useSupportChat } from '../hooks/useSupportChat';

const { TextArea } = Input;

const BRAND = '#E95211';

export default function ChatSupportBubble({ user }) {
  const [open, setOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef(null);

  const { messages, connected, sendMessage } = useSupportChat(
    user?.id ?? null,
    'USER'
  );

  // Count unread admin messages
  const unreadCount = messages.filter(m => m.senderRole === 'ADMIN' && !m.isRead).length;

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    sendMessage(inputVal.trim());
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user || user.role === 'ADMIN') return null;

  return (
    <>
      {/* Floating button */}
      <div style={{
        position: 'fixed', bottom: 90, right: 24, zIndex: 1200,
      }}>
        <Badge count={open ? 0 : unreadCount} offset={[-4, 4]}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={open ? <CloseOutlined /> : <MessageOutlined />}
            onClick={() => setOpen(!open)}
            style={{
              width: 56, height: 56, fontSize: 22,
              background: BRAND, borderColor: BRAND,
              boxShadow: '0 4px 20px rgba(233,82,17,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          />
        </Badge>
      </div>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 158, right: 24, zIndex: 1200,
          width: 360, height: 480,
          background: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUpChat 0.25s ease',
        }}>
          {/* Header */}
          <div style={{
            background: `linear-gradient(135deg, ${BRAND} 0%, #c94209 100%)`,
            padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: connected ? '#4ade80' : '#94a3b8',
              flexShrink: 0,
              boxShadow: connected ? '0 0 6px #4ade80' : 'none',
            }} />
            <div style={{ color: '#fff', flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Hỗ trợ AndrewSport</div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>
                {connected ? 'Đang kết nối' : 'Đang kết nối...'}
              </div>
            </div>
            <Button
              type="text" size="small"
              icon={<CloseOutlined style={{ color: '#fff' }} />}
              onClick={() => setOpen(false)}
              style={{ background: 'transparent', border: 'none' }}
            />
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '12px 14px',
            background: '#f8fafc',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center', color: '#94a3b8', fontSize: 13,
                marginTop: 40,
              }}>
                Xin chào! Bạn cần hỗ trợ gì? 👋
              </div>
            )}
            {messages.map((msg) => {
              const isMe = msg.senderRole === 'USER';
              return (
                <div key={msg.id} style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    maxWidth: '75%',
                    background: isMe ? BRAND : '#ffffff',
                    color: isMe ? '#fff' : '#1e293b',
                    borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    padding: '9px 13px',
                    fontSize: 13,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    lineHeight: 1.5,
                  }}>
                    {msg.content}
                    <div style={{
                      fontSize: 10, opacity: 0.65, marginTop: 3,
                      textAlign: 'right',
                    }}>
                      {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px',
            borderTop: '1px solid #e2e8f0',
            background: '#fff',
            display: 'flex', gap: 8, alignItems: 'flex-end',
          }}>
            <TextArea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              autoSize={{ minRows: 1, maxRows: 3 }}
              style={{ borderRadius: 10, fontSize: 13, resize: 'none' }}
              disabled={!connected}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!connected || !inputVal.trim()}
              style={{
                background: BRAND, borderColor: BRAND,
                borderRadius: 10, height: 36, flexShrink: 0,
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUpChat {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
