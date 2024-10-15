export const showMessageBox = (message) => ({
    type: 'SHOW_MESSAGE_BOX',
    payload: message
});

export function resetMessageBox() {
    return dispatch => {
        return new Promise(function (resolve, reject) {
            dispatch({
                type: 'RESET_MESSAGE_BOX'
            });
            resolve(true)
        });
    }
};