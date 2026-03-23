
import React from "react";
import { User, Calendar, MapPin, Wallet } from "lucide-react";
import { formatDate } from "@/utils/formatters";

interface ZakatCardDetailsProps {
  penginput: string;
  pembayaran: "cash" | "transfer";
  tanggal: string;
  alamat: string;
}

const ZakatCardDetails: React.FC<ZakatCardDetailsProps> = ({
  penginput,
  pembayaran,
  tanggal,
  alamat
}) => {
  return (
    <div className="space-y-2 md:space-y-3">
      <div className="flex items-center text-xs sm:text-sm">
        <User className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
        <span className="text-muted-foreground">Diinput oleh:</span>
        <span className="ml-1 sm:ml-1.5 font-medium truncate">{penginput}</span>
      </div>
      
      <div className="flex items-center text-xs sm:text-sm">
        <Calendar className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
        <span className="text-muted-foreground">Tanggal:</span>
        <span className="ml-1 sm:ml-1.5 font-medium">{formatDate(tanggal)}</span>
      </div>

      <div className="flex items-center text-xs sm:text-sm">
        <Wallet className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
        <span className="text-muted-foreground">Pembayaran:</span>
        <span className="ml-1 sm:ml-1.5 font-medium">{pembayaran === "transfer" ? "Transfer" : "Cash"}</span>
      </div>
      
      {alamat && (
        <div className="flex items-start text-xs sm:text-sm">
          <MapPin className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 mt-0.5 text-primary" />
          <div className="overflow-hidden">
            <span className="text-muted-foreground">Alamat:</span>
            <span className="ml-1 sm:ml-1.5 font-medium break-words line-clamp-2">{alamat.normalize("NFKC")}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZakatCardDetails;
