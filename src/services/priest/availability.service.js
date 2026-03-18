import {
    upsertPriestAvailabilityModel,
    getPriestAvailabilityModel,
    addPriestUnavailabilityModel,
    getPriestUnavailabilityModel,
    deletePriestUnavailabilityModel,
} from "../../models/priest/availability.model.js";

export const upsertPriestAvailabilityService = async (priestId, data) => {
    return await upsertPriestAvailabilityModel(priestId, data);
};

export const getPriestAvailabilityService = async (priestId) => {
    return await getPriestAvailabilityModel(priestId);
};

export const addPriestUnavailabilityService = async (priestId, data) => {
    return await addPriestUnavailabilityModel(priestId, data);
};

export const getPriestUnavailabilityService = async (priestId) => {
    return await getPriestUnavailabilityModel(priestId);
};

export const deletePriestUnavailabilityService = async (priestId, unavailabilityId) => {
    return await deletePriestUnavailabilityModel(priestId, unavailabilityId);
};
