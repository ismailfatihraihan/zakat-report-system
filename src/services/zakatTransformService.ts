
import { ZakatFormData, ZakatRecord } from "@/types/ZakatTypes";
import { calculateTotals } from "@/utils/calculators";

// Map database record to ZakatRecord
export const mapDbRecordToZakatRecord = (data: any): ZakatRecord => {
  return {
    id: data.id,
    period: data.period,
    penginput: data.penginput,
    pembayaran: data.pembayaran ?? "cash",
    tanggal: data.tanggal,
    nama: data.nama,
    alamat: data.alamat,
    zakatFitrah: {
      jiwaBeras: data.zakat_fitrah_jiwa_beras,
      berasKg: data.zakat_fitrah_beras_kg,
      jiwaUang: data.zakat_fitrah_jiwa_uang,
      uang: data.zakat_fitrah_uang
    },
    zakatMaal: data.zakat_maal,
    infaq: {
      beras: data.infaq_beras,
      uang: data.infaq_uang
    },
    fidyah: {
      beras: data.fidyah_beras,
      uang: data.fidyah_uang
    },
    totalBeras: data.total_beras,
    totalUang: data.total_uang,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

// Prepare record for database
export const prepareRecordForDb = (formData: ZakatFormData) => {
  // Calculate totals
  const { totalBeras, totalUang } = calculateTotals(formData);
  
  return {
    period: formData.period,
    penginput: formData.penginput,
    pembayaran: formData.pembayaran,
    tanggal: formData.tanggal,
    nama: formData.nama,
    alamat: formData.alamat,
    zakat_fitrah_jiwa_beras: formData.zakatFitrah.jiwaBeras,
    zakat_fitrah_beras_kg: formData.zakatFitrah.berasKg,
    zakat_fitrah_jiwa_uang: formData.zakatFitrah.jiwaUang,
    zakat_fitrah_uang: formData.zakatFitrah.uang,
    zakat_maal: formData.zakatMaal,
    infaq_beras: formData.infaq.beras,
    infaq_uang: formData.infaq.uang,
    fidyah_beras: formData.fidyah.beras,
    fidyah_uang: formData.fidyah.uang,
    total_beras: totalBeras,
    total_uang: totalUang
  };
};
