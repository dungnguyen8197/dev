export interface AddressResult {
  prefcode: string;
  address2: string;
  address3: string;
}

export interface AddressResponse {
  results: AddressResult[];
  message: string | null;
  status: number;
}