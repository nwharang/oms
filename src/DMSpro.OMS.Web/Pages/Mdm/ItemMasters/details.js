var l = abp.localization.getResource("MdmService");
const itemMaster = {};
if (sessionStorage.getItem('itemMaster') != null) {
    itemMaster = JSON.parse(sessionStorage.getItem('itemMaster'));
    document.title = `Edit Item - ${itemMaster.code} | OMS`;
} else {
    document.title = `New Item | OMS`;
}

var itemMasterService = window.dMSpro.oMS.mdmService.controllers.items.item;
var itemTypeService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;
var uOMGroupDetailService = window.dMSpro.oMS.mdmService.controllers.uOMGroupDetails.uOMGroupDetail;
var uOMGroupService = window.dMSpro.oMS.mdmService.controllers.uOMGroups.uOMGroup;
var vATService = window.dMSpro.oMS.mdmService.controllers.vATs.vAT;
var itemAttrValueService = window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue;
var itemAttrService = window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute;
var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;

const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

$(function () {
    DevExpress.config({
        editorStylingMode: 'underlined',
    });

    $("#top-section").dxForm({
        formData: itemMaster,
        elementAttr: {
            id: 'formEditing',
            class: 'formEditing'
        },
        labelMode: 'floating',
        colCount: 10,
        onFieldDataChanged: function (e) {

        },
        items: [
            {
                itemType: 'group',
                cssClass: 'first-group',
                colCount: 2,
                colSpan: 8,
                items: [
                    {
                        itemType: 'group',
                        caption: 'General',
                        colSpan: 4,
                        items: [
                            {
                                dataField: 'code',
                                caption: l("EntityFieldName:MDMService:Item:Code"),
                                dataType: 'string',
                                validationRules: [{ type: "required" }]
                            },
                            {
                                dataField: 'name',
                                caption: l("EntityFieldName:MDMService:Item:Name"),
                                dataType: 'string',
                                validationRules: [{ type: "required" }]
                            },
                            {
                                dataField: 'shortName',
                                dataField: 'shortName',
                                caption: l("EntityFieldName:MDMService:Item:ShortName"),
                                dataType: 'string'
                            },
                            {
                                dataField: 'itemTypeId',
                                caption: l("EntityFieldName:MDMService:Item:ItemTypeName"),
                                editorType: 'dxSelectBox',
                                lookup: {
                                    dataSource: getItemTypes,
                                    valueExpr: 'id',
                                    displayExpr: 'valueName'
                                }
                            },
                            {
                                dataField: 'barcode',
                                caption: l("EntityFieldName:MDMService:Item:Barcode"),
                                dataType: 'string',
                                validationRules: [{ type: "required" }]
                            },
                            {
                                dataField: 'erpCode',
                                colSpan: 2,
                                dataField: 'erpCode',
                                caption: l("EntityFieldName:MDMService:Item:ERPCode"),
                                dataType: 'string'
                            }
                        ]
                    },
                    {
                        itemType: 'group',
                        caption: 'System Information',
                        colSpan: 4,
                        colCount: 2,
                        items: [
                            {
                                dataField: 'uomGroupId',
                                cssClass: 'uomGroup',
                                caption: l('EntityFieldName:MDMService:Item:UOMGroupCode'),
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    dataSource: getUOMGroups,
                                    valueExpr: 'id',
                                    displayExpr: 'code'
                                },
                                colSpan: 2
                            },
                            {
                                itemType: 'group',
                                items: [
                                    {
                                        dataField: 'isInventoriable',
                                        caption: l('EntityFieldName:MDMService:Item:IsInventoryItem'),
                                        editorType: 'dxCheckBox'
                                    },
                                    {
                                        dataField: 'isPurchasable',
                                        caption: l('EntityFieldName:MDMService:Item:IsPurchaseItem'),
                                        editorType: 'dxCheckBox'
                                    },
                                    {
                                        dataField: 'isSaleable',
                                        dataField: 'isSaleable',
                                        caption: l('EntityFieldName:MDMService:Item:IsSalesItem'),
                                        editorType: 'dxCheckBox'
                                    },
                                    {
                                        dataField: 'manageItemBy',
                                        cssClass: 'fieldManageItemBy',
                                        caption: l('EntityFieldName:MDMService:Item:ManageItemBy'),
                                        editorType: 'dxSelectBox',
                                        editorOptions: {
                                            items: manageItem,
                                            searchEnabled: true,
                                            displayExpr: 'text',
                                            valueExpr: 'id'
                                        },
                                        validationRules: [{ type: "required" }]
                                    },
                                    {
                                        dataField: 'expiredType',
                                        cssClass: 'fieldExpiredType',
                                        dataField: 'expiredType',
                                        caption: l('EntityFieldName:MDMService:Item:ExpiredType'),
                                        editorType: 'dxSelectBox',
                                        editorOptions: {
                                            items: expiredType,
                                            searchEnabled: true,
                                            displayExpr: 'text',
                                            valueExpr: 'id',
                                            disabled: true
                                        }
                                    },
                                    {
                                        dataField: 'expiredValue',
                                        cssClass: 'fieldExpiredValue',
                                        caption: l('EntityFieldName:MDMService:Item:ExpiredValue'),
                                        dataType: 'number',
                                        editorOptions: {
                                            disabled: true
                                        }
                                    },
                                    {
                                        dataField: 'issueMethod',
                                        cssClass: 'fieldIssueMethod',
                                        caption: l('EntityFieldName:MDMService:Item:IssueMethod'),
                                        editorType: 'dxSelectBox',
                                        editorOptions: {
                                            items: issueMethod,
                                            searchEnabled: true,
                                            displayExpr: 'text',
                                            valueExpr: 'id',
                                            disabled: true
                                        }
                                    }
                                ]
                            },
                            {
                                itemType: 'group',
                                items: [
                                    {
                                        dataField: 'inventoryUOMId',
                                        cssClass: 'fieldInventoryUOMId',
                                        caption: l('EntityFieldName:MDMService:Item:InventoryUnitName'),
                                        editorType: 'dxSelectBox',
                                        editorOptions: {
                                            dataSource: getUOMGroupDetails,
                                            valueExpr: 'altUOMId',
                                            displayExpr: 'altUOMId',
                                            disabled: true
                                        },
                                        validationRules: [{ type: "required" }]
                                    },
                                    {
                                        dataField: 'purUOMId',
                                        cssClass: 'fieldPurUOMId',
                                        caption: l('EntityFieldName:MDMService:Item:PurUnitName'),
                                        editorType: 'dxSelectBox',
                                        editorOptions: {
                                            dataSource: getUOMGroupDetails,
                                            valueExpr: 'altUOMId',
                                            displayExpr: 'altUOMId',
                                            disabled: true
                                        },
                                        validationRules: [{ type: "required" }]
                                    },
                                    {
                                        dataField: 'salesUOMId',
                                        cssClass: 'fieldSalesUOMId',
                                        caption: l('EntityFieldName:MDMService:Item:SalesUnitName'),
                                        editorType: 'dxSelectBox',
                                        editorOptions: {
                                            dataSource: getUOMGroupDetails,
                                            valueExpr: 'altUOMId',
                                            displayExpr: 'altUOMId',
                                            disabled: true
                                        },
                                        validationRules: [{ type: "required" }]
                                    },
                                    {
                                        dataField: 'vatId',
                                        caption: l('EntityFieldName:MDMService:Item:VATName'),
                                        editorType: 'dxSelectBox',
                                        editorOptions: {
                                            dataSource: getVATs,
                                            valueExpr: 'id',
                                            displayExpr: 'code'
                                        },
                                        validationRules: [{ type: "required" }]
                                    },
                                    {
                                        dataField: 'basePrice',
                                        caption: 'Base Price',
                                        editorType: 'dxSelectBox',
                                        editorOptions: {
                                            dataSource: getPriceList,
                                            valueExpr: 'id',
                                            displayExpr: 'code'
                                        },
                                        validationRules: [{ type: "required" }]
                                    },
                                    {
                                        dataField: 'active',
                                        dataField: 'active',
                                        caption: l('EntityFieldName:MDMService:Item:Active'),
                                        editorType: 'dxCheckBox'
                                    }
                                ]
                            }
                        ]
                    },
                ]
            },
            {
                itemType: 'group',
                cssClass: 'second-group',
                caption: 'DMS Attribute',
                colSpan: 2,
                items: getAttrOptions()
                //items: [
                //{
                //    //itemAttrActiveData.forEach(function (item) {
                //    //    debugger
                //    //})
                //    dataField: 'attr0Id'
                //},
                //{
                //    dataField: 'attr1Id'
                //},
                //{
                //    dataField: 'attr2Id'
                //},
                //{
                //    dataField: 'attr3Id'
                //},
                //{
                //    dataField: 'attr4Id'
                //},
                //{
                //    dataField: 'attr5Id'
                //},
                //{
                //    dataField: 'attr6Id'
                //},
                //{
                //    dataField: 'attr7Id'
                //},
                //{
                //    dataField: 'attr8Id'
                //},
                //{
                //    dataField: 'attr9Id'
                //}
                //]
            }
            //{
            //    itemType: 'group',
            //    colSpan: 8,
            //    items: [{
            //        itemType: 'tabbed',
            //        tabPanelOptions: {
            //            deferRendering: false,
            //        },
            //        tabs: [
            //            {
            //                title: 'Images',
            //                icon: "isnotblank",
            //                badge: "new",
            //                template: function (itemData, itemIndex, element) {
            //                    const galleryDiv = $("<div style='padding:10px'>")
            //                    galleryDiv.dxGallery({
            //                        dataSource: items.Images,
            //                        height: 'auto',
            //                        selectedItem: items.Images[1],
            //                        slideshowDelay: 1500,
            //                        loop: true
            //                    });
            //                    galleryDiv.appendTo(element);
            //                }
            //            },
            //            {
            //                title: 'Attachments',
            //                items: ['Attachments']
            //            }
            //        ]
            //    }]
            //    }
        ]
    });

    $('#resizable').dxResizable({
        minHeight: 300,
        handles: "bottom"
    }).dxResizable('instance');

    $('#tabpanel-container').dxTabPanel({
        items: [{
            title: l('Menu:MdmService:ItemGroupAttrs'),
            template: initItemAttributeTab()
        }, {
            title: l('Menu:MdmService:ItemGroupLists'),
            template: initListItemTab()
        }]
    }).dxTabPanel('instance');

    $('#danger-contained').dxButton({
        stylingMode: 'contained',
        text: 'Canceled',
        type: 'danger',
        width: 120,
        onClick() {
            DevExpress.ui.notify('The Contained button was clicked');
        },
    });

    $('#default-contained').dxButton({
        stylingMode: 'contained',
        text: 'Released',
        type: 'default',
        width: 120,
        onClick() {
            DevExpress.ui.notify('The Contained button was clicked');
        },
    });
});

