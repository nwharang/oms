var l = abp.localization.getResource("OMS");
var cusProfile = JSON.parse(sessionStorage.getItem("customerProfile"));
if (cusProfile != null) {
    document.title = `Customer - ${cusProfile.name} | OMS`;
}

var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
var systemDataService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;
var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
var geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;
var cusAttributeValueService = window.dMSpro.oMS.mdmService.controllers.cusAttributeValues.cusAttributeValue;
var cusAttrService = window.dMSpro.oMS.mdmService.controllers.customerAttributes.customerAttribute;
var cusContactService = window.dMSpro.oMS.mdmService.controllers.customerContacts.customerContact;
var cusAttachService = window.dMSpro.oMS.mdmService.controllers.customerAttachments.customerAttachment;
var cusProfileService = window.dMSpro.oMS.mdmService.controllers.customers.customer;

var urlUploadFileAttachment = `${abp.appPath}api/mdm-service/item-attachments`;
var urlGetFileAttachment = `${abp.appPath}api/mdm-service/item-attachments/get-file`;
var itemAttachment = [];
var attachmentId = '';
var attachment = [];

$(function () {
    DevExpress.config({
        editorStylingMode: 'underlined',
    });

    const gender = [
        {
            id: 0,
            text: l('EntityFieldValue:MDMService:CustomerContact:Gender:MALE')
        },
        {
            id: 1,
            text: l('EntityFieldValue:MDMService:CustomerContact:Gender:FEMALE')
        },
        {
            id: 2,
            text: l('EntityFieldValue:MDMService:CustomerContact:Gender:OTHER')
        }
    ]

    $('#tabpanel-container').dxTabPanel({
        items: [
            {
                title: "Image",
                icon: "image",
                //template: initImageTab()
            },
            {
                title: "Address",
                icon: "map",
                template: initAddressTab()
            },
            //{
            //    title: "Attribute",
            //    icon: "check",
            //    template: initAttributeTab()
            //},
            {
                title: "Contact",
                icon: "card",
                template: initContactTab()
            },
            {
                title: "Attachment",
                icon: "attach",
                template: iniAttachmentTab()
            }
        ],
        onInitialized: function (e) {
            if (cusProfile == null) {
                e.component.option('items[3].disabled', true);
                e.component.option('items[4].disabled', true);
                e.component.option('selectedIndex', 0);
            } else {
                e.component.option('items[3].disabled', false);
                e.component.option('items[4].disabled', false);
                e.component.option('selectedIndex', 0);
            }
        }
    }).dxTabPanel('instance');

    $("#top-section").dxForm({
        formData: cusProfile,
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
        cusAttrService.getListDevextremes({})
            .done(result => {
                var listCusAttribute = result.data.filter(x => x.active == true);
                var items = [
                    {
                        itemType: 'group',
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
                                        dataField: 'phone1',
                                        dataType: 'string'
                                    },
                                    {
                                        dataField: 'phone2',
                                        dataType: 'string'
                                    },
                                    {
                                        dataField: 'erpCode',
                                        dataType: 'string'
                                    },
                                    {
                                        dataField: 'active',
                                        editorType: 'dxCheckBox'
                                    }
                                ]
                            },
                            {
                                itemType: 'group',
                                caption: 'System Information',
                                colCount: 2,
                                colSpan: 4,
                                items: [
                                    {
                                        itemType: 'group',
                                        items: [
                                            {
                                                dataField: 'priceListId',
                                                editorType: 'dxSelectBox',
                                                editorOptions: {
                                                    dataSource: {
                                                        store: pricelistLookup,
                                                        paginate: true,
                                                        pageSize: pageSizeForLookup
                                                    },
                                                    displayExpr: 'code',
                                                    valueExpr: 'id'
                                                },
                                                validationRules: [{ type: 'required' }]
                                            },
                                            {
                                                dataField: 'license',
                                                dataType: 'string'
                                            },
                                            {
                                                dataField: 'taxCode',
                                                dataType: 'string'
                                            },
                                            {
                                                dataField: 'vatName',
                                                dataType: 'string'
                                            },
                                            {
                                                dataField: 'vatAddress',
                                                dataType: 'string'
                                            },
                                            {
                                                dataField: 'creditLimit'
                                            },
                                            {
                                                dataField: 'sfaCustomerCode',
                                                dataType: 'string',
                                                validationRules: [{ type: 'required' }]
                                            }
                                        ]
                                    },
                                    {
                                        itemType: 'group',
                                        items: [
                                            {
                                                dataField: 'effectiveDate',
                                                editorType: "dxDateBox",
                                                validationRules: [{ type: 'required' }]
                                            },
                                            {
                                                dataField: 'endDate',
                                                editorType: "dxDateBox"
                                            },
                                            {
                                                dataField: 'lastOrderDate',
                                                editorType: "dxDateBox"
                                            },
                                            //{
                                            //    dataField: 'warehouseId',
                                            //    editorType: 'dxSelectBox',
                                            //    editorOptions: {
                                            //        dataSource: {
                                            //            store: warehouseLookup,
                                            //            paginate: true,
                                            //            pageSize: pageSizeForLookup
                                            //        },
                                            //        displayExpr: 'valueCode',
                                            //        valueExpr: 'id'
                                            //    }
                                            //},
                                            {
                                                dataField: 'paymentTermId',
                                                editorType: 'dxSelectBox',
                                                editorOptions: {
                                                    dataSource: {
                                                        store: systemDataLookup,
                                                        paginate: true,
                                                        pageSize: pageSizeForLookup
                                                    },
                                                    displayExpr: 'valueCode',
                                                    valueExpr: 'id'
                                                }
                                            },
                                            {
                                                dataField: 'linkedCompanyId',
                                                editorType: 'dxSelectBox',
                                                validationRules: [{ type: "required" }],
                                                editorOptions: {
                                                    dataSource: {
                                                        store: companyData,
                                                        paginate: true,
                                                        pageSize: pageSizeForLookup
                                                    },
                                                    displayExpr: 'name',
                                                    valueExpr: 'id'
                                                }
                                            },
                                            {
                                                dataField: 'isCompany',
                                                editorType: 'dxCheckBox'
                                            }
                                        ]
                                    }
                                ]
                            },
                        ]
                    }
                ];
                listCusAttribute.forEach((i) => {
                    itemsOption.push(generateAttrOptions(i))
                })
                items.push({
                    itemType: 'group',
                    cssClass: 'second-group',
                    caption: 'DMS Attribute',
                    colSpan: 2,
                    items: itemsOption
                })
                dxForm.option('items', items);
            });
    }

    function initContactTab() {
        return function () {
            return $('<div id="dgContact" style="padding-top: 10px">')
                .dxDataGrid({
                    dataSource: cusContactStore,
                    editing: {
                        mode: "row",
                        allowAdding: abp.auth.isGranted('MdmService.Customers.Create'),
                        allowUpdating: abp.auth.isGranted('MdmService.Customers.Edit'),
                        allowDeleting: abp.auth.isGranted('MdmService.Customers.Delete'),
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
                                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Contact.xlsx');
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
                        storageKey: 'dgContact',
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
                        e.data.customerId = cusProfile.id;
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
                                    $('#dgContact').data('dxDataGrid').addRow()
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
                            dataField: 'customerId',
                            caption: l("CustomerId"),
                            dataType: 'string',
                            visible: false
                        },
                        {
                            dataField: 'firstName',
                            caption: l("FirstName"),
                            dataType: 'string',
                        },
                        {
                            dataField: 'lastName',
                            caption: l("LastName"),
                            dataType: 'string',
                        },
                        {
                            dataField: 'gender',
                            caption: l("Gender"),
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                dataSource: {
                                    store: gender,
                                    paginate: true,
                                    pageSize: pageSizeForLookup
                                },
                                displayExpr: 'text',
                                valueExpr: 'id'
                            }
                        },
                        {
                            dataField: 'phone',
                            caption: l("Phone"),
                            dataType: 'string',
                        },
                        {
                            dataField: 'email',
                            caption: l("Email"),
                            dataType: 'string',
                        },
                        {
                            dataField: 'address',
                            caption: l("Address"),
                            dataType: 'string',
                        },
                        {
                            dataField: 'identityNumber',
                            caption: l("IdentityNumber"),
                        },
                        {
                            dataField: 'bankName',
                            caption: l("BankName"),
                        },
                        {
                            dataField: 'bankAccName',
                            caption: l("BankAccName"),
                        },
                        {
                            dataField: 'bankAccNumber',
                            caption: l("BankAccNumber"),
                        },
                    ],
                })
        }
    }

    const dsAttrValue = function (n) {
        return {
            store: getCusAttrValue,
            filter: ['customerAttribute.attrNo', '=', n],
            paginate: true,
            pageSize: pageSizeForLookup
        };
    }

    function generateAttrOptions(attr) {
        return {
            dataField: 'attribute' + attr.attrNo + 'Id',
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

var pricelistLookup = new DevExpress.data.CustomStore({
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

        var d = new $.Deferred();
        priceListService.get(key)
            .done(data => {
                d.resolve(data);
            });
        return d.promise();
    }
});

var systemDataLookup = new DevExpress.data.CustomStore({
    key: 'id',
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = { filter: JSON.stringify(['code', '=', 'MD04']) };
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });

        systemDataService.getListDevextremes(args)
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
        systemDataService.get(key)
            .done(data => {
                d.resolve(data);
            });
        return d.promise();
    }
});

