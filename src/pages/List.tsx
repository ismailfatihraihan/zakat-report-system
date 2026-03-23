import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { getAllRecords, deleteRecord } from "@/services/zakatService";
import ZakatCardList from "@/components/zakat-list/ZakatCardList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw, Table, LayoutList, Search, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeleteConfirmDialog from "@/components/zakat-table/DeleteConfirmDialog";
import ZakatTable from "@/components/ZakatTable";
import { usePeriod } from "@/contexts/PeriodContext";
import { PENGINPUT_OPTIONS } from "@/types/ZakatTypes";
const List: React.FC = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("cards");
  const { currentPeriod } = usePeriod();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPenginput, setFilterPenginput] = useState("all");
  const [filterPembayaran, setFilterPembayaran] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // Load records using React Query, sorted by newest first
  const {
    data: records = [],
    refetch,
    isLoading,
    error
  } = useQuery({
    queryKey: ['zakatRecords', currentPeriod],
    queryFn: () => getAllRecords(currentPeriod),
    meta: {
      onError: () => {
        toast.error("Failed to load records. Please try again later.");
      }
    }
  });

  // Sort records to show newest on top
  const sortedRecords = [...records].reverse();

  // Apply client-side filters
  const filteredRecords = useMemo(() => {
    return sortedRecords.filter((record) => {
      // Search by nama or alamat
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = record.nama.toLowerCase().includes(query);
        const matchesAddress = record.alamat.toLowerCase().includes(query);
        if (!matchesName && !matchesAddress) return false;
      }
      // Filter by penginput
      if (filterPenginput !== "all" && record.penginput !== filterPenginput) {
        return false;
      }
      // Filter by pembayaran
      if (filterPembayaran !== "all" && record.pembayaran !== filterPembayaran) {
        return false;
      }
      // Filter by date
      if (filterDate && record.tanggal !== filterDate) {
        return false;
      }
      return true;
    });
  }, [sortedRecords, searchQuery, filterPenginput, filterPembayaran, filterDate]);

  const hasActiveFilters = searchQuery || filterPenginput !== "all" || filterPembayaran !== "all" || filterDate;

  const clearFilters = () => {
    setSearchQuery("");
    setFilterPenginput("all");
    setFilterPembayaran("all");
    setFilterDate("");
  };

  // Handle record deletion
  const handleDelete = async () => {
    if (recordToDelete) {
      setIsDeleting(true);
      try {
        const deleted = await deleteRecord(recordToDelete);
        if (deleted) {
          toast.success("Record deleted successfully");
          refetch();
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
    setRecordToDelete(id);
    setOpenDeleteDialog(true);
  };
  return <Layout forceActivePath="/list">
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 pb-4 md:pb-6 border-b border-border/60">
          <div>
            <h1 className="protocol-heading text-xl sm:text-2xl md:text-3xl">Zakat Records</h1>
            <p className="protocol-subheading text-sm md:text-base">
              View all zakat contributions in different formats
            </p>
          </div>
          {error && <Button variant="outline" className="flex items-center gap-1.5 text-sm" onClick={() => refetch()} size="sm">
              <RotateCcw className="h-3.5 w-3.5" />
              Reload Data
            </Button>}
        </div>
        
        <Tabs defaultValue="cards" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-xs grid-cols-2 mb-4">
            <TabsTrigger value="cards" className="flex items-center gap-1.5">
              <LayoutList className="h-4 w-4" />
              <span>Cards</span>
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-1.5">
              <Table className="h-4 w-4" />
              <span>Table</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Select value={filterPenginput} onValueChange={setFilterPenginput}>
              <SelectTrigger className="w-full sm:w-[160px] h-9">
                <SelectValue placeholder="Penginput" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Penginput</SelectItem>
                {PENGINPUT_OPTIONS.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPembayaran} onValueChange={setFilterPembayaran}>
              <SelectTrigger className="w-full sm:w-[160px] h-9">
                <SelectValue placeholder="Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pembayaran</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full sm:w-[160px] h-9"
            />
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-3">
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
          </div>

          {hasActiveFilters && !isLoading && (
            <p className="text-sm text-muted-foreground mb-3">
              Menampilkan {filteredRecords.length} dari {records.length} data
            </p>
          )}

          <TabsContent value="cards" className="pt-3 md:pt-6">
            {isLoading ? <div className="flex items-center justify-center h-40 md:h-60 w-full bg-card/50 rounded-lg border border-border/30">
                <div className="flex flex-col items-center gap-3 md:gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground text-sm">Loading data...</p>
                </div>
              </div> : error ? <div className="flex flex-col items-center justify-center h-40 md:h-60 w-full bg-destructive/5 rounded-lg border border-destructive/30 p-4 md:p-6">
                <p className="text-destructive font-medium mb-3 md:mb-4 text-sm md:text-base text-center">Error loading data. Please try again.</p>
                <Button variant="outline" className="mt-1 md:mt-2" onClick={() => refetch()} size="sm">
                  Retry
                </Button>
              </div> : <ZakatCardList records={filteredRecords} onDelete={confirmDelete} />}
          </TabsContent>
          
          <TabsContent value="table" className="pt-3 md:pt-6">
            {isLoading ? <div className="flex items-center justify-center h-40 md:h-60 w-full bg-card/50 rounded-lg border border-border/30">
                <div className="flex flex-col items-center gap-3 md:gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground text-sm">Loading data...</p>
                </div>
              </div> : error ? <div className="flex flex-col items-center justify-center h-40 md:h-60 w-full bg-destructive/5 rounded-lg border border-destructive/30 p-4 md:p-6">
                <p className="text-destructive font-medium mb-3 md:mb-4 text-sm md:text-base text-center">Error loading data. Please try again.</p>
                <Button variant="outline" className="mt-1 md:mt-2" onClick={() => refetch()} size="sm">
                  Retry
                </Button>
              </div> : <div className="protocol-card p-0 md:p-1 overflow-hidden">
                <ZakatTable data={filteredRecords} onDelete={() => refetch()} locationPath="/list" />
              </div>}
          </TabsContent>
        </Tabs>
        
        <DeleteConfirmDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog} onConfirm={handleDelete} isDeleting={isDeleting} />
      </div>
    </Layout>;
};
export default List;