import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConsultationTransferProps {
  isOpen: boolean;
  onClose: () => void;
  language: "ar" | "en"; // Language can be either 'ar' or 'en'
}

export function ConsultationTransfer({
  isOpen,
  onClose,
  language,
}: ConsultationTransferProps) {
  console.log("transfer modal language", language);

  // Define all text content based on language
  const content = {
    title: language === "ar" ? "تحويل الاستشارة" : "Transfer Consultation",
    notebookLabel:
      language === "ar" ? "إرسال الي دكتور محدد" : "Send to a specific doctor",
    notebookPlaceholder:
      language === "ar" ? "ادخل اسم الدفتر" : "Enter notebook name",
    specialtyLabel:
      language === "ar" ? "إرسال الى تخصص محدد" : "Send to Specific Specialty",
    specialtyPlaceholder:
      language === "ar" ? "اختر التخصص" : "Select specialty",
    transferLabel: language === "ar" ? "تحويل" : "Transfer",
    transferPlaceholder:
      language === "ar" ? "ادخل تفاصيل التحويل" : "Enter transfer details",
    submitButton: language === "ar" ? "إرسال" : "Submit",
    specialties: {
      cardiology: language === "ar" ? "أمراض القلب" : "Cardiology",
      dermatology: language === "ar" ? "الأمراض الجلدية" : "Dermatology",
      orthopedics: language === "ar" ? "جراحة العظام" : "Orthopedics",
      pediatrics: language === "ar" ? "طب الأطفال" : "Pediatrics",
    },
  };

  // Determine the direction based on the language
  const direction = language === "ar" ? "rtl" : "ltr";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        dir={direction}
        className={language === "ar" ? "text-right" : "text-left"}
      >
        <DialogHeader>
          <DialogTitle
            className={language === "ar" ? "text-center" : "text-center"}
          >
            {content.title}
          </DialogTitle>{" "}
          {/* Dynamic title */}
        </DialogHeader>
        <div className="space-y-4">
          {/* Notebook Input */}
          <div>
            <Label htmlFor="notebook">{content.notebookLabel}</Label>
            <Input
              id="notebook"
              placeholder={content.notebookPlaceholder}
              className="h-[50px] mt-2"
            />
          </div>

          {/* Specialty Select 
          <div>
            <Label htmlFor="specialty">{content.specialtyLabel}</Label>
            <Select>
              <SelectTrigger
                className={
                  language === "ar"
                    ? "text-right justify-end h-[50px] mt-2"
                    : "text-left h-[50px] mt-2"
                }
              >
                <SelectValue placeholder={content.specialtyPlaceholder} />
              </SelectTrigger>
              <SelectContent
                className={language === "ar" ? "text-right" : "text-left"}
              >
                <SelectItem
                  value="cardiology"
                  className={
                    language === "ar" ? "text-right items-start" : "text-left"
                  }
                >
                  {content.specialties.cardiology}
                </SelectItem>
                <SelectItem
                  value="dermatology"
                  className={language === "ar" ? "text-right" : "text-left"}
                >
                  {content.specialties.dermatology}
                </SelectItem>
                <SelectItem
                  value="orthopedics"
                  className={language === "ar" ? "text-right" : "text-left"}
                >
                  {content.specialties.orthopedics}
                </SelectItem>
                <SelectItem
                  value="pediatrics"
                  className={language === "ar" ? "text-right" : "text-left"}
                >
                  {content.specialties.pediatrics}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          */}

          {/* Transfer Input 
          <div>
            <Label htmlFor="transfer">{content.transferLabel}</Label>
            <Input id="transfer" placeholder={content.transferPlaceholder} className="h-10 mt-2"/>
          </div>
          */}

          {/* Submit Button */}
          <div className=" flex justify-center items-center mt-6  mx-[50px]">
            <Button type="submit" className=" bg-[#1588C8] text-white w-1/2">
              {content.transferLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