var companyData = new DevExpress.data.CustomStore({
    key: 'id',
    cacheRawData: true,
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });

        companyService.getListDevextremes(args)
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
        companyService.get(key)
            .done(data => {
                d.resolve(data);
            });
        return d.promise();
    }
});

//var warehouseLookup = new DevExpress.data.CustomStore({
//    key: 'id',
//    cacheRawData: true,
//    load(loadOptions) {
//        const deferred = $.Deferred();
//        const args = {};
//        requestOptions.forEach((i) => {
//            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
//                args[i] = JSON.stringify(loadOptions[i]);
//            }
//        });

//        warehouseService.getListDevextremes(args)
//            .done(result => {
//                deferred.resolve(result.data, {
//                    totalCount: result.totalCount,
//                    summary: result.summary,
//                    groupCount: result.groupCount,
//                });
//            });
//        return deferred.promise();
//    }
//});

function initAddressTab() {
    return function () {
        return $('<div id="formAddress" style="padding:10px">')
            .dxForm({
                dataForm: cusProfile,
                labelMode: 'floating',
                colCount: 2,
                items: [
                    {
                        itemType: "group",
                        items: [
                            {
                                dataField: 'geoMaster0Id',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    dataSource: dsAddressValue(0),
                                    valueExpr: "id",
                                    displayExpr: "name"
                                }
                            },
                            {
                                dataField: 'geoMaster1Id',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    dataSource: dsAddressValue(1),
                                    valueExpr: "id",
                                    displayExpr: "name"
                                }
                            },
                            {
                                dataField: 'geoMaster2Id',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    dataSource: dsAddressValue(2),
                                    valueExpr: "id",
                                    displayExpr: "name"
                                }
                            },
                            {
                                dataField: 'geoMaster3Id',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    dataSource: dsAddressValue(3),
                                    valueExpr: "id",
                                    displayExpr: "name"
                                }
                            },
                            {
                                dataField: 'geoMaster4Id',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    dataSource: dsAddressValue(4),
                                    valueExpr: "id",
                                    displayExpr: "name"
                                }
                            },
                            {
                                dataField: 'street'
                            },
                            {
                                dataField: 'address'
                            },
                            {
                                dataField: 'latitude'
                            },
                            {
                                dataField: 'longitude'
                            }
                        ]
                    },
                    {
                        itemType: "group",
                        items: [{
                            template: function (data, itemElement) {
                                const mapsDiv = $("<div style='padding:15px; min-height: 320px;'>")
                                var latitude = 0;
                                var longitude = 0;
                                if (cusProfile != null) {
                                    latitude = cusProfile.latitude ? cusProfile.latitude : 0;
                                    longitude = cusProfile.longitude ? cusProfile.longitude : 0;
                                }
                                mapsDiv.dxMap({
                                    center: { lat: latitude, lng: longitude },
                                    controls: true,
                                    zoom: 14,
                                    height: 380,
                                    width: '100%',
                                    provider: 'google',
                                    apiKey: {
                                        // Specify your API keys for each map provider:
                                        // bing: "YOUR_BING_MAPS_API_KEY",
                                        // google: "YOUR_GOOGLE_MAPS_API_KEY",
                                        // googleStatic: "YOUR_GOOGLE_STATIC_MAPS_API_KEY"
                                    },
                                });
                                mapsDiv.appendTo(itemElement);
                            }
                        }]
                    }
                ]
            })
    }
}

