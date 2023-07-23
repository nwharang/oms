let readOnly = true
let enumValue = {
    manageItem: [],
    expiredType: [],
    itemTypes: [],
    valuationMethod: []
}
// For type
let gridInfo = {
    itemAttr: {},
    data: {},
    element: {
        loadingPanel: $('<div class"fixed"/>'),
        popup: $('<div/>').appendTo('body'),
        form: $('<div/>'),
        tabs: $('<div/>'),
        tabsElement: [
            createInventory(),
            createPurchasing(),
            createSales(),
            createAttribute(),
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

let rpcService = {
    itemMasterService: dMSpro.oMS.mdmSapService.items.item,
    uomService: dMSpro.oMS.mdmSapService.uoms.uom,
    uomGroupService: dMSpro.oMS.mdmSapService.uomGroups.uomGroup,
    uomGroupDetailService: dMSpro.oMS.mdmSapService.uomGroupDetails.uomGroupDetail,
    vatService: dMSpro.oMS.mdmSapService.vats.vat,
    itemAttr: dMSpro.oMS.mdmSapService.attributeConfigs.attributeConfig,
    itemAttrValue: dMSpro.oMS.mdmSapService.attributeValues.attributeValue
}

let l = abp.localization.getResource("OMS");


let store = {
    getVATs: new DevExpress.data.CustomStore({
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
            rpcService.vatService.getListDevExtreme(args)
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
    getUOMs: new DevExpress.data.CustomStore({
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
            rpcService.uomService.getListDevExtreme(args)
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
    getUOMsGroup: new DevExpress.data.CustomStore({
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
            rpcService.uomGroupService.getListDevExtreme(args)
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
    getUOMsGroupDetailStore: new DevExpress.data.CustomStore({
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
            rpcService.uomGroupDetailService.getListDevExtreme(args)
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
    itemStore: new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            rpcService.itemMasterService.getListDevExtreme(args)
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
            if (!key) return null;

            let d = new $.Deferred();
            rpcService.itemMasterService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return rpcService.itemMasterService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return rpcService.itemMasterService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return rpcService.itemMasterService.delete(key);
        }
    }),

}
$(() => {
    enumValue = {
        manageItem: [
            {
                id: 0,
                text: l('EntityFieldValue:MDMService:Item:ManageItemBy:NONE')
            },
            {
                id: 1,
                text: l('EntityFieldValue:MDMService:Item:ManageItemBy:LOT')
            },
            {
                id: 2,
                text: l('EntityFieldValue:MDMService:Item:ManageItemBy:SERIAL')
            }
        ],
        expiredType: [
            {
                id: 0,
                text: l('EntityFieldValue:MDMService:Item:ExpiredType:DAY')
            },
            {
                id: 1,
                text: l('EntityFieldValue:MDMService:Item:ExpiredType:WEEK')
            },
            {
                id: 2,
                text: l('EntityFieldValue:MDMService:Item:ExpiredType:MONTH')
            },
            {
                id: 3,
                text: l('EntityFieldValue:MDMService:Item:ExpiredType:YEAR')
            }
        ],
        itemTypes: [
            {
                id: 0,
                text: l('EntityFieldValue:MDMService:Item:ItemTypes:Item'),
            },
            {
                id: 1,
                text: l('EntityFieldValue:MDMService:Item:ItemTypes:POSM'),
            },
            {
                id: 2,
                text: l('EntityFieldValue:MDMService:Item:ItemTypes:Discount'),
            },
            {
                id: 3,
                text: l('EntityFieldValue:MDMService:Item:ItemTypes:Voucher'),
            }
        ],
        valuationMethod: [
            {
                id: 'A',
                text: 'Moving Average',
            },
            {
                id: 'S',
                text: 'Standard',
            },
            {
                id: 'F',
                text: 'FIFO',
            },
            {
                id: 'B',
                text: 'Serial/Batch',
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



function createNumberBox(label, dataField) {
    return {
        label: {
            text: label
        },
        dataField,
        editorType: 'dxTextBox',
        editorOptions: {
            // DxNumberBox maxLength is 15 , useTextBox here, donot change type
            onKeyDown(e) {
                const { event } = e;
                const str = event.key || String.fromCharCode(event.which);
                if (/^[^0-9]$/.test(str)) {
                    event.preventDefault();
                }
            },
        },
        validationRules: [
            {
                type: "stringLength",
                max: 20,
                message: l('WarnMessage.FieldLength').replace('{0}', 20),
            }
        ],
    }
}
rpcService.itemAttr.getListDevExtreme({ filter: JSON.stringify([['active', '=', 'Y'], 'and', ["type", "=", "IN"]]) })
    .then(({ data }) => {
        gridInfo.itemAttr = {
            hierarchy: data.filter(e => e.hierarchyLevel != null).sort((a, b) => a.attributeNumber - b.attributeNumber),
            flat: data.filter(e => e.hierarchyLevel == null).sort((a, b) => a.attributeNumber - b.attributeNumber),
            count: data.length
        }
    })
function getAttrField(type) {
    return gridInfo.itemAttr[type].map(({ attributeNumber, name: text, id }) =>
    ({
        label: {
            text,
        },
        dataField: 'attrID' + attributeNumber,
        editorType: 'dxTextBox',
        editorOptions: {
            value: gridInfo.data['attrID' + attributeNumber]
        },
    }))
}