function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
}

var listAttrValue = [];

function getAttrOptions() {
    const options = [];

    const def = $.Deferred();
    itemAttrValueService.getListDevextremes({})
        .done(r => {
            def.resolve(r.data, {
                totalCount: r.totalCount,
                summary: r.summary,
                groupCount: r.groupCount
            })
        })
    def.promise().then(attrVal => {
        listAttrValue = attrVal;
    })

    const deferred = $.Deferred();
    itemAttrService.getListDevextremes({})
        .done(result => {
            deferred.resolve(result.data, {
                totalCount: result.totalCount,
                summary: result.summary,
                groupCount: result.groupCount,
            });
        });
    deferred.promise().then(u => {
        var listAttrActive = u.filter(x => x.active == true);
        for (let i = 0; i < listAttrActive.length; i++) {
            options.push(generateAttrOptions(listAttrActive[i]))
        }
    });
    return options;
}

function generateAttrOptions(attr) {
    return {
        dataField: 'attr' + attr.attrNo + 'Id',
        label: {
            text: attr.attrName
        },
        editorOptions: {
            dataSource: listAttrValue.filter(x => x.itemAttributeId == attr.id),
            valueExpr: 'id',
            displayExpr: 'attrValName'
        }
    }
}

// get item type list
var getItemTypes = new DevExpress.data.CustomStore({
    key: 'id',
    loadMode: "processed",
    load(loadOptions) {
        if (loadOptions.filter == undefined)
            loadOptions.filter = ['code', '=', 'MD02']
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });

        itemTypeService.getListDevextremes(args)
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
        itemTypeService.get(key)
            .done(data => {
                d.resolve(data);
            });
        return d.promise();
    }
});

