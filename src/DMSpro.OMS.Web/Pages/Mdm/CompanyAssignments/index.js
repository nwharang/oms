$(function () {
    var l = abp.localization.getResource("MdmService");
    //var customerAssignmentService = window.dMSpro.oMS.mdmService.controllers.customerAssignments.customerAssignment;
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }
    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    var urlCompanyAssignment = abp.appPath + 'api/mdm-service/company-identity-user-assignments' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);

    $.ajax({
        url: `${urlCompanyAssignment}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log('data call companyassignment ajax: ', data);
        }
    });


    var userTemps = [
        {
            id: 1,
            displayName: "User 01"
        },
        {
            id: 2,
            displayName: "User 02"
        },
        {
            id: 3,
            displayName: "User 03"
        }
    ];
    var companyTemps = [
        {
            id: 1,
            displayName: "Company 01"
        },
        {
            id: 2,
            displayName: "Company 02"
        },
        {
            id: 3,
            displayName: "Company 03"
        }
    ];

    var assignmentTemps = [
        {
            id: 1,
            userId: 1,
            companyId: 1
        },
        {
            id: 2,
            userId: 1,
            companyId: 2
        },
        {
            id: 3,
            userId: 3,
            companyId: 3
        }
    ];

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
    //$.ajax({
    //    url: `${urlCus}`,
    //    dataType: 'json',
    //    async: false,
    //    success: function (data) {
    //        console.log('data call customersLookup ajax: ', data);
    //        customersLookup = data.items;
    //    }
    //});
    $.ajax({
        url: `${urlCompany}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log('data call companiesLookup ajax: ', data);
            companiesLookup = data.items;
        }
    });

    ////Custom store - for load, update, delete
    //var customStore = new DevExpress.data.CustomStore({
    //    key: 'id',
    //    load(loadOptions) {
    //        const deferred = $.Deferred();
    //        const args = {};
    //        requestOptions.forEach((i) => {
    //            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
    //                args[i] = JSON.stringify(loadOptions[i]);
    //            }
    //        });

    //        customerAssignmentService.getListDevextremes(args)
    //            .done(result => {
    //                console.log('data:', result)
    //                deferred.resolve(result.data, {
    //                    totalCount: result.totalCount,
    //                    summary: result.summary,
    //                    groupCount: result.groupCount,
    //                });
    //            });

    //        return deferred.promise();
    //    },
    //    byKey: function (key) {
    //        return key == 0 ? customerAssignmentService.get(key) : null;
    //    },
    //    insert(values) {
    //        return customerAssignmentService.create(values, { contentType: "application/json" });
    //    },
    //    update(key, values) {
    //        return customerAssignmentService.update(key, values, { contentType: "application/json" });
    //    },
    //    remove(key) {
    //        return customerAssignmentService.delete(key);
    //    }
    //});
    var gridComAssignments = $('#dgComAssignments').dxDataGrid({
        dataSource: assignmentTemps,
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
                dataField: 'userId',
                caption: l("User Name"),
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: userTemps,
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
                dataField: 'companyId',
                caption: l("EntityFieldName:MDMService:CustomerAssignment:CompanyName"),
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: companyTemps,
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
            }
        ],
    }).dxDataGrid("instance");

    $("input#Search").on("input", function () {
        gridComAssignments.searchByText($(this).val());
    });

    $("#btnNewComAssignment").click(function (e) {
        gridComAssignments.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        //cusAttributesValueService.getDownloadToken().then(
        //    function (result) {
        //        var input = getFilter();
        //        var url = abp.appPath + 'api/mdm-service/sales-channels/as-excel-file' +
        //            abp.utils.buildQueryString([
        //                { name: 'downloadToken', value: result.token },
        //                { name: 'filterText', value: input.filterText },
        //                { name: 'code', value: input.code },
        //                { name: 'name', value: input.name }
        //            ]);

        //        var downloadWindow = window.open(url, '_blank');
        //        downloadWindow.focus();
        //    }
        //)
    });
});
