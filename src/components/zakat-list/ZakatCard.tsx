
import React from "react";
import { ZakatRecord } from "@/types/ZakatTypes";
import { Card, CardContent } from "@/components/ui/card";
import ZakatCardHeader from "./ZakatCardHeader";
import ZakatCardDetails from "./ZakatCardDetails";
import ZakatCardSections from "./ZakatCardSections";
import ZakatCardSummary from "./ZakatCardSummary";

interface ZakatCardProps {
  record: ZakatRecord;
  onDelete: (id: string) => void;
  index: number;
}

const ZakatCard: React.FC<ZakatCardProps> = ({
  record,
  onDelete,
  index
}) => {
  return (
    <Card className="protocol-card overflow-hidden h-full flex flex-col">
      <ZakatCardHeader
        name={record.nama}
        id={record.id}
        index={index}
        onDelete={onDelete}
      />
      <CardContent className="space-y-3 pt-3 md:space-y-4 md:pt-4 flex-grow text-sm">
        <ZakatCardDetails
          penginput={record.penginput}
          pembayaran={record.pembayaran}
          tanggal={record.tanggal}
          alamat={record.alamat}
        />
        
        <div className="my-2 md:my-3 border-t border-border/50"></div>
        
        <ZakatCardSections record={record} />
        
        <div className="mt-auto pt-2 md:pt-3">
          <ZakatCardSummary
            totalBeras={record.totalBeras}
            totalUang={record.totalUang}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ZakatCard;
