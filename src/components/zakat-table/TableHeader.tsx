
import React from "react";
import ExportButton from "./ExportButton";
import { ZakatRecord } from "@/types/ZakatTypes";
import { format } from "date-fns";

interface TableHeaderProps {
  data: ZakatRecord[];
  canExport?: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({ data, canExport = true }) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="mb-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">Total Records: {data.length}</h2>
      </div>
      {canExport && (
        <ExportButton 
          data={data} 
          formatDate={formatDate}
          formatCurrency={formatCurrency} 
        />
      )}
    </div>
  );
};

export default TableHeader;
