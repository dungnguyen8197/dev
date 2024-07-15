export interface Supporter {
  id: number;
  name: string;
  amount: number,
  icon?: string;
  createdAt: string | Date;
  regionName: string;
  active: string;
}
