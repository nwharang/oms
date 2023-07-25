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
    },
    shipToData: {}
}

let enumValue = {
    shipToType: []
}

let rpcService = {
    customerService: dMSpro.oMS.mdmSapService.customers.customer,
    priceListService: dMSpro.oMS.mdmSapService.priceLists.priceList,
    companyService: dMSpro.oMS.mdmSapService.companies.company,
    itemAttr: dMSpro.oMS.mdmSapService.attributeConfigs.attributeConfig,
    itemAttrValue: dMSpro.oMS.mdmSapService.attributeValues.attributeValue
}

let store = {
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
            args.withDetails = true;
            rpcService.customerService.getListDevExtreme(args)
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
    }),
    priceListStore: new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
        cacheRawData: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            rpcService.priceListService.getListDevExtreme({})
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                    });
                });
            return deferred.promise();
        }
    }),
    getItemAttrValue: new DevExpress.data.CustomStore({
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

            rpcService.itemAttrValue.getListDevExtreme(args)
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

rpcService.itemAttr.getListDevExtreme({ filter: JSON.stringify([['active', '=', 'Y'], 'and', ["type", "=", "DC"]]) })
    .then(({ data }) => {
        gridInfo.itemAttr = {
            all: data.sort((a, b) => a.attributeNumber - b.attributeNumber),
            count: data.length
        }
    })
function getAttrField() {
    return gridInfo.itemAttr.all.map(({ attributeNumber, name: text, id }) =>
    ({
        caption: text,
        dataField: 'attrID' + attributeNumber,
        lookup: {
            dataSource: store.getItemAttrValue,
            valueExpr: "code",
            displayExpr: "name",
        },
    }))
}