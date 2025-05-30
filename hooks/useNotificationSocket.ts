import { useState, useEffect } from 'react';

interface Translation {
  consultation_request_id?: number;
  message: string;
  [key: string]: any;
}

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
  translations?: {
    en: Translation;
    ar: Translation;
  };
  uniqueKey?: string; // Added for duplicate checking
}

interface UseNotificationSocketProps {
  userId: string;
  userType: 'patient' | 'doctor' | 'hospital';
}

export const useNotificationSocket = ({ userId, userType }: UseNotificationSocketProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newNotificationCount, setNewNotificationCount] = useState(0);

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
        endpoints = [
          `${baseUrl}/patient-doctor-suggest/${userId}`,
          `${baseUrl}/patient-doctor-response/${userId}`,   
          `${baseUrl}/hospital-response-second-opinion-request-user/${userId}`, 
        ];
        break;
      case 'doctor':
        endpoints = [
          `${baseUrl}/doctor-second-opinion-request-assigned/${userId}/`,          
        ];
        break;
      case 'hospital':
        endpoints = [
          `${baseUrl}/hospital-selected-by-doctor/${userId}/`,
          `${baseUrl}/hospital-new-second_opinion/${userId}/`,
          `${baseUrl}/doctor-response-second-opinion-request-hospital-staff/${userId}/`,
          `${baseUrl}/user-accept-second-opinion-request-hospital/${userId}/`,
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
            
            // Create a unique key based on the message content and consultation ID
            const consultationId = data.translations?.en?.consultation_request_id || 
                                 data.translations?.ar?.consultation_request_id ||
                                 data.data?.consultation_request_id;
            const uniqueKey = `${data.message}_${consultationId}`;

            // Process the notification with translations
            const notification: Notification = {
              id: Date.now(),
              message: data.message || 'New notification',
              status: 'unread',
              timestamp: new Date().toISOString(),
              data: data,
              ...(data.data || {}), // Spread any additional data fields
              translations: data.translations || {
                en: { message: data.message || 'New notification' },
                ar: { message: data.message || 'إشعار جديد' }
              },
              uniqueKey // Add unique key for duplicate checking
            };
            
            // If translations exist in the data, use them
            if (data.translations) {
              notification.translations = {
                en: {
                  ...data.translations.en,
                  message: data.translations.en.message || data.message || 'New notification'
                },
                ar: {
                  ...data.translations.ar,
                  message: data.translations.ar.message || data.message || 'إشعار جديد'
                }
              };
            }
            
            console.log('Processed notification with translations:', notification);
            
            setNotifications(prev => {
              // Check if notification with same uniqueKey already exists
              const isDuplicate = prev.some(n => n.uniqueKey === uniqueKey);
              
              if (!isDuplicate) {
                setNewNotificationCount(count => count + 1); // Increment counter for new notifications
                return [notification, ...prev];
              }
              return prev;
            });
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
      prev.map((n) => {
        if (n.id === id && n.status === 'unread') {
          setNewNotificationCount(count => count - 1); // Decrement counter when marking as read
          return { ...n, status: 'read' };
        }
        return n;
      })
    );
  };

  const resetNotificationCount = () => {
    setNewNotificationCount(0);
  };

  return {
    notifications,
    isConnected,
    error,
    newNotificationCount,
    removeNotification,
    markAsRead,
    resetNotificationCount
  };
};