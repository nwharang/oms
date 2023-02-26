//var l = abp.localization.getResource("MdmService");
var l = abp.localization.getResource("OMS");
const itemGroup = JSON.parse(sessionStorage.getItem('itemGroup'));
if (itemGroup.id == 0) {
    document.title = `New Item Group | OMS`;
} else {
    document.title = `Item Group - ${itemGroup.code} | OMS`;
}

var itemGroupAttributeService = window.dMSpro.oMS.mdmService.controllers.itemGroupAttributes.itemGroupAttribute;
var itemListService = window.dMSpro.oMS.mdmService.controllers.itemGroupLists.itemGroupList;
var itemAttributeService = window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute;
var itemAttrValueService = window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue;
var itemService = window.dMSpro.oMS.mdmService.controllers.items.item;
var uOMsService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;
var itemGroupService = window.dMSpro.oMS.mdmService.controllers.itemGroups.itemGroup;

$(function () {
    DevExpress.config({
        editorStylingMode: 'underlined',
    });

    if (itemGroup.status != 0) {
        $('#btnReleased').attr("disabled", true);
        $('#btnCancelled').attr("disabled", true);
    }

    var status = [
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

    var types = [
        {
            id: 0,
            text: l('EntityFieldValue:MDMService:ItemGroup:Type:ATTRIBUTE')
        },
        {
            id: 1,
            text: l('EntityFieldValue:MDMService:ItemGroup:Type:LIST')
        }
    ];

    $('#tabpanel-container').dxTabPanel({
        items: [
            {
                title: l('Menu:MdmService:ItemGroupAttrs'),
                icon: "detailslayout",
                template: initItemAttributeTab()
            },
            {
                title: l('Menu:MdmService:ItemGroupLists'),
                icon: "detailslayout",
                template: initListItemTab()
            }
        ],
        onInitialized: function (e) {
            if (itemGroup.type == 0) {
                e.component.option('items[0].disabled', false);
                e.component.option('items[1].disabled', true);
                e.component.option('selectedIndex', 0);
            }
            else {
                e.component.option('items[0].disabled', true);
                e.component.option('items[1].disabled', false);
                e.component.option('selectedIndex', 1);
            }

            if (itemGroup.id == 0) {
                e.component.option('items[0].disabled', true);
                e.component.option('items[1].disabled', true);
                e.component.option('selectedIndex', 0);
            }
        }
    }).dxTabPanel('instance');

    $("#top-section").dxForm({
        formData: itemGroup,
        labelMode: 'floating',
        colCount: 3,
        items: [
            {
                itemType: 'group',
                items: [
                    {
                        dataField: 'code',
                        validationRules: [{
                            type: 'required',
                            message: 'Code is required',
                        }]
                    },
                    {
                        dataField: 'name',
                        validationRules: [{
                            type: 'required',
                            message: 'Name is required',
                        }],
                    },
                    {
                        dataField: 'description'
                    }
                ]
            },
            {
                itemType: 'group',
                items: [
                    {
                        dataField: 'type',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            searchEnabled: true,
                            items: types,
                            displayExpr: 'text',
                            valueExpr: 'id',
                            onValueChanged: function (e) {
                                var value = e.value;
                                var dxTabPanel = $('#tabpanel-container').data('dxTabPanel');
                                if (value == 0) {
                                    dxTabPanel.option('items[0].disabled', false);
                                    dxTabPanel.option('items[1].disabled', true);
                                    dxTabPanel.option('selectedIndex', 0);
                                }
                                else {
                                    dxTabPanel.option('items[0].disabled', true);
                                    dxTabPanel.option('items[1].disabled', false);
                                    dxTabPanel.option('selectedIndex', 1);
                                }
                            }
                        },
                        validationRules: [
                            {
                                type: 'required',
                                message: 'Type is required'
                            }
                        ]
                    },
                    {
                        dataField: 'status',
                        //editorType: 'dxSelectBox',
                        editorOptions: {
                            searchEnabled: true,
                            items: status,
                            displayExpr: 'text',
                            valueExpr: 'id',
                            readOnly: true
                        }
                    },
                    //{
                    //    dataField: 'active',
                    //    editorType: 'dxCheckBox',
                    //    alignment: 'center',
                    //    dataType: 'boolean',
                    //    cellTemplate(container, options) {
                    //        $('<div>')
                    //            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                    //            .appendTo(container);
                    //    }
                    //}
                ]
            }
        ],
        customizeItem: function (e) {
            if (itemGroup.status != 0) {
                if (e.dataField === 'code') {
                    e.editorOptions = {
                        readOnly: true
                    }
                }

                if (e.dataField === 'type') {
                    e.readOnly = true;
                    e.disabled = true;
                    //e.editorOptions = {
                    //    disabled: true
                    //}
                }
            }
        }
    });

    $('#resizable').dxResizable({
        minHeight: 120,
        handles: "bottom"
    }).dxResizable('instance');

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

function initItemAttributeTab() {
    return function () {
        return $('<div id="gridItemAttribute">')
            .dxDataGrid({
                dataSource: getDataSourceAttrGrid(itemGroup.id),
                remoteOperations: true,
                showBorders: true,
                //autoExpandAll: true,
                focusedRowEnabled: true,
                allowColumnReordering: false,
                rowAlternationEnabled: true,
                columnAutoWidth: true,
                //columnHidingEnabled: true,
                //errorRowEnabled: false,
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
                    storageKey: 'gridItemAttribute',
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
                onRowUpdating: function (e) {
                    var objectRequire = ['dummy', 'attr0Id', 'attr1Id', 'attr2Id', 'attr3Id', 'attr4Id', 'attr5Id', 'attr6Id', 'attr7Id', 'attr8Id', 'attr9Id', 'attr10Id', 'attr11Id', 'attr12Id', 'attr13Id', 'attr14Id', 'attr15Id', 'attr16Id', 'attr17Id', 'attr18d', 'attr19Id',];
                    for (var property in e.oldData) {
                        if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                            e.newData[property] = e.oldData[property];
                        }
                    }
                },
                toolbar: {
                    items: [
                        {
                            location: 'after',
                            template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                            onClick() {
                                $('#gridItemAttribute').data('dxDataGrid').addRow();
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
                    getItemAttributeColumns(e.component);
                },
                onContentReady: function (e) {
                    if (itemGroup.status != 0) {
                        e.component.option('toolbar.items[0].visible', false);
                        e.component.option('columns[0].visible', false);
                    }
                }
            })
    }
}

function initListItemTab() {
    return function () {
        return $('<div id="gridListItem">')
            .dxDataGrid({
                dataSource: getDataSourceListGrid(itemGroup.id),
                remoteOperations: true,
                showBorders: true,
                autoExpandAll: true,
                focusedRowEnabled: true,
                allowColumnReordering: false,
                rowAlternationEnabled: true,
                columnAutoWidth: true,
                //columnHidingEnabled: true,
                //errorRowEnabled: false,
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
                    storageKey: 'gridListItem',
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
                    if (e.data.rate == null) {
                        e.data.rate = 1
                    }
                },
                onRowUpdating: function (e) {
                    var objectRequire = ['itemGroupId', 'itemId', 'uomId', 'rate', 'price'];
                    for (var property in e.oldData) {
                        if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                            e.newData[property] = e.oldData[property];
                        }
                    }
                },
                toolbar: {
                    items: [
                        {
                            location: 'after',
                            template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                            onClick() {
                                $('#gridListItem').data('dxDataGrid').addRow();
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
                        dataField: 'id',
                        visible: false
                    },
                    {
                        dataField: 'itemId',
                        caption: l("EntityFieldName:MDMService:ItemGroupList:Item"),
                        validationRules: [{ type: "required" }],
                        editorType: 'dxSelectBox',
                        lookup: {
                            //dataSource: getItemList,
                            dataSource: {
                                store: getItemList,
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
                        dataField: 'uomId',
                        caption: l("EntityFieldName:MDMService:ItemGroupList:UOM"),
                        validationRules: [{ type: "required" }],
                        editorType: 'dxSelectBox',
                        lookup: {
                            //dataSource: getUOMs,
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
                        dataField: 'rate',
                        caption: l("EntityFieldName:MDMService:ItemGroupList:Rate"),
                        /*validationRules: [{ type: "required" }],*/
                        dataType: 'number',
                        value: 1
                    },
                    {
                        dataField: 'price',
                        caption: l("EntityFieldName:MDMService:ItemGroupList:Price"),
                        dataType: 'number'
                    }
                ],
                onContentReady: function (e) {
                    if (itemGroup.status != 0) {
                        e.component.option('toolbar.items[0].visible', false);
                        e.component.option('columns[0].visible', false);
                    }
                }
            })
    }
}

var groupAttributeStore = new DevExpress.data.CustomStore({
    key: "id",
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });
        itemGroupAttributeService.getListDevextremes(args)
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
        itemGroupAttributeService.get(key)
            .done(data => {
                d.resolve(data);
            })
        return d.promise();
    },
    insert(values) {
        values.itemGroupId = itemGroup.id;
        return itemGroupAttributeService.create(values, { contentType: 'application/json' });
    },
    update(key, values) {
        return itemGroupAttributeService.update(key, values, { contentType: 'application/json' });
    },
    remove(key) {
        return itemGroupAttributeService.delete(key);
    }
});

var itemGroupListStore = new DevExpress.data.CustomStore({
    key: "id",
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });
        itemListService.getListDevextremes(args)
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
        itemListService.get(key)
            .done(data => {
                d.resolve(data);
            })
        return d.promise();
    },
    insert(values) {
        return itemListService.create(values, { contentType: 'application/json' });
    },
    update(key, values) {
        return itemListService.update(key, values, { contentType: 'application/json' });
    },
    remove(key) {
        return itemListService.delete(key);
    }
});

var getItemList = new DevExpress.data.CustomStore({
    key: "id",
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });
        itemService.getListDevextremes(args)
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
        itemService.get(key)
            .done(data => {
                d.resolve(data);
            })
        return d.promise();
    }
});

