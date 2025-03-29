
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ZakatFormData, ZakatRecord } from "@/types/ZakatTypes";
import { createRecord, updateRecord } from "@/services/zakatApiService";
import { toast } from "sonner";

export const useFormSubmission = (
  formData: ZakatFormData,
  initialData?: ZakatRecord,
  isEdit: boolean = false
) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Handle form review before actual submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Show review modal instead of submitting immediately
    setShowReviewModal(true);
  };

  // Handle actual submission after review confirmation
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (isEdit && initialData) {
        const updated = await updateRecord(initialData.id, formData);
        if (updated) {
          toast.success("Record updated successfully");
          navigate("/list");
        } else {
          toast.error("Failed to update record");
        }
      } else {
        await createRecord(formData);
        toast.success("Record created successfully");
        // Redirect to list page instead of dashboard
        navigate("/list");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred while saving the record");
    } finally {
      setIsSubmitting(false);
      setShowReviewModal(false);
    }
  };

  // Close review modal
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  return {
    isSubmitting,
    showReviewModal,
    handleSubmit,
    handleConfirmSubmit,
    handleCloseReviewModal
  };
};