// get item attribute value
var getItemAttrValue = new DevExpress.data.CustomStore({
    key: 'id',
    loadMode: "processed",
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });

        itemAttrValueService.getListDevextremes(args)
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
        itemAttrValueService.get(key)
            .done(data => {
                d.resolve(data);
            });
        return d.promise();
    }
});
// get UOM group lookup
var getUOMGroups = new DevExpress.data.CustomStore({
    key: 'id',
    loadMode: "processed",
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });

        uOMGroupService.getListDevextremes(args)
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
        uOMGroupService.get(key)
            .done(data => {
                d.resolve(data);
            });
        return d.promise();
    }
});

// get UOMs detail lookup
var getUOMGroupDetails = new DevExpress.data.CustomStore({
    key: 'id',
    loadMode: "processed",
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });

        uOMGroupDetailService.getListDevextremes(args)
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
        uOMGroupDetailService.get(key)
            .done(data => {
                d.resolve(data);
            });
        return d.promise();
    }
});

// get VATs
var getVATs = new DevExpress.data.CustomStore({
    key: 'id',
    loadMode: "processed",
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });

        vATService.getListDevextremes(args)
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
        vATService.get(key)
            .done(data => {
                d.resolve(data);
            });
        return d.promise();
    }
});

// get price list
var getPriceList = new DevExpress.data.CustomStore({
    key: 'id',
    loadMode: "processed",
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

        var d = new $.Deferred();
        priceListService.get(key)
            .done(data => {
                d.resolve(data);
            });
        return d.promise();
    }
});

