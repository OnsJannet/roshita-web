
# 🛎️ Notification System Documentation

This documentation explains the WebSocket-based real-time notification system in your healthcare platform for consultations and doctor suggestions.

---

## 🔌 WebSocket Endpoints (Django Channels)

| URL Pattern | Consumer Class | Group Format | Purpose |
|-------------|----------------|--------------|---------|
| `wss://www.test-roshita.net/ws/notifications/patient-doctor-suggest/<user_id>/` | PatientDoctorSuggestConsumer | `patient_doctor_suggest_user_<user_id>` | Patient gets notified of new doctor suggestions. |
| `wss://www.test-roshita.net/ws/notifications/doctor-consultation-request-assigned/<doctor_id>/` | DoctorConsultationRequestAssignedConsumer | `consultation_request_assigned_doctor_<doctor_id>` | Doctor gets notified when assigned a consultation. |
| `wss://www.test-roshita.net/ws/notifications/doctor-consultation-response-accepted/<user_id>/` | DoctorConsultationResponseConsumer | `doctor_consultation_response_doctor_<user_id>` | Patient gets notified of doctor's consultation response. |
| `wss://www.test-roshita.net/ws/notifications/patient-doctor-response/<user_id>/` | PatientConsultationRequestHospitalAcceptedConsumer | `patient_consultation_request_hospital_accepted_user_<user_id>` | Patient gets notified when hospital accepts consultation. |
| `wss://www.test-roshita.net/ws/notifications/hospital-new-consultation/<org_id>/` | HospitalNewConsultationNotificationConsumer | `new_consultation_medical_org_<org_id>` | Hospital gets notified of a new consultation. |
| `wss://www.test-roshita.net/ws/notifications/hospital-selected-by-doctor/<org_id>/` | HospitalSelectedByDoctorConsumer | `hospital_selected_by_doctor_<org_id>` | Hospital gets notified when selected by a doctor. |

---

## 🧠 Notification Flow Overview

1. **Patient submits a consultation request**
   - No immediate WebSocket notification.
   - Notification goes to the hospital via API logic.

2. **Hospital accepts a consultation request** (`AcceptConsultationRequestView`)
   - Sends WebSocket message to:
     - `patient_consultation_request_hospital_accepted_user_<user_id>` (notifies patient).
     - `consultation_request_assigned_doctor_<doctor_id>` (notifies doctor).

3. **Doctor responds to the consultation** (`DoctorResponseConsultationRequestView`)
   - Sends WebSocket message to:
     - `doctor_consultation_response_doctor_<user_id>` (notifies patient).

4. **Patient accepts the doctor's offer** (`AcceptDoctorConsultationOfferView`)
   - Finalizes payment/reservation.
   - _No WebSocket triggered (optional to add)._

5. **Doctor submits a treatment suggestion** (`DoctorSuggestViewSet.perform_create`)
   - Notifies:
     - Patient via `patient_doctor_suggest_user_<user_id>`.
     - Hospital via `hospital_selected_by_doctor_<org_id>`.

6. **Hospital accepts the suggestion** (`HospitalAcceptDoctorSuggestView`)
   - Notifies patient via `doctor_suggest_user_<user_id>`.

---

## 📤 WebSocket Message Format

All `send_notification` events use a common structure:

```json
{
  "type": "send_notification",
  "data": {
    "message": "String",
    "patient": "John Doe",
    "doctor": "Dr. Smith",
    "appointment_date": "2025-05-05T10:00:00Z",
    "organization": {
      "id": 12,
      "name": "Tunis Care Hospital"
    },
    "consultation_request_id": 44,
    "status": "Reviewed"
  }
}
```

> 🔔 Fields vary depending on the context (consultation accepted, suggestion sent, etc.).

---

## 📥 API Endpoints That Trigger Notifications

| Endpoint | View | Method | Purpose |
|----------|------|--------|---------|
| `/api/consultation-request/<id>/accept/` | AcceptConsultationRequestView | POST | Notifies patient + doctor |
| `/api/consultation-response/<id>/doctor-response/` | DoctorResponseConsultationRequestView | POST | Notifies patient |
| `/api/doctor-suggest/` | DoctorSuggestViewSet | POST | Notifies patient + hospital |
| `/api/doctor-suggest/<id>/hospital-accept/` | HospitalAcceptDoctorSuggestView | POST | Notifies patient |

---

## ✅ WebSocket Authentication

WebSocket connections are based on URL parameters like `user_id`, `doctor_id`, or `org_id`.

Authentication must be enforced at the consumer level using:
- Django Channels middlewares
- Scope user validation _(not shown but recommended)_
