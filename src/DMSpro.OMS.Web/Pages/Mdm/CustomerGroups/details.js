//var l = abp.localization.getResource("MdmService");
var l = abp.localization.getResource("OMS");
const customerGroup = JSON.parse(sessionStorage.getItem('customerGroup'));
if (customerGroup != null) {
    document.title = `Customer - ${customerGroup.name} | OMS`;
}

var customerGroupAttributeService = window.dMSpro.oMS.mdmService.controllers.customerGroupByAtts.customerGroupByAtt;
var customerAttributeService = window.dMSpro.oMS.mdmService.controllers.customerAttributes.customerAttribute;
var cusAttributeValueService = window.dMSpro.oMS.mdmService.controllers.cusAttributeValues.cusAttributeValue;
var customerListService = window.dMSpro.oMS.mdmService.controllers.customerGroupByLists.customerGroupByList;
var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
var customerGroupService = window.dMSpro.oMS.mdmService.controllers.customerGroups.customerGroup;

$(function () {
    DevExpress.config({
        editorStylingMode: 'underlined',
    });

    if (customerGroup.status == 1 || customerGroup.status == 'RELEASED') {
        $('#btnReleased').attr("disabled", true);
        $('#btnCancelled').attr("disabled", true);
    }

    if (customerGroup.status == 2 || customerGroup.status == 'CANCELLED') {
        $('#btnReleased').attr("disabled", true);
        $('#btnCancelled').attr("disabled", true);
    }

    var GroupModes = [
        {
            id: 0,
            displayName: l('EntityFieldValue:MDMService:CustomerGroup:GroupBy:ATTRIBUTE')
        },
        {
            id: 1,
            displayName: l('EntityFieldValue:MDMService:CustomerGroup:GroupBy:LIST')
        },
        {
            id: 2,
            displayName: l('EntityFieldValue:MDMService:CustomerGroup:GroupBy:GEO')
        }
    ];

    const status = [
        {
            id: 0,
            text: l('EntityFieldValue:MDMService:ItemGroup:Status:OPEN')
        },
        {
            id: 1,
            text: l('EntityFieldValue:MDMService:ItemGroup:Status:RELEASED')
        },
        {
            id: 2,
            text: l('EntityFieldValue:MDMService:ItemGroup:Status:CANCELLED')
        }
    ];

    $('#tabpanel-container').dxTabPanel({
        items: [
            {
                title: l('By Attribute'),
                icon: "check",
                template: initItemAttributeTab()
            },
            {
                title: l('By List'),
                icon: "detailslayout",
                template: initListCustomerTab()
            },
            {
                title: l('By GEO'),
                icon: "map",
                //template: initGeoTab()
            }
        ],
        onInitialized: function (e) {
            if (customerGroup.groupBy == 0 || customerGroup.groupBy == 'ATTRIBUTE') {
                e.component.option('items[0].disabled', false);
                e.component.option('items[1].disabled', true);
                e.component.option('items[2].disabled', true);
                e.component.option('selectedIndex', 0);
            }
            else if (customerGroup.groupBy == 1 || customerGroup.groupBy == 'LIST') {
                e.component.option('items[0].disabled', true);
                e.component.option('items[1].disabled', false);
                e.component.option('items[2].disabled', true);
                e.component.option('selectedIndex', 1);
            }
            else {
                e.component.option('items[0].disabled', true);
                e.component.option('items[1].disabled', true);
                e.component.option('items[2].disabled', false);
                e.component.option('selectedIndex', 2);
            }

            if (customerGroup == null) {
                e.component.option('items[0].disabled', true);
                e.component.option('items[1].disabled', true);
                e.component.option('items[2].disabled', true);
                e.component.option('selectedIndex', 0);
            }
        }
    }).dxTabPanel('instance');

    $("#top-section").dxForm({
        formData: customerGroup,
        labelMode: 'floating',
        colCount: 3,
        items: [
            {
                itemType: 'group',
                items: [
                    {
                        dataField: 'code',
                        validationRules: [{ type: 'required' }]
                    },
                    {
                        dataField: 'name',
                        validationRules: [{ type: 'required' }],
                    },
                    {
                        dataField: 'active',
                        editorType: 'dxCheckBox'
                    }
                ]
            },
            {
                itemType: 'group',
                items: [
                    {
                        dataField: 'groupBy',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            searchEnabled: true,
                            items: GroupModes,
                            displayExpr: 'displayName',
                            valueExpr: 'id',
                            onValueChanged: function (e) {
                                var value = e.value;
                                var dxTabPanel = $('#tabpanel-container').data('dxTabPanel');
                                if (value == 0 || value == 'ATTRIBUTE') {
                                    dxTabPanel.option('items[0].disabled', false);
                                    dxTabPanel.option('items[1].disabled', true);
                                    dxTabPanel.option('items[2].disabled', true);
                                    dxTabPanel.option('selectedIndex', 0);
                                }
                                else if (value == 1 || value == 'LIST') {
                                    dxTabPanel.option('items[0].disabled', true);
                                    dxTabPanel.option('items[1].disabled', false);
                                    dxTabPanel.option('items[2].disabled', true);
                                    dxTabPanel.option('selectedIndex', 1);
                                }
                                else {
                                    dxTabPanel.option('items[0].disabled', true);
                                    dxTabPanel.option('items[1].disabled', true);
                                    dxTabPanel.option('items[2].disabled', false);
                                    dxTabPanel.option('selectedIndex', 2);
                                }
                            }
                        },
                        validationRules: [{ type: 'required' }]
                    },
                    {
                        dataField: 'status',
                        editorOptions: {
                            searchEnabled: true,
                            items: status,
                            displayExpr: 'text',
                            valueExpr: 'id',
                            readOnly: true
                        }
                    }
                ]
            }
        ],
        customizeItem: function (e) {
            if (customerGroup.status == 1 || customerGroup.status == 'RELEASED') {
                if (e.dataField === 'code' || e.dataField === 'name' || e.dataField === 'active' || e.dataField === 'groupBy' || e.dataField === 'status') {
                    e.editorOptions = {
                        readOnly: true
                    }
                }

                //if (e.dataField === 'type') {
                //    e.readOnly = true;
                //    e.disabled = true;
                //}
            }
        }
    });

    $('#resizable').dxResizable({
        minHeight: 120,
        handles: "bottom"
    }).dxResizable('instance');

    //$('#danger-contained').dxButton({
    //    stylingMode: 'contained',
    //    text: 'Canceled',
    //    type: 'danger',
    //    width: 120,
    //    onClick() {
    //        DevExpress.ui.notify('The Contained button was clicked');
    //    },
    //});

    //$('#default-contained').dxButton({
    //    stylingMode: 'contained',
    //    text: 'Released',
    //    type: 'default',
    //    width: 120,
    //    onClick() {
    //        DevExpress.ui.notify('The Contained button was clicked');
    //    },
    //});
});

