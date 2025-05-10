import { useState, useEffect } from 'react';

interface Notification {
  id: number;
  patient?: string;
  doctor?: string;
  service_type?: string;
  note?: string;
  timestamp?: string;
  status?: string;
  message: string;
  data?: any;
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

    if (!userId) {
      setError('User ID is required for WebSocket connection');
      return;
    }

    let baseUrl = 'wss://test-roshita.net:8080/ws/notifications';
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
      default:
        setError('Invalid user type');
        return;
    }

    const connectWebSocket = () => {
      try {
        console.log('Attempting to connect to WebSocket at:', endpoint);
        
        socket = new WebSocket(endpoint);

        socket.onopen = () => {
          setIsConnected(true);
          setError(null);
          console.log('WebSocket connected successfully');
        };

        socket.onmessage = (event) => {
          console.log('Raw WebSocket message:', event.data);
          try {
            const data = JSON.parse(event.data);
            console.log('Parsed WebSocket message:', data);
            
            const notification: Notification = {
              id: Date.now(),
              message: data.message || 'New notification',
              status: 'unread',
              timestamp: new Date().toISOString(),
              data: data,
              ...(data.data || {}) // Spread any additional data fields
            };
            
            console.log('Processed notification:', notification);
            setNotifications((prev) => [notification, ...prev]);
          } catch (parseError) {
            console.error('Error parsing WebSocket message:', parseError);
            console.log('Raw message that failed to parse:', event.data);
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError('WebSocket connection error');
          setIsConnected(false);
        };

        socket.onclose = (event) => {
          console.log('WebSocket closed:', event);
          setIsConnected(false);
          setTimeout(connectWebSocket, 5000);
        };
      } catch (err) {
        console.error('WebSocket connection failed:', err);
        setError('Failed to establish WebSocket connection');
        setIsConnected(false);
        setTimeout(connectWebSocket, 5000);
      }
    };

    connectWebSocket();

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