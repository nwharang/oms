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
    itemMasterService: window.dMSpro.oMS.mdmService.controllers.items.item,
    itemAttrValueService: window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue,
    itemAttrService: window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute,
    itemImageService: window.dMSpro.oMS.mdmService.controllers.itemImages.itemImage,
    itemAttachmentService: window.dMSpro.oMS.mdmService.controllers.itemAttachments.itemAttachment,
    itemTypeService: window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData,
    uomService: window.dMSpro.oMS.mdmService.controllers.uOMs.uOM,
    uomGroupService: window.dMSpro.oMS.mdmService.controllers.uOMGroups.uOMGroup,
    uomGroupDetailService: window.dMSpro.oMS.mdmService.controllers.uOMGroupDetails.uOMGroupDetail,
    vatService: window.dMSpro.oMS.mdmService.controllers.vATs.vAT,
}

let l = abp.localization.getResource("OMS");


let store = {
    imageStore: new DevExpress.data.CustomStore({
        key: 'id',
        load: (loadOptions) => {
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            return rpcService.itemImageService.getListDevextremes(args)
                .then(({ data }) => Promise.all(data.map(async imageInfo => {
                    return {
                        ...imageInfo,
                        url: await fetch("/api/mdm-service/item-images/get-file?id=" + imageInfo.fileId)
                            .then(res => res.blob())
                            .then(data => URL.createObjectURL(data))
                    }
                })))
                .then(data => data.sort((a, b) => a.displayOrder - b.displayOrder));
        },
        byKey: (key) => key ? new Promise((resolve, reject) => rpcService.itemImageService.get(key)
            .done(data => resolve(data))
            .fail(err => reject(err))
        ) : null,
        insert: (values) => rpcService.itemImageService.create(values, { contentType: "application/json" }),
        update: (key, values) => rpcService.itemImageService.update(key, values, { contentType: "application/json" }),
        remove: (key) => rpcService.itemImageService.deleteMany(key)
    }),
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
            rpcService.vatService.getListDevextremes(args)
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
            rpcService.uomService.getListDevextremes(args)
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
            rpcService.uomGroupService.getListDevextremes(args)
                .done(result => {
                    let lastResult = { ...result }
                    // Validate UOM group where UOM group must have asleast 1 row and have base UOM
                    lastResult.data = result.data.filter(e => e.details.filter(detail => detail.baseUOMId === detail.altUOMId).length > 0)
                    deferred.resolve(lastResult.data, {
                        totalCount: lastResult.totalCount,
                        summary: lastResult.summary,
                        groupCount: lastResult.groupCount,
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
            rpcService.uomGroupDetailService.getListDevextremes(args)
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
        useDefaultSearch: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            rpcService.itemMasterService.getListDevextremes(args)
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

            rpcService.itemAttrValueService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });
            return deferred.promise();
        },
    })
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
