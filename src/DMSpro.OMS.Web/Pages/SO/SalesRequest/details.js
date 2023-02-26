$(function () {
    // language texts
    var l = abp.localization.getResource("MdmService");

    var dataSales = [
        {
            id: 1,
            itemCode: "item1",
            itemName: "John Heart",
            UOM: "Thung",
            qty: 3,
            issueQty: 0,
            price: 100000,
            lineAmountNoTax: 400000,
            discount: 0,
            discountLineAmount: 0,
            taxRate: "10",
            taxRateAmount: 40000,
            lineAmt: 440000,
            baseQty: 40,
            baseUOM: "Chai",
            warehourse: "Main",
            WHLocation: "ABC bcx",
            taxCode: "VAT10",
            tranType: "Selling",
        },
        {
            id: 2,
            itemCode: "item2",
            itemName: "San pham 2",
            UOM: "Thung",
            qty: 3,
            issueQty: 0,
            price: 100000,
            lineAmountNoTax: 300000,
            discount: 20,
            discountLineAmount: 60,
            taxRate: "10",
            taxRateAmount: 50000,
            lineAmt: 240000,
            baseQty: 30,
            baseUOM: "Chai",
            warehourse: "Main",
            WHLocation: "ABC bcx",
            taxCode: "VAT10",
            tranType: "Selling",
        },
        {
            id: 3,
            itemCode: "item3",
            itemName: "San pham 3",
            UOM: "Lon",
            qty: 4,
            issueQty: 0,
            price: 100000,
            lineAmountNoTax: 300000,
            discount: 0,
            discountLineAmount: 0,
            taxRate: "10",
            taxRateAmount: 33000,
            lineAmt: 530000,
            baseQty: 30,
            baseUOM: "Chai",
            warehourse: "Main",
            WHLocation: "ABC bcx",
            taxCode: "VAT10",
            tranType: "Sampling",
        }
    ];

    $("#frmSalesOrders").dxForm({
        formData: {
            company: "CEO Company",
            SRNbr: "hsdjsd939239j23",
            orderType: "JHeart",
            docDate: new Date(),
            deliveryDate: new Date(2022, 4, 13),
            postingDate: new Date(),
            remark: "",
            outletID: "01234567890",
            isActive: true,
            routeID: "1",
            route: "Route 1",
            employeeID: "JS13343JDD3",
            salesman: "Jay ne",
            status: "Open",
            linkedNbr: "JB893",
            SFAlinkedNbr: "AH2002",
            totalAmtNoTax: 400,
            totalAmtDiscount: 35,
            totalTaxAmt: 20,
            totalAmt: 420,
            docSource: "Đơn Manual",
        },
        labelMode: 'floating',
        colCount: 3,
        items: [
            {
                itemType: "group",
                items: ["SRNbr", "status", "docDate", "deliveryDate", "postingDate", "orderType", "remark"]
            },
            {
                itemType: "group",
                items: ["company", "route", "salesman", "linkedNbr", "SFAlinkedNbr"]
            },
            {
                itemType: "group",
                items: ["totalAmtNoTax", "totalAmtDiscount", "totalTaxAmt", "totalAmt"]
            }
        ],
    });

    var gridSales = $('#dgSalesOrders').dxDataGrid({
        dataSource: dataSales,
        keyExpr: "id",
        showBorders: true,
        //filterRow: {
        //    visible: true
        //},
        searchPanel: {
            visible: true
        },
        scrolling: {
            mode: 'standard'
        },
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        //headerFilter: {
        //    visible: true,
        //},
        paging:
        {
            pageSize: pageSize,
        },
        pager: {
            visible: true,
            allowedPageSizes: [10, 20, 'all'],
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true,
        },
        columns: [
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
        ],
    }).dxDataGrid("instance");

});
//$(function () {
//    var l = abp.localization.getResource("OMSWeb");
//    var salesRequestService = window.dMSpro.oMS.orderService.controllers.salesRequests.salesRequest;
//    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
//    var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
//    var customerAssignmentService = window.dMSpro.oMS.mdmService.controllers.customerAssignments.customerAssignment;
//    var employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;
//    var salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;
//    var itemService = window.dMSpro.oMS.mdmService.controllers.items.item;
//    var uOMGroupService = window.dMSpro.oMS.mdmService.controllers.uOMGroups.uOMGroup;
//    var uOMGroupDetailService = window.dMSpro.oMS.mdmService.controllers.uOMGroupDetails.uOMGroupDetail;

