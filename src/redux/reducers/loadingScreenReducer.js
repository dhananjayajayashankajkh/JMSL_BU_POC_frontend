export const loadingScreenReducer = (state = false, action) => {
    switch (action.type) {
        case 'SHOW_LOADING_SCREEN':
            return true;
        case 'HIDE_LOADING_SCREEN':
            return false;
        default:
            return state;
    }
};