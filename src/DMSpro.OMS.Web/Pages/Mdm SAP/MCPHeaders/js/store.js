let l = abp.localization.getResource("OMS");
let readOnly = true

let gridInfo = {
    itemAttr: {},
    data: {},
    element: {
        loadingPanel: $('<div class"fixed"/>'),
        popup: $('<div/>').appendTo('body'),
        form: $('<div/>'),
        grid: $('<div class="mt-5"/>'),
    },
    instance: {
        loadingPanel: null,
        popup: null,
        form: null,
        grid: null,
        mainGrid: null
    }
}

let enumValue = {
    customerType: []
}

let rpcService = {
    mCPHeaderService: window.dMSpro.oMS.mdmService.controllers.mCPHeaders.mCPHeader,
    salesOrgHierarchyService: window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy,
    itemGroupService: window.dMSpro.oMS.mdmService.controllers.itemGroups.itemGroup,
    companyInZoneService: window.dMSpro.oMS.mdmService.controllers.companyInZones.companyInZone,
    customerInZoneService: window.dMSpro.oMS.mdmService.controllers.customerInZones.customerInZone,
    customerService: window.dMSpro.oMS.mdmService.controllers.customers.customer,
    companyService: window.dMSpro.oMS.mdmService.controllers.companies.company,
    mCPDetailsService: window.dMSpro.oMS.mdmService.controllers.mCPDetails.mCPDetail,
    visitPlanService: window.dMSpro.oMS.mdmService.controllers.visitPlans.visitPlan,
}

let store = {
    salesOrgHierarchyStore: new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            rpcService.salesOrgHierarchyService.getListDevextremes(args)
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
            rpcService.salesOrgHierarchyService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return rpcService.salesOrgHierarchyService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return rpcService.salesOrgHierarchyService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return rpcService.salesOrgHierarchyService.delete(key);
        }
    }),
    mCPHeaderStore: new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            rpcService.mCPHeaderService.getListDevextremes(args)
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
            rpcService.mCPHeaderService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        remove(key) {
            return mCPHeaderService.delete(key);
        }
    }),
    mCPDetailsStore: new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            rpcService.mCPDetailsService.getListDevextremes(args)
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
            rpcService.mCPDetailsService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        remove(key) {
            return mCPDetailsService.delete(key);
        }
    }),
    customerStore: new DevExpress.data.CustomStore({
        key: 'customerId',
        load(loadOptions) {
            const deferred = $.Deferred();
            loadOptions.filter = [...(loadOptions.filter && loadOptions.filter.length > 0 ? [loadOptions.filter, "and"] : []), [["endDate", ">=", moment().format('YYYY-MM-DD')], 'or', ['endDate', '=', null]], 'and', ["salesOrgHierarchyId", "=", sellingZoneId]]
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            rpcService.customerInZoneService.getListDevextremes(args)
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
            rpcService.customerService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
    }),
    companyInZoneStore: new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            const deferred = $.Deferred();
            rpcService.companyInZoneService.getListDevextremes(args)
                .done(result => {
                    let data = [];
                    result.data.forEach(x => {
                        data.push({
                            id: x.company.id,
                            name: x.company.name
                        })
                    })
                    deferred.resolve(data, {
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
            rpcService.companyService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    }),

    companyStore: new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            rpcService.companyService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;
            var d = new $.Deferred();
            rpcService.companyService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    }),

    itemGroupStore: new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            rpcService.itemGroupService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            rpcService.itemGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    })
}

$(() => {
    enumValue = {
        customerType: [
            {
                id: "C",
                text: "Coverage"
            },
            {
                id: "P",
                text: "Potential"
            },
        ]
    }
    gridInfo.instance.loadingPanel = gridInfo.element.loadingPanel.dxPopup({
        height: 100,
        width: 100,
        showTitle: false,
        animation: null,
        contentTemplate: (e) => $('<div/>').dxLoadIndicator({
            height: 60,
            width: 60,
        })
    })
        .appendTo('body')
        .dxPopup('instance')
    gridInfo.instance.loadingPanel.registerKeyHandler('escape', () => gridInfo.instance.loadingPanel.hide())
})

let notify = (option) => {
    obj = { type: "success", position: "bottom right", message: "Message Placeholder", ...option };
    DevExpress.ui.notify({
        message: obj.message,
        height: 45,
        width: 250,
        minWidth: 250,
        type: obj.type,
        displayTime: 5000,
        animation: {
            show: {
                type: 'fade', duration: 400, from: 0, to: 1,
            },
            hide: { type: 'fade', duration: 40, to: 0 },
        },
    }, {
        position: obj.position,
    })
}