//    //get data from sessionStorage
//    var SalesRequestModel = JSON.parse(sessionStorage.getItem("SalesRequest"));
//    var salesRequesIdFilter = null;
//    var stateMode = "add";

//    /****custom store*****/
//    var salesRequestStore = new DevExpress.data.CustomStore({
//        key: 'id',
//        load(loadOptions) {
//            const deferred = $.Deferred();
//            const args = {};

//            requestOptions.forEach((i) => {
//                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
//                    args[i] = JSON.stringify(loadOptions[i]);
//                }
//            });

//            salesRequestService.getHeaderListDevextremes(args)
//                .done(result => {
//                    deferred.resolve(result.data, {
//                        totalCount: result.totalCount,
//                        summary: result.summary,
//                        groupCount: result.groupCount,
//                    });
//                });

//            return deferred.promise();
//        },
//        byKey: function (key) {
//            if (key == 0) return null;

//            var d = new $.Deferred();
//            salesRequestService.get(key)
//                .done(data => {
//                    d.resolve(data);
//                });
//            return d.promise();
//        },
//        insert(values) {
//            return salesRequestService.create(values, { contentType: "application/json" });
//        },
//        update(key, values) {
//            return salesRequestService.update(key, values, { contentType: "application/json" });
//        },
//        remove(key) {
//            return salesRequestService.delete(key);
//        }
//    });

//    var companyStore = new DevExpress.data.CustomStore({
//        key: 'id',
//        load(loadOptions) {
//            const deferred = $.Deferred();
//            const args = {};

//            requestOptions.forEach((i) => {
//                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
//                    args[i] = JSON.stringify(loadOptions[i]);
//                }
//            });

//            companyService.getListDevextremes(args)
//                .done(result => {
//                    deferred.resolve(result.data, {
//                        totalCount: result.totalCount,
//                        summary: result.summary,
//                        groupCount: result.groupCount,
//                    });
//                });

//            return deferred.promise();
//        },
//        byKey: function (key) {
//            if (key == 0) return null;

//            var d = new $.Deferred();
//            companyService.get(key)
//                .done(data => {
//                    d.resolve(data);
//                });
//            return d.promise();
//        }
//    });

//    var customerStore = new DevExpress.data.CustomStore({
//        key: 'id',
//        load(loadOptions) {
//            const deferred = $.Deferred();
//            const args = {};

//            requestOptions.forEach((i) => {
//                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
//                    args[i] = JSON.stringify(loadOptions[i]);
//                }
//            });

//            customerService.getListDevextremes(args)
//                .done(result => {
//                    deferred.resolve(result.data, {
//                        totalCount: result.totalCount,
//                        summary: result.summary,
//                        groupCount: result.groupCount,
//                    });
//                });

//            return deferred.promise();
//        },
//        byKey: function (key) {
//            if (key == 0) return null;

//            var d = new $.Deferred();
//            customerService.get(key)
//                .done(data => {
//                    d.resolve(data);
//                });
//            return d.promise();
//        }
//    });

//    var customerAssignmentStore = new DevExpress.data.CustomStore({
//        key: 'id',
//        load(loadOptions) {
//            const deferred = $.Deferred();
//            const args = {};

//            requestOptions.forEach((i) => {
//                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
//                    args[i] = JSON.stringify(loadOptions[i]);
//                }
//            });

//            customerAssignmentService.getListDevextremes(args)
//                .done(result => {
//                    deferred.resolve(result.data, {
//                        totalCount: result.totalCount,
//                        summary: result.summary,
//                        groupCount: result.groupCount,
//                    });
//                });

//            return deferred.promise();
//        },
//        byKey: function (key) {
//            if (key == 0) return null;

//            var d = new $.Deferred();
//            customerAssignmentService.get(key)
//                .done(data => {
//                    d.resolve(data);
//                });
//            return d.promise();
//        }
//    });

//    var employeeProfileStore = new DevExpress.data.CustomStore({
//        key: 'id',
//        load(loadOptions) {
//            const deferred = $.Deferred();
//            const args = {};

