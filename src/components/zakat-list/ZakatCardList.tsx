
import React from "react";
import { ZakatRecord } from "@/types/ZakatTypes";
import ZakatCard from "./ZakatCard";
import ErrorBoundary from "../ErrorBoundary";

interface ZakatCardListProps {
  records: ZakatRecord[];
  onDelete: (id: string) => void;
  canManage: boolean;
}

const ZakatCardList: React.FC<ZakatCardListProps> = ({ records, onDelete, canManage }) => {
  if (records.length === 0) {
    return (
      <div className="text-center p-8 md:p-12 bg-secondary/30 rounded-lg border border-border/50">
        <p className="text-muted-foreground">No records found</p>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {records.map((record, idx) => (
          <ZakatCard 
            key={record.id} 
            record={record} 
            onDelete={onDelete} 
            canManage={canManage}
            index={records.length - idx} // Display highest number first
          />
        ))}
      </div>
    </ErrorBoundary>
  );
};

export default ZakatCardList;
