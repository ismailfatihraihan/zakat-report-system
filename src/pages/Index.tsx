
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ZakatTable from "@/components/ZakatTable";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ZakatRecord } from "@/types/ZakatTypes";
import { getAllRecords, initializeWithSampleData } from "@/services/zakatService";
import { PlusCircle, BarChart, Table, LayoutList } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePeriod } from "@/contexts/PeriodContext";

const Index: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { currentPeriod } = usePeriod();
  
  // Load records using React Query
  const { data: records = [], refetch, isLoading, error } = useQuery({
    queryKey: ['zakatRecords', currentPeriod],
    queryFn: () => getAllRecords(currentPeriod),
    meta: {
      onError: () => {
        toast.error("Failed to load records. Please try again later.");
      }
    }
  });
  
  // Initialize sample data if needed
  useEffect(() => {
    if (import.meta.env.DEV) {
      initializeWithSampleData(currentPeriod).catch(err => {
        console.error("Error initializing sample data:", err);
      });
    }
  }, [currentPeriod]);
  
  useEffect(() => {
    // Check for tab param in URL
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && (tabParam === 'dashboard' || tabParam === 'records' || tabParam === 'cards')) {
      setActiveTab(tabParam);
    }
  }, [location.search]);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL without reloading the page
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', value);
    
    // Preserve other query params except scrollToBottom
    if (searchParams.has('scrollToBottom')) {
      searchParams.delete('scrollToBottom');
    }
    
    navigate(`?${searchParams.toString()}`, { replace: true });
  };
  
  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 pb-4 md:pb-6 border-b border-border/60">
          <div>
            <h1 className="protocol-heading text-xl sm:text-2xl md:text-3xl">Zakat Management System</h1>
            <p className="protocol-subheading text-sm md:text-base">
              Manage and track zakat contributions efficiently
            </p>
          </div>
          <Button 
            asChild 
            className="bg-primary hover:bg-primary/90 flex items-center h-9 md:h-10 px-3 md:px-4 gap-1.5 md:gap-2 text-sm"
          >
            <Link to="/add">
              <PlusCircle className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden xs:inline">Input</span> Data Baru
            </Link>
          </Button>
        </div>
        
        <Tabs 
          defaultValue="dashboard" 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="space-y-4 md:space-y-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-1.5 py-1.5 md:py-2.5 text-sm">
              <BarChart className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>Rekapan</span>
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-1.5 py-1.5 md:py-2.5 text-sm">
              <Table className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>Tabel</span>
            </TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-40 md:h-60 w-full bg-card/50 rounded-lg border border-border/30">
              <div className="flex flex-col items-center gap-3 md:gap-4">
                <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="text-muted-foreground text-sm">Loading data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-40 md:h-60 w-full bg-destructive/5 rounded-lg border border-destructive/30 p-4 md:p-6">
              <p className="text-destructive font-medium mb-3 md:mb-4 text-sm md:text-base text-center">Error loading data. Please try again.</p>
              <Button 
                variant="outline" 
                className="mt-1 md:mt-2" 
                onClick={() => refetch()}
                size="sm"
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <TabsContent value="dashboard" className="space-y-4 md:space-y-6 mt-0 md:mt-2">
                <Dashboard data={records} />
              </TabsContent>
              
              <TabsContent value="records" className="space-y-4 md:space-y-6 mt-0 md:mt-2">
                <div className="protocol-card p-0 md:p-1 overflow-hidden">
                  <ZakatTable data={records} onDelete={() => refetch()} />
                </div>
              </TabsContent>
              
              <TabsContent value="cards" className="space-y-4 md:space-y-6 mt-0 md:mt-2">
                <Button 
                  asChild
                  variant="outline" 
                  className="mb-4"
                  size="sm"
                >
                  <Link to="/list">View Full Card List</Link>
                </Button>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