//            requestOptions.forEach((i) => {
//                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
//                    args[i] = JSON.stringify(loadOptions[i]);
//                }
//            });

//            employeeProfileService.getListDevextremes(args)
//                .done(result => {
//                    deferred.resolve(result.data, {
//                        totalCount: result.totalCount,
//                        summary: result.summary,
//                        groupCount: result.groupCount,
//                    });
//                });

//            return deferred.promise();
//        },
//        byKey: function (key) {
//            if (key == 0) return null;

//            var d = new $.Deferred();
//            employeeProfileService.get(key)
//                .done(data => {
//                    d.resolve(data);
//                });
//            return d.promise();
//        }
//    });

//    var salesOrgHierarchyStore = new DevExpress.data.CustomStore({
//        key: 'id',
//        load(loadOptions) {
//            const deferred = $.Deferred();
//            const args = {};

//            requestOptions.forEach((i) => {
//                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
//                    args[i] = JSON.stringify(loadOptions[i]);
//                }
//            });

//            salesOrgHierarchyService.getListDevextremes(args)
//                .done(result => {
//                    deferred.resolve(result.data, {
//                        totalCount: result.totalCount,
//                        summary: result.summary,
//                        groupCount: result.groupCount,
//                    });
//                });

//            return deferred.promise();
//        },
//        byKey: function (key) {
//            if (key == 0) return null;

//            var d = new $.Deferred();
//            salesOrgHierarchyService.get(key)
//                .done(data => {
//                    d.resolve(data);
//                });
//            return d.promise();
//        },
//        insert(values) {
//            return salesOrgHierarchyService.create(values, { contentType: "application/json" });
//        },
//        update(key, values) {
//            return salesOrgHierarchyService.update(key, values, { contentType: "application/json" });
//        },
//        remove(key) {
//            return salesOrgHierarchyService.delete(key);
//        }
//    });

//    var itemStore = new DevExpress.data.CustomStore({
//        key: 'id',
//        load(loadOptions) {
//            const deferred = $.Deferred();
//            const args = {};

//            requestOptions.forEach((i) => {
//                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
//                    args[i] = JSON.stringify(loadOptions[i]);
//                }
//            });

//            itemService.getListDevextremes(args)
//                .done(result => {
//                    deferred.resolve(result.data, {
//                        totalCount: result.totalCount,
//                        summary: result.summary,
//                        groupCount: result.groupCount,
//                    });
//                });

//            return deferred.promise();
//        },
//        byKey: function (key) {
//            if (key == 0) return null;

//            var d = new $.Deferred();
//            itemService.get(key)
//                .done(data => {
//                    d.resolve(data);
//                });
//            return d.promise();
//        }
//    });

//    var uOMGroupStore = new DevExpress.data.CustomStore({
//        key: 'id',
//        load(loadOptions) {
//            const deferred = $.Deferred();
//            const args = {};

//            requestOptions.forEach((i) => {
//                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
//                    args[i] = JSON.stringify(loadOptions[i]);
//                }
//            });

//            uOMGroupService.getListDevextremes(args)
//                .done(result => {
//                    deferred.resolve(result.data, {
//                        totalCount: result.totalCount,
//                        summary: result.summary,
//                        groupCount: result.groupCount,
//                    });
//                });

//            return deferred.promise();
//        },
//        byKey: function (key) {
//            if (key == 0) return null;

//            var d = new $.Deferred();
//            uOMGroupService.get(key)
//                .done(data => {
//                    d.resolve(data);
//                });
//            return d.promise();
//        }
//    });

//    var uOMGroupDetailStore = new DevExpress.data.CustomStore({
//        key: 'id',
//        load(loadOptions) {
//            const deferred = $.Deferred();
//            const args = {};

//            requestOptions.forEach((i) => {
//                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
//                    args[i] = JSON.stringify(loadOptions[i]);
//                }
//            });

//            uOMGroupDetailService.getListDevextremes(args)
//                .done(result => {
//                    deferred.resolve(result.data, {
//                        totalCount: result.totalCount,
//                        summary: result.summary,
//                        groupCount: result.groupCount,
//                    });
//                });

//            return deferred.promise();
//        },
//        byKey: function (key) {
//            if (key == 0) return null;

//            var d = new $.Deferred();
//            uOMGroupDetailService.get(key)
//                .done(data => {
//                    d.resolve(data);
//                });
//            return d.promise();
//        }
//    });