function initItemAttributeTab() {
    return function () {
        return $('<div id="dgCustomerAttribute" style="padding-top:10px">')
            .dxDataGrid({
                dataSource: cusAttributeStore,
                remoteOperations: true,
                showBorders: true,
                focusedRowEnabled: true,
                allowColumnReordering: false,
                rowAlternationEnabled: true,
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
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CustomerAttribute.xlsx');
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
                    storageKey: 'dgCustomerAttribute',
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
                onRowInserting: function (e) {
                    e.data.customerGroupId = customerGroup ? customerGroup.id : 0;
                },
                onRowUpdating: function (e) {
                    e.newData = Object.assign({}, e.oldData, e.newData);
                },
                toolbar: {
                    items: [
                        {
                            location: 'after',
                            template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                            onClick() {
                                $('#dgCustomerAttribute').data('dxDataGrid').addRow();
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
                onInitialized: function (e) {
                    getCustomerAttributeColumns(e.component);
                },
                onContentReady: function (e) {
                    if (customerGroup.status == 1 || customerGroup.status == 'RELEASED') {
                        e.component.option('toolbar.items[0].visible', false);
                        e.component.option('columns[0].visible', false);
                    }
                }
            })
    }
}

function initListCustomerTab() {
    return function () {
        return $('<div id="dgListCustomer">')
            .dxDataGrid({
                dataSource: customerListStore,
                remoteOperations: true,
                showBorders: true,
                autoExpandAll: true,
                focusedRowEnabled: true,
                allowColumnReordering: false,
                rowAlternationEnabled: true,
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
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Export.xlsx');
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
                    storageKey: 'dgListCustomer',
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
                onRowInserting: function (e) {
                    e.data.customerGroupId = customerGroup ? customerGroup.id : 0;
                },
                onRowUpdating: function (e) {
                    e.newData = Object.assign({}, e.oldData, e.newData);
                },
                toolbar: {
                    items: [
                        'groupPanel',
                        {
                            location: 'after',
                            template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                            onClick() {
                                $('#dgListCustomer').data('dxDataGrid').addRow();
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
                        dataField: 'customerId',
                        caption: l("EntityFieldName:MDMService:CustomerGroupByList:CustomerCode"),
                        validationRules: [{ type: "required" }],
                        editorType: 'dxSelectBox',
                        lookup: {
                            dataSource: {
                                store: getCustomerList,
                                paginate: true,
                                pageSize: pageSizeForLookup
                            },
                            valueExpr: 'id',
                            displayExpr: function (e) {
                                return e.code + ' - ' + e.name
                            }
                        }
                    },
                    {
                        dataField: 'active',
                        caption: l("EntityFieldName:MDMService:CustomerGroupByList:Active"),
                        editorType: 'dxCheckBox',
                        alignment: 'center',
                        dataType: 'boolean',
                        cellTemplate(container, options) {
                            $('<div>')
                                .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                                .appendTo(container);
                        }
                    }
                ],
                onContentReady: function (e) {
                    if (customerGroup.status == 1 || customerGroup.status == 'RELEASED') {
                        e.component.option('toolbar.items[0].visible', false);
                        e.component.option('columns[0].visible', false);
                    }
                }
            })
    }
}

var getCustomerList = new DevExpress.data.CustomStore({
    key: "id",
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });
        customerService.getListDevextremes(args)
            .done(result => {
                deferred.resolve(result.data, {
                    totalCount: result.totalCount,
                    summary: result.summary,
                    groupCount: result.groupCount
                });
            });
        return deferred.promise();
    }
});

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

const dsAttrValue = function (n) {
    return {
        store: getCusAttrValue,
        filter: ['customerAttribute.attrNo', '=', n],
    };
}

function getCustomerAttributeColumns(dxGrid) {
    customerAttributeService.getListDevextremes({})
        .done(result => {
            var listAttrActive = result.data.filter(x => x.active == true);
            var columns = [
                {
                    type: 'buttons',
                    caption: l('Actions'),
                    buttons: ['edit', 'delete'],
                    fixedPosition: 'left'
                },
            ];
            listAttrActive.forEach((i) => {
                columns.push(generateAttrOptions(i));
            })
            dxGrid.option('columns', columns);
        });
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

const cusAttributeStore = new DevExpress.data.CustomStore({
    key: "id",
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });
        args.filter = JSON.stringify(['customerGroupId', '=', customerGroup ? customerGroup.id : null])
        customerGroupAttributeService.getListDevextremes(args)
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
        customerGroupAttributeService.get(key)
            .done(data => {
                d.resolve(data);
            })
        return d.promise();
    },
    insert(values) {
        return customerGroupAttributeService.create(values, { contentType: 'application/json' });
    },
    update(key, values) {
        return customerGroupAttributeService.update(key, values, { contentType: 'application/json' });
    },
    remove(key) {
        return customerGroupAttributeService.delete(key);
    }
});

const customerListStore = new DevExpress.data.CustomStore({
    key: "id",
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });
        args.filter = JSON.stringify(['customerGroupId', '=', customerGroup ? customerGroup.id : null])
        customerListService.getListDevextremes(args)
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
        customerListService.get(key)
            .done(data => {
                d.resolve(data);
            })
        return d.promise();
    },
    insert(values) {
        return customerListService.create(values, { contentType: 'application/json' });
    },
    update(key, values) {
        return customerListService.update(key, values, { contentType: 'application/json' });
    },
    remove(key) {
        return customerListService.delete(key);
    }
});

function action(e) {
    var typeButton = e.getAttribute('data-type');
    var values = customerGroup;
    var key = customerGroup.id;
    if (customerGroup.status == 0 || customerGroup.status == 'OPEN') {
        if (typeButton == 'released') {
            values.status = 1;
        }
        if (typeButton == 'cancelled') {
            values.status = 2;
        }
    }
    customerGroupService.update(key, values, { contentType: 'application/json' });
    sessionStorage.clear();
    sessionStorage.setItem('customerGroup', JSON.stringify(customerGroup));
    location.reload();
}