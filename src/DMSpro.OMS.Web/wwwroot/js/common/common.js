class Common {
    static async getCurrentCompany() {
        let keyString = `currentlySelectedCompany|${abp.currentUser.id}`;
        let storedObject =
            await this.loadFromStorage(keyString);
        if (storedObject == null) {
            let assignmentService =
                window.dMSpro.oMS.mdmService.controllers.companyIdentityUserAssignments.companyIdentityUserAssignment;
            let result = await assignmentService.getCurrentlySelectedCompany();
            Common.saveToStorage(keyString, result);
            return (result);
        } else {
            return storedObject
        }
    };

    static processInitData(data) {
        let result = {};
        let keyList = Object.keys(data);
        for (let i = 0; i < keyList.length; i++) {
            let aKey = keyList[i];
            let aValue = data[aKey];
            let updateRequired = aValue["updateRequired"];
            if (updateRequired == "false") {
                result[aKey] = this.loadFromStorage(aKey);
            } else {
                result[aKey] = aValue;
                this.saveToStorage(aKey, aValue);
            }
        }
        return result;
    };

    static async getLastAPICallDates() {
        let keyList = ["itemInfo", "customerInfo", "routeInfo", "vendorInfo",];
        let result = {};
        for (let i = 0; i < keyList.length; i++) {
            let key = keyList[i];
            let value = await this.loadFromStorage(key);
            if (value == null || value["lastUpdated"] == null) {
                result[key] = null;
                continue;
            }
            else {
                result[key] = value["lastUpdated"];
            }
        }
        return result;
    };

    static saveToStorage(key, value) {
        if (typeof (Storage) === "undefined") {
            return;
        }
        if (value == null || value == 'undefined') {
            return;
        }
        localStorage.setItem(key, JSON.stringify(value));
    };

    static async loadFromStorage(key) {
        if (typeof (Storage) === "undefined") {
            return;
        }
        let storageObject = localStorage.getItem(key);
        if (storageObject === 'undefined') {
            return null;
        }
        return await this.parseJSON(storageObject);
    };

    static parseJSON(input) {
        return new Promise(function (resolve, reject) {
            try {
                let jsonRes = JSON.parse(input);
                resolve(jsonRes);
            } catch (error) {
                reject(error);
            }
        });
    };
};