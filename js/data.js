import { showLoading, hideLoadig, showError } from '../js/notificator.js';
import API from '../js/myApi.js';

const api = new API("6DF2EB25-33FF-48E6-FF06-971601C2C000",
    "C9B4F68E-EF59-46B8-AAD9-73C6CDF57843",
    showLoading,
    hideLoadig,
    sessionStorage
);

const endpoints = {
    ITEMS: "data/recipe",
    ITEM_BY_ID: "data/recipe/"
}

export const register = api.register.bind(api);
export const login = api.login.bind(api);
export const logout = api.logout.bind(api);
export const setCategoryRelation = api.setCategoryRelation.bind(api);

export async function getAll() {
   
    return api.get(`${endpoints.ITEMS}?loadRelations=category`);
}

export async function getItemById(id) {
    return api.get(`${endpoints.ITEM_BY_ID}${id}?loadRelations=category`);
}

export async function createItem(newItem) {
    return api.post(endpoints.ITEMS, newItem);
}

export async function editItem(id, editedItem) {
    return api.put(endpoints.ITEM_BY_ID + id, editedItem);
}

export async function deleteItem(id) {
    return api.delete(endpoints.ITEM_BY_ID + id);
}

export async function likeItem(id) {
    const item = await getItemById(id);

    return await editItem(id, { likes: item.likes + 1 });
}

export function checkResult(result) {
    
    if (result.hasOwnProperty('errorData' || result.hasOwnProperty('Message'))) {
        const error = new Error();
        Object.assign(error, result);
        showError(error.message);

        throw error;
    }
}

