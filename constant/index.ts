export type Payment = {
  img: string;
  id: string;
  دكاترة: string;
  "تاريخ الانضمام": Date;
  التقييم: number;
  التخصص: string;
  المستشفى: string;
  الموقع: string;
  الهاتف: string;
  السعر: number;
};

type LabTest = {
  معرف_الفحص: string;
  اسم_الفحص: string;
  الفئة: string;
  النطاق_الطبيعي: string;
  الوحدة: string;
  الوصف: string;
  السعر: number;
};

type TestGroup = {
  معرف_المجموعة: string;
  اسم_المجموعة: string;
  الفحوصات_المشمولة: string[];
  الوصف: string;
  السعر: number;
};

type LabData = {
  lab_tests: LabTest[];
  test_groups: TestGroup[];
};

export const doctors = [
  {
    doctor_id: 1,
    name: "إيمان طنطاوي",
    specialty: "اسنان",
    hospital: "معمل تحليل B",
    rating: 4,
    reviewsCount: 10,
    price: "300.000",
    location: " تونس , تونس العاصمة",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/f065d5ae-01dd-4469-baa2-ca6fc2dfb1bc.png",
    appointment_dates: [
      "2024-09-05 16:56:00",
      "2024-09-04 10:53:00",
      "2024-09-04 14:29:00",
      "2024-09-08 09:11:00",
      "2024-09-05 17:49:00",
    ],
  },
  {
    doctor_id: 2,
    name: "نهي صدقي",
    specialty: "اسنان",
    rating: 5,
    reviewsCount: 25,
    hospital: "معمل تحليل B",
    price: "200.000",
    location: "تونس , تونس العاصمة",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/04e9052d-fadc-4685-985c-66f6eaa56668.png",
    appointment_dates: [
      "2024-09-08 12:02:00",
      "2024-09-03 10:35:00",
      "2024-09-06 09:47:00",
      "2024-09-08 16:45:00",
      "2024-09-02 16:01:00",
    ],
  },
  {
    doctor_id: 3,
    name: "احمد عز الرجال",
    specialty: "جراحة أورام",
    rating: 4.5,
    reviewsCount: 15,
    hospital: "مستشفى المختار",
    price: "800.000",
    location: "تونس , تونس العاصمة",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/5c5005fc-72c5-4737-bbfd-3b921c73479b.png",
    appointment_dates: [
      "2024-09-07 10:46:00",
      "2024-09-06 13:37:00",
      "2024-09-04 13:20:00",
      "2024-09-08 09:15:00",
      "2024-09-04 13:46:00",
    ],
  },
  {
    doctor_id: 4,
    name: "سلمى ممدوح",
    specialty: "جراحة أورام",
    hospital: "مستشفى المختار",
    rating: 4.2,
    reviewsCount: 18,
    price: "500.000",
    location: "تونس , تونس العاصمة",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/ce090d43-bfc0-4283-8dc4-da9d32958e2f.png",
    appointment_dates: [
      "2024-09-05 17:53:00",
      "2024-09-07 16:08:00",
      "2024-09-06 17:47:00",
      "2024-09-07 13:27:00",
      "2024-09-04 16:14:00",
    ],
  },
  {
    doctor_id: 5,
    name: "مصطفي ابوالليل",
    specialty: "جراحة اوعية دموية",
    hospital: "مستشفى المختار",
    rating: 3.8,
    reviewsCount: 12,
    price: "500.000",
    location: "طرابلس، ليبيا",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/1aa016d1-5de4-4a26-9ef6-c98e9c4fb9a6.png",
    appointment_dates: [
      "2024-09-04 09:40:00",
      "2024-09-08 12:42:00",
      "2024-09-03 14:36:00",
      "2024-09-08 12:56:00",
      "2024-09-08 12:47:00",
    ],
  },
  {
    doctor_id: 6,
    name: "احمد زكى",
    specialty: "جراحة اوعية دموية",
    hospital: "مستشفى المختار",
    rating: 4.7,
    reviewsCount: 22,
    price: "450.000",
    location: " تونس , تونس العاصمة",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/a34acb6f-042b-4e9d-9a2f-76cd1ca0fd68.png",
    appointment_dates: [
      "2024-09-08 12:30:00",
      "2024-09-07 10:08:00",
      "2024-09-02 12:08:00",
      "2024-09-06 11:48:00",
      "2024-09-03 17:09:00",
    ],
  },
  {
    doctor_id: 7,
    name: "اميرة السعيد",
    specialty: "نساء وتوليد",
    hospital: "مستشفى الشفاء",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/41e8c1de-30bc-4cf5-b01b-ff058206581e.png",
    rating: 4.9,
    reviewsCount: 30,
    price: "450.000",
    location: "سوسة",
    appointment_dates: [
      "2024-09-04 17:18:00",
      "2024-09-04 10:19:00",
      "2024-09-05 12:27:00",
      "2024-09-04 08:07:00",
      "2024-09-07 13:08:00",
    ],
  },
  {
    doctor_id: 8,
    name: "ياسمين فكرى",
    specialty: "نساء وتوليد",
    hospital: "مستشفى الشفاء",
    rating: 4.4,
    reviewsCount: 18,
    price: "450.000",
    location: "تونس , سوسة",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/abc552eb-7d91-418c-826e-a723a221f9bb.png",
    appointment_dates: [
      "2024-09-05 10:54:00",
      "2024-09-05 12:55:00",
      "2024-09-03 15:36:00",
      "2024-09-02 14:44:00",
      "2024-09-03 17:50:00",
    ],
  },
  {
    doctor_id: 9,
    name: "الهام يوسف",
    specialty: "سكر وغدد صماء",
    hospital: "مستشفى الشفاء",
    rating: 4.1,
    reviewsCount: 17,
    price: "500.000",
    location: "تونس , سوسة",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/0f28b746-eaec-4e98-a8dc-949981657e4f.png",
    appointment_dates: [
      "2024-09-07 15:27:00",
      "2024-09-05 12:55:00",
      "2024-09-03 15:31:00",
      "2024-09-07 13:58:00",
      "2024-09-06 09:03:00",
    ],
  },
  {
    doctor_id: 10,
    name: "احمد ابراهيم دويك",
    specialty: "سكر وغدد صماء",
    hospital: "مستشفى الشفاء",
    rating: 4.6,
    reviewsCount: 25,
    price: "500.000",
    location: "تونس , سوسة",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/c161f0a4-f144-464f-be39-c3bca1ffdc0c.png",
    appointment_dates: [
      "2024-09-06 12:39:00",
      "2024-09-02 08:34:00",
      "2024-09-06 12:58:00",
      "2024-09-07 14:58:00",
      "2024-09-08 14:47:00",
    ],
  },
  {
    doctor_id: 11,
    name: "ايمان جابر المشالي",
    specialty: "اسنان",
    hospital: "مستشفي النور",
    rating: 4.8,
    reviewsCount: 35,
    price: "100.000",
    location: "طرابلس",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/21cc4b93-70c4-428f-bac0-7e167be34774.png",
    appointment_dates: [
      "2024-09-02 13:12:00",
      "2024-09-03 17:20:00",
      "2024-09-05 12:38:00",
      "2024-09-05 10:36:00",
      "2024-09-06 16:16:00",
    ],
  },
  {
    doctor_id: 12,
    name: "ايمان عبد السلام",
    specialty: "اسنان",
    hospital: "مستشفى الشفاء",
    rating: 4.2,
    reviewsCount: 19,
    price: "100.000",
    location: "البيضاء، ليبيا",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/a8150e72-c792-405c-a38f-2f3393b66b50.png",
    appointment_dates: [
      "2024-09-07 17:14:00",
      "2024-09-05 10:38:00",
      "2024-09-05 17:16:00",
      "2024-09-07 13:12:00",
      "2024-09-02 08:27:00",
    ],
  },
  {
    doctor_id: 13,
    name: "إيمان السيد",
    specialty: "اسنان",
    hospital: "مستشفى الشفاء",
    rating: 4.3,
    reviewsCount: 21,
    price: "150.000",
    location: "مصراتة، ليبيا",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/3b8160f3-afcc-4857-b4f9-8f984642cf12.png",
    appointment_dates: [
      "2024-09-07 09:10:00",
      "2024-09-05 14:32:00",
      "2024-09-04 15:42:00",
      "2024-09-03 14:00:00",
      "2024-09-06 14:03:00",
    ],
  },
  {
    doctor_id: 14,
    name: "احمد محمد فريد",
    specialty: "جراحة أورام",
    hospital: "مستشفى المختار",
    rating: 4.7,
    reviewsCount: 26,
    price: "450.000",
    location: "تونس , سوسة",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/c19a9fec-4ce8-463e-996a-aa6d372beda5.png",
    appointment_dates: [
      "2024-09-03 14:22:00",
      "2024-09-04 10:12:00",
      "2024-09-03 14:29:00",
      "2024-09-08 14:44:00",
      "2024-09-05 14:05:00",
    ],
  },
  {
    doctor_id: 15,
    name: "حسين فخرى",
    specialty: "جراحة أورام",
    hospital: "مستشفى المختار",
    rating: 4.0,
    reviewsCount: 14,
    price: "500.000",
    location: "تونس , سوسة",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/ad01c202-7103-4551-9627-d89b29e3dd05.png",
    appointment_dates: [
      "2024-09-05 14:13:00",
      "2024-09-05 08:27:00",
      "2024-09-03 12:44:00",
      "2024-09-03 09:24:00",
      "2024-09-05 15:38:00",
    ],
  },
  {
    doctor_id: 16,
    name: "محمد بكر الجيزاوى",
    specialty: "جراحة أورام",
    hospital: "مستشفي النور",
    rating: 4.5,
    reviewsCount: 20,
    price: "400.000",

    location: "طرابلس",
    imageUrl: "/Images/drahmed.png",
    appointment_dates: [
      "2024-09-03 09:03:00",
      "2024-09-04 15:16:00",
      "2024-09-02 16:33:00",
      "2024-09-06 11:43:00",
      "2024-09-03 12:17:00",
    ],
  },
  {
    doctor_id: 17,
    name: "محمد ندا",
    specialty: "جراحة اوعية دموية",
    hospital: "مستشفي النور",
    rating: 4.6,
    reviewsCount: 29,
    price: "400.000",
    location: "طرابلس",
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/4861ef5d-3d0d-427f-a56b-60e39de8f4ca.png",
    appointment_dates: [
      "2024-09-05 16:29:00",
      "2024-09-03 13:29:00",
      "2024-09-03 12:24:00",
      "2024-09-07 16:49:00",
      "2024-09-03 10:53:00",
    ],
  },
  {
    doctor_id: 18,
    name: "رفيق جعفر",
    specialty: "جراحة اوعية دموية",
    hospital: "مستشفي النور",
    location: "طرابلس",
    address: null,
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/6eef593e-0910-4ed7-885e-45e550aec224.png",
    price: "400.000",
    rating: 4.6,
    reviewsCount: 29,
    appointment_dates: [
      "2024-09-02 16:54:00",
      "2024-09-03 14:41:00",
      "2024-09-08 08:44:00",
      "2024-09-03 15:37:00",
      "2024-09-06 13:48:00",
    ],
  },
  {
    doctor_id: 19,
    name: "سعد الحق",
    specialty: "جراحة اوعية دموية",
    hospital: "مستشفى الشفاء",
    location: "تونس , تونس العاصمة",
    address: null,
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/9734b75e-9b08-4c9b-927e-da180368b8ed.png",
    price: "300.000",
    rating: 4.6,
    reviewsCount: 29,
    appointment_dates: [
      "2024-09-05 10:17:00",
      "2024-09-05 11:20:00",
      "2024-09-05 13:43:00",
      "2024-09-06 16:16:00",
      "2024-09-02 13:17:00",
    ],
  },
  {
    doctor_id: 20,
    name: "محمد الحسيني",
    specialty: "سكر وغدد صماء",
    hospital: "مستشفى الشفاء",
    location: "تونس , تونس العاصمة",
    address: null,
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/fb99a5e1-7602-4ba6-a1ff-70ba0568b532.png",
    price: "700.000",
    rating: 4.6,
    reviewsCount: 29,
    appointment_dates: [
      "2024-09-02 14:52:00",
      "2024-09-04 11:46:00",
      "2024-09-05 09:56:00",
      "2024-09-03 13:27:00",
      "2024-09-05 16:00:00",
    ],
  },
  {
    doctor_id: 21,
    name: "مهند محمود",
    specialty: "سكر وغدد صماء",
    hospital: "مستشفى الشفاء",
    location: "تونس , تونس العاصمة",
    address: null,
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/84bcfc4a-9580-4096-a94b-c6554645ba22.png",
    price: "400.000",
    rating: 4.6,
    reviewsCount: 29,
    appointment_dates: [
      "2024-09-03 11:54:00",
      "2024-09-04 12:32:00",
      "2024-09-05 13:38:00",
      "2024-09-05 10:01:00",
      "2024-09-04 17:24:00",
    ],
  },
  {
    doctor_id: 23,
    name: "دعاء صلاح الدين محمود",
    specialty: "نساء وتوليد",
    hospital: "مستشفى الشفاء",
    location: "تونس , تونس العاصمة",
    address: null,
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/d7d42fc3-dfe8-4c8f-8bba-7147de678cde.png",
    price: "500.000",
    rating: 4.6,
    reviewsCount: 29,
    appointment_dates: [
      "2024-09-02 17:08:00",
      "2024-09-05 13:54:00",
      "2024-09-04 08:37:00",
      "2024-09-05 11:10:00",
      "2024-09-08 11:42:00",
    ],
  },
  {
    doctor_id: 24,
    name: "امانى السيد",
    specialty: "نساء وتوليد",
    hospital: "مستشفى الشفاء",
    location: "تونس , تونس العاصمة",
    address: null,
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/2b15d753-a898-4fbe-9a1e-c94c872ca1c7.png",
    price: "300.000",
    rating: 4.6,
    reviewsCount: 29,
    appointment_dates: [
      "2024-09-05 08:10:00",
      "2024-09-06 12:03:00",
      "2024-09-05 13:43:00",
      "2024-09-08 12:07:00",
      "2024-09-05 15:20:00",
    ],
  },
  {
    doctor_id: 25,
    name: "محمد محمود سامى",
    specialty: "نساء وتوليد",
    hospital: "مستشفي النور",
    location: "تونس , طرابلس",
    address: null,
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/f8f1550d-ef87-48b1-888a-b0a6f2fa5b8e.png",
    price: "500.000",
    rating: 4.6,
    reviewsCount: 29,
    appointment_dates: [
      "2024-09-04 13:03:00",
      "2024-09-08 09:56:00",
      "2024-09-07 17:09:00",
      "2024-09-06 09:39:00",
      "2024-09-07 16:15:00",
    ],
  },
  {
    doctor_id: 26,
    name: "عماد فريخة",
    specialty: "جراحة اوعية دموية",
    hospital: "مستشفى الحبيب بورقيبة",
    location: "تونس , صفاقس",
    address: null,
    imageUrl: "",
    price: "620.000",
    rating: 4.6,
    reviewsCount: 29,
    appointment_dates: [
      "2024-09-06 17:17:00",
      "2024-09-02 17:21:00",
      "2024-09-04 10:58:00",
      "2024-09-02 16:18:00",
      "2024-09-06 14:09:00",
    ],
  },
  {
    doctor_id: 27,
    name: "عمر حكموني",
    specialty: "اسنان",
    hospital: "مستشفى الحبيب بورقيبة",
    location: " تونس , صفاقس",
    address: null,
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/c214e0d1-a81f-4ea9-b5f9-33d4e85c7062.png",
    price: "500.000",
    rating: 4.6,
    reviewsCount: 29,
    appointment_dates: [
      "2024-09-05 17:04:00",
      "2024-09-02 17:38:00",
      "2024-09-07 13:18:00",
      "2024-09-04 11:56:00",
      "2024-09-05 14:45:00",
    ],
  },
  {
    doctor_id: 28,
    name: "نسرين شيخ روحه",
    specialty: "سكر وغدد صماء",
    hospital: "المركب الطبي ميديكال سيتي",
    location: "تونس , صفاقس",
    address: null,
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/71a9f9c4-c1f4-4ade-aaa7-2bac85f27bf5.png",
    price: "220.000",
    rating: 4.6,
    reviewsCount: 29,
    appointment_dates: [
      "2024-09-04 15:59:00",
      "2024-09-04 13:18:00",
      "2024-09-07 15:35:00",
      "2024-09-04 16:18:00",
      "2024-09-03 16:28:00",
    ],
  },
  {
    doctor_id: 29,
    name: "شهيدة بن نصر",
    specialty: "نساء وتوليد",
    hospital: "المركب الطبي ميديكال سيتي",
    location: "تونس , صفاقس",
    address: null,
    imageUrl:
      "https://test-roshita.net/media/media/avatar/staff/73757796-1a2d-49c3-8813-1fa85e5c8753.png",
    price: "150.000",
    rating: 4.6,
    reviewsCount: 29,
    appointment_dates: [
      "2024-09-05 10:27:00",
      "2024-09-05 08:14:00",
      "2024-09-07 16:15:00",
      "2024-09-04 12:29:00",
      "2024-09-03 10:09:00",
    ],
  },
];

