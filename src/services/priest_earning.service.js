import {
  autoInsertPriestEarningsJobModel,
  getPriestEarningsModel,
} from '../models/priest_earnings.model.js';

export const getPriestEarningsService = async (priestId, filter) => {
  return await getPriestEarningsModel(priestId, filter);
};

export const autoInsertPriestEarningsJobService = async () => {
  return await autoInsertPriestEarningsJobModel();
};
