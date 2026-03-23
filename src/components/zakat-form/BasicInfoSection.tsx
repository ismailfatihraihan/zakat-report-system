
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PENGINPUT_OPTIONS } from "@/types/ZakatTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface BasicInfoSectionProps {
  penginput: string;
  pembayaran: "cash" | "transfer";
  tanggal: string;
  nama: string;
  alamat: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (value: string, name: string) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  penginput,
  pembayaran,
  tanggal,
  nama,
  alamat,
  onInputChange,
  onSelectChange
}) => {
  return (
    <Card className="apple-card">
      <CardHeader>
        <CardTitle>Informasi Muzakki</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input
              id="tanggal"
              name="tanggal"
              type="date"
              value={tanggal}
              onChange={onInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="penginput">Penginput</Label>
            <Select
              value={penginput}
              onValueChange={(value) => onSelectChange(value, "penginput")}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select penginput" />
              </SelectTrigger>
              <SelectContent>
                {PENGINPUT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pembayaran">Pembayaran</Label>
            <Select
              value={pembayaran}
              onValueChange={(value) => onSelectChange(value, "pembayaran")}
            >
              <SelectTrigger className="w-full" id="pembayaran">
                <SelectValue placeholder="Pilih pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nama">Nama Muzakki</Label>
          <Input
            id="nama"
            name="nama"
            value={nama}
            onChange={onInputChange}
            placeholder="Nama lengkap"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="alamat">Alamat</Label>
          <Input
            id="alamat"
            name="alamat"
            value={alamat}
            onChange={onInputChange}
            placeholder="Alamat lengkap"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
