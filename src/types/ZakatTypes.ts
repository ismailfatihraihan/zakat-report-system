
export type PaymentMethod = "cash" | "transfer";

export interface ZakatRecord {
  id: string;
  period: string;
  penginput: string;
  pembayaran: PaymentMethod;
  tanggal: string;
  nama: string;
  alamat: string;
  zakatFitrah: {
    jiwaBeras: number;
    berasKg: number;
    jiwaUang: number;
    uang: number;
  };
  zakatMaal: number;
  infaq: {
    beras: number;
    uang: number;
  };
  fidyah: {
    beras: number;
    uang: number;
  };
  totalBeras: number;
  totalUang: number;
  createdAt: string;
  updatedAt: string;
}

export type ZakatFormData = Omit<ZakatRecord, 'id' | 'totalBeras' | 'totalUang' | 'createdAt' | 'updatedAt'>;

export interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, record: ZakatRecord) => React.ReactNode;
}

export interface DailyReportItem {
  label: string;
  value: number;
  color: string;
  unit?: string;
}

export interface DailyReportData {
  date: string;
  totalRecords: number;
  items: DailyReportItem[];
}

export interface DailyReportTableRow {
  id: number;
  category: string;
  value: number;
  unit?: string;
  percentage: number;
}

export interface ReportData {
  date: string;
  zakatFitrahJiwaBeras: number;
  zakatFitrahBerasKg: number;
  zakatFitrahJiwaUang: number;
  zakatFitrahUang: number;
  zakatMaal: number;
  infaqBeras: number;
  infaqUang: number;
  fidyahBeras: number;
  fidyahUang: number;
  totalBeras: number;
  totalUang: number;
}

export interface ReportSummary {
  totalJiwaBeras: number;
  totalBerasKg: number; 
  totalJiwaUang: number;
  totalZakatFitrahUang: number;
  totalZakatMaal: number;
  totalInfaqBeras: number;
  totalInfaqUang: number;
  totalFidyahBeras: number;
  totalFidyahUang: number;
  totalAllBeras: number;
  totalAllUang: number;
}

export const ZAKAT_FITRAH_RATE_PER_JIWA = 37500;

export const PENGINPUT_OPTIONS = [
  "Rais", 
  "Rizal", 
  "Ismail", 
  "Raya", 
  "Arif", 
  "Hendri", 
  "Hasbi", 
  "Ibnu", 
  "Asep Ali"
];
