export interface RegisterTeam {
  uuid: string;
  id?: number;
  name: string;
  status: number;
  competition_id: number;
}

export interface UpdateTeam {
  id?: number;
  name: string;
  competition_id: number;
}