import { useState, useEffect } from 'react';

interface Notification {
  id: number;
  patient: string;
  doctor: string;
  service_type: string;
  note: string;
  timestamp?: string;
  status?: string;
}

interface UseNotificationSocketProps {
  userId: string;
  userType: 'patient' | 'doctor' | 'hospital';
}

export const useNotificationSocket = ({ userId, userType }: UseNotificationSocketProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let socket: WebSocket;
    let baseUrl = 'wss://test-roshita.net/ws/notifications';
    let endpoint = '';

    switch (userType) {
      case 'patient':
        endpoint = `${baseUrl}/patient-doctor-suggest/${userId}/`;
        break;
      case 'doctor':
        endpoint = `${baseUrl}/doctor-consultation-request-assigned/${userId}/`;
        break;
      case 'hospital':
        endpoint = `${baseUrl}/hospital-new-consultation/${userId}/`;
        break;
    }

    try {
      socket = new WebSocket(endpoint);

      socket.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'send_notification') {
          const notification = {
            id: data.data.id,
            patient: data.data.patient,
            doctor: data.data.doctor,
            service_type: data.data.service_type,
            note: data.data.note,
            timestamp: data.data.timestamp || new Date().toISOString(),
            status: data.data.status || 'unread'
          };
          setNotifications((prev) => [notification, ...prev]);
        }
      };

      socket.onerror = (error) => {
        setError('WebSocket connection error');
        setIsConnected(false);
      };

      socket.onclose = () => {
        setIsConnected(false);
      };
    } catch (err) {
      setError('Failed to establish WebSocket connection');
      setIsConnected(false);
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [userId, userType]);

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n))
    );
  };

  return {
    notifications,
    isConnected,
    error,
    removeNotification,
    markAsRead
  };
};