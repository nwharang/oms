$(function () {
    var l = abp.localization.getResource("MdmService");
    var customerAssignmentService = window.dMSpro.oMS.mdmService.controllers.customerAssignments.customerAssignment;
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;

    //var companyStore = new DevExpress.data.CustomStore({
    //    key: 'id',
    //    loadMode: "raw",
    //    load(loadOptions) {
    //        const deferred = $.Deferred();
    //        const argsGeo = {};
    //        requestOptions.forEach((i) => {
    //            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
    //                args[i] = JSON.stringify(loadOptions[i]);
    //            }
    //        });

    //        companyService.getListDevextremes(argsGeo)
    //            .done(result => {
    //                deferred.resolve(result.data, {
    //                    totalCount: result.totalCount,
    //                    summary: result.summary,
    //                    groupCount: result.groupCount,
    //                });
    //            });

    //        return deferred.promise();
    //    },
    //    byKey: function (key) {
    //        if (key == 0) return null;

    //        var d = new $.Deferred();
    //        companyService.get(key)
    //            .done(data => {
    //                d.resolve(data);
    //            });
    //        return d.promise();
    //    }
    //});

    //var cusProfileStore = new DevExpress.data.CustomStore({
    //    key: 'id',
    //    loadMode: "raw",
    //    load(loadOptions) {
    //        const deferred = $.Deferred();
    //        const argsGeo = {};
    //        requestOptions.forEach((i) => {
    //            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
    //                args[i] = JSON.stringify(loadOptions[i]);
    //            }
    //        });

    //        customerService.getListDevextremes(argsGeo)
    //            .done(result => {
    //                deferred.resolve(result.data, {
    //                    totalCount: result.totalCount,
    //                    summary: result.summary,
    //                    groupCount: result.groupCount,
    //                });
    //            });

    //        return deferred.promise();
    //    },
    //    byKey: function (key) {
    //        if (key == 0) return null;

    //        var d = new $.Deferred();
    //        customerService.get(key)
    //            .done(data => {
    //                d.resolve(data);
    //            });
    //        return d.promise();
    //    }
    //});
    var customersLookup = new DevExpress.data.CustomStore({
        key: 'id',
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
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            customerService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });
    var companiesLookup = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            companyService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            companyService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
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

            customerAssignmentService.getListDevextremes(args)
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
            return key == 0 ? customerAssignmentService.get(key) : null;
        },
        insert(values) {
            return customerAssignmentService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return customerAssignmentService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return customerAssignmentService.delete(key);
        }
    });
    var gridCusAssignments = $('#dgCusAssignments').dxDataGrid({
        dataSource: customStore,
        keyExpr: "id",
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.CustomerAssignments.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.CustomerAssignments.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.CustomerAssignments.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
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
            storageKey: 'dgCustomerAssignments',
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
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        gridCusAssignments.addRow();
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
                dataField: 'companyId',
                caption: l("EntityFieldName:MDMService:CustomerAssignment:CompanyName"),
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: {
                        store: companiesLookup,
                        paginate: true,
                        pageSize: pageSizeForLookup
                    },
                    valueExpr: "id",
                    displayExpr: "code"
                }
                //lookup: {
                //    dataSource() {
                //        return {
                //            store: companyStore
                //        };
                //    },
                //    displayExpr: 'name',
                //    valueExpr: 'id',
                //}
            },
            {
                dataField: 'customerId',
                caption: l("EntityFieldName:MDMService:CustomerAssignment:CustomerShortName"),
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: {
                        store: customersLookup,
                        paginate: true,
                        pageSize: pageSizeForLookup
                    },
                    valueExpr: "id",
                    displayExpr: "code"
                }
                //lookup: {
                //    dataSource() {
                //        return {
                //            store: cusProfileStore
                //        };
                //    },
                //    displayExpr: 'name',
                //    valueExpr: 'id',
                //}
            },
            {
                dataField: 'effectiveDate',
                caption: l("EntityFieldName:MDMService:CustomerAssignment:EffectiveDate"),
                dataType: 'date',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'endDate',
                caption: l("EntityFieldName:MDMService:CustomerAssignment:EndDate"),
                dataType: 'date',
            },
        ],
    }).dxDataGrid("instance");

    //$("input#Search").on("input", function () {
    //    gridCusAssignments.searchByText($(this).val());
    //});

    //$("#btnNewCusAssignment").click(function (e) {
    //    gridCusAssignments.addRow();
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
