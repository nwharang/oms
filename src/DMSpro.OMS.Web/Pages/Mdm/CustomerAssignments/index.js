$(function () {
    var l = abp.localization.getResource("MdmService");
    var customerAssignmentService = window.dMSpro.oMS.mdmService.controllers.customerAssignments.customerAssignment;
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }
    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];


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
    var customersLookup = [];
    var companiesLookup = [];

    var urlCus = abp.appPath + 'api/mdm-service/customer-assignments/customer-profile-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    var urlCompany = abp.appPath + 'api/mdm-service/customer-assignments/company-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    $.ajax({
        url: `${urlCus}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log('data call customersLookup ajax: ', data);
            customersLookup = data.items;
        }
    });
    $.ajax({
        url: `${urlCompany}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log('data call companiesLookup ajax: ', data);
            companiesLookup = data.items;
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
        showBorders: true,
        focusedRowEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        //columnHidingEnabled: true,
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
                dataField: 'companyId',
                caption: l("EntityFieldName:MDMService:CustomerAssignment:CompanyName"),
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: companiesLookup,
                    valueExpr: "id",
                    displayExpr: "displayName"
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
                    dataSource: customersLookup,
                    valueExpr: "id",
                    displayExpr: "displayName"
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

    $("input#Search").on("input", function () {
        gridCusAssignments.searchByText($(this).val());
    });

    $("#btnNewCusAssignment").click(function (e) {
        gridCusAssignments.addRow();
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
