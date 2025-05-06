import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Notification } from "@/types/notification";

interface NotificationCardProps {
  notification: Notification;
  language: string;
  onAccept?: (id: number) => void;
  onDeny?: (id: number) => void;
  onMarkAsRead?: (id: number) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  language,
  onAccept,
  onDeny,
  onMarkAsRead,
}) => {
  const { id, patient, doctor, service_type, note, timestamp, status, type, organization, appointment_date } = notification;

  const timeAgo = timestamp
    ? formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: language === "ar" ? ar : enUS,
      })
    : "";

  return (
    <Card className={`mb-4 ${status === 'unread' ? 'border-l-4 border-l-blue-500' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">
            {language === "ar" ? "إشعار" : type === 'consultation' ? 'Consultation Request' : type === 'suggestion' ? 'Doctor Suggestion' : 'Response'}
          </CardTitle>
          <p className="text-sm text-gray-500">{timeAgo}</p>
        </div>
        {status === 'unread' && onMarkAsRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkAsRead(id)}
            className="text-blue-500 hover:text-blue-600"
          >
            {language === "ar" ? "تحديد كمقروء" : "Mark as read"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {patient && (
            <p>
              <strong>{language === "ar" ? "المريض:" : "Patient:"}</strong> {patient}
            </p>
          )}
          {doctor && (
            <p>
              <strong>{language === "ar" ? "الطبيب:" : "Doctor:"}</strong> {doctor}
            </p>
          )}
          {organization && (
            <p>
              <strong>{language === "ar" ? "المستشفى:" : "Hospital:"}</strong> {organization.name}
            </p>
          )}
          {service_type && (
            <p>
              <strong>{language === "ar" ? "نوع الخدمة:" : "Service Type:"}</strong>{" "}
              {service_type}
            </p>
          )}
          {appointment_date && (
            <p>
              <strong>{language === "ar" ? "موعد:" : "Appointment:"}</strong>{" "}
              {new Date(appointment_date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
            </p>
          )}
          {note && (
            <p>
              <strong>{language === "ar" ? "ملاحظة:" : "Note:"}</strong> {note}
            </p>
          )}
        </div>
      </CardContent>
      {(onAccept || onDeny) && (
        <CardFooter className="flex justify-end gap-2">
          {onAccept && (
            <Button
              onClick={() => onAccept(id)}
              className="bg-green-500 hover:bg-green-600"
            >
              {language === "ar" ? "قبول" : "Accept"}
            </Button>
          )}
          {onDeny && (
            <Button
              onClick={() => onDeny(id)}
              variant="destructive"
            >
              {language === "ar" ? "رفض" : "Deny"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default NotificationCard;