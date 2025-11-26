export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type Option = {
  value: string;
  label: string;
};

export type User = {
  id: number;
  uuid: string;
  email: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  zip_code: string | null;
  role_id: number;
  updated_at: string | null;
  created_at: string;
  deleted_at: string | null;
  /* relation */
  role_name: string;
};


export type Role = {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  updated_at: string | null;
  created_at: string;
  deleted_at: string | null;
};

export type Access = {
  id: number;
  uuid: string;
  code: string;
  label: string;
  module_id: number;
  created_at: string;
  updated_at: string | null;
  /* relation */
  module_name: string;
};
