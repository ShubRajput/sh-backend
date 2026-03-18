import {
    // Temple types
    getAllTempleTypesModel,
    createTempleTypeModel,
    updateTempleTypeModel,
    deleteTempleTypeModel,
    // Ritual modes
    getAllRitualModesModel,
    createRitualModeModel,
    updateRitualModeModel,
    deleteRitualModeModel,
    // Ritual groups
    getAllRitualGroupsModel,
    createRitualGroupModel,
    updateRitualGroupModel,
    deleteRitualGroupModel,
    // Preview
    getAllPoojasWithReligionModel,
} from "../models/admin_pricing_config.model.js";

// ==================== TEMPLE TYPES ====================
export const getAllTempleTypesService = async () => getAllTempleTypesModel();
export const createTempleTypeService = async (data) => createTempleTypeModel(data);
export const updateTempleTypeService = async (id, data) => updateTempleTypeModel(id, data);
export const deleteTempleTypeService = async (id) => deleteTempleTypeModel(id);

// ==================== RITUAL MODES ====================
export const getAllRitualModesService = async () => getAllRitualModesModel();
export const createRitualModeService = async (data) => createRitualModeModel(data);
export const updateRitualModeService = async (id, data) => updateRitualModeModel(id, data);
export const deleteRitualModeService = async (id) => deleteRitualModeModel(id);

// ==================== RITUAL GROUPS ====================
export const getAllRitualGroupsService = async () => getAllRitualGroupsModel();
export const createRitualGroupService = async (data) => createRitualGroupModel(data);
export const updateRitualGroupService = async (id, data) => updateRitualGroupModel(id, data);
export const deleteRitualGroupService = async (id) => deleteRitualGroupModel(id);

// ==================== PACKAGES PREVIEW ====================
export const getPackagesPreviewService = async () => {
    const [poojas, templeTypes, modes, groups] = await Promise.all([
        getAllPoojasWithReligionModel(),
        getAllTempleTypesModel(),
        getAllRitualModesModel(),
        getAllRitualGroupsModel(),
    ]);

    // Group poojas by religion
    const religionMap = {};
    for (const pooja of poojas) {
        const key = pooja.religion_id;
        if (!religionMap[key]) {
            religionMap[key] = {
                religion_id: pooja.religion_id,
                religion_name: pooja.religion_name,
                feature_name: pooja.feature_name,
                rituals: [],
            };
        }

        // Build 16 packages for each ritual (4 modes × 4 groups)
        const packages = [];
        for (const mode of modes) {
            for (const group of groups) {
                const packageMultiplier = parseFloat(mode.multiplier) * parseFloat(group.multiplier);
                const packageName = `${group.display_name} ${mode.name.split(" ")[0]}`;
                const templeBreakdown = {};
                for (const temple of templeTypes) {
                    const finalPrice = parseFloat(pooja.price) * parseFloat(temple.multiplier) * packageMultiplier;
                    templeBreakdown[temple.name] = {
                        temple_id: temple.id,
                        price: Math.round(finalPrice),
                        multiplier: parseFloat(temple.multiplier),
                    };
                }
                packages.push({
                    package_name: packageName,
                    mode_name: mode.name,
                    mode_multiplier: parseFloat(mode.multiplier),
                    group_name: group.name,
                    group_display_name: group.display_name,
                    group_multiplier: parseFloat(group.multiplier),
                    package_multiplier: Math.round(packageMultiplier * 100) / 100,
                    by_temple: templeBreakdown,
                });
            }
        }

        religionMap[key].rituals.push({
            id: pooja.id,
            name: pooja.pooja_name,
            base_price: parseFloat(pooja.price),
            currency: pooja.currency || "INR",
            packages,
        });
    }

    return {
        temple_types: templeTypes,
        modes,
        groups,
        religions: Object.values(religionMap),
    };
};
