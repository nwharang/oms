let l = abp.localization.getResource("OMS");
let priceUpdateService = window.dMSpro.oMS.mdmService.controllers.priceUpdates.priceUpdate;
let priceUpdateDetailService = window.dMSpro.oMS.mdmService.controllers.priceUpdateDetails.priceUpdateDetail;
let priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
let priceListDetailService = window.dMSpro.oMS.mdmService.controllers.priceListDetails.priceListDetail;
let itemMasterService = window.dMSpro.oMS.mdmService.controllers.items.item;
let uomService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;

let mainGridInstance, popup, popupInstance, grid, gridInstance, form, formInstance, massInputGrid, massInputGridInstance, massInputPopup, massInputPopupInstance
let preLoadData

let store = {
    status: [
        {
            id: 0,
            text: () => l('EntityFieldValue:MDMService:PriceUpdate:Status:OPEN')
        },
        {
            id: 1,
            text: () => l('EntityFieldValue:MDMService:PriceUpdate:Status:RELEASED')
        },
        {
            id: 2,
            text: () => l('EntityFieldValue:MDMService:PriceUpdate:Status:CANCELLED')
        },
        {
            id: 3,
            text: () => l('EntityFieldValue:MDMService:PriceUpdate:Status:COMPLETED')
        },
    ],
    priceUpdateStore: new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            priceUpdateService.getListDevextremes(args)
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
            priceUpdateService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return priceUpdateService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return priceUpdateService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return priceUpdateService.delete(key);
        }
    }),
    priceListStore: new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            priceListService.getListDevextremes(args)
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
            priceListService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    }),
    getUOMs: new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            uomService.getListDevextremes(args)
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
            uomService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    }),
    getItems: new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            itemMasterService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
    }),
    priceListDetailStore: (priceListId) => priceListDetailService.getListDevextremes({ filter: JSON.stringify(['priceListId', '=', priceListId]) })
        .done(({ data }) => {
            temp = [...data]
        }),
    priceUpdateDetailStore: (priceUpdateId) => new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            args.filter = JSON.stringify(['priceUpdateId', '=', priceUpdateId])
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            priceUpdateDetailService.getListDevextremes(args)
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
            priceUpdateDetailService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return priceUpdateDetailService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return priceUpdateDetailService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return priceUpdateDetailService.delete(key);
        }
    })
}