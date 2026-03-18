import {
  createHowWePrayModel,
  deleteHowWePrayByIdModel,
  getAllHowWePrayModel,
  getHowWePrayByIdModel,
  updateHowWePrayByIdModel,
} from "../models/admin_how_we_pray.model.js";

export const createHowWePrayService = async (data) => {
  try {
    const result = await createHowWePrayModel(data);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getAllHowWePrayService = async (religionId) => {
  try {
    const result = await getAllHowWePrayModel(religionId);
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteHowWePrayService = async (id) => {
  try {
    const result = await deleteHowWePrayByIdModel(id);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getHowWePrayByIdService = async (id) => {
  try {
    const result = await getHowWePrayByIdModel(id);
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateHowWePrayByIdService = async (id, data) => {
  try {
    const result = await updateHowWePrayByIdModel(id, data);
    return result;
  } catch (error) {
    throw error;
  }
};
