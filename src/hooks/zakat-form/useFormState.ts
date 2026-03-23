
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ZakatFormData, ZakatRecord } from "@/types/ZakatTypes";
import { BERAS_PER_JIWA } from "./constants";
import { validateJiwaInput } from "./validators";
import { calculateBerasFromJiwa, calculateUangFromJiwa } from "@/utils/calculators";

export const useFormState = (initialData?: ZakatRecord, isEdit: boolean = false, period: string = "", initialRate: number = 37500) => {
  const [formData, setFormData] = useState<ZakatFormData>({
    period: period,
    penginput: "",
    pembayaran: "cash",
    tanggal: format(new Date(), "yyyy-MM-dd"),
    nama: "",
    alamat: "",
    zakatFitrah: {
      jiwaBeras: 0,
      berasKg: 0,
      jiwaUang: 0,
      uang: 0
    },
    zakatMaal: 0,
    infaq: {
      beras: 0,
      uang: 0
    },
    fidyah: {
      beras: 0,
      uang: 0
    }
  });
  
  const [zakatFitrahRate, setZakatFitrahRate] = useState(initialRate);
  
  // Load initial data if editing
  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        period: initialData.period,
        penginput: initialData.penginput,
        pembayaran: initialData.pembayaran ?? "cash",
        tanggal: format(new Date(initialData.tanggal), "yyyy-MM-dd"),
        nama: initialData.nama,
        alamat: initialData.alamat,
        zakatFitrah: { 
          jiwaBeras: initialData.zakatFitrah.jiwaBeras,
          berasKg: initialData.zakatFitrah.berasKg,
          jiwaUang: initialData.zakatFitrah.jiwaUang,
          uang: initialData.zakatFitrah.uang
        },
        zakatMaal: initialData.zakatMaal,
        infaq: { 
          beras: initialData.infaq.beras,
          uang: initialData.infaq.uang
        },
        fidyah: { 
          beras: initialData.fidyah.beras,
          uang: initialData.fidyah.uang
        }
      });
    }
  }, [initialData, isEdit]);

  // Keep period in sync for new records when the active period changes.
  useEffect(() => {
    if (!isEdit) {
      setFormData((prev) => ({
        ...prev,
        period,
      }));
    }
  }, [period, isEdit]);

  // Effect to calculate zakat fitrah beras based on jiwa count
  useEffect(() => {
    if (formData.zakatFitrah.jiwaBeras > 0) {
      const calculatedBerasKg = calculateBerasFromJiwa(formData.zakatFitrah.jiwaBeras, BERAS_PER_JIWA);
      setFormData(prev => ({
        ...prev,
        zakatFitrah: {
          ...prev.zakatFitrah,
          berasKg: calculatedBerasKg
        }
      }));
    }
  }, [formData.zakatFitrah.jiwaBeras]);
  
  // Effect to calculate zakat fitrah uang based on jiwa count and rate
  useEffect(() => {
    if (formData.zakatFitrah.jiwaUang > 0) {
      const calculatedUang = calculateUangFromJiwa(formData.zakatFitrah.jiwaUang, zakatFitrahRate);
      setFormData(prev => ({
        ...prev,
        zakatFitrah: {
          ...prev.zakatFitrah,
          uang: calculatedUang
        }
      }));
    }
  }, [formData.zakatFitrah.jiwaUang, zakatFitrahRate]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      
      if (parent === "zakatFitrah") {
        // Apply max validation for jiwa fields
        if ((child === "jiwaBeras" || child === "jiwaUang") && 
            !validateJiwaInput(child === "jiwaBeras" ? "Jiwa Beras" : "Jiwa Uang", Number(value))) {
          return;
        }
        
        setFormData(prev => ({
          ...prev,
          zakatFitrah: {
            ...prev.zakatFitrah,
            [child]: value === "" ? 0 : Number(value)
          }
        }));
      } else if (parent === "infaq") {
        setFormData(prev => ({
          ...prev,
          infaq: {
            ...prev.infaq,
            [child]: value === "" ? 0 : Number(value)
          }
        }));
      } else if (parent === "fidyah") {
        setFormData(prev => ({
          ...prev,
          fidyah: {
            ...prev.fidyah,
            [child]: value === "" ? 0 : Number(value)
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === "nama" || name === "alamat" || name === "penginput" || name === "tanggal" 
          ? value 
          : (value === "" ? 0 : Number(value))
      }));
    }
  };

  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle zakat fitrah rate change
  const handleRateChange = (rate: number) => {
    setZakatFitrahRate(rate);
  };
  
  // Reset the form
  const handleReset = () => {
    if (isEdit && initialData) {
      setFormData({
        period: initialData.period,
        penginput: initialData.penginput,
        pembayaran: initialData.pembayaran ?? "cash",
        tanggal: format(new Date(initialData.tanggal), "yyyy-MM-dd"),
        nama: initialData.nama,
        alamat: initialData.alamat,
        zakatFitrah: { 
          jiwaBeras: initialData.zakatFitrah.jiwaBeras,
          berasKg: initialData.zakatFitrah.berasKg,
          jiwaUang: initialData.zakatFitrah.jiwaUang,
          uang: initialData.zakatFitrah.uang
        },
        zakatMaal: initialData.zakatMaal,
        infaq: { 
          beras: initialData.infaq.beras,
          uang: initialData.infaq.uang
        },
        fidyah: { 
          beras: initialData.fidyah.beras,
          uang: initialData.fidyah.uang
        }
      });
    } else {
      setFormData({
        period,
        penginput: "",
        pembayaran: "cash",
        tanggal: format(new Date(), "yyyy-MM-dd"),
        nama: "",
        alamat: "",
        zakatFitrah: {
          jiwaBeras: 0,
          berasKg: 0,
          jiwaUang: 0,
          uang: 0
        },
        zakatMaal: 0,
        infaq: {
          beras: 0,
          uang: 0
        },
        fidyah: {
          beras: 0,
          uang: 0
        }
      });
      setZakatFitrahRate(initialRate);
    }
  };

  return {
    formData,
    zakatFitrahRate,
    setFormData,
    handleInputChange,
    handleSelectChange,
    handleRateChange,
    handleReset
  };
};