//    const docTypeStore = [
//        {
//            id: 0,
//            text: l('EntityFieldName:OrderService:SalesRequest:PreOrder')
//        },
//        {
//            id: 1,
//            text: l('EntityFieldName:OrderService:SalesRequest:VanSales')
//        },
//        {
//            id: 2,
//            text: l('EntityFieldName:OrderService:SalesRequest:ThirdPartyDelivery')
//        }
//    ];

//    const discountTypeStore = [
//        {
//            id: 0,
//            text: l('EntityFieldName:OrderService:SalesRequest:CashDiscount')
//        },
//        {
//            id: 1,
//            text: l('EntityFieldName:OrderService:SalesRequest:DiscountBeforeTax')
//        },
//        {
//            id: 2,
//            text: l('EntityFieldName:OrderService:SalesRequest:DiscountAfterTax')
//        }
//    ];

//    const docSourceStore = [
//        {
//            id: 0,
//            text: l('EntityFieldName:OrderService:SalesRequest:Manual')
//        },
//        {
//            id: 1,
//            text: l('EntityFieldName:OrderService:SalesRequest:SFA')
//        },
//        {
//            id: 2,
//            text: l('EntityFieldName:OrderService:SalesRequest:BonBonShop')
//        },
//        {
//            id: 3,
//            text: l('EntityFieldName:OrderService:SalesRequest:Ecommerce')
//        }
//    ];

//    const transactionTypeStore = [
//        {
//            id: 0,
//            text: l('EntityFieldName:OrderService:SalesRequest:Item')
//        },
//        {
//            id: 1,
//            text: l('EntityFieldName:OrderService:SalesRequest:Promotion')
//        },
//        {
//            id: 2,
//            text: l('EntityFieldName:OrderService:SalesRequest:Sampling')
//        },
//        {
//            id: 3,
//            text: l('EntityFieldName:OrderService:SalesRequest:Incentive')
//        }
//    ];

//    /****control*****/

