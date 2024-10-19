export const url = 'https://localhost:8443/';

export const routes = {
    ROUTE_BOARDS:'boards',
    ROUTE_LOGIN:'login',
    ROUTE_REGISTER:'register',
    ROUTE_USERS:'users',
    ROUTE_WHO_AM_I:'whoami',
    ROUTE_TOKEN_VALIDATOR:'tokenValidator',
    ROUTE_IMAGES:'images',
    ROUTE_TASKS:(boardId, columnId) => `boards/${boardId}/columns/${columnId}/tasks`,
    ROUTE_COLUMNS:(boardId) => `boards/${boardId}/columns`,
    ROUTE_COLUMN:(boardId, columnId) => `boards/${boardId}/columns/${columnId}`,
}

export const localStorageKeys = {
    LS_AUTH_TOKEN:'kanbantastischAuthToken',
    LS_USERS:'ls_users',
    LS_USER_EMAIL:'ls_user_email',
    LS_USER_ID:'ls_user_id',
    LS_COUNTRIES:'ls_countries',
}

export const ERDBEERLAND = {
    name:{
        common: 'Erdbeerland'
    },
    flag: '🍓',
    cca3: 'ERD',
}

export const BANANENREPUBLIK = {
    name:{
        common: 'Bananenrepublik'
    },
    flag: '🍌',
    cca3: 'BAN',
}

export const NEW_BOARD_COLUMN_NAMES = ['BACKLOG','TODO', 'IN_PROGRESS', 'DONE']

export const COUNTRIES_API = 'https://restcountries.com/v3.1/all?fields=name,flag,flags,cca3'