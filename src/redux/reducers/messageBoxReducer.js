const initialState = {
    show: false,
    title: "",
    className: "",
    content: "",
    isConfirmation: false,
    callBackFunction: null
};

export const messageBoxReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_MESSAGE_BOX':
            return {
                show: action.payload.show,
                title: action.payload.title,
                className: action.payload.className,
                content: action.payload.content,
                isConfirmation: action.payload.isConfirmation,
                callBackFunction: action.payload.callBackFunction
            };
        case 'RESET_MESSAGE_BOX':
            return initialState;
        default:
            return state;
    }
};