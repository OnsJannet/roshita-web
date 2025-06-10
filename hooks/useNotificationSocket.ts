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
  uniqueKey?: string;
  notification_date: string;
  notification_time: string;
  notification_day: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const MAX_CONNECTION_ATTEMPTS = 3;

  const getEndpoints = (type: string): string[] => {
    const baseUrl = 'wss://test-roshita.net:8080/ws/notifications';
    switch (type) {
      case 'patient':
        return [
          //`${baseUrl}/patient-doctor-suggest/${userId}`,
          //`${baseUrl}/patient-doctor-response/${userId}`,
          //`${baseUrl}/hospital-response-second-opinion-request-user/${userId}`,
          `${baseUrl}/patient/${userId}/`,
        ];
      case 'doctor':
        return [
          //`${baseUrl}/doctor-second-opinion-request-assigned/${userId}/`,
          `${baseUrl}/doctor/${userId}/`,
        ];
      case 'hospital':
        return [
          //`${baseUrl}/hospital-selected-by-doctor/${userId}/`,
          //`${baseUrl}/hospital-new-second_opinion/${userId}/`,
          //`${baseUrl}/doctor-response-second-opinion-request-hospital-staff/${userId}/`,
          //`${baseUrl}/user-accept-second-opinion-request-hospital/${userId}/`,
          `${baseUrl}/hospital/${userId}/`,
        ];
      default:
        return [];
    }
  };

  const formatNotificationDateTime = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return {
      date: now.toISOString().split('T')[0], // YYYY-MM-DD format
      time: now.toTimeString().slice(0, 5),  // HH:MM format
      day: days[now.getDay()]                // Full day name
    };
  };

  useEffect(() => {
    let sockets: WebSocket[] = [];
    let activeConnections = 0;
    let successfulConnections = 0;
    const totalEndpoints = getEndpoints(userType).length;

    const cleanup = () => {
      sockets.forEach(socket => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      });
    };

    if (!userId) {
      setIsLoading(false);
      return cleanup;
    }

    setIsLoading(true);
    setError(null);
    setConnectionAttempts(0);

    const endpoints = getEndpoints(userType);
    if (endpoints.length === 0) {
      setError('Invalid user type');
      setIsLoading(false);
      return cleanup;
    }

    const checkAllConnections = () => {
      if (successfulConnections === endpoints.length) {
        setIsLoading(false);
        setIsConnected(true);
      } else if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS * endpoints.length) {
        setError('Failed to establish all connections');
        setIsLoading(false);
      }
    };

    const connectWebSocket = (endpoint: string) => {
      try {
        const socket = new WebSocket(endpoint);
        sockets.push(socket);
        activeConnections++;

        socket.onopen = () => {
          console.log('WebSocket connected successfully:', endpoint);
          successfulConnections++;
          checkAllConnections();
        };

socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    console.log('Raw WebSocket message:', data);

    const translation = data.data?.translations?.en || data.data?.translations?.ar || {};
    const consultationId =
      translation.consultation_request_id || data.data?.consultation_request_id || 'unknown';
    const messageContent =
      translation.message || data.message || 'New notification';
    const uniqueKey = `${consultationId}_${messageContent}`;
    const { date, time, day } = formatNotificationDateTime();

    const notification: Notification = {
      id: Date.now(),
      message: messageContent,
      status: 'unread',
      timestamp: new Date().toISOString(),
      data: data.data,
      translations: data.data?.translations || {
        en: { message: 'New notification' },
        ar: { message: 'إشعار جديد' },
      },
      uniqueKey,
      notification_date: date,
      notification_time: time,
      notification_day: day,

      // Add details manually from translation
      patient: translation.patient,
      doctor: translation.doctor,
      service_type: translation.service_type,
      note: translation.diagnosis_description_response,
      status: translation.status,
    };

    console.log('Constructed notification:', notification);

    setNotifications((prev) => {
      const isDuplicate = prev.some((n) => {
        const isSameKey = n.uniqueKey === uniqueKey;
        const isRecentDuplicate =
          isSameKey && Date.now() - new Date(n.timestamp || 0).getTime() < 5000;
        return isRecentDuplicate;
      });

      if (!isDuplicate) {
        console.log('Adding new notification:', notification);
        setNewNotificationCount((count) => count + 1);
        return [notification, ...prev];
      } else {
        console.log('Duplicate notification detected, skipping:', notification);
        return prev;
      }
    });
  } catch (parseError) {
    console.error('Error parsing WebSocket message:', parseError, event.data);
  }
};


        socket.onerror = () => {
          activeConnections--;
          setConnectionAttempts(prev => prev + 1);
          setTimeout(() => {
            if (connectionAttempts < MAX_CONNECTION_ATTEMPTS * endpoints.length) {
              connectWebSocket(endpoint);
            } else {
              checkAllConnections();
            }
          }, 5000);
        };

        socket.onclose = () => {
          activeConnections--;
        };

      } catch (err) {
        console.error('WebSocket connection failed:', err);
        setConnectionAttempts(prev => prev + 1);
        setTimeout(() => {
          if (connectionAttempts < MAX_CONNECTION_ATTEMPTS * endpoints.length) {
            connectWebSocket(endpoint);
          } else {
            checkAllConnections();
          }
        }, 5000);
      }
    };

    endpoints.forEach(endpoint => connectWebSocket(endpoint));

    return cleanup;
  }, [userId, userType]);

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => {
        if (n.id === id && n.status === 'unread') {
          setNewNotificationCount(count => count - 1);
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
    resetNotificationCount,
    isLoading
  };
};