export const hospitals = [
  {
    id: 9,
    name: "المركب الطبي ميديكال سيتي",
    doctors: [
      {
        name: "نسرين شيخ روحه",
        specialization: "سكر وغدد صماء",
        hospital: "المركب الطبي ميديكال سيتي",
        city: "تونس , صفاقس",
        address: null,
        image:
          "/media/media/avatar/staff/71a9f9c4-c1f4-4ade-aaa7-2bac85f27bf5.png",
        price: "220.000",
        rating: 3,
        appointment_dates: [
          "2024-09-02 14:18:00",
          "2024-09-04 11:40:00",
          "2024-09-08 13:18:00",
          "2024-09-06 13:44:00",
          "2024-09-07 10:25:00",
        ],
      },
      {
        name: "شهيدة بن نصر",
        specialization: "نساء وتوليد",
        hospital: "المركب الطبي ميديكال سيتي",
        city: "تونس , صفاقس",
        address: null,
        image:
          "/media/media/avatar/staff/73757796-1a2d-49c3-8813-1fa85e5c8753.png",
        price: "150.000",
        rating: 2,
        appointment_dates: [
          "2024-09-04 11:42:00",
          "2024-09-02 14:14:00",
          "2024-09-08 10:51:00",
          "2024-09-03 17:53:00",
          "2024-09-08 12:17:00",
        ],
      },
    ],
    specialities: [
      {
        name: "سكر وغدد صماء",
        doctor_count: 1,
      },
      {
        name: "نساء وتوليد",
        doctor_count: 1,
      },
    ],
  },
  {
    id: 8,
    name: "مستشفى الحبيب بورقيبة",
    doctors: [
      {
        name: "عماد فريخة",
        specialization: "جراحة اوعية دموية",
        hospital: "مستشفى الحبيب بورقيبة",
        city: "تونس , صفاقس",
        address: null,
        image: "",
        price: "620.000",
        rating: 1,
        appointment_dates: [
          "2024-09-02 16:41:00",
          "2024-09-02 11:04:00",
          "2024-09-06 09:17:00",
          "2024-09-07 12:31:00",
          "2024-09-05 14:05:00",
        ],
      },
      {
        name: "عمر حكموني",
        specialization: "اسنان",
        hospital: "مستشفى الحبيب بورقيبة",
        city: "تونس , صفاقس",
        address: null,
        image:
          "/media/media/avatar/staff/c214e0d1-a81f-4ea9-b5f9-33d4e85c7062.png",
        price: "500.000",
        rating: 1,
        appointment_dates: [
          "2024-09-08 16:32:00",
          "2024-09-06 09:21:00",
          "2024-09-02 16:21:00",
          "2024-09-08 08:58:00",
          "2024-09-08 11:35:00",
        ],
      },
    ],
    specialities: [
      {
        name: "جراحة اوعية دموية",
        doctor_count: 1,
      },
      {
        name: "اسنان",
        doctor_count: 1,
      },
    ],
  },
  {
    id: 2,
    name: "مستشفى الشفاء",
    doctors: [
      {
        name: "اميرة السعيد",
        specialization: "نساء وتوليد",
        hospital: "مستشفى الشفاء",
        city: "تونس , سوسة",
        address: null,
        image:
          "/media/media/avatar/staff/41e8c1de-30bc-4cf5-b01b-ff058206581e.png",
        price: "450.000",
        rating: 2,
        appointment_dates: [
          "2024-09-08 08:59:00",
          "2024-09-03 17:00:00",
          "2024-09-04 12:55:00",
          "2024-09-02 17:05:00",
          "2024-09-03 09:59:00",
        ],
      },
      {
        name: "ياسمين فكرى",
        specialization: "نساء وتوليد",
        hospital: "مستشفى الشفاء",
        city: "تونس , سوسة",
        address: null,
        image:
          "/media/media/avatar/staff/abc552eb-7d91-418c-826e-a723a221f9bb.png",
        price: "450.000",
        rating: 5,
        appointment_dates: [
          "2024-09-04 17:18:00",
          "2024-09-08 10:27:00",
          "2024-09-08 16:48:00",
          "2024-09-02 13:53:00",
          "2024-09-02 11:23:00",
        ],
      },
      {
        name: "الهام يوسف",
        specialization: "سكر وغدد صماء",
        hospital: "مستشفى الشفاء",
        city: "تونس , سوسة",
        address: null,
        image:
          "/media/media/avatar/staff/0f28b746-eaec-4e98-a8dc-949981657e4f.png",
        price: "500.000",
        rating: 1,
        appointment_dates: [
          "2024-09-04 16:32:00",
          "2024-09-07 16:01:00",
          "2024-09-05 08:01:00",
          "2024-09-04 09:12:00",
          "2024-09-03 09:14:00",
        ],
      },
      {
        name: "احمد ابراهيم دويك",
        specialization: "سكر وغدد صماء",
        hospital: "مستشفى الشفاء",
        city: "تونس , سوسة",
        address: null,
        image:
          "/media/media/avatar/staff/c161f0a4-f144-464f-be39-c3bca1ffdc0c.png",
        price: "500.000",
        rating: 5,
        appointment_dates: [
          "2024-09-02 08:08:00",
          "2024-09-03 15:07:00",
          "2024-09-05 16:46:00",
          "2024-09-06 17:34:00",
          "2024-09-05 10:43:00",
        ],
      },
      {
        name: "سعد الحق",
        specialization: "جراحة اوعية دموية",
        hospital: "مستشفى الشفاء",
        city: "تونس , تونس العاصمة",
        address: null,
        image:
          "/media/media/avatar/staff/9734b75e-9b08-4c9b-927e-da180368b8ed.png",
        price: "300.000",
        rating: 1,
        appointment_dates: [
          "2024-09-03 11:04:00",
          "2024-09-05 13:28:00",
          "2024-09-08 09:06:00",
          "2024-09-03 15:50:00",
          "2024-09-07 09:43:00",
        ],
      },
      {
        name: "محمد الحسيني",
        specialization: "سكر وغدد صماء",
        hospital: "مستشفى الشفاء",
        city: "تونس , تونس العاصمة",
        address: null,
        image:
          "/media/media/avatar/staff/fb99a5e1-7602-4ba6-a1ff-70ba0568b532.png",
        price: "700.000",
        rating: 5,
        appointment_dates: [
          "2024-09-08 08:09:00",
          "2024-09-08 10:20:00",
          "2024-09-04 11:16:00",
          "2024-09-06 08:59:00",
          "2024-09-05 10:00:00",
        ],
      },
      {
        name: "مهند محمود",
        specialization: "سكر وغدد صماء",
        hospital: "مستشفى الشفاء",
        city: "تونس , تونس العاصمة",
        address: null,
        image:
          "/media/media/avatar/staff/84bcfc4a-9580-4096-a94b-c6554645ba22.png",
        price: "400.000",
        rating: 2,
        appointment_dates: [
          "2024-09-02 12:06:00",
          "2024-09-08 12:21:00",
          "2024-09-07 12:47:00",
          "2024-09-07 15:44:00",
          "2024-09-05 11:04:00",
        ],
      },
      {
        name: "دعاء صلاح الدين محمود",
        specialization: "نساء وتوليد",
        hospital: "مستشفى الشفاء",
        city: "تونس , تونس العاصمة",
        address: null,
        image:
          "/media/media/avatar/staff/d7d42fc3-dfe8-4c8f-8bba-7147de678cde.png",
        price: "500.000",
        rating: 5,
        appointment_dates: [
          "2024-09-04 15:08:00",
          "2024-09-05 08:44:00",
          "2024-09-06 10:36:00",
          "2024-09-05 17:31:00",
          "2024-09-02 09:14:00",
        ],
      },
      {
        name: "امانى السيد",
        specialization: "نساء وتوليد",
        hospital: "مستشفى الشفاء",
        city: "تونس , تونس العاصمة",
        address: null,
        image:
          "/media/media/avatar/staff/2b15d753-a898-4fbe-9a1e-c94c872ca1c7.png",
        price: "300.000",
        rating: 1,
        appointment_dates: [
          "2024-09-08 17:49:00",
          "2024-09-08 15:28:00",
          "2024-09-08 16:27:00",
          "2024-09-04 14:04:00",
          "2024-09-02 13:08:00",
        ],
      },
    ],
    specialities: [
      {
        name: "نساء وتوليد",
        doctor_count: 4,
      },
      {
        name: "سكر وغدد صماء",
        doctor_count: 4,
      },
      {
        name: "جراحة اوعية دموية",
        doctor_count: 1,
      },
    ],
  },
  {
    id: 3,
    name: "مستشفى المختار",
    doctors: [
      {
        name: "احمد عز الرجال",
        specialization: "جراحة أورام",
        hospital: "مستشفى المختار",
        city: "تونس , تونس العاصمة",
        address: null,
        image:
          "/media/media/avatar/staff/5c5005fc-72c5-4737-bbfd-3b921c73479b.png",
        price: "800.000",
        rating: 3,
        appointment_dates: [
          "2024-09-05 13:56:00",
          "2024-09-06 13:43:00",
          "2024-09-06 14:20:00",
          "2024-09-07 15:28:00",
          "2024-09-03 10:04:00",
        ],
      },
      {
        name: "سلمى ممدوح",
        specialization: "جراحة أورام",
        hospital: "مستشفى المختار",
        city: "تونس , تونس العاصمة",
        address: null,
        image:
          "/media/media/avatar/staff/ce090d43-bfc0-4283-8dc4-da9d32958e2f.png",
        price: "500.000",
        rating: 2,
        appointment_dates: [
          "2024-09-02 16:10:00",
          "2024-09-03 15:58:00",
          "2024-09-02 17:39:00",
          "2024-09-02 09:18:00",
          "2024-09-07 15:27:00",
        ],
      },
      {
        name: "مصطفي ابوالليل",
        specialization: "جراحة اوعية دموية",
        hospital: "مستشفى المختار",
        city: "تونس , تونس العاصمة",
        address: null,
        image:
          "/media/media/avatar/staff/1aa016d1-5de4-4a26-9ef6-c98e9c4fb9a6.png",
        price: "500.000",
        rating: 1,
        appointment_dates: [
          "2024-09-08 09:49:00",
          "2024-09-03 13:41:00",
          "2024-09-05 11:34:00",
          "2024-09-07 17:16:00",
          "2024-09-08 16:36:00",
        ],
      },
      {
        name: "احمد زكى",
        specialization: "جراحة اوعية دموية",
        hospital: "مستشفى المختار",
        city: "تونس , تونس العاصمة",
        address: null,
        image:
          "/media/media/avatar/staff/a34acb6f-042b-4e9d-9a2f-76cd1ca0fd68.png",
        price: "450.000",
        rating: 1,
        appointment_dates: [
          "2024-09-06 17:44:00",
          "2024-09-03 15:42:00",
          "2024-09-02 16:56:00",
          "2024-09-03 08:44:00",
          "2024-09-05 14:54:00",
        ],
      },
      {
        name: "أحمد سامي فياض",
        specialization: "سكر وغدد صماء",
        hospital: "مستشفى المختار",
        city: "تونس , سوسة",
        address: null,
        image:
          "/media/media/avatar/staff/f5d4b298-5cbf-46bc-a12d-07e58906b269.png",
        price: "400.000",
        rating: 4,
        appointment_dates: [
          "2024-09-04 13:13:00",
          "2024-09-07 09:01:00",
          "2024-09-07 08:29:00",
          "2024-09-02 14:53:00",
          "2024-09-02 13:09:00",
        ],
      },
    ],
    specialities: [
      {
        name: "جراحة أورام",
        doctor_count: 2,
      },
      {
        name: "جراحة اوعية دموية",
        doctor_count: 2,
      },
      {
        name: "سكر وغدد صماء",
        doctor_count: 1,
      },
    ],
  },
  {
    id: 5,
    name: "مستشفي النور",
    doctors: [
      {
        name: "إيمان طنطاوي",
        specialization: "اسنان",
        hospital: "مستشفي النور",
        city: "تونس , تونس العاصمة",
        address: null,
        image:
          "/media/media/avatar/staff/f065d5ae-01dd-4469-baa2-ca6fc2dfb1bc.png",
        price: "300.000",
        rating: 1,
        appointment_dates: [
          "2024-09-02 13:42:00",
          "2024-09-06 14:17:00",
          "2024-09-04 12:24:00",
          "2024-09-03 17:40:00",
          "2024-09-07 12:11:00",
        ],
      },
      {
        name: "نهي صدقي",
        specialization: "اسنان",
        hospital: "مستشفي النور",
        city: "تونس , تونس العاصمة",
        address: null,
        image:
          "/media/media/avatar/staff/04e9052d-fadc-4685-985c-66f6eaa56668.png",
        price: "200.000",
        rating: 1,
        appointment_dates: [
          "2024-09-02 14:01:00",
          "2024-09-08 09:13:00",
          "2024-09-04 10:29:00",
          "2024-09-03 11:42:00",
          "2024-09-05 16:36:00",
        ],
      },
      {
        name: "محمد محمود سامى",
        specialization: "نساء وتوليد",
        hospital: "مستشفي النور",
        city: "طرابلس",
        address: null,
        image:
          "/media/media/avatar/staff/f8f1550d-ef87-48b1-888a-b0a6f2fa5b8e.png",
        price: "500.000",
        rating: 1,
        appointment_dates: [
          "2024-09-02 10:00:00",
          "2024-09-07 16:46:00",
          "2024-09-02 11:52:00",
          "2024-09-06 08:51:00",
          "2024-09-08 15:58:00",
        ],
      },
    ],
    specialities: [
      {
        name: "اسنان",
        doctor_count: 2,
      },
      {
        name: "نساء وتوليد",
        doctor_count: 1,
      },
    ],
  },
];

