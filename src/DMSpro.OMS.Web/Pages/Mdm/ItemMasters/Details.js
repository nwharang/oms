var l = abp.localization.getResource("OMS");
var item = JSON.parse(sessionStorage.getItem("item"));
if (item != null) {
    document.title = `Item - ${item.name} | OMS`;
}

var itemTypeService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;
var uOMGroupService = window.dMSpro.oMS.mdmService.controllers.uOMGroups.uOMGroup;
var uomService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;
var itemAttrValueService = window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue;
var itemAttrService = window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute;
var itemImageService = window.dMSpro.oMS.mdmService.controllers.itemImages.itemImage;
var itemAttachService = window.dMSpro.oMS.mdmService.controllers.itemAttachments.itemAttachment;

$(function () {
    DevExpress.config({
        editorStylingMode: 'underlined',
    });

    const manageItem = [
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
    ];
    const expiredType = [
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
    ];
    const issueMethod = [
        {
            id: 0,
            text: l('EntityFieldValue:MDMService:Item:IssueMethod:FEFO')
        },
        {
            id: 1,
            text: l('EntityFieldValue:MDMService:Item:IssueMethod:SERIAL')
        }
    ];


    $('#tabpanel-container').dxTabPanel({
        items: [
            {
                title: "Image",
                icon: "image",
                template: initImageTab()
            },
            {
                title: "Attachment",
                icon: "attach",
                template: iniAttachmentTab()
            }
        ]
    }).dxTabPanel('instance');

    $("#top-section").dxForm({
        formData: item,
        labelMode: 'floating',
        colCount: 10,
        onInitialized: function (e) {
            getItemForm(e.component)
        }
    });

    $('#resizable').dxResizable({
        minHeight: 400,
        handles: "bottom"
    }).dxResizable('instance');

    function getItemForm(dxForm) {
        var itemsOption = [];
        itemAttrService.getListDevextremes({})
            .done(result => {
                var listItemAttribute = result.data.filter(x => x.active == true);
                var items = [
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
                                        dataType: 'string',
                                        validationRules: [{ type: 'required' }]
                                    },
                                    {
                                        dataField: 'name',
                                        dataType: 'string',
                                        validationRules: [{ type: 'required' }]
                                    },
                                    {
                                        dataField: 'shortName',
                                        dataType: 'string'
                                    },
                                    {
                                        dataField: 'itemTypeId',
                                        label: l('EntityFieldName:MDMService:Item:ItemTypeName'),
                                        editorType: 'dxSelectBox',
                                        editorOptions: {
                                            dataSource: {
                                                store: getItemTypes,
                                                paginate: true,
                                                pageSize: pageSizeForLookup
                                            },
                                            valueExpr: 'id',
                                            displayExpr: 'valueName'
                                        }
                                    },
                                    {
                                        dataField: 'barcode',
                                        label: l('EntityFieldName:MDMService:Item:Barcode'),
                                        dataType: 'string'
                                    },
                                    {
                                        dataField: 'erpCode',
                                        label: l('EntityFieldName:MDMService:Item:ERPCode'),
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
                                        colSpan: 2,
                                        editorType: 'dxSelectBox',
                                        editorOptions: {
                                            dataSource: {
                                                store: getUOMGroups,
                                                paginate: true,
                                                pageSize: pageSizeForLookup
                                            },
                                            valueExpr: 'id',
                                            displayExpr: 'code'
                                        }
                                    },
                                    {
                                        itemType: 'group',
                                        items: [
                                            {
                                                dataField: 'isInventoriable',
                                                dataType: 'boolean',
                                                editorType: 'dxCheckBox'
                                            },
                                            {
                                                dataField: 'isPurchasable',
                                                dataType: 'boolean',
                                                editorType: 'dxCheckBox'
                                            },
                                            {
                                                dataField: 'isSaleable',
                                                dataType: 'boolean',
                                                editorType: 'dxCheckBox'
                                            },
                                            {
                                                dataField: 'manageItemBy',
                                                cssClass: 'fieldManageItemBy',
                                                validationRules: [{ type: 'required' }],
                                                editorType: 'dxSelectBox',
                                                editorOptions: {
                                                    items: manageItem,
                                                    valueExpr: 'id',
                                                    displayExpr: 'text'
                                                }
                                            },
                                            {
                                                dataField: 'expiredType',
                                                cssClass: 'fieldExpiredType',
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
                                                dataType: 'number',
                                                editorOptions: {
                                                    disabled: true
                                                }
                                            },
                                            {
                                                dataField: 'issueMethod',
                                                cssClass: 'fieldIssueMethod',
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
                                                validationRules: [{ type: 'required' }],
                                                editorType: 'dxSelectBox',
                                                editorOptions: {
                                                    dataSource: {
                                                        store: getUOMs,
                                                        paginate: true,
                                                        pageSize: pageSizeForLookup
                                                    },
                                                    valueExpr: 'id',
                                                    displayExpr: 'code'
                                                }
                                            },
                                            {
                                                dataField: 'purUOMId',
                                                cssClass: 'fieldPurUOMId',
                                                validationRules: [{ type: 'required' }],
                                                editorType: 'dxSelectBox',
                                                editorOptions: {
                                                    dataSource: {
                                                        store: getUOMs,
                                                        paginate: true,
                                                        pageSize: pageSizeForLookup
                                                    },
                                                    valueExpr: 'id',
                                                    displayExpr: 'code'
                                                }
                                            },
                                            {
                                                dataField: 'salesUOMId',
                                                cssClass: 'fieldSalesUOMId',
                                                validationRules: [{ type: 'required' }],
                                                editorType: 'dxSelectBox',
                                                editorOptions: {
                                                    dataSource: {
                                                        store: getUOMs,
                                                        paginate: true,
                                                        pageSize: pageSizeForLookup
                                                    },
                                                    valueExpr: 'id',
                                                    displayExpr: 'code'
                                                }
                                            },
                                            {
                                                dataField: 'vatId',
                                                validationRules: [{ type: 'required' }]
                                            },
                                            {
                                                dataField: 'basePrice',
                                                validationRules: [{ type: 'required' }]
                                            },
                                            {
                                                dataField: 'active',
                                                dataType: 'boolean',
                                                editorType: 'dxCheckBox'
                                            }
                                        ]
                                    }
                                ]
                            },
                        ]
                    }
                ];
                listItemAttribute.forEach((i) => {
                    itemsOption.push(generateAttrOptions(i))
                })
                items.push(
                    {
                        itemType: 'group',
                        cssClass: 'second-group',
                        caption: 'DMS Attribute',
                        colSpan: 2,
                        items: itemsOption
                    }
                )
                dxForm.option('items', items);
            });
    }

    const dsAttrValue = function (n) {
        return {
            store: getItemAttrValue,
            filter: ['itemAttribute.attrNo', '=', n],
        };
    }

    function getAttrOptions(e) {
        const options = [];

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
            listAttrActive.forEach((i) => {
                options.push(generateAttrOptions(i))
            });
        });
        return options;
    }

    function generateAttrOptions(attr) {
        return {
            dataField: 'attr' + attr.attrNo + 'Id',
            label: {
                text: attr.attrName
            },
            editorType: 'dxSelectBox',
            editorOptions: {
                dataSource: dsAttrValue(attr.attrNo), //listAttrValue.filter(x => x.itemAttributeId == attr.id),
                valueExpr: 'id',
                displayExpr: 'attrValName'
            }
        }
    }
});

