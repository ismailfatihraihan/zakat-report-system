
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ZakatRecord } from "@/types/ZakatTypes";
import { deleteRecord } from "@/services/zakatApiService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import TableHeader from "./zakat-table/TableHeader";
import ZakatTableContent from "./zakat-table/ZakatTableContent";
import DeleteConfirmDialog from "./zakat-table/DeleteConfirmDialog";
import ErrorBoundary from "./ErrorBoundary";

interface ZakatTableProps {
  data: ZakatRecord[];
  onDelete?: () => void;
  locationPath?: string;
  searchQuery?: string;
}

const ZakatTable: React.FC<ZakatTableProps> = ({ 
  data, 
  onDelete,
  locationPath,
  searchQuery 
}) => {
  const { isAuthenticated, isGuest } = useAuth();

  // Get location safely - will be available when used within router context
  let location;
  try {
    location = useLocation();
  } catch (e) {
    location = { pathname: locationPath || '', search: searchQuery || '' };
  }
  
  const currentLocation = locationPath || location.pathname;
  const currentSearch = searchQuery || location.search;
  
  const tableEndRef = useRef<HTMLDivElement>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Handle record deletion
  const handleDelete = async () => {
    if (!isAuthenticated) return;
    if (recordToDelete) {
      setIsDeleting(true);
      try {
        const deleted = await deleteRecord(recordToDelete);
        if (deleted) {
          toast.success("Record deleted successfully");
          if (onDelete) onDelete();
        } else {
          toast.error("Failed to delete record");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
        toast.error("An error occurred while deleting the record");
      } finally {
        setIsDeleting(false);
        setRecordToDelete(null);
        setOpenDeleteDialog(false);
      }
    }
  };
  
  // Confirm deletion
  const confirmDelete = (id: string) => {
    if (!isAuthenticated) return;
    setRecordToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Scroll to bottom if requested
  useEffect(() => {
    if (!currentSearch) return;
    
    const searchParams = new URLSearchParams(currentSearch);
    if (searchParams.get('scrollToBottom') === 'true' && tableEndRef.current) {
      tableEndRef.current.scrollIntoView({ behavior: 'smooth' });
      // Clean up the URL - only if we're in a browser context with history
      if (window.history && typeof location !== 'string' && location.search) {
        const newParams = new URLSearchParams(location.search);
        newParams.delete('scrollToBottom');
        
        const newSearch = newParams.toString();
        const newUrl = `${currentLocation}${newSearch ? `?${newSearch}` : ''}`;
        
        // Update URL without reloading
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [currentSearch, currentLocation, location]);
  
  return (
    <ErrorBoundary>
      <TableHeader data={data} canExport={isAuthenticated} />
      
      <ZakatTableContent data={data} onDeleteClick={confirmDelete} showAddress={!isGuest} showActions={isAuthenticated} />
      
      <div ref={tableEndRef}></div>
      
      {isAuthenticated && (
        <DeleteConfirmDialog 
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </ErrorBoundary>
  );
};

export default ZakatTable;
