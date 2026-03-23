
import React from "react";
import { ZakatRecord } from "@/types/ZakatTypes";
import ZakatTableRow from "./TableRow";
import { useIsMobile } from "@/hooks/use-mobile";

interface ZakatTableContentProps {
  data: ZakatRecord[];
  onDeleteClick: (id: string) => void;
}

const ZakatTableContent: React.FC<ZakatTableContentProps> = ({ 
  data, 
  onDeleteClick 
}) => {
  const isMobile = useIsMobile();
  
  // if (isMobile) {
  //   return (
  //     <div className="p-4 text-center text-sm text-muted-foreground">
  //       <p className="mb-2">Table view is optimized for larger screens.</p>
  //       <p>Please use card view on mobile devices for better experience.</p>
  //     </div>
  //   );
  // }
  
  return (
    <div className="table-container rounded-lg border border-border/60 shadow-protocol overflow-x-auto animate-fade-in">
      <table className="data-table w-max min-w-full border-collapse">
        <thead>
          <tr className="bg-secondary">
            <th className="text-center align-bottom sticky left-0 z-10 bg-secondary border border-border/60 font-medium text-foreground">No</th>
            <th className="text-center align-bottom border border-border/60 font-medium text-foreground">Penginput</th>
            <th className="text-center align-bottom border border-border/60 font-medium text-foreground">Pembayaran</th>
            <th className="text-center align-bottom border border-border/60 font-medium text-foreground">Tanggal</th>
            <th className="text-center align-bottom border border-border/60 font-medium text-foreground">Nama</th>
            <th className="text-center align-bottom border border-border/60 font-medium text-foreground">Alamat</th>
            <th colSpan={4} className="text-center border border-border/60 font-medium text-foreground">Zakat Fitrah</th>
            <th className="text-center align-bottom border border-border/60 font-medium text-foreground">Zakat Maal</th>
            <th colSpan={2} className="text-center border border-border/60 font-medium text-foreground">Infaq</th>
            <th colSpan={2} className="text-center border border-border/60 font-medium text-foreground">Fidyah</th>
            <th className="text-center align-bottom border border-border/60 font-medium text-foreground">Total Beras</th>
            <th className="text-center align-bottom border border-border/60 font-medium text-foreground">Total Uang</th>
            <th className="text-center align-bottom bg-secondary border border-border/60 font-medium text-foreground">Actions</th>
          </tr>
          <tr className="bg-secondary/80">
            <th className="sticky left-0 z-10 bg-secondary/80 border border-border/60"></th>
            <th className="border border-border/60"></th>
            <th className="border border-border/60"></th>
            <th className="border border-border/60"></th>
            <th className="border border-border/60"></th>
            <th className="border border-border/60"></th>
            <th className="text-center border border-border/60">Jiwa</th>
            <th className="text-center border border-border/60">Beras (kg)</th>
            <th className="text-center border border-border/60">Jiwa</th>
            <th className="text-center border border-border/60">Uang</th>
            <th className="border border-border/60"></th>
            <th className="text-center border border-border/60">Beras</th>
            <th className="text-center border border-border/60">Uang</th>
            <th className="text-center border border-border/60">Beras</th>
            <th className="text-center border border-border/60">Uang</th>
            <th className="border border-border/60"></th>
            <th className="border border-border/60"></th>
            <th className="bg-secondary/80 border border-border/60"></th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={18} className="text-center py-12 text-muted-foreground border border-border/60">
                No records found
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <ZakatTableRow 
                key={record.id} 
                record={record} 
                index={index} 
                onDeleteClick={onDeleteClick} 
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ZakatTableContent;
