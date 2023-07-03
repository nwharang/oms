let l = abp.localization.getResource("OMS");
let readOnly = true

let gridInfo = {
    itemAttr: {},
    data: {},
    element: {
        loadingPanel: $('<div class"fixed"/>'),
        popup: $('<div/>').appendTo('body'),
        form: $('<div/>'),
        tabs: $('<div/>'),
        tabsElement: [
            createShipTo(),
            createAttribute(),
            createAssignToCompany(),
        ]
    },
    instance: {
        loadingPanel: null,
        popup: null,
        form: null,
        tabs: null,
        mainGrid: null
    }
}

let enumValue = {
    shipToType: []
}

let rpcService = {
    customerService: window.dMSpro.oMS.mdmService.controllers.customers.customer,
    cusAttributeValueService: window.dMSpro.oMS.mdmService.controllers.customerAttributeValues.customerAttributeValue,
    cusAttrService: window.dMSpro.oMS.mdmService.controllers.customerAttributes.customerAttribute,
    customerImageService: window.dMSpro.oMS.mdmService.controllers.customerImages.customerImage,
    geoMasterService: window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster,
    priceListService: window.dMSpro.oMS.mdmService.controllers.priceLists.priceList,
    companyService: window.dMSpro.oMS.mdmService.controllers.companies.company,
}

let store = {
    companiesLookup: new DevExpress.data.CustomStore({
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
    geoMasterStore: new DevExpress.data.CustomStore({
        key: 'id',
        useDefaultSearch: true,
        // loadMode: "raw",
        // cacheRawData: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            rpcService.geoMasterService.getListDevextremes(args)
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
            rpcService.geoMasterService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    }),
    customStore: new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            rpcService.customerService.getListDevextremes(args)
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
            return key == 0 ? rpcService.customerService.get(key) : null;
        },
        insert(values) {
            return rpcService.customerService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return rpcService.customerService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return rpcService.customerService.delete(key);
        }
    }),

    getCusAttrValue: new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
        cacheRawData: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            rpcService.cusAttributeValueService.getListDevextremes({})
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });
            deferred.promise().then(attrVal => {
                listAttrValue = attrVal;
            })
            return deferred.promise();
        }
    }),
    priceListStore: new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
        cacheRawData: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            rpcService.priceListService.getListDevextremes({})
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                    });
                });
            return deferred.promise();
        }
    }),
}

$(() => {
    enumValue = {
        shipToType: [
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

function getAttrField(type) {
    return gridInfo.itemAttr[type].map(({ attrNo, attrName: text, hierarchyLevel, id }, index) => {
        return {
            label: {
                text,
            },
            dataField: 'attr' + attrNo + 'Id',
            editorType: 'dxSelectBox',
            editorOptions: {
                valueExpr: "id",
                displayExpr: "attrValName",
                dataSource: {
                    store: store.getItemAttrValue,
                    filter: ['itemAttributeId', '=', id],
                }
            },
        }
    })
}
