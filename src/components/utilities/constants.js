export const url = 'https://localhost:8443/';

export const routes = {
    ROUTE_BOARDS:'boards',
    ROUTE_LOGIN:'login',
    ROUTE_REGISTER:'register',
    ROUTE_USERS:'users',
    ROUTE_WHO_AM_I:'whoami', // todo: obsolete - replace with ROUTE_USERS
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
}

export const NEW_BOARD_COLUMN_NAMES = ['BACKLOG','TODO', 'IN_PROGRESS', 'DONE']