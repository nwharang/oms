var l = abp.localization.getResource("MdmService");
const priceList = JSON.parse(sessionStorage.getItem('priceList'));
document.title = `Price List Detail - ${priceList.code} | OMS`;

var itemGroupAttributeService = window.dMSpro.oMS.mdmService.controllers.itemGroupAttributes.itemGroupAttribute;
var itemListService = window.dMSpro.oMS.mdmService.controllers.itemGroupLists.itemGroupList;
var itemAttributeService = window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute;

const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

const status = [
    {
        id: 'OPEN',
        text: l('EntityFieldValue:MDMService:ItemGroup:Status:OPEN')
    },
    {
        id: 'RELEASED',
        text: l('EntityFieldValue:MDMService:ItemGroup:Status:RELEASED')
    },
    {
        id: 'CANCELLED',
        text: l('EntityFieldValue:MDMService:ItemGroup:Status:CANCELLED')
    }
];

const types = [
    {
        id: 'ATTRIBUTE',
        text: l('EntityFieldValue:MDMService:ItemGroup:Type:ATTRIBUTE')
    },
    {
        id: 'LIST',
        text: l('EntityFieldValue:MDMService:ItemGroup:Type:LIST')
    }
];

$(function () {
    DevExpress.config({
        editorStylingMode: 'underlined',
    });

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
                    {
                        dataField: 'active',
                        editorType: 'dxCheckBox',
                        alignment: 'center',
                        dataType: 'boolean',
                        cellTemplate(container, options) {
                            $('<div>')
                                .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                                .appendTo(container);
                        }
                    }
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

var groupAttributeStore = new DevExpress.data.CustomStore({
    key: "id",
    loadMode: 'raw',
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
    loadMode: 'raw',
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

// get items lookup
var items = [];
var urlItemsLookup = abp.appPath + 'api/mdm-service/item-group-lists/item-lookup' +
    abp.utils.buildQueryString([
        { name: 'maxResultCount', value: 1000 }
    ]);
$.ajax({
    url: `${urlItemsLookup}`,
    dataType: 'json',
    async: false,
    success: function (data) {
        items = data.items;
    }
});
var getItems = function () {
    return items;
}
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