//    const salesRequestForm = $('#salesRequestDetailsForm').dxForm({
//        formData: {
//            linkedSFAId: SalesRequestModel ? SalesRequestModel.linkedSFAId : '3fa85f64-5717-4562-b3fc-2c963f66afa6'
//        },
//        labelMode: "floating",
//        colCount: 4,
//        items: [
//            // row 1
//            {
//                dataField: "docNbr",
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:DocNbr')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            {
//                dataField: "companyId",
//                editorType: 'dxSelectBox',
//                editorOptions: {
//                    dataSource: {
//                        store: companyStore,
//                        paginate: true,
//                        pageSize: pageSizeForLookup
//                    },
//                    displayExpr: 'name',
//                    valueExpr: 'id',
//                    onValueChanged: function (e) {
//                        const newValue = e.value;
//                        var dxbusinessPartnerId = $('input[name=businessPartnerId]').closest('.dx-selectbox').data('dxSelectBox');
//                        dxbusinessPartnerId.reset();
//                        dxbusinessPartnerId.option('dataSource', new DevExpress.data.DataSource({
//                            store: customerAssignmentStore,
//                            filter: ["company.id", "=", newValue],
//                            paginate: true,
//                            pageSize: pageSizeForLookup
//                        }));
//                    }
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:Company')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            {
//                dataField: "docTotalLineDiscountAmt",
//                editorType: "dxNumberBox",
//                editorOptions: {
//                    format: '#,##0.##',
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineDiscountAmt')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            {
//                dataField: "docTotalLineAmt",
//                editorType: "dxNumberBox",
//                editorOptions: {
//                    format: '#,##0.##',
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmt')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            // row 2
//            {
//                dataField: "docType",
//                editorType: "dxSelectBox",
//                editorOptions: {
//                    dataSource: docTypeStore,
//                    displayExpr: 'text',
//                    valueExpr: 'id'
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:DocType')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            {
//                dataField: "businessPartnerId",
//                editorType: 'dxSelectBox',
//                editorOptions: {
//                    displayExpr: 'customer.name',
//                    valueExpr: 'customer.id'
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:BusinessPartner')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            {
//                dataField: "docTotalLineAmtAfterTax",
//                editorType: "dxNumberBox",
//                editorOptions: {
//                    format: '#,##0.##',
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmtAfterTax')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            {
//                dataField: "docDiscountType",
//                editorType: "dxNumberBox",
//                editorOptions: {
//                    format: '#,##0.##',
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:DocDiscountType')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            // row 3
//            {
//                dataField: "linkedSFAId",
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:LinkedSFA')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            {
//                dataField: "employeeId",
//                editorType: 'dxSelectBox',
//                editorOptions: {
//                    dataSource: {
//                        store: employeeProfileStore,
//                        paginate: true,
//                        pageSize: pageSizeForLookup
//                    },
//                    displayExpr: 'code',
//                    valueExpr: 'id'
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:Employee')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            {
//                dataField: "docDiscountPerc",
//                editorType: "dxNumberBox",
//                editorOptions: {
//                    format: '#,##0.##',
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:DocDiscountPerc')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            {
//                dataField: "docDiscountAmt",
//                editorType: "dxNumberBox",
//                editorOptions: {
//                    format: '#,##0.##',
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:DocDiscountAmt')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            // row 4
//            {
//                dataField: "remark",
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:Remark')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            {
//                dataField: "routeId",
//                editorType: "dxSelectBox",
//                editorOptions: {
//                    dataSource: {
//                        store: salesOrgHierarchyStore,
//                        filter: ["isRoute", "=", true],
//                        paginate: true,
//                        pageSize: pageSizeForLookup
//                    },
//                    displayExpr: 'name',
//                    valueExpr: 'id'
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:Route')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            {
//                dataField: "docTotalAmt",
//                editorType: "dxNumberBox",
//                editorOptions: {
//                    format: '#,##0.##',
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmt')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            {
//                dataField: "docTotalAmtAfterTax",
//                editorType: "dxNumberBox",
//                editorOptions: {
//                    format: '#,##0.##',
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmtAfterTax')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            // row 5
//            {
//                dataField: "requestDate",
//                editorType: 'dxDateBox',
//                editorOptions: {
//                    type: 'datetime',
//                    value: new Date(),
//                    disabled: true,
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:RequestDate')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            },
//            {
//                dataField: "docSource",
//                editorType: "dxSelectBox",
//                editorOptions: {
//                    dataSource: docSourceStore,
//                    displayExpr: 'text',
//                    valueExpr: 'id'
//                },
//                label: {
//                    visible: false,
//                    text: l('EntityFieldName:OrderService:SalesRequest:DocSource')
//                },
//                validationRules: [{
//                    type: 'required',
//                }]
//            }
//        ]
//    }).dxForm('instance');

//    const salesRequestDetailsContainer = $('#salesRequestDetailsContainer').dxDataGrid({
//        dataSource: [],// salesRequestStore,
//        keyExpr: 'id',
//        remoteOperations: false,
//        cacheEnabled: true,
//        export: {
//            enabled: true,
//            // allowExportSelectedData: true,
//        },
//        onExporting(e) {
//            const workbook = new ExcelJS.Workbook();
//            const worksheet = workbook.addWorksheet('SalesRequestDetails');