var itemAttachStore = new DevExpress.data.CustomStore({
    key: 'id',
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });
        args.filter = JSON.stringify(['itemId', '=', item ? item.id : null])

        itemAttachService.getListDevextremes(args)
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
        return key == 0 ? itemAttachService.get(key) : null;
    },
    insert(values) {
        return itemAttachService.create(values, { contentType: "application/json" });
    },
    update(key, values) {
        return itemAttachService.update(key, values, { contentType: "application/json" });
    },
    remove(key) {
        return itemAttachService.delete(key);
    }
});

function iniAttachmentTab() {
    return function () {
        return $('<div id="dgItemAttachment" style="padding-top: 10px">')
            .dxDataGrid({
                dataSource: itemAttachStore,
                editing: {
                    mode: "popup",
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
                remoteOperations: true,
                showRowLines: true,
                showBorders: true,
                cacheEnabled: true,
                allowColumnReordering: true,
                rowAlternationEnabled: true,
                allowColumnResizing: true,
                columnResizingMode: 'widget',
                columnAutoWidth: true,
                filterRow: {
                    visible: true
                },
                groupPanel: {
                    visible: true,
                },
                searchPanel: {
                    visible: true
                },
                columnMinWidth: 50,
                columnChooser: {
                    enabled: true,
                    mode: "select"
                },
                columnFixing: {
                    enabled: true,
                },
                export: {
                    enabled: true,
                },
                onExporting(e) {
                    const workbook = new ExcelJS.Workbook();
                    const worksheet = workbook.addWorksheet('Data');

                    DevExpress.excelExporter.exportDataGrid({
                        component: e.component,
                        worksheet,
                        autoFilterEnabled: true,
                    }).then(() => {
                        workbook.xlsx.writeBuffer().then((buffer) => {
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ItemAttachment.xlsx');
                        });
                    });
                    e.cancel = true;
                },
                headerFilter: {
                    visible: true,
                },
                stateStoring: {
                    enabled: true,
                    type: 'localStorage',
                    storageKey: 'dgItemAttachment',
                },
                paging: {
                    enabled: true,
                    pageSize: pageSize
                },
                pager: {
                    visible: true,
                    showPageSizeSelector: true,
                    allowedPageSizes: allowedPageSizes,
                    showInfo: true,
                    showNavigationButtons: true
                },
                onRowInserting: function (e) {
                    e.data.itemId = item.id;
                },
                onRowUpdating: function (e) {
                    e.newData = Object.assign({}, e.oldData, e.newData);
                },
                toolbar: {
                    items: [
                        "groupPanel",
                        {
                            location: 'after',
                            template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                            onClick() {
                                $('#dgItemAttachment').data('dxDataGrid').addRow()
                            },
                        },
                        'columnChooserButton',
                        "exportButton",
                        {
                            location: 'after',
                            template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
                            onClick() {
                                //todo
                            },
                        },
                        "searchPanel"
                    ],
                },
                columns: [
                    {
                        type: 'buttons',
                        caption: l("Actions"),
                        width: 110,
                        buttons: ['edit', 'delete'],
                        fixedPosition: 'left'
                    },
                    {
                        dataField: 'itemId',
                        caption: l("ItemId"),
                        dataType: 'string',
                        visible: false
                    },
                    {
                        dataField: 'fileId',
                        caption: l('File'),
                        validationRules: [{ type: "required" }],
                    },
                    {
                        dataField: 'description',
                        caption: l("Description"),
                        dataType: 'string'
                    },
                    {
                        dataField: 'active',
                        caption: l("Active"),
                        width: 120,
                        alignment: 'center',
                        dataType: 'boolean',
                        cellTemplate(container, options) {
                            $('<div>')
                                .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                                .appendTo(container);
                        },
                    }
                ],
            })
    }
}

var getItemTypes = new DevExpress.data.CustomStore({
    key: 'id',
    loadMode: 'raw',
    cacheRawData: true,
    load(loadOptions) {
        const deferred = $.Deferred();
        itemTypeService.getListDevextremes({ filter: JSON.stringify(['code', '=', 'MD02']) })
            .done(result => {
                deferred.resolve(result.data, {
                    totalCount: result.totalCount,
                    summary: result.summary,
                    groupCount: result.groupCount,
                });
            });
        return deferred.promise();
    }
});

var getUOMGroups = new DevExpress.data.CustomStore({
    key: 'id',
    loadMode: 'raw',
    cacheRawData: true,
    load(loadOptions) {
        const deferred = $.Deferred();
        uOMGroupService.getListDevextremes({})
            .done(result => {
                deferred.resolve(result.data, {
                    totalCount: result.totalCount,
                    summary: result.summary,
                    groupCount: result.groupCount,
                });
            });
        return deferred.promise();
    }
});

var getUOMs = new DevExpress.data.CustomStore({
    key: 'id',
    loadMode: 'raw',
    cacheRawData: true,
    load(loadOptions) {
        const deferred = $.Deferred();
        uomService.getListDevextremes({})
            .done(result => {
                deferred.resolve(result.data, {
                    totalCount: result.totalCount,
                    summary: result.summary,
                    groupCount: result.groupCount,
                });
            });
        return deferred.promise();
    }
});

var getItemAttrValue = new DevExpress.data.CustomStore({
    key: 'id',
    loadMode: 'raw',
    cacheRawData: true,
    load(loadOptions) {
        const deferred = $.Deferred();
        itemAttrValueService.getListDevextremes({})
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
});

function initImageTab() {
    return function () {
        return $('<div id="dgItemImage" style="padding-top: 10px">')
            .dxDataGrid({
                dataSource: imageStore,
                remoteOperations: true,
                showRowLines: true,
                showBorders: true,
                cacheEnabled: true,
                allowColumnReordering: true,
                rowAlternationEnabled: true,
                allowColumnResizing: true,
                columnResizingMode: 'widget',
                columnAutoWidth: true,
                filterRow: {
                    visible: true
                },
                groupPanel: {
                    visible: true,
                },
                searchPanel: {
                    visible: true
                },
                columnMinWidth: 50,
                columnChooser: {
                    enabled: true,
                    mode: "select"
                },
                columnFixing: {
                    enabled: true,
                },
                export: {
                    enabled: true,
                },
                onExporting(e) {
                    const workbook = new ExcelJS.Workbook();
                    const worksheet = workbook.addWorksheet('Data');

                    DevExpress.excelExporter.exportDataGrid({
                        component: e.component,
                        worksheet,
                        autoFilterEnabled: true,
                    }).then(() => {
                        workbook.xlsx.writeBuffer().then((buffer) => {
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ItemImage.xlsx');
                        });
                    });
                    e.cancel = true;
                },
                headerFilter: {
                    visible: true,
                },
                stateStoring: {
                    enabled: true,
                    type: 'localStorage',
                    storageKey: 'dgItemImage',
                },
                paging: {
                    enabled: true,
                    pageSize: pageSize
                },
                pager: {
                    visible: true,
                    showPageSizeSelector: true,
                    allowedPageSizes: allowedPageSizes,
                    showInfo: true,
                    showNavigationButtons: true
                },
                editing: {
                    mode: 'popup',
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
                onRowInserting: function (e) {
                    e.data.itemId = item.id;
                },
                onRowUpdating: function (e) {
                    e.newData = Object.assign({}, e.oldData, e.newData);
                },
                toolbar: {
                    items: [
                        "groupPanel",
                        {
                            location: 'after',
                            template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                            onClick() {
                                $('#dgItemImage').data('dxDataGrid').addRow();
                            },
                        },
                        'columnChooserButton',
                        "exportButton",
                        {
                            location: 'after',
                            template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
                            onClick() {
                                //todo
                            },
                        },
                        'searchPanel'
                    ]
                },
                columns: [
                    {
                        type: 'buttons',
                        caption: l('Actions'),
                        buttons: ['edit', 'delete'],
                        fixedPosition: 'left'
                    },
                    {
                        dataField: 'itemId',
                        caption: l('EntityFieldName:MDMService:ItemImage:Item'),
                        visible: false
                    },
                    {
                        dataField: 'fileId',
                        caption: l('File'),
                        validationRules: [{ type: "required" }],
                        cellTemplate(container, options) {
                            $('<div>')
                                .append($(options.value ? "<img src=\"" + options.value + "\"> " : ""))
                                .appendTo(container);
                        }
                    },
                    {
                        dataField: 'description',
                        caption: l('EntityFieldName:MDMService:ItemImage:Description'),
                        dataType: 'string'
                    },
                    {
                        dataField: 'active',
                        caption: l('EntityFieldName:MDMService:ItemImage:Active'),
                        dataType: 'boolean',
                        cellTemplate(container, options) {
                            $('<div>')
                                .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                                .appendTo(container);
                        }
                    },
                    {
                        dataField: 'displayOrder',
                        caption: l('EntityFieldName:MDMService:ItemImage:DisplayOrder'),
                        dataType: 'number',
                        validationRules: [{ type: "required" }],
                    }
                ]
            })
    }
}

const imageStore = new DevExpress.data.CustomStore({
    key: "id",
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });
        args.filter = JSON.stringify(['itemId', '=', item ? item.id : null])
        itemImageService.getListDevextremes(args)
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
        itemImageService.get(key)
            .done(data => {
                d.resolve(data);
            })
        return d.promise();
    },
    insert(values) {
        return itemImageService.create(values, { contentType: 'application/json' });
    },
    update(key, values) {
        return itemImageService.update(key, values, { contentType: 'application/json' });
    },
    remove(key) {
        return itemImageService.delete(key);
    }
});