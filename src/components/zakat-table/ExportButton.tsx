
import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { format } from "date-fns";
import { ZakatRecord } from "@/types/ZakatTypes";
import { toast } from "sonner";

interface ExportButtonProps {
  data: ZakatRecord[];
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  formatDate,
  formatCurrency 
}) => {
  const exportToCSV = () => {
    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add headers
      csvContent += "No,Penginput,Pembayaran,Tanggal,Nama,Alamat,Jiwa Beras,Beras (kg),Jiwa Uang,Uang,Zakat Maal,Infaq Beras,Infaq Uang,Fidyah Beras,Fidyah Uang,Total Beras,Total Uang\n";
      
      // Add data
      data.forEach((record, index) => {
        csvContent += `${index + 1},${record.penginput},${record.pembayaran},${formatDate(record.tanggal)},${record.nama},${record.alamat},${record.zakatFitrah.jiwaBeras},${record.zakatFitrah.berasKg},${record.zakatFitrah.jiwaUang},${record.zakatFitrah.uang},${record.zakatMaal},${record.infaq.beras},${record.infaq.uang},${record.fidyah.beras},${record.fidyah.uang},${record.totalBeras},${record.totalUang}\n`;
      });
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `zakat_records_${format(new Date(), 'yyyyMMdd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Records exported to CSV successfully");
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      toast.error("Failed to export records");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={exportToCSV}
      className="flex items-center"
    >
      <FileDown className="mr-2 h-4 w-4" />
      Export to CSV
    </Button>
  );
};

export default ExportButton;
