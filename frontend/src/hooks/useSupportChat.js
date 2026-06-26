import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import api from '../services/api';

/**
 * Hook for live support chat.
 * @param {string|null} userId - the customer's userId (from auth). null = not connected.
 * @param {string} role - 'USER' | 'ADMIN'
 */
export function useSupportChat(userId, role) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  const loadHistory = useCallback(async (uid) => {
    if (!uid) return;
    try {
      const url = role === 'ADMIN' ? `/support/history/${uid}` : '/support/history';
      const res = await api.get(url);
      setMessages(res.data);
    } catch (e) {
      console.error('Support chat history error', e);
    }
  }, [role]);

  useEffect(() => {
    if (!userId) return;

    loadHistory(userId);

    const token = role === 'ADMIN'
      ? localStorage.getItem('admin_token')
      : localStorage.getItem('token');

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        stompClient.subscribe(`/topic/support/${userId}`, (frame) => {
          const msg = JSON.parse(frame.body);
          setMessages((prev) => [...prev, msg]);
        });
      },
      onDisconnect: () => setConnected(false),
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [userId, role]);

  const sendMessage = useCallback((content, targetUserId = null) => {
    if (!clientRef.current?.connected || !content.trim()) return;

    const headers = {};
    if (role === 'ADMIN' && targetUserId) {
      headers.targetUserId = targetUserId;
    }

    clientRef.current.publish({
      destination: '/app/support.send',
      headers,
      body: JSON.stringify({ content }),
    });
  }, [role]);

  return { messages, connected, sendMessage, loadHistory };
}
