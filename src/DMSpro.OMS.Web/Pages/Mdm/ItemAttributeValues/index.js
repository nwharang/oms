$(function () {
    // language
    var l = abp.localization.getResource("MdmService");
    // load mdmService
    var itemAttrValueService = window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];
    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
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
            itemAttrValueService.getListDevextremes(args)
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
            itemAttrValueService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return itemAttrValueService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return itemAttrValueService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return itemAttrValueService.delete(key);
        }
    });

    // get item attribute
    var productAttr = [];
    var urlProductAttrLookup = abp.appPath + 'api/mdm-service/item-attribute-values/item-attribute-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    $.ajax({
        url: `${urlProductAttrLookup}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            productAttr = data.items;
        }
    });
    var getProductAttr = function () {
        return productAttr;
    }

    // get Product Attr Value
    var productAttrValue = [];
    var urlProductAttrValLookup = abp.appPath + 'api/mdm-service/item-attribute-values/item-attribute-value-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    $.ajax({
        url: `${urlProductAttrValLookup}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            productAttrValue = data.items;
        }
    });
    var getProductAttrValue = function () {
        return productAttrValue;
    }


    const dataTreeContainer = $('#treeProdAttributeValue').dxTreeList({
        dataSource: customStore,
        keyExpr: 'id',
        parentIdExpr: 'parentId',
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
        onEditorPreparing(e) {
            if (e.dataField === 'parentId' && e.editorOptions.value == 0) {
                e.editorOptions.value = '';
            }
        },
        onInitNewRow(e) {
            var row = e.component.getNodeByKey(e.data.parentId) ? e.component.getNodeByKey(e.data.parentId).data : null;
            if (row) {
                e.data.level = row.level + 1;
            } else if (e.data.parentId == 0) {
                e.data.level = 0;
            }
        },
        onRowInserting: function (e) {
            if (e.data && e.data.parentId == 0) {
                e.data.parentId = null;
            }
        },
        onRowUpdating: function (e) {
            var objectRequire = ['id', 'attrValName', 'itemAttributeId', 'parentId'];
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
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: ['add', 'edit', 'delete']
            },
            {
                dataField: 'attrValName',
                caption: l("EntityFieldName:MDMService:ItemAttributeValues:AttrValName")
            },
            {
                dataField: 'itemAttributeId',
                caption: l("EntityFieldName:MDMService:ItemAttributeValue:ProdAttributeId"),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getProductAttr,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                }
            },
            {
                caption: l("EntityFieldName:MDMService:ProdAttributeValue:ParentProdAttributeValueId"),
                dataField: 'parentId',
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getProductAttrValue,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                }
            }
        ]
    }).dxTreeList("instance");

    $("#NewProductAttrValueButton").click(function () {
        dataTreeContainer.addRow();
    });

    $("input#Search").on("input", function () {
        dataTreeContainer.searchByText($(this).val());
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        itemAttrValueService.getDownloadToken().then(
            function (result) {
                var url = abp.appPath + 'api/mdm-service/item-attribute-values/as-excel-file' +
                    abp.utils.buildQueryString([
                        { name: 'downloadToken', value: result.token }
                    ]);

                var downloadWindow = window.open(url, '_blank');
                downloadWindow.focus();
            }
        )
    });

    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }
});
