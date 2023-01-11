$(function () {
    var l = abp.localization.getResource("MdmService");
    var cusAttributesValueService = window.dMSpro.oMS.mdmService.controllers.cusAttributeValues.cusAttributeValue;
    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }

    var cusAttributes = [];

    var url = abp.appPath + 'api/mdm-service/cus-attribute-values/customer-attribute-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    $.ajax({
        url: `${url}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log('data call ajax: ', data);
            cusAttributes = data.items;
        }
    })

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
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

            cusAttributesValueService.getListDevextremes(args)
                .done(result => {
                    console.log('data:', result)
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            return key == 0 ? cusAttributesValueService.get(key) : null;
        },
        insert(values) {
            return cusAttributesValueService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return cusAttributesValueService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return cusAttributesValueService.delete(key);
        }
    });
    var gridCusAttributeValues = $('#dgCusAttributeValues').dxDataGrid({
        dataSource: customStore,
        keyExpr: "id",
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.CustomerAttributes.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.CustomerAttributes.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.CustomerAttributes.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onEditorPreparing(e) {
            if (e.dataField == "customerAttributeTree") {
                
            }
            if (e.rowType === "data" && e.column.command == "edit") {
                var grid = e.component;
                var index = e.row.rowIndex;
                var value = grid.cellValue(index, "parentCusAttributeValueId");
                if (!value) {
                    //e.cellElement.css("background-color", "yellow");
                    //e.cellElement.find(".dx-link-edit").remove();
                    e.cellElement.find(".dx-link-edit").disable();
                }
            }
        },
        onRowInserting: function (e) {
            // for create first data - if parentId = 0, update parentId = null
            if (e.data && e.data.parentCusAttributeValueId == 0) {
                e.data.parentCusAttributeValueId = null;
            }
        },
        remoteOperations: true,
        showBorders: true,
        focusedRowEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        columnHidingEnabled: true,
        errorRowEnabled: false,
        filterRow: {
            visible: false
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
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 110,
                buttons: ['edit', 'delete'],
            },
            {
                dataField: 'attrValName',
                caption: l("EntityFieldName:MDMService:CusAttributeValue:Name"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'customerAttributeId',
                caption: l("EntityFieldName:MDMService:CusAttributeValue:AttrNo"),
                lookup: {
                    dataSource: cusAttributes,
                    valueExpr: "id",
                    displayExpr: "displayName"
                }
            },
            {
                dataField: 'parentCusAttributeValueId',
                caption: l("EntityFieldName:MDMService:CusAttributeValue:ParentName"),
                lookup: {
                    dataSource(options) {
                        return {
                            store: customStore,
                            filter: options.data ? ["!", ["attrValName", "=", options.data.attrValName]] : null,
                        };
                    },
                    valueExpr: "id",
                    displayExpr: "attrValName"
                }
            },
            //{
            //    dataField: 'active',
            //    caption: l("EntityFieldName:MDMService:CusAttributeValue:Active"),
            //    width: 110,
            //    alignment: 'center',
            //    dataType: 'boolean',
            //    cellTemplate(container, options) {
            //        $('<div>')
            //            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
            //            .appendTo(container);
            //    }
            //}
        ],
    }).dxDataGrid("instance");

    $("input#Search").on("input", function () {
        gridCusAttributeValues.searchByText($(this).val());
    });

    $("#btnNewCusAttributeValue").click(function (e) {
        gridCusAttributeValues.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        cusAttributesValueService.getDownloadToken().then(
            function (result) {
                var input = getFilter();
                var url = abp.appPath + 'api/mdm-service/sales-channels/as-excel-file' +
                    abp.utils.buildQueryString([
                        { name: 'downloadToken', value: result.token },
                        { name: 'filterText', value: input.filterText },
                        { name: 'code', value: input.code },
                        { name: 'name', value: input.name }
                    ]);

                var downloadWindow = window.open(url, '_blank');
                downloadWindow.focus();
            }
        )
    });
});