export const labs = [
  {
    name: "Aمعمل تصوير طبية",
    city: "تونس , تونس العاصمة",
    services: [
      {
        medical_services_category: {
          full_path: "تصوير مقطعي CT",
        },
        price: "30.000",
      },
      {
        medical_services_category: {
          full_path: "تصوير X - RAY",
        },
        price: "10.000",
      },
    ],
  },
  {
    name: "معمل تحليل B",
    city: "تونس , تونس العاصمة",
    services: [
      {
        medical_services_category: {
          full_path: "تحليل الفيتامينات / VIT.B12",
        },
        price: "50.000",
      },
      {
        medical_services_category: {
          full_path: "تحليل الفيتامينات / VIT.D",
        },
        price: "95.000",
      },
      {
        medical_services_category: {
          full_path: "تحليل الكبد / ALK.Ph",
        },
        price: "50.000",
      },
    ],
  },
];

export const specialities = [
  [
    {
      id: 5,
      name: "اسنان",
      foreign_name: "teeth",
    },
    {
      id: 3,
      name: "جراحة أورام",
      foreign_name: "Oncology surgery",
    },
    {
      id: 2,
      name: "جراحة اوعية دموية",
      foreign_name: "Vascular surgery",
    },
    {
      id: 4,
      name: "سكر وغدد صماء",
      foreign_name: "Sugar and endocrine glands",
    },
    {
      id: 1,
      name: "نساء وتوليد",
      foreign_name: "Gynecology and obstetrics",
    },
  ],
];

