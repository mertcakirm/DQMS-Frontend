import { getAllUnits } from "../API/Unit.js";

export let optionsList = ["Seçim Yapın"];

export const setOptionsList = (units) => {
    optionsList = Array.isArray(units)
        ? ["Birim Seçin", ...units.map(unit => unit.name)]
        : ["Birim Seçin"];
};

export const loadOptionsList = async () => {
    const data = await getAllUnits();
    setOptionsList(data);
};

loadOptionsList();