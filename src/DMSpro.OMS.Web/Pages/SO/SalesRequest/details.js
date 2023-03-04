var SalesRequestHeaderModel = null;
var SalesRequestDetailsModel = [];

$(function () {
    var l = abp.localization.getResource("OMS");
    var salesRequestService = window.dMSpro.oMS.orderService.controllers.salesRequests.salesRequest;
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    var customerAssignmentService = window.dMSpro.oMS.mdmService.controllers.customerAssignments.customerAssignment;
    var employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;
    var salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;
    var itemService = window.dMSpro.oMS.mdmService.controllers.items.item;
    var uOMService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;
    var uOMGroupService = window.dMSpro.oMS.mdmService.controllers.uOMGroups.uOMGroup;
    var uOMGroupDetailService = window.dMSpro.oMS.mdmService.controllers.uOMGroupDetails.uOMGroupDetail;
    var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
    var priceListDetailsService = window.dMSpro.oMS.mdmService.controllers.priceListDetails.priceListDetail;
    var vATService = window.dMSpro.oMS.mdmService.controllers.vATs.vAT;

    //get data from sessionStorage
    const companyId = '29d43197-c742-90b8-65d8-3a099166f987';
    var pricelistId = null;
    var itemsInPopup = null;

    /****custom store*****/
    var salesRequestStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            salesRequestService.getHeaderListDevextremes(args)
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
            salesRequestService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return salesRequestService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return salesRequestService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return salesRequestService.delete(key);
        }
    });

    var companyStore = new DevExpress.data.CustomStore({
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

    var customerAssignmentStore = new DevExpress.data.CustomStore({
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
            customerAssignmentService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    var employeeProfileStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            employeeProfileService.getListDevextremes(args)
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
            employeeProfileService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    var salesOrgHierarchyStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            salesOrgHierarchyService.getListDevextremes(args)
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
        }
    });

    var itemStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            itemService.getListDevextremes(args)
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
            itemService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
    });

    var uOMStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            uOMService.getListDevextremes(args)
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
            uOMService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    var uOMGroupStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            uOMGroupService.getListDevextremes(args)
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
            uOMGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    var uOMGroupDetailStore = new DevExpress.data.CustomStore({
        key: 'altUOMId',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            uOMGroupDetailService.getListDevextremes(args)
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
            uOMGroupDetailService.getListDevextremes({ filter: JSON.stringify(['uomGroup.id', '=', key]) })
                .done(result => {
                    d.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return d.promise();
        }
    });

    var priceListStore = new DevExpress.data.CustomStore({
        key: 'altUOMId',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            priceListService.getListDevextremes(args)
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
            priceListService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    var priceListDetailsStore = new DevExpress.data.CustomStore({
        key: 'altUOMId',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            priceListDetailsService.getListDevextremes(args)
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
            priceListDetailsService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    var vATStore = new DevExpress.data.CustomStore({
        key: 'altUOMId',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            vATService.getListDevextremes(args)
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
            vATService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    const docTypeStore = [
        {
            id: 0,
            text: l('EntityFieldName:OrderService:SalesRequest:PreOrder')
        },
        {
            id: 1,
            text: l('EntityFieldName:OrderService:SalesRequest:VanSales')
        },
        {
            id: 2,
            text: l('EntityFieldName:OrderService:SalesRequest:ThirdPartyDelivery')
        }
    ];

    const discountTypeStore = [
        {
            id: 0,
            text: l('EntityFieldName:OrderService:SalesRequest:CashDiscount')
        },
        {
            id: 1,
            text: l('EntityFieldName:OrderService:SalesRequest:DiscountBeforeTax')
        },
        {
            id: 2,
            text: l('EntityFieldName:OrderService:SalesRequest:DiscountAfterTax')
        }
    ];

    const docSourceStore = [
        {
            id: 0,
            text: l('EntityFieldName:OrderService:SalesRequest:Manual')
        },
        {
            id: 1,
            text: l('EntityFieldName:OrderService:SalesRequest:SFA')
        },
        {
            id: 2,
            text: l('EntityFieldName:OrderService:SalesRequest:BonBonShop')
        },
        {
            id: 3,
            text: l('EntityFieldName:OrderService:SalesRequest:Ecommerce')
        }
    ];

    const transactionTypeStore = [
        {
            id: 0,
            text: l('EntityFieldName:OrderService:SalesRequest:Item')
        },
        {
            id: 1,
            text: l('EntityFieldName:OrderService:SalesRequest:Promotion')
        },
        {
            id: 2,
            text: l('EntityFieldName:OrderService:SalesRequest:Sampling')
        },
        {
            id: 3,
            text: l('EntityFieldName:OrderService:SalesRequest:Incentive')
        }
    ];

    /****control*****/

    $('#resizable').dxResizable({
        minHeight: 120,
        handles: "bottom"
    }).dxResizable('instance');

    const frmSalesRequestDetails = $('#frmSalesRequestDetails').dxForm({
        formData: {
            linkedSFAId: SalesRequestHeaderModel ? SalesRequestHeaderModel.linkedSFAId : '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        },
        labelMode: "floating",
        colCount: 4,
        items: [
            // row 1
            {
                dataField: "docNbr",
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:DocNbr')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "companyId",
                editorType: 'dxSelectBox',
                editorOptions: {
                    dataSource: {
                        store: companyStore,
                        paginate: true,
                        pageSize: pageSizeForLookup
                    },
                    displayExpr: 'name',
                    valueExpr: 'id',
                    value: companyId,
                    disabled: true
                    //onValueChanged: function (e) {
                    //    const newValue = e.value;
                    //    var dxbusinessPartnerId = $('input[name=businessPartnerId]').closest('.dx-selectbox').data('dxSelectBox');
                    //    dxbusinessPartnerId.reset();
                    //    dxbusinessPartnerId.option('dataSource', new DevExpress.data.DataSource({
                    //        store: customerAssignmentStore,
                    //        filter: ["company.id", "=", newValue],
                    //        paginate: true,
                    //        pageSize: pageSizeForLookup
                    //    }));
                    //}
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:Company')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "docTotalLineDiscountAmt",
                editorType: "dxNumberBox",
                editorOptions: {
                    format: '#,##0.##',
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineDiscountAmt')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "docTotalLineAmt",
                editorType: "dxNumberBox",
                editorOptions: {
                    format: '#,##0.##',
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmt')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            // row 2
            {
                dataField: "docType",
                editorType: "dxSelectBox",
                editorOptions: {
                    dataSource: docTypeStore,
                    displayExpr: 'text',
                    valueExpr: 'id'
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:DocType')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "businessPartnerId",
                editorType: 'dxSelectBox',
                editorOptions: {
                    dataSource: {
                        store: customerAssignmentStore,
                        filter: [["company.id", "=", companyId], 'and', ['customer.active', '=', true], 'and', ['customer.effectiveDate', '<=', new Date()], 'and', [['customer.endDate', '=', null], 'or', ['customer.endDate', '>=', new Date()]]],
                        paginate: true,
                        pageSize: pageSizeForLookup
                    },
                    displayExpr: 'customer.name',
                    valueExpr: 'customer.id',
                    onValueChanged: function (e) {
                        const curSelectBox = e.element.dxSelectBox('instance');
                        const customers = curSelectBox.getDataSource().items().filter(x => x.customerId == e.value);
                        pricelistId = customers[0].customer.priceListId;

                        //console.log("new value: " + e.value);
                        //console.log("cus source:", customers[0].customer)
                        //console.log("price source:" + customers[0].customer.priceListId)
                        //console.log("price change: " + pricelistId);
                    }
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:BusinessPartner')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "docTotalLineAmtAfterTax",
                editorType: "dxNumberBox",
                editorOptions: {
                    format: '#,##0.##',
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmtAfterTax')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "docDiscountType",
                editorType: "dxNumberBox",
                editorOptions: {
                    format: '#,##0.##',
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:DocDiscountType')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            // row 3
            {
                dataField: "linkedSFAId",
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:LinkedSFA')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "employeeId",
                editorType: 'dxSelectBox',
                editorOptions: {
                    dataSource: {
                        store: employeeProfileStore,
                        filter: [['active', '=', true], 'and', [['effectiveDate', '=', null], 'or', ['effectiveDate', '<=', new Date()]], 'and', [['endDate', '=', null], 'or', ['endDate', '>=', new Date()]]],
                        paginate: true,
                        pageSize: pageSizeForLookup
                    },
                    displayExpr: 'code',
                    valueExpr: 'id'
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:Employee')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "docDiscountPerc",
                editorType: "dxNumberBox",
                editorOptions: {
                    format: '#,##0.##',
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:DocDiscountPerc')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "docDiscountAmt",
                editorType: "dxNumberBox",
                editorOptions: {
                    format: '#,##0.##',
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:DocDiscountAmt')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            // row 4
            {
                dataField: "remark",
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:Remark')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "routeId",
                editorType: "dxSelectBox",
                editorOptions: {
                    dataSource: {
                        store: salesOrgHierarchyStore,
                        filter: ["isRoute", "=", true],
                        paginate: true,
                        pageSize: pageSizeForLookup
                    },
                    displayExpr: 'name',
                    valueExpr: 'id'
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:Route')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "docTotalAmt",
                editorType: "dxNumberBox",
                editorOptions: {
                    format: '#,##0.##',
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmt')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "docTotalAmtAfterTax",
                editorType: "dxNumberBox",
                editorOptions: {
                    format: '#,##0.##',
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmtAfterTax')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            // row 5
            {
                dataField: "requestDate",
                editorType: 'dxDateBox',
                editorOptions: {
                    type: 'datetime',
                    value: new Date(),
                    disabled: true,
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:RequestDate')
                },
                validationRules: [{
                    type: 'required',
                }]
            },
            {
                dataField: "docSource",
                editorType: "dxSelectBox",
                editorOptions: {
                    dataSource: docSourceStore,
                    displayExpr: 'text',
                    valueExpr: 'id'
                },
                label: {
                    visible: false,
                    text: l('EntityFieldName:OrderService:SalesRequest:DocSource')
                },
                validationRules: [{
                    type: 'required',
                }]
            }
        ]
    }).dxForm('instance');

    const dgSalesRequestDetails = $('#dgSalesRequestDetails').dxDataGrid({
        dataSource: SalesRequestDetailsModel,
        keyExpr: 'id',
        remoteOperations: false,
        cacheEnabled: true,
        export: {
            enabled: true,
            // allowExportSelectedData: true,
        },
        onExporting(e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('SalesRequestDetails');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'SalesRequestDetails.xlsx');
                });
            });
            e.cancel = true;
        },
        showRowLines: true,
        showBorders: true,
        focusedRowEnabled: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnMinWidth: 50,
        columnAutoWidth: true,
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columnFixing: {
            enabled: true,
        },
        filterRow: {
            visible: true,
        },
        groupPanel: {
            visible: true,
        },
        headerFilter: {
            visible: true,
        },
        rowAlternationEnabled: true,
        searchPanel: {
            visible: true
        },
        //scrolling: {
        //    mode: 'standard'
        //},
        stateStoring: { //save state in localStorage
            //enabled: true,
            //type: 'localStorage',
            //storageKey: 'dgSalesRequestDetails',
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
                "addRowButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "add",
                        onClick(e) {
                            popupItems.show();
                        },
                    },
                },
                'columnChooserButton',
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
                "searchPanel"
            ],
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
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: ['edit', 'delete'],
                fixedPosition: 'left'
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:Item'),
                dataField: 'itemId',
                calculateDisplayValue: "name",
                lookup: {
                    dataSource() {
                        return {
                            store: itemStore,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr: "name",
                    valueExpr: "id"
                },
                setCellValue: function (newData, value) {
                    return LoadDataByItem(newData, value);
                },
                validationRules: [{ type: 'required' }],
                width: 200
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:UOM'),
                dataField: 'uomId',
                calculateDisplayValue: "salesUOM.name",
                lookup: {
                    dataSource(options) {
                        return {
                            store: uOMGroupDetailStore,
                            filter: [["uomGroup.id", "=", options.data != null ? options.data.uomGroupId : null]],
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr: "altUOM.name",
                    valueExpr: "altUOM.id"
                },
                validationRules: [{ type: 'required' }],
                width: 200
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:Price'),
                dataField: 'price',
                dataType: 'number',
                editorOptions: {
                    format: '#,##0.##',
                },
                value: 0,
                validationRules: [{ type: 'required' }],
                width: 150,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:VAT'),
                dataField: 'vatId',
                calculateDisplayValue: "name",
                lookup: {
                    dataSource() {
                        return {
                            store: vATStore,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr: "name",
                    valueExpr: "id"
                },
                width: 150,
                validationRules: [{ type: 'required' }]
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:PriceAfterTax'),
                dataField: 'priceAfterTax',
                dataType: 'number',
                editorOptions: {
                    format: '#,##0.##',
                },
                setCellValue: function (newData, value, currentdata) {
                    newData.priceAfterTax = value;
                    newData.lineAmtAfterTax = currentdata.qty * value - currentdata.discountAmt;
                },
                value: 0,
                validationRules: [{ type: 'required' }],
                width: 150,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:Qty'),
                dataField: 'qty',
                dataType: 'number',
                setCellValue: function (newData, value, currentdata) {
                    newData.qty = value;
                    newData.lineAmt = currentdata.price * value - currentdata.discountAmt;
                    newData.lineAmtAfterTax = currentdata.priceAfterTax * value - currentdata.discountAmt;
                },
                value: 0,
                validationRules: [
                    {
                        type: 'required'
                    },
                    {
                        type: 'pattern',
                        message: 'Quantity can not be Negative!',
                        pattern: /^\d*[1-9]\d*$/,
                    }
                ],
                width: 150,
            },
            {
                caption: l('EntityFieldName:MDMService:UOMGroupDetail:BaseUomId'),
                dataField: 'baseUomId',
                calculateDisplayValue: "baseUOM.name",
                lookup: {
                    dataSource(options) {
                        return {
                            store: uOMGroupDetailStore,
                            filter: [["uomGroup.id", "=", options.data != null ? options.data.uomGroupId : null]],
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr: "baseUOM.name",
                    valueExpr: "baseUOM.id"
                },
                setCellValue: function (newData, value, currentData) {
                    newData.baseUomId = value;

                    var d = new $.Deferred();

                    uOMGroupDetailService.getListDevextremes({ filter: JSON.stringify(['uomGroupId', '=', currentData.uomGroupId]) })
                        .done(result => {
                            d.resolve(
                                newData.uomRate = result.data[0].baseQty
                            );
                        });

                    return d.promise();
                },
                width: 200
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:SfaOrderBaseQty'),
                dataField: 'sfaOrderBaseQty',
                dataType: 'number',
                value: 0,
                setCellValue: function (newData, value, currentRowData) {
                    if (value < 0 || value > currentRowData.qty) {
                        newData.sfaOrderBaseQty = 0;
                    } else {
                        newData.sfaOrderBaseQty = value;
                        newData.baseQty = currentRowData.uomRate * value;
                    }
                },
                width: 150
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:BaseQty'),
                dataField: 'baseQty',
                dataType: 'number',
                value: 0,
                width: 150
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:Warehouse'),
                dataField: 'warehouseId',
                value: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                validationRules: [{ type: 'required' }],
                width: 200
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:WarehouseLocation'),
                dataField: 'warehouseLocationId',
                value: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                validationRules: [{ type: 'required' }],
                width: 200
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:IsFree'),
                dataField: 'isFree',
                dataType: 'boolean',
                validationRules: [{ type: 'required' }],
                width: 120
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:Promotion'),
                dataField: 'promotionId',
                value: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                width: 150
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountType'),
                dataField: 'discountType',
                lookup: {
                    dataSource: discountTypeStore,
                    displayExpr: 'text',
                    valueExpr: 'id'
                },
                setCellValue: function (newData, value, currentdata) {
                    newData.discountType = value;

                    switch (value) {
                        case 1:
                            newData.discountAmt = currentdata.price * currentdata.discountPerc;
                            break;
                        case 2:
                            newData.discountAmt = currentdata.priceAfterTax * currentdata.discountPerc;
                            break;
                        default:
                            newData.discountAmt = 0;
                    }
                },
                validationRules: [{ type: 'required' }],
                width: 200
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountPerc'),
                dataField: 'discountPerc',
                dataType: 'number',
                editorOptions: {
                    format: '#0.00%',
                },
                value: 0,
                setCellValue: function (newData, value, currentdata) {
                    newData.discountPerc = value;
                    switch (currentdata.discountType) {
                        case 1:
                            newData.discountAmt = currentdata.price * value;
                            break;
                        case 2:
                            newData.discountAmt = currentdata.priceAfterTax * value;
                            break;
                        default:
                            newData.discountAmt = 0;
                    }
                },
                validationRules: [{ type: 'required' }],
                width: 150
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountAmt'),
                dataField: 'discountAmt',
                dataType: 'number',
                editorOptions: {
                    format: '#,##0.##',
                },
                setCellValue: function (newData, value, currentdata) {
                    newData.discountAmt = value;
                    newData.lineAmt = currentdata.price * currentdata.qty - value;
                    newData.lineAmtAfterTax = currentdata.priceAfterTax * currentdata.qty - value;
                },
                value: 0,
                validationRules: [{ type: 'required' }],
                width: 150
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:LineAmt'),
                dataField: 'lineAmt',
                dataType: 'number',
                editorOptions: {
                    format: '#,##0.##',
                },
                value: 0,
                validationRules: [{ type: 'required' }],
                width: 150
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:LineAmtAfterTax'),
                dataField: 'lineAmtAfterTax',
                validationRules: [{ type: 'required' }],
                width: 150
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:TransactionType'),
                dataField: 'transactionType',
                lookup: {
                    dataSource: transactionTypeStore,
                    displayExpr: 'text',
                    valueExpr: 'id'
                },
                value: 0,
                validationRules: [{ type: 'required' }],
                width: 150
            },
            //hidden field
            {
                dataField: 'uomGroupId',
                visible: false,
            },
            {
                dataField: 'uomRate',
                visible: false,
            },
            {
                dataField: 'taxRate',
                visible: false,
            },
            //{
            //    caption: l('EntityFieldName:OrderService:SalesRequestDetails:LineDiscountAmt'),
            //    dataField: 'lineDiscountAmt',
            //    validationRules: [{ type: 'required' }]
            //},
            //{
            //    caption: l('EntityFieldName:OrderService:SalesRequestDetails:ProcessQty'),
            //    dataField: 'processQty',
            //    validationRules: [{ type: 'required' }]
            //},
            //{
            //    caption: l('EntityFieldName:OrderService:SalesRequestDetails:OpenQty'),
            //    dataField: 'openQty',
            //    validationRules: [{ type: 'required' }]
            //},
            //{
            //    caption: l('EntityFieldName:OrderService:SalesRequestDetails:ConfirmQty'),
            //    dataField: 'confirmQty',
            //    validationRules: [{ type: 'required' }]
            //},
        ]
    }).dxDataGrid("instance");

    const dgItems = $('#dgItems').dxDataGrid({
        dataSource: itemStore,
        remoteOperations: true,
        showColumnLines: true,
        showRowLines: false,
        rowAlternationEnabled: true,
        showBorders: false,
        export: {
            enabled: false,
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnMinWidth: 50,
        columnAutoWidth: true,
        columnChooser: {
            enabled: true,
            allowSearch: true,
        },
        columnFixing: {
            enabled: true,
        },
        filterRow: {
            visible: true,
        },
        groupPanel: {
            visible: true,
        },
        headerFilter: {
            visible: true,
        },
        searchPanel: {
            visible: true
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
            mode: 'cell',
            allowUpdating: true,
        },
        selection: {
            mode: 'multiple',
        },
        onContentReady(e) {
            if (itemsInPopup == null) {
                itemsInPopup = dgItems.getDataSource().items();
                dgItems.option('dataSource', itemsInPopup);
            }
        },
        toolbar: {
            items: [
                "columnChooserButton",
                "searchPanel",
            ],
        },
        columns: [
            {
                caption: l('EntityFieldName:OrderService:SalesRequestDetails:Qty'),
                dataField: 'qty',
                width: 100,
                dataType: 'number',
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:Item:Code"),
                dataType: 'string',
                allowEditing: false
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:Item:Name"),
                dataType: 'string',
                allowEditing: false
            },
            {
                dataField: 'inventory',
                caption: l("Inventory"),
                dataType: 'number',
                width: 100,
                allowEditing: false
            },
            {
                dataField: 'id',
                visible: false
            },
            {
                dataField: 'salesUOMId',
                visible: false
            },
            {
                dataField: 'uomGroupId',
                visible: false
            },
        ],
    }).dxDataGrid("instance");

    const popupItems = $('#popupItems').dxPopup({
        width: "100vh",
        height: 500,
        container: '.panel-container',
        showTitle: true,
        title: 'Choose items',
        visible: false,
        dragEnabled: true,
        hideOnOutsideClick: false,
        showCloseButton: true,
        resizeEnabled: true,
        position: {
            at: 'center',
            my: 'center',
            collision: 'fit',
        },
        onShowing: function (e) {
            var heightGridContent = $('div.dx-overlay-content.dx-popup-normal.dx-popup-draggable.dx-resizable').innerHeight() - 310;
            $('#dgItems div.dx-datagrid-rowsview').css('height', heightGridContent + 'px');
        },
        onResize: function (e) {
            var heightGridContent = $('div.dx-overlay-content.dx-popup-normal.dx-popup-draggable.dx-resizable').innerHeight() - 310;
            $('#dgItems div.dx-datagrid-rowsview').css('height', heightGridContent + 'px');
        },
        toolbarItems: [{
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                icon: 'fa fa-check hvr-icon',
                text: 'Submit',
                onClick() {
                    var selectedItems = dgItems.getSelectedRowsData();
                    if (selectedItems.length > 0) {
                        selectedItems.forEach(u => {
                            SalesRequestDetailsModel.unshift({
                                id: u.id,
                                itemId: u.id,
                                uomId: u.salesUOMId,
                                qty: u.qty,

                            });
                        });

                        dgSalesRequestDetails.refresh();

                        itemsInPopup = null;
                        dgItems.option('dataSource', itemStore);
                    }
                },
            },
        }, {
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                text: 'Cancel',
                onClick() {
                    itemsInPopup = null;
                    dgItems.option('dataSource', itemStore);
                    popupItems.hide();
                },
            },
        }],
    }).dxPopup('instance');

    /****button*****/
    $("#CloseButton").click(function (e) {
        e.preventDefault();

        abp.message.confirm(l('ConfirmationMessage.UnSavedAndLeave'), l('ConfirmationMessage.UnSavedAndLeaveTitle')).then(function (confirmed) {
            if (confirmed) {
                window.close();
            }
        });
    });

    $("#SaveButton").click(function (e) {
        e.preventDefault();

        //if (!frmSalesRequestDetails.validate().isValid) {
        //    abp.message.warn(l('WarnMessage.RequiredField'));
        //    return;
        //}

        var salesRequest = frmSalesRequestDetails.option('formData');
        var salesRequestDetails = dgSalesRequestDetails.getDataSource().items();

        var salesRequestObject = {
            header: {
                companyId: salesRequest.companyId,
                docNbr: salesRequest.docNbr,
                docType: salesRequest.docType,
                requestDate: salesRequest.requestDate,
                remark: salesRequest.remark,
                businessPartnerId: salesRequest.businessPartnerId,
                routeId: salesRequest.routeId,
                employeeId: salesRequest.employeeId,
                linkedSFAId: salesRequest.linkedSFAId,
                docTotalLineDiscountAmt: salesRequest.docTotalLineDiscountAmt,
                docTotalLineAmt: salesRequest.docTotalLineAmt,
                docTotalLineAmtAfterTax: salesRequest.docTotalLineAmtAfterTax,
                docDiscountType: salesRequest.docDiscountType,
                docDiscountPerc: salesRequest.docDiscountPerc,
                docDiscountAmt: salesRequest.docDiscountAmt,
                docTotalAmt: salesRequest.docTotalAmt,
                docTotalAmtAfterTax: salesRequest.docTotalAmtAfterTax,
                docSource: salesRequest.docSource
            },
            details: salesRequestDetails
        };

        console.log(salesRequestObject);

        salesRequestService.createDoc(salesRequestObject, { contentType: "application/json" })
            .done(result => {
                abp.message.success(l('Congratulations'));
                console.log(result);
            })
    });

    /****function*****/
    function LoadData() {
        SalesRequestHeaderModel = JSON.parse(sessionStorage.getItem("SalesRequest"));
        if (SalesRequestHeaderModel == null) {

        } else {
            salesRequesIdFilter = SalesRequestHeaderModel.id;
            frmSalesRequestDetails.option('formData', SalesRequestHeaderModel);
        }
    }

    //LoadData();

    function LoadDataByItem(fieldData, itemId) {
        var d = new $.Deferred();
        itemService.getListDevextremes({ filter: JSON.stringify(['id', '=', itemId]) })
            .done(resultItem => {
                priceListDetailsService.getListDevextremes({ filter: JSON.stringify([['itemId', '=', itemId], 'and', ['item.uomGroupId', '=', resultItem.data[0].uomGroupId], 'and', ['priceList.id', '=', pricelistId]]) })
                    .done(result => {
                        d.resolve(
                            fieldData.itemId = itemId,
                            fieldData.uomGroupId = resultItem.data[0].uomGroupId,
                            fieldData.vatId = resultItem.data[0].vatId,
                            fieldData.taxRate = resultItem.data[0].vat.rate,
                            fieldData.uomId = resultItem.data[0].salesUOMId,
                            fieldData.price = result.data[0] == null ? 0 : result.data[0].price,
                            fieldData.priceAfterTax = fieldData.price + (fieldData.price * fieldData.taxRate) / 100
                        );
                    });
            });

        return d.promise();
    }

    initImportPopup('', 'SalesRequest_Template', 'dgSalesRequestDetails');
});