export const countries = [
  [
    {
      id: 2,
      name: "تونس",
      foreign_name: "Tunisia",
    },
    {
      id: 1,
      name: "ليبيا",
      foreign_name: "Libya",
    },
  ],
];

export const paiement = [
  {
    id: 1,
    name: "سداد",
    name_en: "sadad", // English name added
    image: "/Images/sadad.png",
    word: "sadad",
  },
  {
    id: 2,
    name: "ادفعلي",
    name_en: "adfali", // English name added
    image: "/Images/creditcard.png",
    word: "adfali",
  },
  {
    id: 3,
    name: "بطاقات البنوك المحلية",
    name_en: "local bank card", // English name added
    image: "/Images/creditcard.png",
    word: "local bank card",
  },
  {
    id: 4,
    name: "الدفع بالعملات الأجنبية",
    name_en: "MPGS", // English name added
    image: "/Images/creditcard.png",
    word: "MPGS",
  },
  {
    id: 5,
    name: "خدمات تداول",
    name_en: "t-lync", // English name added
    image: "/Images/tadawal.png",
    word: "t-lync",
  },
  /*{
    id: 6,
    name: "موبي كاش",
    name_en: "MobiCash", // English name added
    image: "/Images/mobicash.png",
  },*/
];

export const DoctorData: Payment[] = [
  {
    img: "/Images/doctors/pexels-carmel-nsenga-735492-19218034.jpg",
    id: "001",
    دكاترة: "دكتور أحمد سعيد",
    "تاريخ الانضمام": new Date("2024-01-15"),
    التقييم: 4.7,
    التخصص: "أخصائي قلب وأوعية دموية",
    المستشفى: "مستشفى تونس الدولي", // Same hospital for all
    الموقع: "تونس العاصمة، تونس",
    الهاتف: "123-456-789",
    السعر: 150, // Added price
  },
  {
    img: "/Images/doctors/pexels-ivan-samkov-4989165.jpg",
    id: "002",
    دكاترة: "دكتور فاطمة حسن",
    "تاريخ الانضمام": new Date("2023-08-10"),
    التقييم: 5.0,
    التخصص: "أخصائية نسائية وتوليد",
    المستشفى: "مستشفى تونس الدولي", // Same hospital for all
    الموقع: "صفاقس، تونس",
    الهاتف: "987-654-321",
    السعر: 180, // Added price
  },
  {
    img: "/Images/doctors/pexels-karolina-grabowska-5207098.jpg",
    id: "003",
    دكاترة: "دكتور يوسف طارق",
    "تاريخ الانضمام": new Date("2022-05-05"),
    التقييم: 4.3,
    التخصص: "أخصائي عيون",
    المستشفى: "مستشفى تونس الدولي", // Same hospital for all
    الموقع: "المنستير، تونس",
    الهاتف: "546-789-123",
    السعر: 120, // Added price
  },
  {
    img: "/Images/doctors/pexels-klaus-nielsen-6303555.jpg",
    id: "004",
    دكاترة: "دكتور ليلى محمد",
    "تاريخ الانضمام": new Date("2024-03-22"),
    التقييم: 4.8,
    التخصص: "أخصائية أمراض جلدية",
    المستشفى: "مستشفى تونس الدولي", // Same hospital for all
    الموقع: "سوسة، تونس",
    الهاتف: "567-890-234",
    السعر: 160, // Added price
  },
  {
    img: "/Images/doctors/pexels-klaus-nielsen-6303591.jpg",
    id: "005",
    دكاترة: "دكتور خالد يوسف",
    "تاريخ الانضمام": new Date("2021-12-18"),
    التقييم: 4.2,
    التخصص: "أخصائي أمراض الجهاز الهضمي",
    المستشفى: "مستشفى تونس الدولي", // Same hospital for all
    الموقع: "بن عروس، تونس",
    الهاتف: "654-321-987",
    السعر: 140, // Added price
  },
  {
    img: "/Images/doctors/pexels-mikewiz-6605090.jpg",
    id: "006",
    دكاترة: "دكتور مريم علي",
    "تاريخ الانضمام": new Date("2024-05-10"),
    التقييم: 4.9,
    التخصص: "أخصائية أطفال",
    المستشفى: "مستشفى تونس الدولي", // Same hospital for all
    الموقع: "تونس العاصمة، تونس",
    الهاتف: "789-123-456",
    السعر: 170, // Added price
  },
  {
    img: "/Images/doctors/pexels-pexels-user-1920570806-28755708.jpg",
    id: "007",
    دكاترة: "دكتور عماد مصطفى",
    "تاريخ الانضمام": new Date("2023-11-25"),
    التقييم: 4.6,
    التخصص: "أخصائي مسالك بولية",
    المستشفى: "مستشفى تونس الدولي", // Same hospital for all
    الموقع: "جندوبة، تونس",
    الهاتف: "321-654-987",
    السعر: 200, // Added price
  },
  {
    img: "/Images/doctors/pexels-polina-tankilevitch-5234482.jpg",
    id: "008",
    دكاترة: "دكتور ريم محمود",
    "تاريخ الانضمام": new Date("2022-07-19"),
    التقييم: 4.4,
    التخصص: "أخصائية أمراض القلب",
    المستشفى: "مستشفى تونس الدولي", // Same hospital for all
    الموقع: "القيروان، تونس",
    الهاتف: "456-789-012",
    السعر: 150, // Added price
  },
  {
    img: "/Images/doctors/pexels-tima-miroshnichenko-5407206.jpg",
    id: "009",
    دكاترة: "دكتور سامي حسين",
    "تاريخ الانضمام": new Date("2021-09-03"),
    التقييم: 4.1,
    التخصص: "أخصائي جراحة",
    المستشفى: "مستشفى تونس الدولي", // Same hospital for all
    الموقع: "صفاقس، تونس",
    الهاتف: "432-987-654",
    السعر: 190, // Added price
  },
  {
    img: "/Images/doctors/pexels-tima-miroshnichenko-6235015.jpg",
    id: "010",
    دكاترة: "دكتور ليلى سامي",
    "تاريخ الانضمام": new Date("2023-02-27"),
    التقييم: 4.5,
    التخصص: "أخصائية الأنف والأذن والحنجرة",
    المستشفى: "مستشفى تونس الدولي", // Same hospital for all
    الموقع: "تونس العاصمة، تونس",
    الهاتف: "567-432-198",
    السعر: 160, // Added price
  },
];

