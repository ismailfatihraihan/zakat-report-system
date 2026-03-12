
import { ZakatRecord } from "@/types/ZakatTypes";
import { useFormState } from "./zakat-form/useFormState";
import { useFormSubmission } from "./zakat-form/useFormSubmission";
import { usePeriod } from "@/contexts/PeriodContext";

export const useZakatForm = ({ 
  initialData, 
  isEdit = false 
}: { 
  initialData?: ZakatRecord; 
  isEdit?: boolean;
}) => {
  const { currentPeriod, fitrahRateUang } = usePeriod();

  const {
    formData,
    zakatFitrahRate,
    handleInputChange,
    handleSelectChange,
    handleRateChange,
    handleReset
  } = useFormState(initialData, isEdit, currentPeriod, fitrahRateUang);
  
  const {
    isSubmitting,
    showReviewModal,
    handleSubmit,
    handleConfirmSubmit,
    handleCloseReviewModal
  } = useFormSubmission(formData, initialData, isEdit);

  return {
    formData,
    zakatFitrahRate,
    isSubmitting,
    showReviewModal,
    handleInputChange,
    handleSelectChange,
    handleRateChange,
    handleSubmit,
    handleConfirmSubmit,
    handleCloseReviewModal,
    handleReset
  };
};