var getUOMs = new DevExpress.data.CustomStore({
    key: "id",
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });
        uOMsService.getListDevextremes(args)
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
        uOMsService.get(key)
            .done(data => {
                d.resolve(data);
            })
        return d.promise();
    }
});

var listAttrValue = [];
function getItemAttributeColumns(dxGrid) {
    itemAttrValueService.getListDevextremes({})
        .done(r => {
            listAttrValue = r.data
            itemAttributeService.getListDevextremes({})
                .done(result => {
                    var u = result.data;
                    var listAttrActive = u.filter(x => x.active == true);
                    var columns = [
                        {
                            type: 'buttons',
                            caption: l('Actions'),
                            buttons: ['edit', 'delete'],
                            fixedPosition: 'left'
                        },
                        {
                            dataField: 'dummy',
                            dataType: 'string',
                            visible: false
                        }
                    ];
                    for (let i = 0; i < listAttrActive.length; i++) {
                        columns.push(generateAttrOptions(listAttrActive[i]))
                    };
                    dxGrid.option('columns', columns);
                });
        })
}

function generateAttrOptions(attr) {
    return {
        dataField: 'attr' + attr.attrNo + 'Id',
        caption: l('EntityFieldName:MDMService:ItemGroupAttr:Attr' + attr.attrNo + 'Name'),
        editorType: 'dxSelectBox',
        lookup: {
            //dataSource: listAttrValue.filter(x => x.itemAttributeId == attr.id),
            dataSource: {
                store: listAttrValue.filter(x => x.itemAttributeId == attr.id),
                paginate: true,
                pageSize: pageSizeForLookup
            },
            valueExpr: 'id',
            displayExpr: 'attrValName'
        }
    }
}