const manageItem = [
    {
        id: 'NONE',
        text: l('EntityFieldValue:MDMService:Item:ManageItemBy:NONE')
    },
    {
        id: 'LOT',
        text: l('EntityFieldValue:MDMService:Item:ManageItemBy:LOT')
    },
    {
        id: 'SERIAL',
        text: l('EntityFieldValue:MDMService:Item:ManageItemBy:SERIAL')
    }
];

const expiredType = [
    {
        id: 'DAY',
        text: l('EntityFieldValue:MDMService:Item:ExpiredType:DAY')
    },
    {
        id: 'WEEK',
        text: l('EntityFieldValue:MDMService:Item:ExpiredType:WEEK')
    },
    {
        id: 'MONTH',
        text: l('EntityFieldValue:MDMService:Item:ExpiredType:MONTH')
    },
    {
        id: 'YEAR',
        text: l('EntityFieldValue:MDMService:Item:ExpiredType:YEAR')
    }
];

const issueMethod = [
    {
        id: 'FEFO',
        text: l('EntityFieldValue:MDMService:Item:IssueMethod:FEFO')
    },
    {
        id: 'SERIAL',
        text: l('EntityFieldValue:MDMService:Item:IssueMethod:SERIAL')
    }
];

function initItemAttributeTab() {
    return function () {
        return $('<div id="gridItemAttribute">')
            .dxDataGrid({
                dataSource: groupAttributeStore,
                keyExpr: 'id',
                remoteOperations: true,
                showBorders: true,
                //autoExpandAll: true,
                focusedRowEnabled: true,
                allowColumnReordering: false,
                rowAlternationEnabled: true,
                columnAutoWidth: true,
                columnHidingEnabled: true,
                errorRowEnabled: false,
                filterRow: {
                    visible: true
                },
                searchPanel: {
                    visible: true
                },
                scrolling: {
                    mode: 'standard'
                },
                paging: {
                    enabled: true,
                    pageSize: 10
                },
                pager: {
                    visible: true,
                    showPageSizeSelector: true,
                    allowedPageSizes: [10, 20, 50, 100],
                    showInfo: true,
                    showNavigationButtons: true
                },
                editing: {
                    mode: 'row',
                    allowAdding: true,
                    allowUpdating: true,
                    allowDeleting: true,
                    useIcons: true,
                    texts: {
                        editRow: l("Edit"),
                        deleteRow: l("Delete"),
                        confirmDeleteMessage: l("DeleteConfirmationMessage")
                    }
                },
                onRowUpdating: function (e) {
                    var objectRequire = ['code', 'name'];
                    for (var property in e.oldData) {
                        if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                            e.newData[property] = e.oldData[property];
                        }
                    }
                },
                toolbar: {
                    items: [
                        {
                            name: "searchPanel",
                            location: 'after'
                        }
                    ]
                },
                columns: [
                    //{
                    //    type: 'buttons',
                    //    caption: l('Actions'),
                    //    buttons: ['edit', 'delete'],
                    //},
                    {
                        dataField: 'attr0Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr0Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr1Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr1Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr2Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr2Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr3Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr3Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr4Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr4Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr5Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr5Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr6Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr6Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr7Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr7Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr8Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr8Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr9Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr9Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr10Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr10Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr11Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr11Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr12Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr12Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr13Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr13Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr14Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr14Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr15Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr15Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr16Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr16Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr17Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr17Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr18Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr18Name"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'attr19Id',
                        caption: l("EntityFieldName:MDMService:ItemGroupAttr:Attr19Name"),
                        dataType: 'string'
                    }
                ]
            })
    }
}

