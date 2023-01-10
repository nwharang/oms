$(function () {
    // language
    var l = abp.localization.getResource("MdmService");
    // load mdmService
    var productAttrValueService = window.dMSpro.oMS.mdmService.controllers.prodAttributeValues.prodAttributeValue;
    var productAttrService = window.dMSpro.oMS.mdmService.controllers.productAttributes.productAttribute;

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'raw',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            [
                'skip',
                'take',
                'requireTotalCount',
                'requireGroupCount',
                'sort',
                'filter',
                'totalSummary',
                'group',
                'groupSummary',
            ].forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            const args2 = { 'loadOptions': args };
            productAttrValueService.getListDevextremes(args)
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
            productAttrValueService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return productAttrValueService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return productAttrValueService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return productAttrValueService.delete(key);
        }
    });

    var lookupStore = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'raw',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            [
                'skip',
                'take',
                'requireTotalCount',
                'requireGroupCount',
                'sort',
                'filter',
                'totalSummary',
                'group',
                'groupSummary',
            ].forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            const args2 = { 'loadOptions': args };
            productAttrService.getListDevextremes(args)
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
            productAttrValueService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    });

    //const data = [
    //    {
    //        ID: 1,
    //        Name: 'FMCG',
    //        AttrNo: 1,

    //        Inactive: true,
    //    },
    //    {
    //        ID: 2,
    //        Name: 'FnB',
    //        AttrNo: 1,

    //        Inactive: true,
    //    },
    //    {
    //        ID: 3,
    //        Name: 'Food',
    //        AttrNo: 2,

    //        Inactive: true,
    //    },
    //    {
    //        ID: 4,
    //        Name: 'Beverage',
    //        AttrNo: 2,

    //        Inactive: true,
    //    },
    //];

    //const AttrNo = [
    //    {
    //        ID: 1,
    //        Name: 'Category',
    //    },
    //    {
    //        ID: 2,
    //        Name: 'Sub-Category',
    //    },
    //    {
    //        ID: 3,
    //        Name: 'Attribute 2',
    //    },
    //    {
    //        ID: 4,
    //        Name: 'Attribute 3',
    //    },
    //    {
    //        ID: 5,
    //        Name: 'Attribute 4',
    //    },
    //    {
    //        ID: 6,
    //        Name: 'Attribute 6',
    //    },

    //];

    const dataTreeContainer = $('#treeProdAttributeValue').dxTreeList({
        dataSource: customStore,
        keyExpr: 'id',
        parentIdExpr: 'parentProdAttributeValueId',
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
            if (e.dataField === 'parentProdAttributeValueId' && e.editorOptions.value == 0) {
                e.editorOptions.value = '';
            }
        },
        onInitNewRow(e) {
            var row = e.component.getNodeByKey(e.data.parentProdAttributeValueId) ? e.component.getNodeByKey(e.data.parentProdAttributeValueId).data : null;
            if (row) {
                e.data.level = row.level + 1;
            } else if (e.data.parentProdAttributeValueId == 0) {
                e.data.level = 0;
            }
        },
        onRowInserting: function (e) {
            if (e.data && e.data.parentProdAttributeValueId == 0) {
                e.data.parentProdAttributeValueId = null;
            }
        },
        onRowUpdating: function (e) {
            var objectRequire = ['id', 'attrValName', 'prodAttributeId', 'parentProdAttributeValueId'];
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
                caption: l("EntityFieldName:MDMService:ProdAttributeValue:AttrValName")
            },
            {
                dataField: 'prodAttributeId',
                caption: l("EntityFieldName:MDMService:ProdAttributeValue:ProdAttributeId"),
                lookup:
                {
                    dataSource:
                    {
                        store: lookupStore,
                    },
                    valueExpr: 'id',
                    displayExpr: 'attrName',
                }
            },
            {
                caption: l("EntityFieldName:MDMService:ProdAttributeValue:ParentProdAttributeValueId"),
                dataField: 'parentProdAttributeValueId',
                lookup: {
                    dataSource(options) {
                        return {
                            store: customStore,
                            filter: options.data ? ["!", ["attrValName", "=", options.data.name]] : null,
                        };
                    },
                    displayExpr: 'attrValName',
                    valueExpr: 'id',
                }
            }
        ]
    }).dxTreeList("instance");

    $("#NewProductAttrValueButton").click(function () {
        dataTreeContainer.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        productAttrValueService.getDownloadToken().then(
            function (result) {
                var url = abp.appPath + 'api/mdm-service/prod-attribute-values/as-excel-file' +
                    abp.utils.buildQueryString([
                        { name: 'downloadToken', value: result.token }
                    ]);

                var downloadWindow = window.open(url, '_blank');
                downloadWindow.focus();
            }
        )
    });
});