//            DevExpress.excelExporter.exportDataGrid({
//                component: e.component,
//                worksheet,
//                autoFilterEnabled: true,
//            }).then(() => {
//                workbook.xlsx.writeBuffer().then((buffer) => {
//                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'SalesRequestDetails.xlsx');
//                });
//            });
//            e.cancel = true;
//        },
//        showRowLines: true,
//        showBorders: true,
//        focusedRowEnabled: true,
//        allowColumnReordering: true,
//        allowColumnResizing: true,
//        columnResizingMode: 'widget',
//        columnMinWidth: 50,
//        columnAutoWidth: true,
//        columnChooser: {
//            enabled: true,
//            mode: "select"
//        },
//        columnFixing: {
//            enabled: true,
//        },
//        filterRow: {
//            visible: true,
//        },
//        groupPanel: {
//            visible: true,
//        },
//        headerFilter: {
//            visible: true,
//        },
//        rowAlternationEnabled: true,
//        searchPanel: {
//            visible: true
//        },
//        //scrolling: {
//        //    mode: 'standard'
//        //},
//        stateStoring: { //save state in localStorage
//            enabled: true,
//            type: 'localStorage',
//            //storageKey: 'salesRequestDetailsContainer',
//        },
//        paging: {
//            enabled: true,
//            pageSize: pageSize
//        },
//        pager: {
//            visible: true,
//            showPageSizeSelector: true,
//            allowedPageSizes: allowedPageSizes,
//            showInfo: true,
//            showNavigationButtons: true
//        },
//        onEditorPreparing: function (e) {
//            if (e.dataField == "itemId" && e.parentType == "dataRow") {
//                e.editorOptions.onValueChanged = function (arg) {
//                    e.setValue(arg.value);
//                    console.log(arg, e)
//                    //if (arg.value == 1) {
//                    //    $('div.fieldExpiredType > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', false);
//                    //    $('div.fieldExpiredValue > div > div.dx-show-invalid-badge').removeClass('dx-state-disabled');
//                    //    $('div.fieldExpiredValue > div > div.dx-show-invalid-badge > div.dx-texteditor-container > div.dx-texteditor-input-container > input').removeAttr('disabled');
//                    //    $('div.fieldIssueMethod > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', false);
//                    //}
//                    //else if (arg.value == 0) {
//                    //    $('div.fieldExpiredType > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', true);
//                    //    $('div.fieldExpiredValue > div > div.dx-show-invalid-badge').addClass('dx-state-disabled');
//                    //    $('div.fieldIssueMethod > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', true);
//                    //}
//                    //else {
//                    //    $('div.fieldExpiredType > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', true);
//                    //    $('div.fieldExpiredValue > div > div.dx-show-invalid-badge').addClass('dx-state-disabled');
//                    //    $('div.fieldIssueMethod > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', false);
//                    //}
//                    //e.component.cellValue(e.row.rowIndex, "FirstName", "AnotherID");  
//                }
//            }
//        },
//        toolbar: {
//            items: [
//                "groupPanel",
//                'addRowButton',
//                'columnChooserButton',
//                "exportButton",
//                {
//                    location: 'after',
//                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
//                    onClick() {
//                        //todo
//                    },
//                },
//                "searchPanel"
//            ],
//        },
//        editing: {
//            mode: 'row',
//            allowAdding: true,
//            allowUpdating: true,
//            allowDeleting: true,
//            useIcons: true,
//            texts: {
//                editRow: l("Edit"),
//                deleteRow: l("Delete"),
//                confirmDeleteMessage: l("DeleteConfirmationMessage")
//            }
//        },
//        columns: [
//            {
//                caption: l("Actions"),
//                type: 'buttons',
//                width: 120,
//                buttons: ['edit', 'delete'],
//                fixedPosition: 'left'
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:Item'),
//                dataField: 'itemId',
//                lookup: {
//                    dataSource() {
//                        return {
//                            store: itemStore,
//                            paginate: true,
//                            pageSize: pageSizeForLookup
//                        };
//                    },
//                    displayExpr: "name",
//                    valueExpr: "id",
//                    //onValueChanged: function (e) {
//                    //    console.log(e)
//                    //    const newValue = e.value;
//                    //    var dxUomId = $('input[name=uomId]').closest('.dx-selectbox').data('dxSelectBox');
//                    //    dxUomId.option('dataSource', new DevExpress.data.DataSource({
//                    //        store: customerAssignmentStore,
//                    //        filter: ["uomGroup.id", "=", newValue],
//                    //        paginate: true,
//                    //        pageSize: pageSizeForLookup
//                    //    }));
//                    //    dxUomId.reset();
//                    //}
//                },
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:UOM'),
//                dataField: 'uomId',
//                lookup: {
//                    dataSource() {
//                        return {
//                            store: uOMGroupDetailStore,
//                            paginate: true,
//                            pageSize: pageSizeForLookup
//                        };
//                    },
//                    displayExpr: "name",
//                    valueExpr: "id"
//                },
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:Qty'),
//                dataField: 'qty',
//                dataType: 'number',
//                editorOptions: {
//                    format: '#',
//                },
//                validationRules: [
//                    {
//                        type: 'required'
//                    },
//                    {
//                        type: 'pattern',
//                        message: 'Quantity can not be Negative!',
//                        pattern: /^\d*[1-9]\d*$/,
//                    }
//                ]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:Price'),
//                dataField: 'price',
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:LineAmt'),
//                dataField: 'lineAmt',
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountPerc'),
//                dataField: 'discountPerc',
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:LineDiscountAmt'),
//                dataField: 'lineDiscountAmt',
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:TaxRate'),
//                dataField: 'taxRate',
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:LineAmtAfterTax'),
//                dataField: 'lineAmtAfterTax',
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:Warehouse'),
//                dataField: 'warehouseId',
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:WarehouseLocation'),
//                dataField: 'warehouseLocationId',
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:TransactionType'),
//                dataField: 'transactionType',
//                lookup: {
//                    dataSource: transactionTypeStore,
//                    displayExpr: 'text',
//                    valueExpr: 'id'
//                },
//                validationRules: [{ type: 'required' }]
//            },



