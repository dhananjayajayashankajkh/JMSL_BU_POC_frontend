import axios from 'axios';
import { BACKEND_URL } from './environmentConfig';

/*-- Import required components --*/
import { store } from '../redux/store';
import { showMessageBox } from '../redux/actions/messageBoxActions';
import { hideLoadingScreen } from '../redux/actions/loadingScreenActions';

/**
 * Author   :   Dinushka Rukshan
 * Remarks  :   We have pre-defined HTTP request types using Axios library
 */

export const getHeaders = () => {
    return {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };
};

// HTTP GET Request - Returns Resolved or Rejected Promise
export const get = (path) => {
    return new Promise((resolve, reject) => {
        axios.defaults.withCredentials = true;
        axios.get(`${BACKEND_URL}/${path}`, getHeaders())
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                window.sessionStorage.clear();
                store.dispatch(hideLoadingScreen());
                let messageBox = {
                    show: true,
                    title: "Oops!",
                    className: "error",
                    content: "Something went wrong.\nYou may be able to try again.",
                    isConfirmation: false,
                    callBackFunction: null
                }
                store.dispatch(showMessageBox(messageBox));
                console.error(error.message);
            });
    });
};

// HTTP POST Request - Returns Resolved or Rejected Promise
export const post = (path, data) => {
    return new Promise((resolve, reject) => {
        axios.defaults.withCredentials = true;
        axios.post(`${BACKEND_URL}/${path}`, data)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                window.sessionStorage.clear();
                store.dispatch(hideLoadingScreen());
                let messageBox = {
                    show: true,
                    title: "Oops!",
                    className: "error",
                    content: "Something went wrong.\nYou may be able to try again.",
                    isConfirmation: false,
                    callBackFunction: null
                }
                store.dispatch(showMessageBox(messageBox));
                console.error(error.message);
            });
    });
};

// HTTP DELETE Request - Returns Resolved or Rejected Promise
export const del = (path) => {
    return new Promise((resolve, reject) => {
        axios.defaults.withCredentials = true;
        axios.delete(`${BACKEND_URL}/${path}`, getHeaders())
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                window.sessionStorage.clear();
                store.dispatch(hideLoadingScreen());
                let messageBox = {
                    show: true,
                    title: "Oops!",
                    className: "error",
                    content: "Something went wrong.\nYou may be able to try again.",
                    isConfirmation: false,
                    callBackFunction: null
                }
                store.dispatch(showMessageBox(messageBox));
                console.error(error.message);
            });
    });
};