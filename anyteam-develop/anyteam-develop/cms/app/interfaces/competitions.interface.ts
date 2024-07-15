export interface CompetitionListInterface {
  count: number;
  offset: number;
  list: Array<[]>;
}

export interface CompetitionFormInterface {
  name: string;
}

export interface SearchCompetitionQuery {
  search?: string;
  limit?: number;
  offset?: number;
}
