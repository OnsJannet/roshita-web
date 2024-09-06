import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const page = () => {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-end">
              أنضــم الي <span className="text-roshitaDarkBlue"> روشيتا</span>{" "}
            </h1>
            <p className="text-balance text-muted-foreground text-end">
              عبئ المتطلبات الأتيه لتسجيل الدخول
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name " className="text-end">
                الإسم
              </Label>
              <Input id="name" type="text" placeholder="jon doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email " className="text-end">
                الإيميل
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex justify-end items-center ">
                <Label htmlFor="password">كلمة السر </Label>
              </div>

              <Input id="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <div className="flex justify-end items-center">
                <Label htmlFor="password"> تأكيد كلمة السر</Label>
              </div>

              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-roshitaBlue">
              تسجيل
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="underline">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-transparent lg:block h-full w-full">
        <Image
          src="/Images/register.png"
          alt="Image"
          width={1920}
          height={1080}
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};
export default page;
