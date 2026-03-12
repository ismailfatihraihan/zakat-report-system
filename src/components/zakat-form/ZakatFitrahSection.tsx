import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

interface ZakatFitrahSectionProps {
  zakatFitrah: {
    jiwaBeras: number;
    berasKg: number;
    jiwaUang: number;
    uang: number;
  };
  zakatFitrahRate: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRateChange: (rate: number) => void;
}

const ZakatFitrahSection: React.FC<ZakatFitrahSectionProps> = ({
  zakatFitrah,
  zakatFitrahRate,
  onInputChange,
  onRateChange
}) => {
  const [manualInput, setManualInput] = useState(false);

  const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "manual") {
      setManualInput(true);
    } else {
      setManualInput(false);
      const rate = parseInt(value, 10);
      onRateChange(rate);
    }
  };

  return (
    <Card className="apple-card">
      <CardHeader>
        <CardTitle>Zakat Fitrah</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Jiwa Beras */}
          <div className="space-y-2">
            <Label htmlFor="zakatFitrah.jiwaBeras">Jiwa Beras (max 100)</Label>
            <Input
              id="zakatFitrah.jiwaBeras"
              name="zakatFitrah.jiwaBeras"
              type="number"
              min="0"
              max="100"
              value={zakatFitrah.jiwaBeras}
              onChange={onInputChange}
              placeholder="0"
            />
          </div>

          {/* Beras */}
          <div className="space-y-2">
            <Label htmlFor="zakatFitrah.berasKg">Beras (kg) - 2.5kg/jiwa</Label>
            <Input
              id="zakatFitrah.berasKg"
              name="zakatFitrah.berasKg"
              type="number"
              min="0"
              step="0.1"
              value={zakatFitrah.berasKg}
              onChange={onInputChange}
              placeholder="0"
            />
          </div>

          {/* Jiwa Uang */}
          <div className="space-y-2">
            <Label htmlFor="zakatFitrah.jiwaUang">Jiwa Uang (max 100)</Label>
            <Input
              id="zakatFitrah.jiwaUang"
              name="zakatFitrah.jiwaUang"
              type="number"
              min="0"
              max="100"
              value={zakatFitrah.jiwaUang}
              onChange={onInputChange}
              placeholder="0"
            />
          </div>

          {/* Uang */}
          <div className="space-y-2">
            <Label htmlFor="zakatFitrah.uang">
              Uang ({formatCurrency(zakatFitrahRate)}/jiwa)
            </Label>
            <select 
              onChange={handleRateChange} 
              value={manualInput ? "manual" : zakatFitrahRate} 
              className="border p-2 rounded w-full"
              aria-label="Select rate per jiwa"
            >
              <option value="37500">37,500</option>
              <option value="40000">40,000</option>
              <option value="50000">50,000</option>
              <option value="manual">Masukkan Manual</option>
            </select>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
              <Input
                id="zakatFitrah.uang"
                name="zakatFitrah.uang"
                type="number"
                min="0"
                value={zakatFitrah.uang}
                placeholder="0"
                className="pl-9"
                onChange={onInputChange}
                disabled={!manualInput}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZakatFitrahSection;