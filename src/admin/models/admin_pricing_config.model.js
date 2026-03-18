import pool from "../../config/db.config.js";
import { BadRequestError } from "../../utils/errors.utils.js";

// ==================== TEMPLE TYPES ====================

export const getAllTempleTypesModel = async () => {
    const [rows] = await pool.execute("SELECT * FROM temple_types ORDER BY id ASC");
    return rows;
};

export const createTempleTypeModel = async ({ name, multiplier }) => {
    const [result] = await pool.execute(
        "INSERT INTO temple_types (name, multiplier) VALUES (?, ?)",
        [name, multiplier]
    );
    return { id: result.insertId, name, multiplier };
};

export const updateTempleTypeModel = async (id, { name, multiplier }) => {
    const [result] = await pool.execute(
        "UPDATE temple_types SET name = ?, multiplier = ? WHERE id = ?",
        [name, multiplier, id]
    );
    return result.affectedRows > 0;
};

export const deleteTempleTypeModel = async (id) => {
    const [result] = await pool.execute("DELETE FROM temple_types WHERE id = ?", [id]);
    return result.affectedRows > 0;
};

// ==================== RITUAL MODES ====================

export const getAllRitualModesModel = async () => {
    const [rows] = await pool.execute("SELECT * FROM ritual_modes ORDER BY id ASC");
    return rows;
};

export const createRitualModeModel = async ({ name, multiplier }) => {
    const [result] = await pool.execute(
        "INSERT INTO ritual_modes (name, multiplier) VALUES (?, ?)",
        [name, multiplier]
    );
    return { id: result.insertId, name, multiplier };
};

export const updateRitualModeModel = async (id, { name, multiplier }) => {
    const [result] = await pool.execute(
        "UPDATE ritual_modes SET name = ?, multiplier = ? WHERE id = ?",
        [name, multiplier, id]
    );
    return result.affectedRows > 0;
};

export const deleteRitualModeModel = async (id) => {
    const [result] = await pool.execute("DELETE FROM ritual_modes WHERE id = ?", [id]);
    return result.affectedRows > 0;
};

// ==================== RITUAL GROUPS ====================

export const getAllRitualGroupsModel = async () => {
    const [rows] = await pool.execute("SELECT * FROM ritual_groups ORDER BY id ASC");
    return rows;
};

export const createRitualGroupModel = async ({ name, display_name, multiplier }) => {
    const [result] = await pool.execute(
        "INSERT INTO ritual_groups (name, display_name, multiplier) VALUES (?, ?, ?)",
        [name, display_name, multiplier]
    );
    return { id: result.insertId, name, display_name, multiplier };
};

export const updateRitualGroupModel = async (id, { name, display_name, multiplier }) => {
    const [result] = await pool.execute(
        "UPDATE ritual_groups SET name = ?, display_name = ?, multiplier = ? WHERE id = ?",
        [name, display_name, multiplier, id]
    );
    return result.affectedRows > 0;
};

export const deleteRitualGroupModel = async (id) => {
    const [result] = await pool.execute("DELETE FROM ritual_groups WHERE id = ?", [id]);
    return result.affectedRows > 0;
};

// ==================== PACKAGES PREVIEW ====================

export const getAllPoojasWithReligionModel = async () => {
    const [rows] = await pool.execute(`
    SELECT p.id, p.pooja_name, p.price, p.currency, r.id AS religion_id, r.sanctuary_name AS religion_name, r.feature_name
    FROM pooja p
    JOIN religions r ON p.religion_id = r.id
    ORDER BY r.id ASC, p.id ASC
  `);
    return rows;
};
