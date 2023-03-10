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
var itemService = window.dMSpro.oMS.mdmService.controllers.items.item;
var vATService = window.dMSpro.oMS.mdmService.controllers.vATs.vAT;

var urlUploadFileImage = `${abp.appPath}api/mdm-service/item-images`;
var urlGetFileImage = `${abp.appPath}api/mdm-service/item-images/get-file`;
var itemImage = [];
var imageId = '';
var image = [];

var urlUploadFileAttachment = `${abp.appPath}api/mdm-service/item-attachments`;
var urlGetFileAttachment = `${abp.appPath}api/mdm-service/item-attachments/get-file`;
var itemAttachment = [];
var attachmentId = '';
var attachment = [];

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
        ],
        onInitialized: function (e) {
            if (item == null) {
                e.component.option('items[0].disabled', true);
                e.component.option('items[1].disabled', true);
                e.component.option('selectedIndex', 0);
            } else {
                e.component.option('items[0].disabled', false);
                e.component.option('items[1].disabled', false);
                e.component.option('selectedIndex', 0);
            }
        }
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
                                                filter: ['code', '=', 'MD02'],
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
                                                    displayExpr: 'text',
                                                    onValueChanged: function (arg) {
                                                        if (arg.value == 1) {
                                                            $('div.fieldExpiredType > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', false);
                                                            $('div.fieldExpiredValue > div > div.dx-show-invalid-badge').removeClass('dx-state-disabled');
                                                            $('div.fieldExpiredValue > div > div.dx-show-invalid-badge > div.dx-texteditor-container > div.dx-texteditor-input-container > input').removeAttr('disabled');
                                                            $('div.fieldIssueMethod > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', false);
                                                        }
                                                        else if (arg.value == 0) {
                                                            $('div.fieldExpiredType > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', true);
                                                            $('div.fieldExpiredValue > div > div.dx-show-invalid-badge').addClass('dx-state-disabled');
                                                            $('div.fieldIssueMethod > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', true);
                                                        }
                                                        else {
                                                            $('div.fieldExpiredType > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', true);
                                                            $('div.fieldExpiredValue > div > div.dx-show-invalid-badge').addClass('dx-state-disabled');
                                                            $('div.fieldIssueMethod > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', false);
                                                        }
                                                    }
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
                                                validationRules: [{ type: 'required' }],
                                                editorType: 'dxSelectBox',
                                                editorOptions: {
                                                    dataSource: {
                                                        store: getVATs,
                                                        paginate: true,
                                                        pageSize: pageSizeForLookup
                                                    },
                                                    valueExpr: 'id',
                                                    displayExpr: 'code'
                                                }
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
            paginate: true,
            pageSize: pageSizeForLookup
        };
    }

    function generateAttrOptions(attr) {
        return {
            dataField: 'attr' + attr.attrNo + 'Id',
            label: {
                text: attr.attrName
            },
            editorType: 'dxSelectBox',
            editorOptions: {
                dataSource: dsAttrValue(attr.attrNo),
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
                    },
                    popup: {
                        title: l('Menu:MdmService:ItemAttachments'),
                        showTitle: true,
                        width: '35%',
                        height: '50%',
                    },
                    form: {
                        colCount: 1,
                        items: [
                            {
                                dataField: 'fileId',
                                template: function (data, itemElement) {
                                    renderAttachment(data, itemElement);
                                }
                            },
                            {
                                dataField: 'description'
                            },
                            {
                                dataField: 'active'
                            }
                        ]
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

var getUOMGroups = new DevExpress.data.CustomStore({
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

var getUOMs = new DevExpress.data.CustomStore({
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
        uomService.getListDevextremes(args)
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
        uomService.get(key)
            .done(data => {
                d.resolve(data);
            });
        return d.promise();
    }
});

var getVATs = new DevExpress.data.CustomStore({
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

var getItemAttrValue = new DevExpress.data.CustomStore({
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
                    },
                    popup: {
                        title: l('Menu:MdmService:ItemImages'),
                        showTitle: true,
                        width: '65%',
                        height: '50%',
                    },
                    form: {
                        colCount: 2,
                        items: [
                            {
                                itemType: 'group',
                                colCount: 1,
                                items: [
                                    {
                                        dataField: 'fileId',
                                        template: function (data, itemElement) {
                                            renderImage(data, itemElement);
                                        }
                                    }
                                ]
                            },
                            {
                                itemType: 'group',
                                colCount: 1,
                                items: [
                                    {
                                        dataField: 'description'
                                    },
                                    {
                                        dataField: 'displayOrder'
                                    },
                                    {
                                        dataField: 'active'
                                    }
                                ]
                            }
                        ]
                    }
                },
                initNewRow(e) {
                    itemImage = []
                },
                onEditingStart(e) {
                    itemImage = e.data
                },
                onRowInserting: function (e) {
                    e.data.itemId = item.id;
                    e.data.fileId = imageId;
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
                                .append($(options.value ? `<img src='${urlGetFileImage}?id=${options.value}' width='150' />` : ""))
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

function renderImage(data, itemElement) {
    itemElement.append($('<img>').attr({
        id: 'item-image',
        src: '/images/default-avatar-image.jpg',
        style: 'display: none; max-width: 50%; height: auto'
    }));

    getItemImage(itemImage.id).done(fileId => {
        if (fileId != '') {
            getFileImage(fileId, function (dataUrl) {
                $('#item-image').attr('src', dataUrl);
                $('#item-image').attr('style', 'display: block !important');
                $('#item-image').attr('width', '200');
            })
        }
    })

    itemElement.append($("<div>").attr("id", "file-uploader").dxFileUploader({
        selectButtonText: 'Select photo',
        labelText: '',
        accept: 'image/*',
        uploadMethod: 'POST',
        uploadMode: 'instantly',
        onValueChanged(e) {
            image = e.value;
        },
        uploadFile: function (file, progressCallback) {
            var formData = new FormData();
            formData.append("file", image[0]);

            $.ajax({
                type: "POST",
                url: `${urlUploadFileImage}?itemId=${item.id}`,
                async: true,
                processData: false,
                mimeType: 'multipart/form-data',
                //contentType: false,
                data: formData,
                success: function (data) {
                },
                error: function (msg) {
                    // handle error
                    console.log(msg.responseText.error);
                },
            });
        }
    }));
}

function getFileImage(fileId, callback) {
    toDataURL(`${urlGetFileImage}?id=${fileId}`, callback);
}

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

function getItemImage(imageId) {
    var d = new $.Deferred();
    itemImageService.getListDevextremes({ id: imageId }).done(result => {
        if (result.data.length > 0) {
            d.resolve(result.data[0].fileId);
        }
        d.resolve("");
    });
    return d.promise();
}

function renderAttachment(data, itemElement) {
    itemElement.append($("<div>").attr("id", "file-uploader").dxFileUploader({
        selectButtonText: 'Select photo',
        labelText: '',
        accept: 'image/*',
        uploadMethod: 'POST',
        uploadMode: 'instantly',
        onValueChanged(e) {
            attachment = e.value;
        },
        uploadFile: function (file, progressCallback) {
            var formData = new FormData();
            formData.append("file", attachment[0]);

            $.ajax({
                type: "POST",
                url: `${urlUploadFileAttachment}?itemId=${item.id}`,
                async: true,
                processData: false,
                mimeType: 'multipart/form-data',
                //contentType: false,
                data: formData,
                success: function (data) {
                },
                error: function (msg) {
                    // handle error
                    console.log(msg.responseText.error);
                },
            });
        }
    }));
}

function action(e) {
    var typeButton = e.getAttribute('data-type');
    if (typeButton == 'save') {
        var form = $('#top-section').data('dxForm');
        if (!form.validate().isValid) {
            abp.message.warn(l1('WarnMessage.RequiredField'));
            return;
        }

        var data = form.option('formData');
        if (item != null) {
            itemService.update(item.id, data, { contentType: 'application/json' })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    sessionStorage.setItem("item", JSON.stringify(result));
                })
        } else {
            itemService.create(data, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    sessionStorage.setItem("item", JSON.stringify(result));
                    if (result.id != null) {
                        var dxTab = $('#tabpanel-container').data('dxTabPanel');
                        dxTab.option('items[0].disabled', false);
                        dxTab.option('items[1].disabled', false);
                        dxTab.option('selectedIndex', 0);
                    }
                })
        }
    } else {
        abp.message.confirm(l('ConfirmationMessage.UnSavedAndLeave'), l('ConfirmationMessage.UnSavedAndLeaveTitle')).then(function (confirmed) {
            if (confirmed) {
                window.close();
            }
        });
    }
}