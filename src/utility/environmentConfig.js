/**
 * Author   :   Dinushka Rukshan
 * Remarks  :   We use this file to maintain environment variables like below
 */

let BACKEND_URL = 'URLMissing';
let LOGIN_URL = 'URLMissing';

const hostname = window && window.location && window.location.hostname;

switch (hostname) {
    case 'localhost':
        BACKEND_URL = 'http://localhost:62641';
        LOGIN_URL = "http://localhost:3000";
    default:
        break;
}

export { BACKEND_URL, LOGIN_URL };
