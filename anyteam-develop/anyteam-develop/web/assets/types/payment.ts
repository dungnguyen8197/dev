export interface Payment {
  id: number;
  created_at: string;
  amount: number;
  type: string;
  team_id: number;
  team_name: string;
}

export interface PaymentRO {
  list: Payment[];
  total: number;
  page: number;
}