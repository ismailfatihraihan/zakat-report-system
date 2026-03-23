
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { getRecordById, deleteRecord } from "@/services/zakatService";
import { ZakatRecord } from "@/types/ZakatTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/utils/formatters";
import { useAuth } from "@/contexts/AuthContext";

const ViewRecord: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isGuest } = useAuth();
  const [record, setRecord] = useState<ZakatRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  useEffect(() => {
    const fetchRecord = async () => {
      if (id) {
        try {
          const recordData = await getRecordById(id, isGuest);
          if (recordData) {
            setRecord(recordData);
          } else {
            toast.error("Record not found");
            navigate("/");
          }
        } catch (error) {
          console.error("Error fetching record:", error);
          toast.error("Failed to load record");
          navigate("/");
        }
      }
      setLoading(false);
    };
    
    fetchRecord();
  }, [id, navigate, isGuest]);
  
  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy');
  };
  
  // Handle record deletion
  const handleDelete = async () => {
    if (id) {
      try {
        const deleted = await deleteRecord(id);
        if (deleted) {
          toast.success("Record deleted successfully");
          navigate("/");
        } else {
          toast.error("Failed to delete record");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
        toast.error("Failed to delete record");
      }
      setOpenDeleteDialog(false);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading record...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!record) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Record Not Found</h2>
          <p className="text-muted-foreground mb-6">The record you're looking for doesn't exist or has been deleted.</p>
          <button 
            onClick={() => navigate("/")}
            className="text-primary hover:text-primary/80"
          >
            Return to home
          </button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-scale-in">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="mr-4"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl font-semibold flex-1">Record Details</h1>
          {isAuthenticated && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/edit/${record.id}`)}
                className="flex items-center"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setOpenDeleteDialog(true)}
                className="flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Basic Information Card */}
          <Card className="apple-card">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Penginput</dt>
                  <dd>{record.penginput}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Tanggal</dt>
                  <dd>{formatDate(record.tanggal)}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Pembayaran</dt>
                  <dd>{record.pembayaran === "transfer" ? "Transfer" : "Cash"}</dd>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <dt className="text-sm text-muted-foreground">Nama</dt>
                  <dd>{record.nama}</dd>
                </div>
                {!isGuest && (
                  <div className="space-y-1 md:col-span-2">
                    <dt className="text-sm text-muted-foreground">Alamat</dt>
                    <dd>{record.alamat}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
          
          {/* Zakat Fitrah Card */}
          <Card className="apple-card">
            <CardHeader>
              <CardTitle>Zakat Fitrah</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Jiwa Beras</dt>
                  <dd>{record.zakatFitrah.jiwaBeras}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Beras (kg)</dt>
                  <dd>{record.zakatFitrah.berasKg} kg</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Jiwa Uang</dt>
                  <dd>{record.zakatFitrah.jiwaUang}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Uang</dt>
                  <dd>{formatCurrency(record.zakatFitrah.uang)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          {/* Other Donations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Zakat Maal */}
            <Card className="apple-card">
              <CardHeader>
                <CardTitle>Zakat Maal</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Jumlah</dt>
                  <dd>{formatCurrency(record.zakatMaal)}</dd>
                </dl>
              </CardContent>
            </Card>
            
            {/* Infaq */}
            <Card className="apple-card">
              <CardHeader>
                <CardTitle>Infaq</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="space-y-1">
                    <dt className="text-sm text-muted-foreground">Beras</dt>
                    <dd>{record.infaq.beras} kg</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm text-muted-foreground">Uang</dt>
                    <dd>{formatCurrency(record.infaq.uang)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            {/* Fidyah */}
            <Card className="apple-card">
              <CardHeader>
                <CardTitle>Fidyah</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="space-y-1">
                    <dt className="text-sm text-muted-foreground">Beras</dt>
                    <dd>{record.fidyah.beras} kg</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-sm text-muted-foreground">Uang</dt>
                    <dd>{formatCurrency(record.fidyah.uang)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
          
          {/* Totals */}
          <Card className="apple-card bg-muted/50">
            <CardHeader>
              <CardTitle>Total</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Total Beras</dt>
                  <dd className="text-lg font-semibold">{record.totalBeras} kg</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm text-muted-foreground">Total Uang</dt>
                  <dd className="text-lg font-semibold">{formatCurrency(record.totalUang)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {isAuthenticated && (
        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <AlertDialogContent className="glass-container">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Layout>
  );
};

export default ViewRecord;
