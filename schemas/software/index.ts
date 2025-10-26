export interface CreateSoftwareData {
  name: string;
  vendor?: string;
  category?: string;
  licenseType?: string;
  defaultExpiry?: number;
  website?: string;
  description?: string;
}

export interface UpdateSoftwareData {
  name?: string;
  vendor?: string;
  category?: string;
  licenseType?: string;
  defaultExpiry?: number;
  website?: string;
  description?: string;
}
