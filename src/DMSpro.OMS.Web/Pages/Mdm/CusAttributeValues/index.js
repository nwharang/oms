$(function () {
    var l = abp.localization.getResource("MdmService");
    var cusAttributesValueService = window.dMSpro.oMS.mdmService.controllers.cusAttributeValues.cusAttributeValue;
    var cusAttributeService = window.dMSpro.oMS.mdmService.controllers.customerAttributes.customerAttribute;
    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }

    const requestOptions = [
        "filter",
        "group",
        "groupSummary",
        "parentIds",
        "requireGroupCount",
        "requireTotalCount",
        "searchExpr",
        "searchOperation",
        "searchValue",
        "select",
        "sort",
        "skip",
        "take",
        "totalSummary",
        "userData"
    ];

    var cusAttributes = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            cusAttributeService.getListDevextremes(args)
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
            return key == 0 ? cusAttributeService.get(key) : null;
        }
    });

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
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
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
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
            storageKey: 'dgCusAttributeValues',
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
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        gridCusAttributeValues.addRow();
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
                dataField: 'attrValName',
                caption: l("EntityFieldName:MDMService:CusAttributeValue:Name"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'customerAttributeId',
                caption: l("EntityFieldName:MDMService:CusAttributeValue:AttrNo"),
                lookup: {
                    //dataSource: cusAttributes,
                    dataSource: {
                        store: cusAttributes,
                        paginate: true,
                        pageSize: 10
                    },
                    valueExpr: "id",
                    displayExpr: "attrName"
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
                            paginate: true,
                            pageSize: 10
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

    //$("input#Search").on("input", function () {
    //    gridCusAttributeValues.searchByText($(this).val());
    //});

    //$("#btnNewCusAttributeValue").click(function (e) {
    //    gridCusAttributeValues.addRow();
    //});

    //$("#ExportToExcelButton").click(function (e) {
    //    e.preventDefault();

    //    cusAttributesValueService.getDownloadToken().then(
    //        function (result) {
    //            var input = getFilter();
    //            var url = abp.appPath + 'api/mdm-service/sales-channels/as-excel-file' +
    //                abp.utils.buildQueryString([
    //                    { name: 'downloadToken', value: result.token },
    //                    { name: 'filterText', value: input.filterText },
    //                    { name: 'code', value: input.code },
    //                    { name: 'name', value: input.name }
    //                ]);

    //            var downloadWindow = window.open(url, '_blank');
    //            downloadWindow.focus();
    //        }
    //    )
    //});
});