var geoMasterStore = new DevExpress.data.CustomStore({
    key: 'id',
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });

        geoMasterService.getListDevextremes(args)
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
    }
});

function initAttributeTab() {
    return function () {
        return $('<div id="formAttribute" style="padding:10px">')
            .dxForm({
                dataForm: cusProfile,
                labelMode: 'floating',
                colCount: 4,
                onInitialized: function (e) {
                    getItemAttributeItems(e.component)
                }
            })
    }
}

var getCusAttrValue = new DevExpress.data.CustomStore({
    key: 'id',
    loadMode: "raw",
    cacheRawData: true,
    load(loadOptions) {
        const deferred = $.Deferred();
        cusAttributeValueService.getListDevextremes({})
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

function getItemAttributeItems(dxForm) {
    const items = [];

    //const deferred = $.Deferred();
    cusAttrService.getListDevextremes({})
        .done(result => {
            var listAttr = result.data.filter(x => x.active == true);
            listAttr.forEach((i) => {
                items.push(generateAttrOptions(i))
            })
            dxForm.option('items', items)
        });
}

const dsAttrValue = function (n) {
    return {
        store: getCusAttrValue,
        filter: ['customerAttribute.attrNo', '=', n],
    };
}

function generateAttrOptions(attr) {
    return {
        dataField: 'attribute' + attr.attrNo + 'Id',
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

const dsAddressValue = function (n) {
    return {
        store: geoMasterStore,
        filter: ['level', '=', n],
        paginate: true,
        pageSize: pageSizeForLookup
    };
}

var cusContactStore = new DevExpress.data.CustomStore({
    key: 'id',
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });
        args.filter = JSON.stringify(['customerId', '=', cusProfile ? cusProfile.id : null])

        cusContactService.getListDevextremes(args)
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
        return key == 0 ? cusContactService.get(key) : null;
    },
    insert(values) {
        return cusContactService.create(values, { contentType: "application/json" });
    },
    update(key, values) {
        return cusContactService.update(key, values, { contentType: "application/json" });
    },
    remove(key) {
        return cusContactService.delete(key);
    }
});

var cusAttachStore = new DevExpress.data.CustomStore({
    key: 'id',
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });
        args.filter = JSON.stringify(['customerId', '=', cusProfile ? cusProfile.id : null])

        cusAttachService.getListDevextremes(args)
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
        return key == 0 ? cusAttachService.get(key) : null;
    },
    insert(values) {
        return cusAttachService.create(values, { contentType: "application/json" });
    },
    update(key, values) {
        return cusAttachService.update(key, values, { contentType: "application/json" });
    },
    remove(key) {
        return cusAttachService.delete(key);
    }
});

