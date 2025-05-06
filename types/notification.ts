export interface Notification {
  id: number;
  patient: string;
  doctor: string;
  service_type: string;
  note: string;
  timestamp?: string;
  status?: 'unread' | 'read';
  type?: 'consultation' | 'suggestion' | 'response';
  organization?: {
    id: number;
    name: string;
  };
  consultation_request_id?: number;
  appointment_date?: string;
}

export interface NotificationResponse {
  type: 'send_notification';
  data: Notification;
}

export type UserType = 'patient' | 'doctor' | 'hospital';