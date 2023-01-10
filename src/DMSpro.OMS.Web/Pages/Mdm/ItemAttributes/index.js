$(function () {
    // language
    var l = abp.localization.getResource("MdmService");
    // load mdmService
    var productAttrService = window.dMSpro.oMS.mdmService.controllers.productAttributes.productAttribute;

    // custom store
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
            productAttrService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return productAttrService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return productAttrService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return productAttrService.delete(key);
        }
    });

    //const data = [
    //    {
    //        ID: 1,
    //        AttrNo: 0,
    //        AttrName: 'Category',
    //        HierarchyLevel: 0,
    //        IsActive: true,
    //    },
    //    {
    //        ID: 2,
    //        AttrNo: 1,
    //        AttrName: 'Attribute 1',
    //        HierarchyLevel: 1,
    //        IsActive: true,
    //    },
    //    {
    //        ID: 3,
    //        AttrNo: 2,
    //        AttrName: 'Attribute 2',
    //        HierarchyLevel: 2,
    //        IsActive: true,
    //    },
    //    {
    //        ID: 4,
    //        AttrNo: 3,
    //        AttrName: 'Attribute 3',
    //        HierarchyLevel: null,
    //        IsActive: false,
    //    },
    //    {
    //        ID: 5,
    //        AttrNo: 4,
    //        AttrName: 'Attribute 4',
    //        HierarchyLevel: null,
    //        IsActive: true,
    //    },
    //    {
    //        ID: 6,
    //        AttrNo: 5,
    //        AttrName: 'Attribute 5',
    //        HierarchyLevel: null,
    //        IsActive: false,
    //    },
    //    {
    //        ID: 7,
    //        AttrNo: 6,
    //        AttrName: 'Attribute 6',
    //        HierarchyLevel: null,
    //        IsActive: true,
    //    },
    //    {
    //        ID: 8,
    //        AttrNo: 7,
    //        AttrName: 'Attribute 7',
    //        HierarchyLevel: null,
    //        IsActive: true,
    //    },
    //    {
    //        ID: 9,
    //        AttrNo: 8,
    //        AttrName: 'Attribute 8',
    //        HierarchyLevel: null,
    //        IsActive: true,
    //    },
    //    {
    //        ID: 10,
    //        AttrNo: 9,
    //        AttrName: 'Attribute 9',
    //        HierarchyLevel: null,
    //        IsActive: true,
    //    },
    //];

    const dataGrid = $('#gridProdAttribute').dxDataGrid({
        dataSource: customStore,
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
        //pager: {
        //    visible: true,
        //    showPageSizeSelector: true,
        //    allowedPageSizes: [10, 20, 50, 100],
        //    showInfo: true,
        //    showNavigationButtons: true
        //},
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
        //onRowInserting: function (e) {
        //    debugger
        //    if (e.data && e.data.code == null) {
        //        e.data.code = e.data.Code;
        //    }
        //},
        onRowUpdating: function (e) {
            var objectRequire = ['attrNo', 'attrName', 'hierarchyLevel', 'active', 'isProductCategory'];
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
                type: 'buttons',
                buttons: ['edit', 'delete'],
                caption: l('Actions'),
            },
            //{
            //    dataField: 'AttrNo',
            //    caption: l("EntityFieldName:MDMService:ProductAttribute:AttrNo"),
            //    allowEditing: false,
            //},
            {
                dataField: 'attrName',
                caption: l("EntityFieldName:MDMService:ProductAttribute:AttrName"),
            },
            {
                dataField: 'hierarchyLevel',
                caption: l("EntityFieldName:MDMService:ProductAttribute:HierarchyLevel"),
            },
            {
                dataField: 'active',
                caption: l("EntityFieldName:MDMService:ProductAttribute:Active"),
            },
            {
                dataField: 'isProductCategory',
                caption: l("EntityFieldName:MDMService:ProductAttribute:IsProductCategory")
            }
        ]
    }).dxDataGrid('instance');

    $("#NewProductAttributeButton").click(function () {
        dataGrid.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        productAttrService.getDownloadToken().then(
            function (result) {
                var url = abp.appPath + 'api/mdm-service/product-attributes/as-excel-file' + abp.utils.buildQueryString([
                    { name: 'downloadToken', value: result.token }
                ]);

                var downloadWindow = window.open(url, '_blank');
                downloadWindow.focus();
            }
        )
    });
});