function getDataSourceAttrGrid(itemGroupId) {
    return new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            if (loadOptions.filter == undefined)
                loadOptions.filter = ['itemGroupId', '=', itemGroupId]
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            itemGroupAttributeService.getListDevextremes(args)
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
            itemGroupAttributeService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            values.itemGroupId = itemGroup.id;
            values.dummy = '0';
            return itemGroupAttributeService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return itemGroupAttributeService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return itemGroupAttributeService.delete(key);
        }
    });
}

function getDataSourceListGrid(itemGroupId) {
    return new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            if (loadOptions.filter == undefined)
                loadOptions.filter = ['itemGroupId', '=', itemGroupId]
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            itemListService.getListDevextremes(args)
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
            itemListService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            values.itemGroupId = itemGroup.id;
            return itemListService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return itemListService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return itemListService.delete(key);
        }
    });
}

function action(e) {
    var typeButton = e.getAttribute('data-type');
    var dataForm = $('#top-section').data('dxForm').option('formData');
    var values = {
        code: dataForm.code,
        name: dataForm.name,
        description: dataForm.description,
        type: dataForm.type
    }
    var key = dataForm.id;
    if (itemGroup.status == 0) {
        if (typeButton == 'released') {
            values.status = 'RELEASED';
            dataForm.status = 'RELEASED';
        }
        if (typeButton == 'cancelled') {
            values.status = 'CANCELLED';
            dataForm.status = 'CANCELLED';
        }
        if (typeButton == 'save') {
            values.status = dataForm.status;
        }
    }
    else {
        if (typeButton == 'save') {
            values.status = dataForm.status;
        }
    }
    itemGroupService.update(key, values, { contentType: 'application/json' });
    sessionStorage.clear();
    sessionStorage.setItem('itemGroup', JSON.stringify(dataForm));
    location.reload();
}