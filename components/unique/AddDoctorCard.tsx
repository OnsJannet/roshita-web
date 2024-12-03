import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Trash2 } from "lucide-react";
import { DoctorData } from "@/constant";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const AddDoctorCard = () => {
  const buttonText = "حذف";
  const confirmMessage =
    "هل أنت متأكد أنك تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.";
  const title = "تأكيد الحذف";

  const onConfirm = () => {
    console.log("Delete clicked");
  };

  return (
    <Card className="flex flex-col pb-[30px] h-[410px]">
      <CardHeader className=" pb-0 flex flex-col justify-start">
        <CardTitle className="text-end">اخر الدكاترة</CardTitle>
        <CardDescription className="flex flex-row-reverse justify-between items-center w-full ">
          اخر دكاترة الذين تم اضافتهم
          <Button>إضافة</Button>
        </CardDescription>
        <CardContent className="flex flex-row-reverse justify-between items-center w-full ">
          <div className="w-full mt-10 ">
            {DoctorData.slice(0, 5).map((doctor) => (
              <div className="flex justify-between flex-row-reverse w-full items-center">
                <div
                  key={doctor.id}
                  className="flex flex-row-reverse items-center gap-4  mb-2"
                >
                  <Avatar>
                    <AvatarImage
                      src={doctor.img}
                      alt="doctors"
                      className="w-10 h-10"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <h3>{doctor.دكاترة}</h3>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash2 className="w-4 h-4 cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-end">
                        {title}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-end">
                        {confirmMessage}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-400"
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </CardContent>
      </CardHeader>
      <CardContent className="flex-1 pb-0"></CardContent>
    </Card>
  );
};

export default AddDoctorCard;
