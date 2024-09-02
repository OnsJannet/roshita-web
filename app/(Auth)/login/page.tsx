import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image.";

const page = () => {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-end">مرحبـــا </h1>
            <p className="text-balance text-muted-foreground text-end">
              عبئ المتطلبات الأتيه لتسجيل الدخول
            </p>
          </div>
          <div className="grid gap-4">
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
              <div className="flex justify-between items-center">
                <Link
                  href="/forgot-password"
                  className="mr-auto inline-block text-sm underline"
                >
                  نسيت كلمة المرور
                </Link>
                <Label htmlFor="password">كلمة المرور</Label>
              </div>

              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-roshitaBlue" >
              تسجيل
            </Button>
            {/*<Button variant="outline" className="w-full">
              Login with Google
            </Button>*/}
          </div>
          <div className="mt-4 text-center text-sm">
            لا تمتلك حسابًا؟{" "}
            <Link href="/register" className="underline">
              اشترك
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-white lg:block">
        <Image
          src="/images/login.png"
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
