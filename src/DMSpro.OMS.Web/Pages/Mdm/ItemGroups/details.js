var l = abp.localization.getResource("MdmService");
var l1 = abp.localization.getResource("OMS");
const itemGroup = JSON.parse(sessionStorage.getItem('itemGroup'));
document.title = `Item Group Detail - ${itemGroup.code} | OMS`;

var itemGroupAttributeService = window.dMSpro.oMS.mdmService.controllers.itemGroupAttributes.itemGroupAttribute;
var itemListService = window.dMSpro.oMS.mdmService.controllers.itemGroupLists.itemGroupList;
var itemAttributeService = window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute;
var itemAttrValueService = window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue;
var itemService = window.dMSpro.oMS.mdmService.controllers.items.item;

const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

$(function () {
    DevExpress.config({
        editorStylingMode: 'underlined',
    });

    var status = [
        {
            id: 'OPEN',
            text: l1('EntityFieldValue:MDMService:ItemGroup:Status:OPEN')
        },
        {
            id: 'RELEASED',
            text: l1('EntityFieldValue:MDMService:ItemGroup:Status:RELEASED')
        },
        {
            id: 'CANCELLED',
            text: l1('EntityFieldValue:MDMService:ItemGroup:Status:CANCELLED')
        }
    ];

    var types = [
        {
            id: 'ATTRIBUTE',
            text: l1('EntityFieldValue:MDMService:ItemGroup:Type:ATTRIBUTE')
        },
        {
            id: 'LIST',
            text: l1('EntityFieldValue:MDMService:ItemGroup:Type:LIST')
        }
    ];

    $('#tabpanel-container').dxTabPanel({
        items: [{
            title: l('Menu:MdmService:ItemGroupAttrs'),
            template: initItemAttributeTab()
        }, {
            title: l('Menu:MdmService:ItemGroupLists'),
            template: initListItemTab()
        }]
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
                            valueExpr: 'id'
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
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            searchEnabled: true,
                            items: status,
                            displayExpr: 'text',
                            valueExpr: 'id'
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
        ]
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
                            location: 'before',
                            template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed"> <i class="fa fa-plus"></i> <span>New Item Group Attribute</span></button>',
                            onClick() {
                                $('#gridItemAttribute').data('dxDataGrid').addRow();
                            }
                        },
                        'searchPanel'
                    ]
                },
                onInitialized: function (e) {
                    getItemAttributeColumns(e.component);
                    //getItemToolbar(e.component);
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
                            location: 'before',
                            template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed"> <i class="fa fa-plus"></i> <span>New Item Group List</span></button>',
                            onClick() {
                                $('#gridListItem').data('dxDataGrid').addRow();
                            }
                        },
                        'searchPanel'
                    ]
                },
                columns: [
                    {
                        type: 'buttons',
                        caption: l('Actions'),
                        buttons: ['edit', 'delete'],
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
                            dataSource: getItemList,
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
                            dataSource: getUOMs,
                            valueExpr: 'id',
                            displayExpr: 'displayName'
                        }
                    },
                    {
                        dataField: 'rate',
                        caption: l("EntityFieldName:MDMService:ItemGroupList:Rate"),
                        validationRules: [{ type: "required" }],
                        dataType: 'number',
                        value: 1
                    },
                    {
                        dataField: 'price',
                        caption: l("EntityFieldName:MDMService:ItemGroupList:Price"),
                        dataType: 'number'
                    }
                ]
            })
    }
}

var groupAttributeStore = new DevExpress.data.CustomStore({
    key: "id",
    loadMode: 'processed',
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
    loadMode: 'processed',
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
    loadMode: 'processed',
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
    }
});
//// get items lookup
//var items = [];
//var urlItemsLookup = abp.appPath + 'api/mdm-service/item-group-lists/item-lookup' +
//    abp.utils.buildQueryString([
//        { name: 'maxResultCount', value: 1000 }
//    ]);
//$.ajax({
//    url: `${urlItemsLookup}`,
//    dataType: 'json',
//    async: false,
//    success: function (data) {
//        items = data.items;
//    }
//});
//var getItems = function () {
//    return items;
//}
// get UOMs lookup
var uOMs = [];
var urlUOMsLookup = abp.appPath + 'api/mdm-service/item-group-lists/u-oM-lookup' +
    abp.utils.buildQueryString([
        { name: 'maxResultCount', value: 1000 }
    ]);
$.ajax({
    url: `${urlUOMsLookup}`,
    dataType: 'json',
    async: false,
    success: function (data) {
        uOMs = data.items;
    }
});
var getUOMs = function () {
    return uOMs;
}

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
                            buttons: ['edit', 'delete']
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
            dataSource: listAttrValue.filter(x => x.itemAttributeId == attr.id),
            valueExpr: 'id',
            displayExpr: 'attrValName'
        }
    }
}

function getDataSourceAttrGrid(itemGroupId) {
    return new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
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
        loadMode: 'processed',
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

function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
}