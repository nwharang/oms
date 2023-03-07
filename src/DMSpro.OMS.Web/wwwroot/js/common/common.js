class Common {
    static processInitData(data) {
        let result = {};
        let keyList = Object.keys(data);
        for (let i = 0; i < keyList.length; i++) {
            let aKey = keyList[i];
            let aValue = object[aKey];
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

    static GetLastAPICallDates() {
        let keyList = ["itemInfo", "customerInfo", "routeInfo", "vendorInfo",];
        let result = {};
        for (let i = 0; i < keyList.length; i++) {
            let key = keyList[i];
            let value = this.loadFromStorage(key);
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
        localStorage.setItem(key, value);
    };

    static loadFromStorage(key) {
        if (typeof (Storage) === "undefined") {
            return;
        }
        return localStorage.getItem(key);
    };
};