export const Tests: LabData = {
  lab_tests: [
    {
      معرف_الفحص: "T001",
      اسم_الفحص: "صورة دم كاملة",
      الفئة: "أمراض الدم",
      النطاق_الطبيعي: "غير متاح",
      الوحدة: "غير متاح",
      الوصف: "يقيس خلايا الدم الحمراء والبيضاء والهيموجلوبين.",
      السعر: 100,
    },
    {
      معرف_الفحص: "T002",
      اسم_الفحص: "سكر الدم أثناء الصيام",
      الفئة: "الكيمياء الحيوية",
      النطاق_الطبيعي: "70-100",
      الوحدة: "ملغ/دل",
      الوصف: "يقيس مستوى السكر في الدم بعد الصيام.",
      السعر: 80,
    },
    {
      معرف_الفحص: "T003",
      اسم_الفحص: "اختبار وظائف الكبد",
      الفئة: "الكيمياء الحيوية",
      النطاق_الطبيعي: "غير متاح",
      الوحدة: "غير متاح",
      الوصف: "يقيم إنزيمات الكبد ومستوى البيليروبين.",
      السعر: 120,
    },
    {
      معرف_الفحص: "T004",
      اسم_الفحص: "الملف الدهني",
      الفئة: "الكيمياء الحيوية",
      النطاق_الطبيعي: "غير متاح",
      الوحدة: "غير متاح",
      الوصف: "يقيس الكوليسترول والدهون الثلاثية.",
      السعر: 150,
    },
    {
      معرف_الفحص: "T005",
      اسم_الفحص: "اختبار فيتامين د",
      الفئة: "علم المناعة",
      النطاق_الطبيعي: "20-50",
      الوحدة: "نانوغرام/مل",
      الوصف: "يقيس مستويات فيتامين د في الدم.",
      السعر: 200,
    },
    {
      معرف_الفحص: "T006",
      اسم_الفحص: "تحليل الغدة الدرقية",
      الفئة: "علم الغدد الصماء",
      النطاق_الطبيعي: "غير متاح",
      الوحدة: "غير متاح",
      الوصف: "يقيم مستويات هرمونات الغدة الدرقية (TSH، T3، T4).",
      السعر: 180,
    },
    {
      معرف_الفحص: "T007",
      اسم_الفحص: "تحليل البول",
      الفئة: "عام",
      النطاق_الطبيعي: "غير متاح",
      الوحدة: "غير متاح",
      الوصف: "يفحص البول للكشف عن مواد مختلفة.",
      السعر: 50,
    },
    {
      معرف_الفحص: "T008",
      اسم_الفحص: "اختبار PCR لكوفيد-19",
      الفئة: "الأحياء الدقيقة",
      النطاق_الطبيعي: "سلبي",
      الوحدة: "غير متاح",
      الوصف: "يكشف المادة الوراثية لفيروس SARS-CoV-2.",
      السعر: 300,
    },
    {
      معرف_الفحص: "T009",
      اسم_الفحص: "الهيموجلوبين A1C",
      الفئة: "الكيمياء الحيوية",
      النطاق_الطبيعي: "<5.7",
      الوحدة: "%",
      الوصف: "يقيس متوسط السكر في الدم خلال 3 أشهر.",
      السعر: 90,
    },
    {
      معرف_الفحص: "T010",
      اسم_الفحص: "تحليل الشوارد",
      الفئة: "الكيمياء الحيوية",
      النطاق_الطبيعي: "غير متاح",
      الوحدة: "غير متاح",
      الوصف: "يفحص مستويات الصوديوم والبوتاسيوم وغيرها.",
      السعر: 110,
    },
  ],
  test_groups: [
    {
      معرف_المجموعة: "G001",
      اسم_المجموعة: "فحص الصحة الأساسي",
      الفحوصات_المشمولة: ["T001", "T002", "T004", "T010"],
      الوصف: "حزمة فحص أساسية للصحة العامة.",
      السعر: 400,
    },
    {
      معرف_المجموعة: "G002",
      اسم_المجموعة: "ملف مرض السكري",
      الفحوصات_المشمولة: ["T002", "T009", "T010"],
      الوصف: "اختبارات لمتابعة إدارة مرض السكري.",
      السعر: 250,
    },
    {
      معرف_المجموعة: "G003",
      اسم_المجموعة: "لوحة وظائف الكبد",
      الفحوصات_المشمولة: ["T003"],
      الوصف: "تقييم مفصل لصحة الكبد.",
      السعر: 120,
    },
    {
      معرف_المجموعة: "G004",
      اسم_المجموعة: "فحص شامل للجسم",
      الفحوصات_المشمولة: ["T001", "T002", "T004", "T006", "T010"],
      الوصف: "فحص شامل للصحة.",
      السعر: 600,
    },
    {
      معرف_المجموعة: "G005",
      اسم_المجموعة: "لوحة صحة المرأة",
      الفحوصات_المشمولة: ["T001", "T002", "T005", "T006"],
      الوصف: "فحوصات موجهة لمشاكل صحة المرأة الشائعة.",
      السعر: 500,
    },
    {
      معرف_المجموعة: "G006",
      اسم_المجموعة: "لوحة اختبارات كوفيد",
      الفحوصات_المشمولة: ["T008"],
      الوصف: "اختبارات للكشف عن كوفيد-19.",
      السعر: 300,
    },
    {
      معرف_المجموعة: "G007",
      اسم_المجموعة: "الملف الدهني المتقدم",
      الفحوصات_المشمولة: ["T004"],
      الوصف: "تحليل متقدم لمستويات الكوليسترول.",
      السعر: 150,
    },
    {
      معرف_المجموعة: "G008",
      اسم_المجموعة: "اختبار وظائف الكلى",
      الفحوصات_المشمولة: ["T002", "T010"],
      الوصف: "فحص لصحة الكلى.",
      السعر: 200,
    },
  ],
};
