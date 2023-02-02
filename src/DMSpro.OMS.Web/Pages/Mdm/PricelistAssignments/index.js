$(function () {
    // language text
    var l = abp.localization.getResource("MdmService");
    // load mdmservice
    var pricelistAssignmentService = window.dMSpro.oMS.mdmService.controllers.pricelistAssignments.pricelistAssignment;
    var pricelistService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
    var customerService = window.dMSpro.oMS.mdmService.controllers.customerGroups.customerGroup;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    // custom store
    var priceListStore = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            pricelistService.getListDevextremes(args)
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
            pricelistService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return pricelistService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return pricelistService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return pricelistService.delete(key);
        }
    });

    var pricelistAssignmentStore = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            pricelistAssignmentService.getListDevextremes(args)
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
            pricelistAssignmentService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return pricelistAssignmentService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return pricelistAssignmentService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return pricelistAssignmentService.delete(key);
        }
    });

    var customerGroupStore = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            const args2 = { 'loadOptions': args };
            customerService.getListDevextremes(args)
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
            customerService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    });

    // get customers
    var customers = [];
    var urlCustomersLookup = abp.appPath + 'api/mdm-service/pricelist-assignments/customer-group-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    $.ajax({
        url: `${urlCustomersLookup}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log('data call geoList ajax: ', data);
            customers = data.items;
        }
    });
    var getCustomers = function () {
        return customers;
    }

    const dataGrid = $('#gridPriceListAssignment').dxDataGrid({
        dataSource: priceListStore,
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
        scrolling: {
            mode: 'standard',
        },
        filterRow: {
            visible: true
        },
        searchPanel: {
            visible: true
        },
        paging:
        {
            enabled: true,
            pageSize: 10,
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100],
            showInfo: true,
            showNavigationButtons: true
        },
        //editing: {
        //    mode: 'row',
        //    allowAdding: true,
        //    allowUpdating: true,
        //    allowDeleting: true,
        //    useIcons: true,
        //    texts: {
        //        editRow: l("Edit"),
        //        deleteRow: l("Delete"),
        //        confirmDeleteMessage: l("DeleteConfirmationMessage")
        //    }
        //},
        //onRowInserting: function (e) {
        //    debugger
        //    if (e.data && e.data.id == 0) {
        //        e.data.id = null;
        //    }
        //},
        //onRowUpdating: function (e) {
        //    var objectRequire = ['code', 'name'];
        //    for (var property in e.oldData) {
        //        if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
        //            e.newData[property] = e.oldData[property];
        //        }
        //    }
        //},
        columns: [
            //{
            //    type: 'buttons',
            //    buttons: ['edit', 'delete'],
            //    caption: l("Actions")
            //},
            {
                caption: l("EntityFieldName:MDMService:PriceListAssignment:PriceListCode"),
                dataField: "code",
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:PriceListAssignment:PriceListName"),
                dataField: "name",
                validationRules: [{ type: "required" }]
            }
        ],
        masterDetail: {
            enabled: true,
            template(container, options) {
                const currentHeaderData = options.data;
                const dataGridDetail = $('<div>')
                    .dxDataGrid({
                        dataSource: {
                            store: pricelistAssignmentStore,
                            filter: ['priceListId', '=', options.key]
                        },
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
                        scrolling: {
                            mode: 'standard'
                        },
                        paging:
                        {
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
                        editing:
                        {
                            mode: 'row',
                            allowAdding: true,
                            //allowUpdating: true,
                            //allowDeleting: true,
                            useIcons: true,
                            //texts: {
                            //    editRow: l("Edit"),
                            //    deleteRow: l("Delete"),
                            //    confirmDeleteMessage: l("DeleteConfirmationMessage")
                            //}
                        },
                        onRowInserting: function (e) {
                            e.data.priceListId = options.key
                        },
                        onRowUpdating: function (e) {
                            var objectRequire = ['priceListId', 'customerGroupId'];
                            for (var property in e.oldData) {
                                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                                    e.newData[property] = e.oldData[property];
                                }
                            }
                        },
                        columns: [
                            //{
                            //    type: 'buttons',
                            //    caption: l('Actions'),
                            //    buttons: ['edit', 'delete'],
                            //},
                            {
                                caption: l("EntityFieldName:MDMService:CustomerGroup:Name"),
                                dataField: "customerGroupId",
                                editorType: 'dxSelectBox',
                                lookup: {
                                    dataSource: getCustomers,
                                    valueExpr: 'id',
                                    displayExpr: 'displayName'
                                }
                            }
                        ]
                    }).appendTo(container);
            }
        }
    }).dxDataGrid('instance');

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        pricelistAssignmentService.getDownloadToken().then(
            function (result) {
                var url = abp.appPath + 'api/mdm-service/pricelist-assignments/as-excel-file' + abp.utils.buildQueryString([
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
