import { getAllUnits } from "../API/Unit.js";

export let optionsList = [];

export const setOptionsList = (units) => {
    optionsList = Array.isArray(units) ? units.map(unit => unit.name) : [];
};

export const loadOptionsList = async () => {
    const data = await getAllUnits();
    setOptionsList(data);
};

loadOptionsList();