export interface PurchaseCreateRequest {
  amount: number;
  type: number;
  team_id: number;
}

export interface PurchaseCreateResponse {
  purchase_id: number;
}

export interface PurchaseResponse {
  id: number,
  organization_id: number,
  organization_name: string,
  team_name: string,
  team_id: null | number,
  purchased_at: string | Date,
  type: number,
  amount: number,
  is_anonymous: boolean,
  reward: string,
}