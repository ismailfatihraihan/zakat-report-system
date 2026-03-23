
import React from "react";
import { ZakatRecord } from "@/types/ZakatTypes";
import ZakatTableRow from "./TableRow";

interface ZakatTableContentProps {
  data: ZakatRecord[];
  onDeleteClick: (id: string) => void;
  showAddress?: boolean;
  showActions?: boolean;
}

const ZakatTableContent: React.FC<ZakatTableContentProps> = ({
  data,
  onDeleteClick,
  showAddress = true,
  showActions = true,
}) => {
  const totalColumns = 16 + (showAddress ? 1 : 0) + (showActions ? 1 : 0);

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
            {showAddress && (
              <th className="text-center align-bottom border border-border/60 font-medium text-foreground">Alamat</th>
            )}
            <th colSpan={4} className="text-center border border-border/60 font-medium text-foreground">Zakat Fitrah</th>
            <th className="text-center align-bottom border border-border/60 font-medium text-foreground">Zakat Maal</th>
            <th colSpan={2} className="text-center border border-border/60 font-medium text-foreground">Infaq</th>
            <th colSpan={2} className="text-center border border-border/60 font-medium text-foreground">Fidyah</th>
            <th className="text-center align-bottom border border-border/60 font-medium text-foreground">Total Beras</th>
            <th className="text-center align-bottom border border-border/60 font-medium text-foreground">Total Uang</th>
            {showActions && (
              <th className="text-center align-bottom bg-secondary border border-border/60 font-medium text-foreground">Actions</th>
            )}
          </tr>
          <tr className="bg-secondary/80">
            <th className="sticky left-0 z-10 bg-secondary/80 border border-border/60"></th>
            <th className="border border-border/60"></th>
            <th className="border border-border/60"></th>
            <th className="border border-border/60"></th>
            <th className="border border-border/60"></th>
            {showAddress && <th className="border border-border/60"></th>}
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
            {showActions && <th className="bg-secondary/80 border border-border/60"></th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={totalColumns} className="text-center py-12 text-muted-foreground border border-border/60">
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
                showAddress={showAddress}
                showActions={showActions}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ZakatTableContent;
