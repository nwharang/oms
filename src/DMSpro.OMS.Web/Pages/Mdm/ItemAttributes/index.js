$(function () {
    // language
    var l = abp.localization.getResource("MdmService");
    // load mdmService
    var itemAttrService = window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];
    // custom store
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
            itemAttrService.getListDevextremes(args)
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
            itemAttrService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return itemAttrService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return itemAttrService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return itemAttrService.delete(key);
        }
    });

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
                caption: l("EntityFieldName:MDMService:ItemAttribute:AttrName"),
            },
            {
                dataField: 'hierarchyLevel',
                caption: l("EntityFieldName:MDMService:ItemAttribute:HierarchyLevel"),
            },
            {
                dataField: 'active',
                caption: l("EntityFieldName:MDMService:ItemAttribute:Active"),
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                }
            },
            {
                dataField: 'isSellingCategory',
                caption: l("EntityFieldName:MDMService:ItemAttribute:IsSellingCategory"),
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                }
            }
        ]
    }).dxDataGrid('instance');

    $("#NewProductAttributeButton").click(function () {
        dataGrid.addRow();
    });

    $("input#Search").on("input", function () {
        dataGrid.searchByText($(this).val());
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        itemAttrService.getDownloadToken().then(
            function (result) {
                var url = abp.appPath + 'api/mdm-service/item-attributes/as-excel-file' + abp.utils.buildQueryString([
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
