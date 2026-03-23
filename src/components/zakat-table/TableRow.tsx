
import React from "react";
import { ZakatRecord } from "@/types/ZakatTypes";
import TableActions from "./TableActions";
import { format } from "date-fns";

interface ZakatTableRowProps {
  record: ZakatRecord;
  index: number;
  onDeleteClick: (id: string) => void;
  showAddress?: boolean;
  showActions?: boolean;
}

const ZakatTableRow: React.FC<ZakatTableRowProps> = ({ 
  record, 
  index,
  onDeleteClick,
  showAddress = true,
  showActions = true
}) => {
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  return (
    <tr className="animate-slide-up hover:bg-secondary/20 transition-colors duration-150" style={{ animationDelay: `${index * 50}ms` }}>
      <td className="text-center align-middle sticky left-0 z-10 bg-white border border-border/60 font-medium">{index + 1}</td>
      <td className="text-center align-middle border border-border/60">{record.penginput}</td>
      <td className="text-center align-middle border border-border/60">{record.pembayaran === "transfer" ? "Transfer" : "Cash"}</td>
      <td className="text-center align-middle border border-border/60">{formatDate(record.tanggal)}</td>
      <td className="align-middle border border-border/60 font-medium">{record.nama}</td>
      {showAddress && <td className="align-middle border border-border/60">{record.alamat}</td>}
      <td className="text-center align-middle border border-border/60">{record.zakatFitrah.jiwaBeras}</td>
      <td className="text-center align-middle border border-border/60">{record.zakatFitrah.berasKg}</td>
      <td className="text-center align-middle border border-border/60">{record.zakatFitrah.jiwaUang}</td>
      <td className="text-right align-middle border border-border/60">{formatCurrency(record.zakatFitrah.uang)}</td>
      <td className="text-right align-middle border border-border/60">{formatCurrency(record.zakatMaal)}</td>
      <td className="text-center align-middle border border-border/60">{record.infaq.beras}</td>
      <td className="text-right align-middle border border-border/60">{formatCurrency(record.infaq.uang)}</td>
      <td className="text-center align-middle border border-border/60">{record.fidyah.beras}</td>
      <td className="text-right align-middle border border-border/60">{formatCurrency(record.fidyah.uang)}</td>
      <td className="text-center align-middle border border-border/60 font-medium">{record.totalBeras}</td>
      <td className="text-right align-middle border border-border/60 font-medium">{formatCurrency(record.totalUang)}</td>
      {showActions && (
        <td className="text-center align-middle bg-white border border-border/60">
          <TableActions recordId={record.id} onDelete={onDeleteClick} />
        </td>
      )}
    </tr>
  );
};

export default ZakatTableRow;
