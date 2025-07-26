export function isImdbID(id: string) { 
    return /tt\d{7,8}/.test(id);
}