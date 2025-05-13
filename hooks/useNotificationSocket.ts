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
    let sockets: WebSocket[] = [];

    if (!userId) {
      setError('User ID is required for WebSocket connection');
      return;
    }

    let baseUrl = 'wss://test-roshita.net:8080/ws/notifications';
    let endpoints: string[] = [];

    // Set up appropriate endpoints based on user type
    switch (userType) {
      case 'patient':
        // Patient receives notifications from multiple endpoints
        endpoints = [
          `${baseUrl}/patient-doctor-suggest/${userId}`,
          `${baseUrl}/doctor-consultation-response-accepted/${userId}`,
          `${baseUrl}/patient-doctor-response/${userId}`
        ];
        break;
      case 'doctor':
        // Doctor receives notifications when assigned to consultations
        endpoints = [
          `${baseUrl}/doctor-consultation-request-assigned/${userId}/`
        ];
        break;
      case 'hospital':
        // Hospital receives notifications for new consultations and when selected by doctors
        endpoints = [
          `${baseUrl}/hospital-new-consultation/${userId}/`,
          `${baseUrl}/hospital-selected-by-doctor/${userId}/`
        ];
        break;
      default:
        setError('Invalid user type');
        return;
    }

    const connectWebSocket = (endpoint: string) => {
      try {
        console.log('Attempting to connect to WebSocket at:', endpoint);
        
        const socket = new WebSocket(endpoint);
        sockets.push(socket);

        socket.onopen = () => {
          setIsConnected(true);
          setError(null);
          console.log('WebSocket connected successfully:', endpoint);
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
          setTimeout(() => connectWebSocket(endpoint), 5000);
        };

        return socket;
      } catch (err) {
        console.error('WebSocket connection failed:', err);
        setError('Failed to establish WebSocket connection');
        setIsConnected(false);
        setTimeout(() => connectWebSocket(endpoint), 5000);
        return null;
      }
    };

    // Connect to all relevant endpoints
    endpoints.forEach(endpoint => {
      connectWebSocket(endpoint);
    });

    return () => {
      // Clean up all socket connections
      sockets.forEach(socket => {
        if (socket) {
          socket.close();
        }
      });
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