
import React from "react";
import { useNavigate } from "react-router-dom";
import { ZakatRecord } from "@/types/ZakatTypes";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useZakatForm } from "@/hooks/useZakatForm";
import ReviewModal from "./zakat-form/ReviewModal";

// Import form section components
import BasicInfoSection from "./zakat-form/BasicInfoSection";
import ZakatFitrahSection from "./zakat-form/ZakatFitrahSection";
import ZakatMaalSection from "./zakat-form/ZakatMaalSection";
import InfaqSection from "./zakat-form/InfaqSection";
import FidyahSection from "./zakat-form/FidyahSection";
import FormActions from "./zakat-form/FormActions";

interface ZakatFormProps {
  initialData?: ZakatRecord;
  isEdit?: boolean;
}

const ZakatForm: React.FC<ZakatFormProps> = ({ initialData, isEdit = false }) => {
  const navigate = useNavigate();
  
  const {
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
  } = useZakatForm({ initialData, isEdit });
  
  return (
    <div className="w-full max-w-4xl mx-auto animate-scale-in px-4 sm:px-6">
      <div className="mb-4 md:mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/")}
          className="mr-2 md:mr-4"
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-xl md:text-2xl font-semibold">{isEdit ? "Edit Record" : "Add New Record"}</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 md:space-y-6">
          {/* Basic Information Section */}
          <BasicInfoSection
            penginput={formData.penginput}
            tanggal={formData.tanggal}
            nama={formData.nama}
            alamat={formData.alamat}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />
          
          {/* Zakat Fitrah Section */}
          <ZakatFitrahSection
            zakatFitrah={formData.zakatFitrah}
            zakatFitrahRate={zakatFitrahRate}
            onInputChange={handleInputChange}
            onRateChange={handleRateChange}
          />
          
          {/* Zakat Maal, Infaq & Fidyah Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Infaq */}
            <InfaqSection
              infaq={formData.infaq}
              onInputChange={handleInputChange}
            />

            {/* Zakat Maal */}
            <ZakatMaalSection
              zakatMaal={formData.zakatMaal}
              onInputChange={handleInputChange}
            />
            
            {/* Fidyah */}
            <FidyahSection
              fidyah={formData.fidyah}
              onInputChange={handleInputChange}
            />
          </div>
          
          {/* Form Actions */}
          <FormActions
            isEdit={isEdit}
            isSubmitting={isSubmitting}
            onReset={handleReset}
          />
        </div>
      </form>

      {/* Review Modal */}
      <ReviewModal 
        isOpen={showReviewModal}
        onClose={handleCloseReviewModal}
        onConfirm={handleConfirmSubmit}
        onEdit={handleCloseReviewModal}
        formData={formData}
      />
    </div>
  );
};

export default ZakatForm;
