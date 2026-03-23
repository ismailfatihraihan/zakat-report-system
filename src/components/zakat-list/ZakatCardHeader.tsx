
import React from "react";
import { CardHeader } from "@/components/ui/card";
import TableActions from "../zakat-table/TableActions";

interface ZakatCardHeaderProps {
  name: string;
  id: string;
  index: number;
  onDelete: (id: string) => void;
  canManage: boolean;
}

const ZakatCardHeader: React.FC<ZakatCardHeaderProps> = ({
  name,
  id,
  index,
  onDelete,
  canManage
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between pb-0 space-y-0 bg-secondary/30">
      <div className="font-medium flex items-center text-sm md:text-lg truncate max-w-[70%]">
        <span className="inline-flex items-center justify-center h-6 w-6 md:h-7 md:w-7 rounded-full bg-primary/10 text-primary text-xs font-medium mr-2 md:mr-3 shrink-0">
          {index}
        </span>
        <span className="truncate">{name.normalize("NFKC")}</span>
      </div>
      {canManage && <TableActions recordId={id} onDelete={onDelete} />}
    </CardHeader>
  );
};

export default ZakatCardHeader;
