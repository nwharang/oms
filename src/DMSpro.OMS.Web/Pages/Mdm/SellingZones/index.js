$(function () {
    var l = abp.localization.getResource("MdmService");
    var l1 = abp.localization.getResource("OMS");
    var salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;
    var companyInZoneService = window.dMSpro.oMS.mdmService.controllers.companyInZones.companyInZone;
    var customerInZoneService = window.dMSpro.oMS.mdmService.controllers.customerInZones.customerInZone;
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;

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
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            const deferred = $.Deferred();
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

    var customerStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            const deferred = $.Deferred();
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
            const checkStatus = data.selectedItem != undefined && data.selectedItem.id != null;

            //set salesOrgHierarchyId value
            salesOrgHierarchyId = checkStatus ? data.selectedItem.id : null;

            companyAssginContainer.option('dataSource', companyInZoneStore);
            customerAssginContainer.option('dataSource', customerInZoneStore);

            //update button status
            companyAssginContainer.option("editing.allowAdding", checkStatus);
            customerAssginContainer.option("editing.allowAdding", checkStatus);
        }
    }).dxSelectBox("instance");

    //DataGrid - Company Assgin
    var companyAssginContainer = $('#companyAssgin').dxDataGrid({
        //dataSource: companyInZoneStore,
        //keyExpr: "id",
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
            storageKey: 'dgCompanyAssign',
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
        editing: {
            mode: 'popup',
            allowAdding: salesOrgHierarchyId != null && abp.auth.isGranted('MdmService.CompanyInZones.Create'),
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
                        items: ["companyId", "effectiveDate", "endDate", "isBase"],
                    }
                ],
            }
        },
        onRowInserting: function (e) {
            e.data.salesOrgHierarchyId = salesOrgHierarchyId;
        },
        onRowUpdating: function (e) {
            var objectRequire = ['companyId', 'effectiveDate', 'endDate', 'isBase'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
            e.newData["salesOrgHierarchyId"] = salesOrgHierarchyId;
        },
        toolbar: {
            items: [
                "groupPanel",
                "addRowButton",
                "columnChooserButton",
                "exportButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            //id: "import-excel",
                            class: "import-excel",
                        },
                        onClick(e) {
                            var gridControl = e.element.closest('div.dx-datagrid').parent();
                            var gridName = gridControl.attr('id');
                            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        },
                    },
                },
                "searchPanel",
            ],
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: ['edit', 'delete'],
                fixedPosition: 'left'
            },
            {
                caption: l1("CompanyInZone.Company"),
                dataField: "companyId",
                calculateDisplayValue: "company.name",
                visible: false,
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource(options) {
                        return {
                            store: companyStore,
                            filter: options.data ? ["!", ["id", "=", options.data.companyId]] : null,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            },
            {
                caption: l("EntityFieldName:MDMService:CompanyInZone:CompanyCode"),
                dataField: "companyId",
                calculateDisplayValue: "company.code",
                name: "companycode",
                allowEditing: false
            },
            {
                caption: l("EntityFieldName:MDMService:CompanyInZone:CompanyName"),
                dataField: "companyId",
                calculateDisplayValue: "company.name",
                name: "companyname",
                allowEditing: false
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
                caption: l1("EntityFieldName:MDMService:CompanyInZone:IsBase"),
                dataField: "isBase",
                dataType: "boolean"
            }
        ]
    }).dxDataGrid("instance");

    //DataGrid - Customer Assgin
    var customerAssginContainer = $('#customerAssgin').dxDataGrid({
        //dataSource: customerInZoneStore,
        //keyExpr: "id",
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
            storageKey: 'dgCustomerAssgin',
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
        editing: {
            mode: 'popup',
            allowAdding: salesOrgHierarchyId != null && abp.auth.isGranted('MdmService.CustomerInZones.Create'),
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
                        items: ["customerId", "effectiveDate", "endDate"/*, "active"*/],
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
                "groupPanel",
                "addRowButton",
                "columnChooserButton",
                "exportButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            //id: "import-excel",
                            class: "import-excel",
                        },
                        onClick(e) {
                            var gridControl = e.element.closest('div.dx-datagrid').parent();
                            var gridName = gridControl.attr('id');
                            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        },
                    },
                },
                "searchPanel",
            ],
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: ['edit', 'delete'],
                fixedPosition: 'left'
            },
            {
                caption: l("EntityFieldName:MDMService:CustomerInZone:Customer"),
                dataField: "customerId",
                calculateDisplayValue: "customer.name",
                visible: false,
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource(options) {
                        return {
                            store: customerStore,
                            filter: options.data ? ["!", ["id", "=", options.data.customerId]] : null,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            },
            {
                caption: l1("CustomerInZone.CustomerCode"),
                dataField: "customerId",
                calculateDisplayValue: "customer.code",
                name: "customercode",
                allowEditing: false
            },
            {
                caption: l1("CustomerInZone.CustomerName"),
                dataField: "customerId",
                calculateDisplayValue: "customer.name",
                name: "customername",
                allowEditing: false
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
            //{
            //    caption: l1("Active"),
            //    dataField: "active",
            //    dataType: "boolean"
            //}
        ]
    }).dxDataGrid("instance");

    /****button*****/

    $("#tab1").click(function () {
        setTimeout(() => { companyAssginContainer.refresh(); }, 100);
    });

    $("#tab2").click(function () {
        setTimeout(() => { customerAssginContainer.refresh(); }, 100);
    });

    /****function*****/
    initImportPopup('api/mdm-service/customer-in-zones', 'CustomerInZones_Template', 'customerAssgin');
    initImportPopup('api/mdm-service/company-in-zones', 'CompanyInZones_Template', 'companyAssgin');
});
