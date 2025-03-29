import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZakatFormData } from "@/types/ZakatTypes";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatters";
import { Edit, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onEdit: () => void;
  formData: ZakatFormData;
}
const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onEdit,
  formData
}) => {
  // Format date for display
  const formattedDate = formData.tanggal ? format(new Date(formData.tanggal), "dd MMMM yyyy") : "";
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-semibold">Review Data Zakat</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Alert className="mb-6 bg-red-50 border border-red-200">
            <AlertDescription className="text-red-600 font-semibold ">MOHON PERIKSA KEMBALI DATA YANG SUDAH DIINPUT MEH TE NGAGAWEKEN, SUPAYA TIDAK CAPEK DUA KALI, TANGGUNG JAWAB DUNIA AKHERAT. 
-KETUA</AlertDescription>
          </Alert>
          
          <div className="space-y-6">
            {/* Basic Info Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium border-b pb-2">Informasi Dasar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm text-muted-foreground">Penginput:</span>
                  <p className="font-medium">{formData.penginput || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Tanggal:</span>
                  <p className="font-medium">{formattedDate || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Nama:</span>
                  <p className="font-medium">{formData.nama || "-"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Alamat:</span>
                  <p className="font-medium">{formData.alamat || "-"}</p>
                </div>
              </div>
            </div>

            {/* Zakat Fitrah Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium border-b pb-2">Zakat Fitrah</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm text-muted-foreground">Jiwa Beras:</span>
                  <p className="font-medium">{formData.zakatFitrah.jiwaBeras} jiwa</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Beras (kg):</span>
                  <p className="font-medium">{formData.zakatFitrah.berasKg} kg</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Jiwa Uang:</span>
                  <p className="font-medium">{formData.zakatFitrah.jiwaUang} jiwa</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Uang:</span>
                  <p className="font-medium">{formatCurrency(formData.zakatFitrah.uang)}</p>
                </div>
              </div>
            </div>

            {/* Zakat Maal Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium border-b pb-2">Zakat Maal</h3>
              <div>
                <span className="text-sm text-muted-foreground">Jumlah:</span>
                <p className="font-medium">{formatCurrency(formData.zakatMaal)}</p>
              </div>
            </div>

            {/* Infaq Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium border-b pb-2">Infaq</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm text-muted-foreground">Beras:</span>
                  <p className="font-medium">{formData.infaq.beras} kg</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Uang:</span>
                  <p className="font-medium">{formatCurrency(formData.infaq.uang)}</p>
                </div>
              </div>
            </div>

            {/* Fidyah Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium border-b pb-2">Fidyah</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm text-muted-foreground">Beras:</span>
                  <p className="font-medium">{formData.fidyah.beras} kg</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Uang:</span>
                  <p className="font-medium">{formatCurrency(formData.fidyah.uang)}</p>
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-sm font-medium">Total Beras:</span>
                  <p className="text-lg font-semibold">
                    {(formData.zakatFitrah.berasKg + formData.infaq.beras + formData.fidyah.beras).toFixed(2)} kg
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Total Uang:</span>
                  <p className="text-lg font-semibold">
                    {formatCurrency(formData.zakatFitrah.uang + formData.zakatMaal + formData.infaq.uang + formData.fidyah.uang)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onEdit} className="w-full sm:w-auto flex items-center gap-2">
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button onClick={onConfirm} className="w-full sm:w-auto flex items-center gap-2 bg-primary">
            <Check className="h-4 w-4" /> Konfirmasi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};
export default ReviewModal;