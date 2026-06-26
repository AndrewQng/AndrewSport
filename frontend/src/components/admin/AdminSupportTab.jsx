import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button, Badge, Avatar, Spin, Empty, Tag } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from '../../services/api';

const { TextArea } = Input;
const BRAND = '#E95211';

export default function AdminSupportTab() {
  const [users, setUsers] = useState([]);           // list of chat users
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [connected, setConnected] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const bottomRef = useRef(null);

  // ── Load user list ────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/support/all-users');
      setUsers(res.data);
    } catch (e) {
      console.error('Failed to load chat users', e);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── WebSocket connection (admin) ──────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
    });
    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
      clientRef.current = null;
    };
  }, []);

  // ── Select a user → load history + subscribe to their topic ──────────────
  const selectUser = useCallback(async (chatUser) => {
    setSelectedUser(chatUser);
    setMessages([]);
    setLoadingMsgs(true);

    // Unsubscribe previous
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    // Load history (also marks USER messages as read)
    try {
      const res = await api.get(`/support/history/${chatUser.userId}`);
      setMessages(res.data);
    } catch (e) {
      console.error('Failed to load history', e);
    } finally {
      setLoadingMsgs(false);
    }

    // Subscribe to this user's topic
    if (clientRef.current?.connected) {
      subscriptionRef.current = clientRef.current.subscribe(
        `/topic/support/${chatUser.userId}`,
        (frame) => {
          const msg = JSON.parse(frame.body);
          setMessages((prev) => [...prev, msg]);
        }
      );
    }

    // Refresh user list to clear unread badge
    fetchUsers();
  }, [fetchUsers]);

  // Re-subscribe when STOMP connects after user already selected
  useEffect(() => {
    if (connected && selectedUser && !subscriptionRef.current && clientRef.current?.connected) {
      subscriptionRef.current = clientRef.current.subscribe(
        `/topic/support/${selectedUser.userId}`,
        (frame) => {
          const msg = JSON.parse(frame.body);
          setMessages((prev) => [...prev, msg]);
        }
      );
    }
  }, [connected, selectedUser]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputVal.trim() || !selectedUser || !clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: '/app/support.send',
      headers: { targetUserId: selectedUser.userId },
      body: JSON.stringify({ content: inputVal.trim() }),
    });
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', height: '65vh', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>

      {/* ── Left sidebar: user list ───────────────────────────────────────── */}
      <div style={{
        width: 260, borderRight: '1px solid #e2e8f0',
        background: '#f8fafc', overflowY: 'auto', flexShrink: 0,
      }}>
        <div style={{
          padding: '14px 16px', fontWeight: 700, fontSize: 13,
          color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em',
          borderBottom: '1px solid #e2e8f0',
        }}>
          Khách hàng đang chat
        </div>

        {loadingUsers && <Spin style={{ display: 'block', margin: '20px auto' }} />}

        {!loadingUsers && users.length === 0 && (
          <Empty description="Chưa có cuộc trò chuyện nào" style={{ marginTop: 40 }} />
        )}

        {users.map((u) => (
          <div
            key={u.userId}
            onClick={() => selectUser(u)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              background: selectedUser?.userId === u.userId ? '#fff7f5' : 'transparent',
              borderLeft: selectedUser?.userId === u.userId ? `3px solid ${BRAND}` : '3px solid transparent',
              display: 'flex', alignItems: 'center', gap: 10,
              transition: 'background 0.15s',
            }}
          >
            <Badge count={u.unreadCount} size="small" color={BRAND}>
              <Avatar icon={<UserOutlined />} style={{ background: '#fde8de', color: BRAND }} />
            </Badge>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {u.fullName || u.username}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>@{u.username}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Right: chat panel ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff' }}>

        {/* Header */}
        {selectedUser ? (
          <div style={{
            padding: '12px 18px', borderBottom: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#fff',
          }}>
            <Avatar icon={<UserOutlined />} style={{ background: '#fde8de', color: BRAND }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
                {selectedUser.fullName || selectedUser.username}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>@{selectedUser.username}</div>
            </div>
            <Tag
              color={connected ? 'success' : 'default'}
              style={{ marginLeft: 'auto', borderRadius: 20, fontSize: 11 }}
            >
              {connected ? '● Realtime' : '○ Đang kết nối...'}
            </Tag>
          </div>
        ) : (
          <div style={{
            padding: '12px 18px', borderBottom: '1px solid #e2e8f0',
            color: '#94a3b8', fontSize: 13,
          }}>
            Chọn khách hàng để bắt đầu trả lời
          </div>
        )}

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '16px',
          background: '#f8fafc',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {!selectedUser && (
            <div style={{ textAlign: 'center', marginTop: 60, color: '#94a3b8' }}>
              👈 Chọn khách hàng từ danh sách bên trái
            </div>
          )}

          {selectedUser && loadingMsgs && <Spin style={{ margin: '40px auto' }} />}

          {selectedUser && !loadingMsgs && messages.length === 0 && (
            <Empty description="Chưa có tin nhắn nào" style={{ marginTop: 40 }} />
          )}

          {messages.map((msg) => {
            const isAdmin = msg.senderRole === 'ADMIN';
            return (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: isAdmin ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '70%',
                  background: isAdmin ? BRAND : '#ffffff',
                  color: isAdmin ? '#fff' : '#1e293b',
                  borderRadius: isAdmin ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  padding: '9px 13px',
                  fontSize: 13,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  lineHeight: 1.5,
                }}>
                  {!isAdmin && (
                    <div style={{ fontSize: 10, color: '#64748b', marginBottom: 2, fontWeight: 600 }}>
                      {msg.senderUsername}
                    </div>
                  )}
                  {msg.content}
                  <div style={{ fontSize: 10, opacity: 0.65, marginTop: 3, textAlign: 'right' }}>
                    {new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {selectedUser && (
          <div style={{
            padding: '10px 14px', borderTop: '1px solid #e2e8f0',
            background: '#fff', display: 'flex', gap: 8, alignItems: 'flex-end',
          }}>
            <TextArea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập phản hồi cho khách hàng..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{ borderRadius: 10, fontSize: 13, resize: 'none' }}
              disabled={!connected}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!connected || !inputVal.trim()}
              style={{ background: BRAND, borderColor: BRAND, borderRadius: 10, height: 36, flexShrink: 0 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
