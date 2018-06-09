const axios = require('axios');
const params = new URLSearchParams();

var routes = {
    login: 'login',
    logout: 'logout',
    accountInfo: 'getaccountinfo',
    devices: 'getewons',
    device: 'getewon'
}

/**
 * Construct a new EwonClient
 * 
 * @param {string} account - Talk2M account name
 * @param {string} username - Talk2M username
 * @param {string} password - Talk2M password
 * @param {string} developerId - Talk2M developer id
 */
class EwonClient {
    constructor(account, username, password, developerId) {
        if (validate(account, "Account name") &&
            validate(username, "Username") &&
            validate(password, "Password"),
            validate(developerId, "Developer ID")) {
            this._valid = true;
            this._account = account;
            this._username = username;
            this._password = password;
            this._developerId = developerId;
            this._axios = axios.create({
                baseURL: 'https://m2web.talk2m.com/t2mapi'
            });
        }
    }
}

/**
 * Login to specified Talk2M account
 * Required to instantiate a stateful session
 * 
 * @returns {string} The Talk2M reply
 */
EwonClient.prototype.login = function () {
    if (!this._valid) {
        throw new Error("Login error; you cannot log in without first instantiating a client");
    }

    request(routes.login, this).then((response) => {
        return response.data.message;
    }).catch(err => {
        return err.response.data.message;
    })
}

/**
 * Logout of an existing stateful session.
 * 
 * @returns {string} The Talk2M reply
 */
EwonClient.prototype.logout = function () {
    request(routes.logout, this).then((response) => {
        return response.data.message;
    }).catch((err) => {
        return err.response.adta.message;
    })
}

/**
 * Retrieve Talk2M account information. 
 * 
 * @returns {object} Talk2M account object
 */
EwonClient.prototype.account = function () {
    return request(routes.accountInfo, this).then((response) => {
        return response.data;
    }).catch((err) => {
        return err.response.adta.message;
    })
}

/**
 * Retrieve devices in Talk2M account
 * 
 * @returns {array} Array of all devices 
 */
EwonClient.prototype.getDevices = function () {
    return request(routes.devices, this).then((response) => {
        return response.data;
    }).catch((err) => {
        return err;
    })
}

/**
 * Retrieve a single device in Talk2M account
 * 
 * @param {string} deviceName - Name of requested device
 * @returns {object} Requested device
 */
EwonClient.prototype.getDevice = function (deviceName) {
    return request(routes.device, this, { name: deviceName }).then((response) => {
        return response.data;
    }).catch((err) => {
        return err;
    })
}

/**
 * Update session Id, requires login
 * @param {string} sessionId - Talk2M session id 
 */
EwonClient.prototype.updateSession = function (sessionId) {
    if (!sessionId || sessionId === "") {
        throw new Error("Error; invalid session Id provided");
    }

    this._sessionId = sessionId;
}

/**
 * Update the current session to become stateful or stateless. 
 * If stateless you must login and update the client session Id
 * via: updateSession(sessionId)
 * 
 * @param {boolean} stateful 
 */
EwonClient.prototype.setState = function (stateful) {
    if (!this._sessionId) {
        throw new Error("State error; session id invalid. Have you logged in?");
    }
    this.stateful = stateful;
}

var request = (path, client, options) => {
    params.append('t2mdeveloperid', client._developerId);
    if (!client.stateful) {
        params.append('t2maccount', client._account);
        params.append('t2musername', client._username);
        params.append('t2mpassword', client._password);
    } else {
        params.append('t2msession', client._sessionId);
    }

    for (var key in options) {
        params.append(key, options[key])
    }

    return client._axios.post(path, params);
}


let validate = (entry, message) => {
    if (message === "Developer ID") {
        //add functionality to check developer id format
    }

    if (!entry) {
        throw Error("Error; " + message + " is blank");
    }
    return true;
}

module.exports = {
    EwonClient
}
