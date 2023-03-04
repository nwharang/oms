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
  
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    var companyIdentityUserAssignmentService = window.dMSpro.oMS.mdmService.controllers.companyIdentityUserAssignments.companyIdentityUserAssignment;
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
    var companyIdentityUserAssignmentStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            }); 
            companyIdentityUserAssignmentService.getListCompanyByCurrentUser(args)
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
                    d.resolve({
                        company: {
                            id: data.id,
                            name: data.name
                        }
                    });
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
                        store: companyIdentityUserAssignmentStore,//companyStore,
                        paginate: true,
                        pageSize: pageSizeForLookup
                    },
                    displayExpr: 'company.name',
                    valueExpr: 'company.id',
                    value: companyId,
                    //disabled: true
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

    var dgDeliveries = $('#dgDeliveries').dxDataGrid(jQuery.extend(dxDataGridConfiguration, {
        dataSource: DeliveryDetailData,
        stateStoring: { //save state in localStorage
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgDeliveries',
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
    }) ).dxDataGrid("instance");

    $('#resizable').dxResizable({
        minHeight: 120,
        handles: "bottom"
    }).dxResizable('instance');

   
    initChooseItemsPopup(dgDeliveries);

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