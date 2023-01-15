$(function () {
    var l = abp.localization.getResource("MdmService");
    var l1 = abp.localization.getResource("OMSWeb");
    var salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;
    var companyInZoneService = window.dMSpro.oMS.mdmService.controllers.companyInZones.companyInZone;
    var customerInZoneService = window.dMSpro.oMS.mdmService.controllers.customerInZones.customerInZone;
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    var salesOrgHierarchyId = null;

    /****custom store*****/
    var salesOrgHierarchyStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            var filter = ["isSellingZone", "=", true];
            if (loadOptions.searchValue != null && loadOptions.searchValue != '') {
                filter = [["isSellingZone", "=", true], "and", [loadOptions.searchExpr, loadOptions.searchOperation, loadOptions.searchValue]];
            }

            const deferred = $.Deferred();
            salesOrgHierarchyService.getListDevextremes({ filter: JSON.stringify(filter) })
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
            salesOrgHierarchyService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return salesOrgHierarchyService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return salesOrgHierarchyService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return salesOrgHierarchyService.delete(key);
        }
    });

    var companyInZoneStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            if (loadOptions.filter == null) {
                loadOptions.filter = ["salesOrgHierarchyId", "=", salesOrgHierarchyId];
            } else {
                loadOptions.filter = [loadOptions.filter, "and", ["salesOrgHierarchyId", "=", salesOrgHierarchyId]];
            }

            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            const deferred = $.Deferred();
            companyInZoneService.getListDevextremes(args)
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
            companyInZoneService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return companyInZoneService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return companyInZoneService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return companyInZoneService.delete(key);
        }
    });

    var customerInZoneStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            if (loadOptions.filter == null) {
                loadOptions.filter = ["salesOrgHierarchyId", "=", salesOrgHierarchyId];
            } else {
                loadOptions.filter = [loadOptions.filter, "and", ["salesOrgHierarchyId", "=", salesOrgHierarchyId]];
            }

            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            const deferred = $.Deferred();
            customerInZoneService.getListDevextremes(args)
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
            customerInZoneService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return customerInZoneService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return customerInZoneService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return customerInZoneService.delete(key);
        }
    });

    var companyStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            companyService.getListDevextremes('')
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

    var customerStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            customerService.getListDevextremes('')
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

    /****control*****/
    const salesOrgHierarchy = $('#salesOrgHierarchy').dxSelectBox({
        dataSource: salesOrgHierarchyStore,
        valueExpr: 'id',
        displayExpr: "name",
        label: "Code",
        labelMode: "floating",
        searchEnabled: true,
        showClearButton: true,
        onSelectionChanged(data) {
            //set salesOrgHierarchyId value
            salesOrgHierarchyId = (data.selectedItem != undefined && data.selectedItem.id != null) ? data.selectedItem.id : null;
            companyAssginContainer.refresh();
            customerAssginContainer.refresh();

            //update button status
            if (data.selectedItem != undefined && data.selectedItem.id != null) {
                $("#NewCompanyAssginButton,#NewCustomerButton").prop('disabled', false);
            } else {
                $("#NewCompanyAssginButton,#NewCustomerButton").prop('disabled', true);
            }
        }
    }).dxSelectBox("instance");

    //DataGrid - Company Assgin
    var companyAssginContainer = $('#companyAssgin').dxDataGrid({
        dataSource: companyInZoneStore,
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
        editing: {
            mode: 'popup',
            allowAdding: abp.auth.isGranted('MdmService.CompanyInZones.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.CompanyInZones.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.CompanyInZones.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            },
            popup: {
                showTitle: false,
                width: 400,
                height: 280
            },
            form: {
                items: [
                    {
                        itemType: 'group',
                        colCount: 1,
                        colSpan: 2,
                        items: ["companyId", "effectiveDate", "endDate", "active"],
                    }
                ],
            }
        },
        onRowInserting: function (e) {
            e.data.salesOrgHierarchyId = salesOrgHierarchyId;
        },
        onRowUpdating: function (e) {
            var objectRequire = ['companyId', 'effectiveDate', 'endDate'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }

            e.newData["salesOrgHierarchyId"] = salesOrgHierarchyId;
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
                buttons: ['edit', 'delete']
            },
            {
                caption: l1("CompanyInZone.Company"),
                dataField: "companyId",
                visible: false,
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource(options) {
                        return {
                            store: companyStore,
                            filter: options.data ? ["!", ["id", "=", options.data.companyId]] : null,
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            },
            {
                caption: l("EntityFieldName:MDMService:CompanyInZone:CompanyCode"),
                dataField: "companyId",
                name: "companycode",
                allowEditing: false,
                lookup: {
                    dataSource() {
                        return {
                            store: companyStore
                        };
                    },
                    displayExpr: 'code',
                    valueExpr: 'id'
                }
            },
            {
                caption: l("EntityFieldName:MDMService:CompanyInZone:CompanyName"),
                dataField: "companyId",
                name: "companyname",
                allowEditing: false,
                lookup: {
                    dataSource() {
                        return {
                            store: companyStore
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            },
            {
                caption: l("EntityFieldName:MDMService:CompanyInZone:EffectiveDate"),
                dataField: "effectiveDate",
                dataType: "date",
                validationRules: [{ type: "required" }],
                editorOptions: {
                    min: new Date()
                }
            },
            {
                caption: l("EntityFieldName:MDMService:CompanyInZone:EndDate"),
                dataField: "endDate",
                dataType: "date",
                editorOptions: {
                    min: new Date()
                }
            },
            {
                caption: l1("Active"),
                dataField: "active",
                dataType: "boolean"
            }
        ]
    }).dxDataGrid("instance");

    //DataGrid - Customer Assgin
    var customerAssginContainer = $('#customerAssgin').dxDataGrid({
        dataSource: customerInZoneStore,
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
        editing: {
            mode: 'popup',
            allowAdding: abp.auth.isGranted('MdmService.CustomerInZones.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.CustomerInZones.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.CustomerInZones.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            },
            popup: {
                showTitle: false,
                width: 400,
                height: 280
            },
            form: {
                items: [
                    {
                        itemType: 'group',
                        colCount: 1,
                        colSpan: 2,
                        items: ["customerId", "effectiveDate", "endDate", "active"],
                    }
                ],
            }
        },
        onRowInserting: function (e) {
            e.data.salesOrgHierarchyId = salesOrgHierarchyId;
        },
        onRowUpdating: function (e) {
            var objectRequire = ['customerId', 'effectiveDate', 'endDate'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }

            e.newData["salesOrgHierarchyId"] = salesOrgHierarchyId;
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
                buttons: ['edit', 'delete']
            },
            {
                caption: l("EntityFieldName:MDMService:CustomerInZone:Customer"),
                dataField: "customerId",
                visible: false,
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource(options) {
                        return {
                            store: customerStore,
                            filter: options.data ? ["!", ["id", "=", options.data.customerId]] : null
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            },
            {
                caption: l1("CustomerInZone.CustomerCode"),
                dataField: "customerId",
                name: "customercode",
                allowEditing: false,
                lookup: {
                    dataSource() {
                        return {
                            store: customerStore
                        };
                    },
                    displayExpr: 'code',
                    valueExpr: 'id'
                }
            },
            {
                caption: l1("CustomerInZone.CustomerName"),
                dataField: "customerId",
                name: "customername",
                allowEditing: false,
                lookup: {
                    dataSource() {
                        return {
                            store: customerStore
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            },
            {
                caption: l("EntityFieldName:MDMService:CustomerInZone:EffectiveDate"),
                dataField: "effectiveDate",
                dataType: "date",
                validationRules: [{ type: "required" }],
                editorOptions: {
                    min: new Date()
                }
            },
            {
                caption: l("EntityFieldName:MDMService:CustomerInZone:EndDate"),
                dataField: "endDate",
                dataType: "date",
                editorOptions: {
                    min: new Date()
                }
            },
            {
                caption: l1("Active"),
                dataField: "active",
                dataType: "boolean"
            }
        ]
    }).dxDataGrid("instance");

    /****button*****/
    $("#NewCompanyAssginButton").click(function () {
        companyAssginContainer.addRow();
    });

    $("#NewCustomerButton").click(function () {
        customerAssginContainer.addRow();
    });

    $("#tab1").click(function () {
        companyAssginContainer.refresh();
    });

    $("#tab2").click(function () {
        customerAssginContainer.refresh();
    });

    /****function*****/
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }
});
