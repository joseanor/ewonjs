const axios = require('axios');
const params = new URLSearchParams();

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

    request("login", this).then((response) => {
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
    request("logout", this).then((response) => {
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
    return request("getaccountinfo", this).then((response) => {
        return response.data;
    }).catch((err) => {
        return err.response.adta.message;
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

var request = (path, client) => {
    params.append('t2mdeveloperid', client._developerId);
    if (!client.stateful) {
        params.append('t2maccount', client._account);
        params.append('t2musername', client._username);
        params.append('t2mpassword', client._password);
    } else {
        params.append('t2msession', client._sessionId);
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