function initListItemTab() {
    return function () {
        return $('<div id="gridListItem">')
            .dxDataGrid({
                dataSource: itemGroupListStore,
                keyExpr: 'id',
                remoteOperations: true,
                showBorders: true,
                autoExpandAll: true,
                focusedRowEnabled: true,
                allowColumnReordering: false,
                rowAlternationEnabled: true,
                columnAutoWidth: true,
                columnHidingEnabled: true,
                errorRowEnabled: false,
                filterRow: {
                    visible: true
                },
                searchPanel: {
                    visible: true
                },
                scrolling: {
                    mode: 'standard'
                },
                paging: {
                    enabled: true,
                    pageSize: 10
                },
                pager: {
                    visible: true,
                    showPageSizeSelector: true,
                    allowedPageSizes: [10, 20, 50, 100],
                    showInfo: true,
                    showNavigationButtons: true
                },
                editing: {
                    mode: 'row',
                    allowAdding: true,
                    allowUpdating: true,
                    allowDeleting: true,
                    useIcons: true,
                    texts: {
                        editRow: l("Edit"),
                        deleteRow: l("Delete"),
                        confirmDeleteMessage: l("DeleteConfirmationMessage")
                    }
                },
                onRowUpdating: function (e) {
                    var objectRequire = ['itemGroupId', 'itemId', 'uomId', 'rate'];
                    for (var property in e.oldData) {
                        if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                            e.newData[property] = e.oldData[property];
                        }
                    }
                },
                toolbar: {
                    items: [
                        {
                            name: "searchPanel",
                            location: 'after'
                        }
                    ]
                },
                columns: [
                    //{
                    //    type: 'buttons',
                    //    caption: l('Actions'),
                    //    buttons: ['edit', 'delete'],
                    //},
                    {
                        dataField: 'itemId',
                        caption: l("EntityFieldName:MDMService:ItemGroupList:Item"),
                        validationRules: [{ type: "required" }],
                        editorType: 'dxSelectBox',
                        lookup: {
                            dataSource: getItems,
                            valueExpr: 'id',
                            displayExpr: 'displayName'
                        }
                    },
                    {
                        dataField: 'uomId',
                        caption: l("EntityFieldName:MDMService:ItemGroupList:UOM"),
                        validationRules: [{ type: "required" }],
                        editorType: 'dxSelectBox',
                        lookup: {
                            dataSource: getUOMs,
                            valueExpr: 'id',
                            displayExpr: 'displayName'
                        }
                    },
                    {
                        dataField: 'rate',
                        caption: l("EntityFieldName:MDMService:ItemGroupList:Rate"),
                        validationRules: [{ type: "required" }],
                        dataType: 'number'
                    },
                    {
                        dataField: 'price',
                        caption: l("EntityFieldName:MDMService:ItemGroupList:Price")
                    }
                ]
            })
    }
}