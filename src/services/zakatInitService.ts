
import { ZakatFormData } from "@/types/ZakatTypes";
import { createRecord } from "./zakatApiService";

// Initialize with sample data if empty
export const initializeWithSampleData = async (period: string): Promise<void> => {
  try {
    const { count } = await supabase
      .from('zakat_records')
      .select('*', { count: 'exact', head: true });
    
    if (count === 0) {
      const sampleData: ZakatFormData = {
        period,
        penginput: "Admin",
        pembayaran: "cash",
        tanggal: new Date().toISOString().split('T')[0],
        nama: "Ahmad Hidayat",
        alamat: "Jl. Mawar No. 12",
        zakatFitrah: {
          jiwaBeras: 4,
          berasKg: 14,
          jiwaUang: 0,
          uang: 0
        },
        zakatMaal: 500000,
        infaq: {
          beras: 2,
          uang: 100000
        },
        fidyah: {
          beras: 0,
          uang: 0
        }
      };
      
      await createRecord(sampleData);
    }
  } catch (error) {
    console.error("Error checking/initializing records:", error);
  }
};

// Import supabase client
import { supabase } from "@/integrations/supabase/client";