function iniAttachmentTab() {
    return function () {
        return $('<div id="dgAttachment" style="padding-top: 10px">')
            .dxDataGrid({
                dataSource: cusAttachStore,
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
                        title: l('Menu:MdmService:CustomerAttachments'),
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
                            },
                            {
                                dataField: 'creationTime'
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
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Attachment.xlsx');
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
                    storageKey: 'dgAttachment',
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
                    e.data.customerId = cusProfile.id;
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
                                $('#dgAttachment').data('dxDataGrid').addRow()
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
                        dataField: 'description',
                        caption: l("Description"),
                        dataType: 'string',
                    },
                    {
                        dataField: 'fileId',
                        caption: l("File"),
                        dataType: 'string',
                        //cellTemplate: function (element, info) {
                        //    element.append("<a href='#'>" + info.text + "</a>")
                        //        .css("color", "blue");
                        //}
                    },
                    {
                        dataField: 'creationTime',
                        caption: l("CreationTime"),
                        width: 150,
                        dataType: 'date',
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
        if (cusProfile != null) {
            cusProfileService.update(cusProfile.id, data, { contentType: 'application/json' })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    sessionStorage.setItem("customerProfile", JSON.stringify(result));
                })
        } else {
            cusProfileService.create(data, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    sessionStorage.setItem("customerProfile", JSON.stringify(result));
                    if (result.id != null) {
                        var dxTab = $('#tabpanel-container').data('dxTabPanel');
                        dxTab.option('items[3].disabled', false);
                        dxTab.option('items[4].disabled', false);
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