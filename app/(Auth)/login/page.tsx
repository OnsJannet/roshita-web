'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginUser } from '@/lib/api';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const url = query.get('redirect') || '/'; // Default to home page
    setRedirectUrl(url);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser({ phone, password });

      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem('access', data.access);
      localStorage.setItem('isLoggedIn', 'true');

      if (redirectUrl) {
        router.push(redirectUrl); // Redirect to the intended destination
      }

    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء تسجيل الدخول.');
    } finally {
      setLoading(false);
    }
  };

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

          {error && (
            <div className="text-red-500 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-end">
                رقم الهاتف
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="1234567890"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-roshitaBlue" disabled={loading}>
              {loading ? 'جاري التسجيل...' : 'تسجيل'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            لا تمتلك حسابًا؟{' '}
            <Link href="/register" className="underline">
              اشترك
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-white lg:block">
        <Image
          src="/Images/Login.png"
          alt="Image"
          width={1920}
          height={1080}
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default Page;
