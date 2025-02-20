import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface Notification {
  id: number;
  patient: string;
  doctor: string;
  service_type: string;
  note: string;
}

interface NotificationCardProps {
  notification: Notification;
  language: string;
  onAccept: (id: number) => void;
  onDeny: (id: number) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  language,
  onAccept,
  onDeny,
}) => {
  const { id, patient, doctor, service_type, note } = notification;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          {language === "ar" ? "إشعار جديد" : "New Notification"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>{language === "ar" ? "المريض:" : "Patient:"}</strong> {patient}
        </p>
        <p>
          <strong>{language === "ar" ? "الطبيب:" : "Doctor:"}</strong> {doctor}
        </p>
        <p>
          <strong>{language === "ar" ? "نوع الخدمة:" : "Service Type:"}</strong>{" "}
          {service_type}
        </p>
        <p>
          <strong>{language === "ar" ? "ملاحظة:" : "Note:"}</strong> {note}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          onClick={() => onAccept(id)}
          className="bg-green-500 hover:bg-green-600"
        >
          {language === "ar" ? "قبول" : "Accept"}
        </Button>
        <Button
          onClick={() => onDeny(id)}
          className="bg-red-500 hover:bg-red-600"
        >
          {language === "ar" ? "رفض" : "Deny"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationCard;