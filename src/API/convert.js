export const convertToUTC = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-"; // Geçersiz tarih kontrolü
    return date.toISOString().split("T")[0];
};

export const convertFromUTC=(utcString)=>{
    if (typeof utcString !== 'string') {
        throw new Error("Invalid input: Expected a UTC string.");
    }
    return new Date(utcString);
}