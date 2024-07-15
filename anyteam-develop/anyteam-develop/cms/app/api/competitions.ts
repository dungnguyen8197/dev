import {
  SearchCompetitionQuery,
  CompetitionListInterface,
  CompetitionFormInterface,
} from "~/interfaces/competitions.interface";
import { apiRequest } from "~/api/common/apiRequest";
import apiMethod from "~/api/common/apiMethod";

export const getCompetitionList = (
  query: SearchCompetitionQuery
): Promise<CompetitionListInterface> => {
  const url = "/api/v1/admin/competitions";
  return apiRequest(url, apiMethod.get, {}, false, query);
};

export const deleteCompetitionById = (id: number) => {
  const url = `/api/v1/admin/competitions/${id}`;
  return apiRequest(url, apiMethod.delete);
};

export const createCompetition = (
  competition: CompetitionFormInterface
): Promise<void> => {
  const url = "/api/v1/admin/competitions";
  return apiRequest(url, apiMethod.post, competition);
};

export const getCompetitionById = (
  id: number
): Promise<CompetitionFormInterface> => {
  const url = `/api/v1/admin/competitions/${id}`;
  return apiRequest(url, apiMethod.get);
};

export const updateCompetition = (
  id: number,
  competition: CompetitionFormInterface
): Promise<void> => {
  const url = `/api/v1/admin/competitions/${id}`;
  return apiRequest(url, apiMethod.patch, competition);
};
