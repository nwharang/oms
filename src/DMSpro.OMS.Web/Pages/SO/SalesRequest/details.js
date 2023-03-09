var SalesRequestHeaderModel = null;
var SalesRequestDetailsModel = [];
var data = {};
var customerList = {};
var priceList = {};
var uomGroupList = {};
var itemList = {};
var uOMList = {};
var itemGroupList = {};
var vatList = {};
const companyId = '29d43197-c742-90b8-65d8-3a099166f987';
var needSummaryUpdate = false;

// get data api getInfoForSo in item service
var itemService = window.dMSpro.oMS.mdmService.controllers.items.item;
let lastCallDates = Common.getLastAPICallDates();
itemService.getInfoForSO(companyId,
    lastCallDates.itemInfo, lastCallDates.customerInfo,
    lastCallDates.routeInfo, lastCallDates.vendorInfo)
    .done(async result => {
        let resultJson = await Common.parseJSON(result);
        let data = Common.processInitData(resultJson);
        console.log(data);
        convertResultToJson(data);
        loadControl();
    });

var loadControl = function () {
    var l = abp.localization.getResource("OMS");
    var salesRequestService = window.dMSpro.oMS.orderService.controllers.salesRequests.salesRequest;
    var uOMService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;
    var vATService = window.dMSpro.oMS.mdmService.controllers.vATs.vAT;

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

    // Sales Request herader form
    const frmSalesRequestDetails = $('#frmSalesRequestDetails').dxForm({
        formData: {
            linkedSFAId: SalesRequestHeaderModel ? SalesRequestHeaderModel.linkedSFAId : '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        },
        labelMode: "floating",
        colCount: 3,
        items: [
            {
                // col 1
                itemType: 'group',
                items: [
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
                    },
                    {
                        dataField: "remark",
                        label: {
                            visible: false,
                            text: l('EntityFieldName:OrderService:SalesRequest:Remark')
                        }
                    },
                    {
                        dataField: "businessPartnerId",
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            dataSource: customerList,
                            displayExpr: 'name',
                            valueExpr: 'id',
                            onValueChanged: function (e) {
                                $('.addNewButton').data('dxButton').option('disabled', false);
                                $('.openItemsPopupButton').data('dxButton').option('disabled', false);
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
                ]
            },
            {
                // col 2
                itemType: 'group',
                items: [
                    {
                        dataField: "docTotalLineDiscountAmt",
                        editorType: "dxNumberBox",
                        editorOptions: {
                            format: '#,##0.##',
                            disabled: true
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
                            disabled: true,
                            onValueChanged: function (e) {
                                calculatorDocTotal();
                            }
                        },
                        label: {
                            visible: false,
                            text: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmt')
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
                            disabled: true,
                            onValueChanged: function (e) {
                                calculatorDocTotal();
                            }
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
                        dataField: "docTotalAmt",
                        editorType: "dxNumberBox",
                        editorOptions: {
                            format: '#,##0.##',
                            disabled: true
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
                            disabled: true
                        },
                        label: {
                            visible: false,
                            text: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmtAfterTax')
                        },
                        validationRules: [{
                            type: 'required',
                        }]
                    }
                ]
            },
            {
                // col 3
                itemType: 'group',
                items: [
                    {
                        dataField: "docDiscountType",
                        editorType: "dxSelectBox",
                        editorOptions: {
                            dataSource: discountTypeStore,
                            displayExpr: 'text',
                            valueExpr: 'id',
                            value: 0,
                            onValueChanged: function (e) {
                                calculatorDocTotal()
                            }
                        },
                        label: {
                            visible: false,
                            text: l('EntityFieldName:OrderService:SalesRequest:DocDiscountType')
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
                            onValueChanged: function (e) {
                                calculatorDocTotal();
                            }
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
                            onValueChanged: function (e) {
                                calculatorDocTotal();
                            }
                        },
                        label: {
                            visible: false,
                            text: l('EntityFieldName:OrderService:SalesRequest:DocDiscountAmt')
                        },
                        validationRules: [{
                            type: 'required',
                        }]
                    }
                ]
            },
        ]
    }).dxForm('instance');

    // Sales Request details grid
    const dgSalesRequestDetails = $('#dgSalesRequestDetails').dxDataGrid(
        jQuery.extend(dxDataGridConfiguration, {
            dataSource: SalesRequestDetailsModel,
            onInitialized: function (e) {
                //todo
            },
            onInitNewRow: function (e) {
                e.data.qty = 1;
                e.data.discountAmt = 0;
                e.data.discountPerc = 0;
                e.data.discountType = 0;
                e.data.transactionType = 0;
            },
            onSaved: function (e) {
                var sumDiscountAmt = dgSalesRequestDetails.getTotalSummaryValue('discountAmt');
                var sumLineAmt = dgSalesRequestDetails.getTotalSummaryValue('lineAmt');
                var sumLineAmtAfterTax = dgSalesRequestDetails.getTotalSummaryValue('lineAmtAfterTax');
                frmSalesRequestDetails.updateData('docTotalLineDiscountAmt', sumDiscountAmt);
                frmSalesRequestDetails.updateData('docTotalLineAmt', sumLineAmt);
                frmSalesRequestDetails.updateData('docTotalLineAmtAfterTax', sumLineAmtAfterTax);
            },
            onContentReady: function (e) {
                var sumDiscountAmt = e.component.getTotalSummaryValue('discountAmt');
                var sumLineAmt = e.component.getTotalSummaryValue('lineAmt');
                var sumLineAmtAfterTax = e.component.getTotalSummaryValue('lineAmtAfterTax');
                frmSalesRequestDetails.updateData('docTotalLineDiscountAmt', sumDiscountAmt);
                frmSalesRequestDetails.updateData('docTotalLineAmt', sumLineAmt);
                frmSalesRequestDetails.updateData('docTotalLineAmtAfterTax', sumLineAmtAfterTax);

            },
            onEditorPreparing: function (e) {
                if (e.parentType === "dataRow" && (e.dataField === "vatId" || e.dataField === "priceAfterTax" || e.dataField === "discountAmt" || e.dataField === "lineAmt" || e.dataField === "lineAmtAfterTax")) {
                    e.editorOptions.disabled = true;
                }
            },
            editing: {
                mode: 'cell',
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
                    fixed: true,
                    fixedPosition: 'left',
                    lookup: {
                        dataSource: itemList,
                        displayExpr: "name",
                        valueExpr: "id",

                    },
                    setCellValue: function (newData, value, currentData) {
                        var selectedItem = itemList.filter(i => i.id == value)[0];
                        var vat = vatList.filter(i => i.id == selectedItem.vatId)[0];

                        newData.itemId = value;
                        newData.uomGroupId = selectedItem.uomGroupId;
                        newData.vatId = selectedItem.vatId;
                        newData.taxRate = vat.rate;
                        newData.uomId = selectedItem.salesUomId;
                        newData.price = selectedItem.basePrice;
                        newData.priceAfterTax = newData.price + (newData.price * newData.taxRate) / 100;
                        newData.lineAmtAfterTax = newData.priceAfterTax;
                        newData.lineAmt = newData.price;
                    },
                    validationRules: [{ type: 'required', message: '' }],
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:UOM'),
                    dataField: 'uomId',
                    lookup: {
                        dataSource(options) {
                            if (options.data != null) {
                                var uomGroupId = options.data.uomGroupId;
                                var uomGroup = uomGroupList.find(x => x = uomGroupId);
                                var uOMListOfItem = [];
                                uomGroup.forEach(x => {
                                    var uOM = uOMList.filter(y => y.id == x)[0];
                                    uOMListOfItem.push(uOM);
                                })
                                return {
                                    store: uOMListOfItem,
                                    paginate: true,
                                    pageSize: pageSizeForLookup
                                };
                            } else {
                                return {
                                    store: uOMList,
                                    paginate: true,
                                    pageSize: pageSizeForLookup
                                };
                            }
                        },
                        displayExpr: "name",
                        valueExpr: "id"
                    },
                    setCellValue: function (newData, value, currentData) {
                        var formSalesRequest = $('#frmSalesRequestDetails').data('dxForm');
                        var customerId = formSalesRequest.getEditor('businessPartnerId').option('value');
                        var customer = customerList.filter(x => x.id == customerId)[0];
                        var price = priceList.find(x => x = customer.priceListId + '|' + currentData.itemId + '|' + value);
                        var priceAfterTax = price + (price * currentData.taxRate) / 100;
                        var lineAmtAfterTax = priceAfterTax;
                        var lineAmt = price;

                        newData.uomId = value;
                        newData.price = price;
                        newData.priceAfterTax = priceAfterTax;
                        newData.lineAmtAfterTax = lineAmtAfterTax;
                        newData.lineAmt = lineAmt;

                        needSummaryUpdate = true;
                    },
                    //editorOptions:{
                    //    onValueChanged: function (e) {
                    //        var rows = dgSalesRequestDetails.getVisibleRows();
                    //        var tr = e.element.closest('tr');  
                    //        var dataRow = rows[tr.index()].data;
                    //        var formSalesRequest = $('#frmSalesRequestDetails').data('dxForm');
                    //        var customerId = formSalesRequest.getEditor('businessPartnerId').option('value');
                    //        var customer = customerList.filter(x => x.id == customerId)[0];
                    //        var price = priceList.find(x => x = customer.priceListId + '|' + dataRow.itemId + '|' + e.value);
                    //        var priceAfterTax = price + (price * dataRow.taxRate) / 100;
                    //        var lineAmtAfterTax = priceAfterTax;
                    //        var lineAmt = price;

                    //    }
                    //},
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
                    format: {
                        type: "currency",
                        currency: "VND"
                    },
                    setCellValue: function (newData, value, currentData) {
                        newData.price = value;
                        newData.priceAfterTax = value + (value * currentData.taxRate) / 100;
                        newData.lineAmt = value * currentData.qty - currentData.discountAmt;
                        newData.lineAmtAfterTax = newData.priceAfterTax * currentData.qty - currentData.discountAmt;
                    },
                    validationRules: [{ type: 'required', message: '' }],
                    width: 150,
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:VAT'),
                    dataField: 'vatId',
                    //calculateDisplayValue: "vat.name",
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
                    validationRules: [{ type: 'required', message: '' }]
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:PriceAfterTax'),
                    dataField: 'priceAfterTax',
                    dataType: 'number',
                    editorOptions: {
                        format: '#,##0.##',
                    },
                    format: {
                        type: "currency",
                        currency: "VND"
                    },
                    validationRules: [{ type: 'required', message: '' }],
                    width: 150,
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:Qty'),
                    dataField: 'qty',
                    dataType: 'number',
                    setCellValue: function (newData, value, currentData) {
                        newData.qty = value;
                        newData.lineAmt = value * currentData.price - currentData.discountAmt;
                    },
                    value: 0,
                    validationRules: [
                        {
                            type: 'required', message: ''
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
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:IsFree'),
                    dataField: 'isFree',
                    dataType: 'boolean',
                    width: 120
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:Promotion'),
                    dataField: 'promotionId',
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
                    setCellValue: function (newData, value, currentData) {
                        newData.discountType = value;
                        // get price
                        //var d = new $.Deferred();
                        //priceListDetailsService.getListDevextremes({ filter: JSON.stringify([['itemId', '=', value], 'and', ['item.uomGroupId', '=', selectedItem.uomGroupId], 'and', ['priceList.id', '=', pricelistId]]) })
                        //    .done(result => {
                        //        d.resolve(
                        //            newData.price = result.data[0] != undefined ? result.data[0].price : 0,
                        //            newData.priceAfterTax = newData.price + (newData.price * newData.taxRate) / 100,
                        //            newData.lineAmtAfterTax = newData.priceAfterTax,
                        //            newData.lineAmt = newData.price,
                        //        );
                        //    });
                        //return d.promise();
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
                    setCellValue: function (newData, value, currentData) {
                        newData.discountPerc = value;
                        switch (currentData.discountType) {
                            case 1:
                                newData.discountAmt = currentData.price * value;
                                newData.lineAmt = currentData.qty * currentData.price - newData.discountAmt;
                                newData.lineAmtAfterTax = currentData.priceAfterTax * currentData.qty - newData.discountAmt;
                                break;
                            case 2:
                                newData.discountAmt = currentData.priceAfterTax * value;
                                newData.lineAmt = currentData.qty * currentData.price - newData.discountAmt;
                                newData.lineAmtAfterTax = currentData.priceAfterTax * currentData.qty - newData.discountAmt;
                                break;
                            default:
                                newData.discountPerc = 0;
                                newData.discountAmt = 0;
                        }
                    },
                    value: 0,
                    validationRules: [{ type: 'required' }],
                    width: 150
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountAmt'),
                    dataField: 'discountAmt',
                    dataType: 'number',
                    format: ",##0.###",
                    //validationRules: [{ type: 'required', message: '' }],
                    width: 150
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:LineAmt'),
                    dataField: 'lineAmt',
                    dataType: 'number',
                    format: ",##0.###",
                    // validationRules: [{ type: 'required', message: '' }],
                    width: 150
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:LineAmtAfterTax'),
                    dataField: 'lineAmtAfterTax',
                    dataType: 'number',
                    format: ",##0.###",
                    // validationRules: [{ type: 'required', message: '' }],
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
                    validationRules: [{ type: 'required', message: '' }],
                    width: 150
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:Warehouse'),
                    dataField: 'warehouseId',
                    //validationRules: [{ type: 'required' }],
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:WarehouseLocation'),
                    dataField: 'warehouseLocationId',
                    //validationRules: [{ type: 'required' }],
                    width: 200
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
                //{
                //    caption: l('EntityFieldName:MDMService:UOMGroupDetail:BaseUomId'),
                //    dataField: 'baseUomId',
                //    calculateDisplayValue: "baseUOM.name",
                //    lookup: {
                //        dataSource(options) {
                //            return {
                //                store: Store,
                //                filter: [["uomGroup.id", "=", options.data != null ? options.data.uomGroupId : null]],
                //                paginate: true,
                //                pageSize: pageSizeForLookup
                //            };
                //        },
                //        displayExpr: "baseUOM.name",
                //        valueExpr: "baseUOM.id"
                //    },
                //    setCellValue: function (newData, value, currentData) {
                //        newData.baseUomId = value;

                //        var d = new $.Deferred();

                //        uOMGroupDetailService.getListDevextremes({ filter: JSON.stringify(['uomGroupId', '=', currentData.uomGroupId]) })
                //            .done(result => {
                //                d.resolve(
                //                    newData.uomRate = result.data[0].baseQty
                //                );
                //            });

                //        return d.promise();
                //    },
                //    width: 200
                //},
                //{
                //    //caption: l('EntityFieldName:OrderService:SalesRequestDetails:SfaOrderBaseQty'),
                //    caption: l('SfaOrderBaseQty'),
                //    dataField: 'sfaOrderBaseQty',
                //    dataType: 'number',
                //    value: 0,
                //    width: 150
                //},
                //{
                //    //caption: l('EntityFieldName:OrderService:SalesRequestDetails:BaseQty'),
                //    caption: l('BaseQty'),
                //    dataField: 'baseQty',
                //    dataType: 'number',
                //    value: 0,
                //    width: 150
                //},
            ],
            summary: {
                totalItems: [
                    {
                        column: "discountAmt",
                        summaryType: "sum",
                        alignment: "left",
                        valueFormat: ",##0.###",
                        customizeText: function (data) {
                            return data.valueText;
                        },
                    },
                    {
                        column: "lineAmt",
                        summaryType: "sum",
                        alignment: "left",
                        valueFormat: ",##0.###",
                        customizeText: function (data) {
                            return data.valueText;
                        },
                    },
                    {
                        column: "lineAmtAfterTax",
                        summaryType: "sum",
                        alignment: "left",
                        valueFormat: ",##0.###",
                        customizeText: function (data) {
                            return data.valueText;
                        },
                    }
                ]
            }
        })).dxDataGrid("instance");

    initChooseItemsPopup(itemList);

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

        var salesRequestHeader = frmSalesRequestDetails.option('formData');
        var salesRequestDetails = dgSalesRequestDetails.getDataSource().items();

        var salesRequestObject = {
            header: salesRequestHeader,
            details: salesRequestDetails
        };

        console.log("Save data: ", salesRequestObject);

        salesRequestService.createDoc(salesRequestObject, { contentType: "application/json" })
            .done(result => {
                abp.message.success(l('Congratulations'));
                console.log(result);
            })
    });

    initImportPopup('', 'SalesRequest_Template', 'dgSalesRequestDetails');

    function calculatorDocTotal() {
        var formSalesRequest = $('#frmSalesRequestDetails').data('dxForm');
        var docTotalLineDiscountAmt = formSalesRequest.getEditor('docTotalLineDiscountAmt').option('value');
        var docTotalLineAmt = formSalesRequest.getEditor('docTotalLineAmt').option('value');
        var docTotalLineAmtAfterTax = formSalesRequest.getEditor('docTotalLineAmtAfterTax').option('value');
        var docDiscountType = formSalesRequest.getEditor('docDiscountType').option('value');
        var docDiscountPerc = (formSalesRequest.getEditor('docDiscountPerc').option('value')) / 100;
        var docDiscountAmt = formSalesRequest.getEditor('docDiscountAmt').option('value');
        if (docDiscountType == 0) {
            formSalesRequest.updateData('docDiscountAmt', 0);
            formSalesRequest.getEditor('docDiscountAmt').option('disabled', false);
            formSalesRequest.updateData('docTotalAmt', docTotalLineAmt - docDiscountAmt);
            formSalesRequest.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - docDiscountAmt);
        }
        if (docDiscountType == 1) {
            var _docDiscountAmt = docTotalLineAmt * docDiscountPerc;
            frmSalesRequestDetails.updateData('docDiscountAmt', _docDiscountAmt);
            formSalesRequest.getEditor('docDiscountAmt').option('disabled', true);
            formSalesRequest.updateData('docTotalAmt', docTotalLineAmt - _docDiscountAmt);
            formSalesRequest.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - _docDiscountAmt);
        }
        if (docDiscountType == 2) {
            var _docDiscountAmt = docTotalLineAmtAfterTax * docDiscountPerc;
            frmSalesRequestDetails.updateData('docDiscountAmt', _docDiscountAmt);
            formSalesRequest.getEditor('docDiscountAmt').option('disabled', true);
            formSalesRequest.updateData('docTotalAmt', docTotalLineAmt - _docDiscountAmt);
            formSalesRequest.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - _docDiscountAmt);
        }

        //var formSalesRequest = $('#frmSalesRequestDetails').data('dxForm');
        //var docTotalLineAmt = formSalesRequest.getEditor('docTotalLineAmt').option('value');
        //var docDiscountPerc = formSalesRequest.getEditor('docDiscountPerc').option('value');
        //var docTotalLineAmtAfterTax = formSalesRequest.getEditor('docTotalLineAmtAfterTax').option('value');
        //var docDiscountAmt = 0;
        //if (e.value == 0) {
        //    docDiscountAmt = 0;
        //    frmSalesRequestDetails.updateData('docDiscountAmt', docDiscountAmt);
        //    formSalesRequest.getEditor('docDiscountAmt').option('disabled', false);
        //    formSalesRequest.updateData('docTotalAmt', docTotalLineAmt - docDiscountAmt);
        //    formSalesRequest.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - docDiscountAmt);
        //}
        //if (e.value == 1) {
        //    docDiscountAmt = docTotalLineAmt * docDiscountPerc;
        //    frmSalesRequestDetails.updateData('docDiscountAmt', docDiscountAmt);
        //    formSalesRequest.getEditor('docDiscountAmt').option('disabled', true);
        //    formSalesRequest.updateData('docTotalAmt', docTotalLineAmt - docDiscountAmt);
        //    formSalesRequest.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - docDiscountAmt);
        //}
        //if (e.value == 2) {
        //    docDiscountAmt = docTotalLineAmtAfterTax * docDiscountPerc;
        //    frmSalesRequestDetails.updateData('docDiscountAmt', docDiscountAmt);
        //    formSalesRequest.getEditor('docDiscountAmt').option('disabled', true);
        //    formSalesRequest.updateData('docTotalAmt', docTotalLineAmt - docDiscountAmt);
        //    formSalesRequest.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - docDiscountAmt);
        //}

    }
};

function appendSelectedItems(selectedItems) {
    selectedItems.forEach(u => {
        SalesRequestDetailsModel.unshift({
            id: u.id,
            itemId: u.id,
            vatId: u.vatId,
            taxRate: vatList.filter(x => x.id == u.vatId)[0].rate,
            uomId: u.salesUomId,
            price: u.basePrice,
            qty: parseInt(u.qty),
            priceAfterTax: u.basePrice + (u.basePrice * vatList.filter(x => x.id == u.vatId)[0].rate) / 100,
            lineAmtAfterTax: u.basePrice + (u.basePrice * vatList.filter(x => x.id == u.vatId)[0].rate) / 100,
            lineAmt: u.basePrice,
            discountAmt: 0,
            discountPerc: 0,
            discountType: 0,
            transactionType: 0,
            uomGroupId: u.uomGroupId
        });
    });
    $('#dgSalesRequestDetails').data('dxDataGrid').refresh();
}
function convertResultToJson(data) {
    // get customer list
    customerList = Object.keys(data.customerInfo.customer).map(function (key) {
        return data.customerInfo.customer[key];
    });
    // get price list
    priceList = Object.keys(data.customerInfo.price).map(function (key) {
        return data.customerInfo.price[key];
    });
    // get item list
    itemList = Object.keys(data.itemInfo.item).map(function (key) {
        data.itemInfo.item[key].qty = 1;
        return data.itemInfo.item[key];
    });
    // get UOM group list
    uomGroupList = Object.keys(data.itemInfo.uomGroup).map(function (key) {
        return data.itemInfo.uomGroup[key];
    });
    // get UOM list
    uOMList = Object.keys(data.itemInfo.uom).map(function (key) {
        return data.itemInfo.uom[key];
    });
    // get item group list
    itemGroupList = Object.keys(data.itemInfo.itemGroup).map(function (key) {
        return data.itemInfo.itemGroup[key];
    });
    // get vat list
    vatList = Object.keys(data.itemInfo.vat).map(function (key) {
        return data.itemInfo.vat[key];
    });
    //
};