import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileDown, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { ReportData, ReportSummary } from "@/types/ZakatTypes";
import { format, parse, isValid } from "date-fns";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "@/contexts/AuthContext";
interface ZakatReportTableProps {
  reportData: ReportData[];
  reportSummary: ReportSummary;
  formatCurrency: (amount: number) => string;
}
const ZakatReportTable: React.FC<ZakatReportTableProps> = ({
  reportData,
  reportSummary,
  formatCurrency
}) => {
  const reportTableRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  // Format date for display
  const formatDisplayDate = (dateStr: string) => {
    try {
      const date = parse(dateStr, 'yyyy-MM-dd', new Date());
      if (isValid(date)) {
        return format(date, 'dd MMMM yyyy');
      }
      return dateStr;
    } catch (error) {
      return dateStr;
    }
  };

  // Function to export daily report to PDF
  const exportToPDF = async () => {
    if (!reportTableRef.current) {
      toast.error("Could not generate PDF");
      return;
    }
    try {
      toast.info("Generating PDF...", {
        duration: 2000
      });
      const element = reportTableRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');

      // Calculate PDF dimensions based on the table
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Add title
      pdf.setFontSize(14);
      pdf.text('LAPORAN PENERIMAAN ZISF', imgWidth / 2, 10, {
        align: 'center'
      });
      pdf.text('UPZ DKM', imgWidth / 2, 18, {
        align: 'center'
      });
      let position = 25;

      // Determine if we need multiple pages
      let heightLeft = imgHeight;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - position;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = 0;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position - (pageHeight - 25), imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save PDF
      pdf.save(`LAPORAN_PENERIMAAN_ZISF_${format(new Date(), 'yyyyMMdd')}.pdf`);
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  // Function to export daily report to Excel
  const exportToExcel = () => {
    try {
      // Create a CSV string
      let csvContent = "data:text/csv;charset=utf-8,";

      // Add table headers
      csvContent += "NO,TANGGAL,ZAKAT FITRAH - JIWA,ZAKAT FITRAH - BERAS,ZAKAT FITRAH - JIWA,ZAKAT FITRAH - UANG,ZAKAT MAAL,INFAQ/SHODAQOH - BERAS,INFAQ/SHODAQOH - UANG,FIDYAH - BERAS,FIDYAH - UANG,TOTAL BERAS (Kg),TOTAL UANG\n";

      // Add table data
      reportData.forEach((report, index) => {
        csvContent += `${index + 1},${formatDisplayDate(report.date)},${report.zakatFitrahJiwaBeras},${report.zakatFitrahBerasKg} Kg,${report.zakatFitrahJiwaUang},${formatCurrency(report.zakatFitrahUang)},${formatCurrency(report.zakatMaal)},${report.infaqBeras} Kg,${formatCurrency(report.infaqUang)},${report.fidyahBeras} Kg,${formatCurrency(report.fidyahUang)},${report.totalBeras} Kg,${formatCurrency(report.totalUang)}\n`;
      });

      // Add summary row
      csvContent += `TOTAL,,${reportSummary.totalJiwaBeras},${reportSummary.totalBerasKg} Kg,${reportSummary.totalJiwaUang},${formatCurrency(reportSummary.totalZakatFitrahUang)},${formatCurrency(reportSummary.totalZakatMaal)},${reportSummary.totalInfaqBeras} Kg,${formatCurrency(reportSummary.totalInfaqUang)},${reportSummary.totalFidyahBeras} Kg,${formatCurrency(reportSummary.totalFidyahUang)},${reportSummary.totalAllBeras} Kg,${formatCurrency(reportSummary.totalAllUang)}\n`;

      // Create a download link and trigger download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `LAPORAN_PENERIMAAN_ZISF.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Report exported successfully");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Failed to export report");
    }
  };
  return <Card className="apple-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>LAPORAN PENERIMAAN ZISF</CardTitle>
        {isAuthenticated && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={exportToExcel}>
              <FileDown size={16} />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={exportToPDF}>
              <FileText size={16} />
              Export PDF
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto" ref={reportTableRef}>
          <div className="inline-block min-w-full align-middle">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead rowSpan={2} className="text-center align-middle border">NO</TableHead>
                  <TableHead rowSpan={2} className="text-center align-middle border">TANGGAL</TableHead>
                  <TableHead colSpan={4} className="text-center border">ZAKAT FITRAH</TableHead>
                  <TableHead rowSpan={2} className="text-center align-middle border">ZAKAT MAAL</TableHead>
                  <TableHead colSpan={2} className="text-center border">INFAQ/SHODAQOH</TableHead>
                  <TableHead colSpan={2} className="text-center border">FIDYAH</TableHead>
                  <TableHead rowSpan={2} className="text-center align-middle border">TOTAL BERAS (Kg)</TableHead>
                  <TableHead rowSpan={2} className="text-center align-middle border">TOTAL UANG</TableHead>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-center border">JIWA</TableHead>
                  <TableHead className="text-center border">BERAS</TableHead>
                  <TableHead className="text-center border">JIWA</TableHead>
                  <TableHead className="text-center border">UANG</TableHead>
                  <TableHead className="text-center border">BERAS</TableHead>
                  <TableHead className="text-center border">UANG</TableHead>
                  <TableHead className="text-center border">BERAS</TableHead>
                  <TableHead className="text-center border">UANG</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.length === 0 ? <TableRow>
                    <TableCell colSpan={13} className="text-center text-muted-foreground py-6">
                      No records found
                    </TableCell>
                  </TableRow> : reportData.map((report, index) => <TableRow key={`report-${index}`}>
                      <TableCell className="text-center border">{index + 1}</TableCell>
                      <TableCell className="text-center border">{formatDisplayDate(report.date)}</TableCell>
                      <TableCell className="text-center border">{report.zakatFitrahJiwaBeras}</TableCell>
                      <TableCell className="text-center border">{report.zakatFitrahBerasKg} Kg</TableCell>
                      <TableCell className="text-center border">{report.zakatFitrahJiwaUang}</TableCell>
                      <TableCell className="text-center border">{formatCurrency(report.zakatFitrahUang)}</TableCell>
                      <TableCell className="text-center border">{formatCurrency(report.zakatMaal)}</TableCell>
                      <TableCell className="text-center border">{report.infaqBeras} Kg</TableCell>
                      <TableCell className="text-center border">{formatCurrency(report.infaqUang)}</TableCell>
                      <TableCell className="text-center border">{report.fidyahBeras} Kg</TableCell>
                      <TableCell className="text-center border">{formatCurrency(report.fidyahUang)}</TableCell>
                      <TableCell className="text-center border">{report.totalBeras} Kg</TableCell>
                      <TableCell className="text-center border">{formatCurrency(report.totalUang)}</TableCell>
                    </TableRow>)}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell colSpan={2} className="text-center border">TOTAL</TableCell>
                  <TableCell className="text-center border">{reportSummary.totalJiwaBeras}</TableCell>
                  <TableCell className="text-center border">{reportSummary.totalBerasKg} Kg</TableCell>
                  <TableCell className="text-center border">{reportSummary.totalJiwaUang}</TableCell>
                  <TableCell className="text-center border">{formatCurrency(reportSummary.totalZakatFitrahUang)}</TableCell>
                  <TableCell className="text-center border">{formatCurrency(reportSummary.totalZakatMaal)}</TableCell>
                  <TableCell className="text-center border">{reportSummary.totalInfaqBeras} Kg</TableCell>
                  <TableCell className="text-center border">{formatCurrency(reportSummary.totalInfaqUang)}</TableCell>
                  <TableCell className="text-center border">{reportSummary.totalFidyahBeras} Kg</TableCell>
                  <TableCell className="text-center border">{formatCurrency(reportSummary.totalFidyahUang)}</TableCell>
                  <TableCell className="text-center border">{reportSummary.totalAllBeras} Kg</TableCell>
                  <TableCell className="text-center border">{formatCurrency(reportSummary.totalAllUang)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default ZakatReportTable;