import { Button } from "../ui/button"

const Cta = () => {
  return (
    <div className="max-w-4xl mx-auto mt-20  bg-roshitaBlue mb-20 rounded-2xl h-60 flex ">
<div className="lg:!w-[40%] w-[100%] h-full">
    <img 
        src="/images/call-to-ation.png" 
        alt="" 
        className="lg:h-[105%] h-full w-[600px] object-cover rounded-2xl lg:-mt-[7px]" 
    />
</div>
<div
      style={{
        width: '100%',
        height: 'auto',
        backgroundImage: "url('/images/BackgroundShape.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      className=" p-8"
    >
      <h2 className="text-[#C31162] text-2xl font-bold text-end">
      قريبــــا 
      </h2>
      <h2 className="lg:text-4xl text-lg font-bold text-end text-white mt-1">هل لديك سؤال طبي؟</h2>
      <h2 className="lg:text-4xl text-lg font-medium text-end text-white mt-1">أرسل رسالة الي طبيب متخصص</h2>
      <div className="flex flex-row-reverse mt-4">
      <Button className="bg-white p-4 text-black hover:text-white">أطلب استشارة</Button>
      </div>
    </div>
    </div>
  )
}

export default Cta