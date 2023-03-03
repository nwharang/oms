var DeliveryModel = null;
const companyId = '29d43197-c742-90b8-65d8-3a099166f987';
var DeliveryDetailData = [{
    itemCode: "1",
    itemName: "xxx",
    qty: 111
},
{
    itemCode: "2",
    itemName: "yyyy",
    qty: 2
},
];

$(function () {
    var l = abp.localization.getResource("OMS");
    var itemsService = window.dMSpro.oMS.mdmService.controllers.items.item;
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    var customerAssignmentService = window.dMSpro.oMS.mdmService.controllers.customerAssignments.customerAssignment;
    var salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;
    var employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;
    var deliveryService = window.dMSpro.oMS.orderService.controllers.deliveries.delivery;

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

    var itemsStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            itemsService.getListDevextremes(args)
                .done(result => {
                    result.data.forEach(u => {
                        u.inventory = null;
                        u.qty = 1;
                    });

                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        }
    });

    var companyStore = new DevExpress.data.CustomStore({
        key: "id",
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
                        groupCount: result.groupCount
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
        }
    });

    const deliveryForm = $("#frmDeliveryHeader").dxForm({
        formData: {
            DeliveryModel
        },
        labelMode: 'floating',
        colCount: 4,
        items: [
            // row 1
            {
                dataField: "docNbr",
                label: {
                    visible: false,
                    text: l('Doc Nbr')
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
                },
                label: {
                    visible: false,
                    text: l('Company')
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
                    text: l('Doc Total Line Discount Amt')
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
                    text: l('Doc Total Line Amt')
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
                    text: l('Doc Type')
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
                    valueExpr: 'customer.id'
                },
                label: {
                    visible: false,
                    text: l('Business Partner')
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
                    text: l('Doc Total Line Amt After Tax')
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
                    text: l('Doc Discount Type')
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
                    text: l('Linked SFA')
                },
                editorOptions: {
                    disabled: true,
                    value: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
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
                    text: l('Employee')
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
                    text: l('Doc Discount Perc')
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
                    text: l('Doc Discount Amt')
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
                    text: l('Remark')
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
                    text: l('Route')
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
                    text: l('Doc Total Amt')
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
                    text: l('Doc Total Amt After Tax')
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
                    text: l('Request Date')
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
                    text: l('Doc Source')
                },
                validationRules: [{
                    type: 'required',
                }]
            }
        ]
    }).dxForm('instance');;

    var dgDeliveries = $('#dgDeliveries').dxDataGrid({
        dataSource: DeliveryDetailData,
        remoteOperations: true,
        showColumnLines: true,
        showRowLines: false,
        rowAlternationEnabled: true,
        showBorders: false,
        export: {
            enabled: true,
        },
        onExporting: function (e) {
            if (e.format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Deliveries');
                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet,
                    autoFilterEnabled: true,
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Deliveries.xlsx');
                    });
                });
                e.cancel = true;
            }
            else if (e.format === 'pdf') {
                const doc = new jsPDF();
                DevExpress.pdfExporter.exportDataGrid({
                    jsPDFDocument: doc,
                    component: e.component,
                }).then(() => {
                    doc.save('Deliveries.pdf');
                });
            }
        },
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
        searchPanel: {
            visible: true
        },
        stateStoring: { //save state in localStorage
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgDeliveries',
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
            mode: "cell",
            allowAdding: abp.auth.isGranted('OrderService.Deliveries.Create'),
            allowUpdating: abp.auth.isGranted('OrderService.Deliveries.Edit'),
            allowDeleting: true,//missing permission
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            },
        },
        toolbar: {
            items: [
                "groupPanel",
                //"addRowButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "add",
                        onClick(e) {
                            var popup = $(`#popupItems`).data('dxPopup');
                            popup.show();
                        },
                    },
                },

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
                type: 'buttons',
                caption: l("Actions"),
                buttons: ['delete'],
                fixed: true,
                fixedPosition: "left"
            },
            {
                dataField: 'itemCode',
                caption: l("Item Code"),
                width: 110,
                dataType: 'string',
            },
            {
                dataField: 'itemName',
                caption: l("Item Name"),
                width: 200,
                dataType: 'string',
            },
            {
                dataField: 'UOM',
                caption: l("UOM"),
                width: 90,
                dataType: 'string',
            },
            {
                dataField: 'qty',
                caption: l("Qty"),
                width: 70,
                dataType: 'number',
            },
            {
                dataField: 'issueQty',
                caption: l("Issue Qty"),
                width: 90,
                dataType: 'number',
            },
            {
                dataField: 'price',
                caption: l("Price"),
                width: 110,
                dataType: 'number',
                format: 'currency',
            },
            {
                dataField: 'lineAmountNoTax',
                caption: l("LineAmtNoTax"),
                width: 110,
                dataType: 'number',
                format: 'currency',
            },
            {
                dataField: 'discount',
                caption: l("Discount %"),
                width: 110,
                dataType: 'number',
            },
            {
                dataField: 'discountLineAmount',
                caption: l("DiscountLineAmount"),
                width: 200,
                dataType: 'number',
                format: 'currency',
            },
            {
                dataField: 'taxRate',
                caption: l("TaxRate"),
                width: 110,
                dataType: 'number',
            },
            {
                dataField: 'taxRateAmount',
                caption: l("TaxRateAmount"),
                width: 110,
                dataType: 'number',
                format: 'currency',
            },
            {
                dataField: 'lineAmt',
                caption: l("LineAmt"),
                width: 70,
                dataType: 'number',
            },
            {
                dataField: 'baseQty',
                caption: l("BaseQty"),
                width: 110,
                dataType: 'number',
            },
            {
                dataField: 'baseUOM',
                caption: l("BaseUOM"),
                width: 110,
                dataType: 'number',
            },
            {
                dataField: 'warehourse',
                caption: l("Warehourse"),
                width: 110,
                dataType: 'string',
            },
            {
                dataField: 'WHLocation',
                caption: l("WHLocationn"),
                width: 110,
                dataType: 'string',
            },
            {
                dataField: 'taxCode',
                caption: l("TaxCode"),
                width: 90,
                dataType: 'string',
            },
            {
                dataField: 'tranType',
                caption: l("TranType"),
                width: 110,
                dataType: 'string',
            },
        ]
    }).dxDataGrid("instance");

    $('#resizable').dxResizable({
        minHeight: 120,
        handles: "bottom"
    }).dxResizable('instance');

    $('#dgItems').dxDataGrid({
        dataSource: itemsStore,
        remoteOperations: true,
        showColumnLines: true,
        showRowLines: false,
        // rowAlternationEnabled: true,
        showBorders: false,
        export: {
            enabled: true,
        },
        onExporting: function (e) {
            if (e.format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Items');
                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet,
                    autoFilterEnabled: true,
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Items.xlsx');
                    });
                });
                e.cancel = true;
            }
            else if (e.format === 'pdf') {
                const doc = new jsPDF();
                DevExpress.pdfExporter.exportDataGrid({
                    jsPDFDocument: doc,
                    component: e.component,
                }).then(() => {
                    doc.save('Items.pdf');
                });
            }
        },
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
        searchPanel: {
            visible: true
        },
        stateStoring: { //save state in localStorage
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgItems',
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
            allowUpdating: false,
        },
        selection: {
            mode: 'multiple',
        },
        toolbar: {
            items: [
                //"groupPanel",
                "columnChooserButton",
                //"exportButton",
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
                dataField: 'qty',
                caption: l("Qty"),
                width: 100,
                dataType: 'number',
                cellTemplate(container, options) {
                    $('<div>')
                        .dxTextBox({
                            value: options.value
                        })
                        .appendTo(container);
                }
            },
            {
                dataField: 'code',
                caption: l("Item Code"),
                dataType: 'string',
                allowEditing: false
            },
            {
                dataField: 'name',
                caption: l("Item Name"),
                dataType: 'string',
                allowEditing: false
            },
            {
                dataField: 'inventory',
                caption: l("Inventory"),
                dataType: 'number',
                width: 100,
                allowEditing: false
            }
        ],
        //onSelectionChanged: function (e) {
        //    var selectedRowsData = e.component.getSelectedRowsData();
        //    if (selectedRowsData.length > 0) {
        //        $('#submitItemsButton').removeAttr('disabled');
        //    } else {
        //        $('#submitItemsButton').prop('disabled', true);
        //    }
        //}

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
            location: 'before',
            options: {
                icon: 'fa fa-check hvr-icon',
                text: 'Submit',
                elementAttr: {
                    id: "submitItemsButton",
                    //disabled: true,
                },
                onClick() {
                    //todo
                    var selectedItems = $('#dgItems').data('dxDataGrid').getSelectedRowsData();
                    if (selectedItems.length > 0) {
                        selectedItems.forEach(u => {
                            DeliveryDetailData.unshift({
                                itemCode: u.code,
                                itemName: u.name,
                                qty: u.qty
                            });
                        });
                        var dataGrid = $('#dgDeliveries').dxDataGrid('instance');
                        dataGrid.refresh();
                    }
                    popupItems.hide();
                },
            },
        }, {
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                text: 'Cancel',
                onClick() {
                    popupItems.hide();
                },
            },
        }],
    }).dxPopup('instance');

    initImportPopup('', 'Deliveries_Template', 'dgDeliveries');
    initImportPopup('api/mdm-service/companies', 'Items_Template', 'dgItems');

    $('#btnSave').click(function (e) {
        e.preventDefault();

        var headerDelivery = deliveryForm.option('formData');

        var deliveryObject = {
            header: headerDelivery,
            details: DeliveryDetailData
        }

        deliveryService.createDoc(deliveryObject, { contentType: "application/json" })
            .done(result => {
                abp.message.success(l('Congratulations'));
                console.log(result);
            })
    })

    $("#btnCancel").click(function (e) {
        e.preventDefault();

        abp.message.confirm(l('ConfirmationMessage.UnSavedAndLeave'), l('ConfirmationMessage.UnSavedAndLeaveTitle')).then(function (confirmed) {
            if (confirmed) {
                window.close();
            }
        });
    });
});