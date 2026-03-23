
import { supabase } from "@/integrations/supabase/client";
import { ZakatFormData, ZakatRecord } from "@/types/ZakatTypes";
import { mapDbRecordToZakatRecord, prepareRecordForDb } from "./zakatTransformService";

// Get all records from Supabase, filtered by period
export const getAllRecords = async (period?: string, useGuestView: boolean = false): Promise<ZakatRecord[]> => {
  let query = supabase
    .from(useGuestView ? 'zakat_records_public' : 'zakat_records')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (period) {
    query = query.eq('period', period);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching records:", error);
    throw error;
  }

  // Map the database records to our application's format
  return data.map(mapDbRecordToZakatRecord);
};

// Get a single record by ID
export const getRecordById = async (id: string, useGuestView: boolean = false): Promise<ZakatRecord | null> => {
  const { data, error } = await supabase
    .from(useGuestView ? 'zakat_records_public' : 'zakat_records')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Record not found
      return null;
    }
    console.error("Error fetching record:", error);
    throw error;
  }

  if (!data) return null;

  return mapDbRecordToZakatRecord(data);
};

// Create a new record
export const createRecord = async (formData: ZakatFormData): Promise<ZakatRecord> => {
  const dbRecord = prepareRecordForDb(formData);

  const { data, error } = await supabase
    .from('zakat_records')
    .insert(dbRecord)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating record:", error);
    throw error;
  }

  return mapDbRecordToZakatRecord(data);
};

// Update an existing record
export const updateRecord = async (id: string, formData: ZakatFormData): Promise<ZakatRecord | null> => {
  const dbRecord = prepareRecordForDb(formData);

  const { data, error } = await supabase
    .from('zakat_records')
    .update({
      ...dbRecord,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating record:", error);
    throw error;
  }

  return mapDbRecordToZakatRecord(data);
};

// Delete a record
export const deleteRecord = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('zakat_records')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting record:", error);
    throw error;
  }
  
  return true;
};