//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:VAT'),
//                dataField: 'vatId',
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:PriceAfterTax'),
//                dataField: 'priceAfterTax',
//                validationRules: [{ type: 'required' }]
//            },

//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:ProcessQty'),
//                dataField: 'processQty',
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:OpenQty'),
//                dataField: 'openQty',
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:ConfirmQty'),
//                dataField: 'confirmQty',
//                validationRules: [{ type: 'required' }]
//            },

//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:IsFree'),
//                dataField: 'isFree',
//                dataType: 'boolean',
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:Promotion'),
//                dataField: 'promotionId',
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountType'),
//                dataField: 'discountType',
//                lookup: {
//                    dataSource: discountTypeStore,
//                    displayExpr: 'text',
//                    valueExpr: 'id'
//                },
//                validationRules: [{ type: 'required' }]
//            },
//            {
//                caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountAmt'),
//                dataField: 'discountAmt',
//                validationRules: [{ type: 'required' }]
//            },
//        ]
//    }).dxDataGrid("instance");

//    /****button*****/
//    $("#CloseButton").click(function (e) {
//        e.preventDefault();

//        abp.message.confirm(l('ConfirmationMessage.UnSavedAndLeave'), l('ConfirmationMessage.UnSavedAndLeaveTitle')).then(function (confirmed) {
//            if (confirmed) {
//                window.close();
//            }
//        });
//    });

//    $("#SaveButton").click(function (e) {
//        e.preventDefault();

//        //if (!salesRequestForm.validate().isValid) {
//        //    abp.message.warn(l('WarnMessage.RequiredField'));
//        //    return;
//        //}

//        var salesRequest = salesRequestForm.option('formData');
//        var salesRequestDetails = salesRequestDetailsContainer.getDataSource().items();

//        var salesRequestObject = {
//            header: {
//                companyId: salesRequest.companyId,
//                docNbr: salesRequest.docNbr,
//                docType: salesRequest.docType,
//                requestDate: salesRequest.requestDate,
//                remark: salesRequest.remark,
//                businessPartnerId: salesRequest.businessPartnerId,
//                routeId: salesRequest.routeId,
//                employeeId: salesRequest.employeeId,
//                linkedSFAId: salesRequest.linkedSFAId,
//                docTotalLineDiscountAmt: salesRequest.docTotalLineDiscountAmt,
//                docTotalLineAmt: salesRequest.docTotalLineAmt,
//                docTotalLineAmtAfterTax: salesRequest.docTotalLineAmtAfterTax,
//                docDiscountType: salesRequest.docDiscountType,
//                docDiscountPerc: salesRequest.docDiscountPerc,
//                docDiscountAmt: salesRequest.docDiscountAmt,
//                docTotalAmt: salesRequest.docTotalAmt,
//                docTotalAmtAfterTax: salesRequest.docTotalAmtAfterTax,
//                docSource: salesRequest.docSource
//            },
//            details: salesRequestDetails
//        };

//        console.log(salesRequestObject);

//        salesRequestService.createDoc(salesRequestObject, { contentType: "application/json" })
//            .done(result => {
//                abp.message.success(l('Congratulations'));
//                console.log(result);
//            })
//    });

//    /****function*****/
//    function LoadData() {
//        SalesRequestModel = JSON.parse(sessionStorage.getItem("SalesRequest"));
//        if (SalesRequestModel == null) {
//            stateMode = 'add';
//        } else {
//            stateMode = 'edit';
//            salesRequesIdFilter = SalesRequestModel.id;
//            salesRequestForm.option('formData', SalesRequestModel);
//        }
//    }

//    LoadData();
//});