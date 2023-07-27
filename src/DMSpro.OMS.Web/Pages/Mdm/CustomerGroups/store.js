let l = abp.localization.getResource("OMS");
let customerGroupService = window.dMSpro.oMS.mdmService.controllers.customerGroups.customerGroup;
let customerGroupAttributeService = window.dMSpro.oMS.mdmService.controllers.customerGroupAttributes.customerGroupAttribute;
let customerListService = window.dMSpro.oMS.mdmService.controllers.customerGroupLists.customerGroupList;
let customerGeoService = window.dMSpro.oMS.mdmService.controllers.customerGroupGeos.customerGroupGeo;
let customerAttributeService = window.dMSpro.oMS.mdmService.controllers.customerAttributes.customerAttribute;
let cusAttributeValueService = window.dMSpro.oMS.mdmService.controllers.customerAttributeValues.customerAttributeValue;
let customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
let geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster
let popup, popupInstance, grid, gridInstance, form, formInstance
let dataGridContainer, customerAttr


let store = {
    cusStatus: [
        {
            id: 0,
            text: () => l('EntityFieldValue:MDMService:CustomerGroup:Status:OPEN')
        },
        {
            id: 1,
            text: () => l('EntityFieldValue:MDMService:CustomerGroup:Status:RELEASED')
        },
        // {
        //     id: 2,
        //     text: () => l('EntityFieldValue:MDMService:CustomerGroup:Status:CANCELLED')
        // }
    ],
    GroupModes: [
        {
            id: 0,
            text: () => l("EntityFieldValue:MDMService:CustomerGroup:GroupBy:ATTRIBUTE")
        },
        {
            id: 1,
            text: () => l("EntityFieldValue:MDMService:CustomerGroup:GroupBy:LIST")
        },
        {
            id: 2,
            text: () => l("EntityFieldValue:MDMService:CustomerGroup:GroupBy:GEO")
        }
    ],
    customerGroupStore: new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            customerGroupService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            let d = new $.Deferred();
            customerGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return customerGroupService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return customerGroupService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return customerGroupService.delete(key);
        }
    }),
    cusAttributes: new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: 'raw',
        cacheRawData: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            customerAttributeService.getListDevextremes({ filter: JSON.stringify(['active', '=', true]) })
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        }
    }),
    customerValueStore: new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: 'raw',
        cacheRawData: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            cusAttributeValueService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
    }),
    customerGroupAttributeStore: (headerId) => new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            args.filter = JSON.stringify(["customerGroupId", "=", headerId || null])
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            customerGroupAttributeService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            customerGroupAttributeService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return customerGroupAttributeService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return customerGroupAttributeService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return customerGroupAttributeService.delete(key);
        }
    }),
    customerListStore: (headerId) => new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            args.filter = JSON.stringify(["customerGroupId", "=", headerId || null])
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            customerListService.getListDevextremes({ filter: JSON.stringify(["customerGroupId", "=", headerId || null]) })
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            customerListService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return customerListService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return customerListService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return customerListService.delete(key);
        }
    }),
    customerGeoStore: (headerId) => new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            args.filter = JSON.stringify(headerId ? ["customerGroupId", "=", headerId] : [])
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            customerGeoService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            customerGeoService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return customerGeoService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return customerGeoService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return customerGeoService.delete(key);
        }
    }),
    geoMasterStore: new DevExpress.data.CustomStore({
        key: 'id',
        useDefaultSearch: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            const argsGeo = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    argsGeo[i] = JSON.stringify(loadOptions[i]);
                }
            });
            geoMasterService.getListDevextremes(argsGeo)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            geoMasterService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
    }),
    customerStore: new DevExpress.data.CustomStore({
        key: 'id',
        useDefaultSearch: true,
        load(loadOptions) {
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            const deferred = $.Deferred();
            customerService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            customerService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    })
}
store.cusAttributes.load({}).then((data) => { customerAttr = data.sort((a, b) => a.attrNo - b.attrNo) })
