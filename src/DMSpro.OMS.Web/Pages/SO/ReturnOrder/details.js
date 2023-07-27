$(async function () {
    var returnOrderHeaderId = sessionStorage.getItem('returnOrderHeaderId');
    var returnOrderDetailModel = [];

    const defaultEmptyModel = {
        itemId: null,
        vatId: null,
        taxRate: null,
        uomId: null,
        price: 0,
        qty: 1,
        priceAfterTax: 0,
        lineAmtAfterTax: 0,
        lineAmt: 0,
        discountAmt: 0,
        discountPerc: 0,
        discountType: 0,
        transactionType: 0,
        uomGroupId: null
    }

    let vatList = {};
    let company = await Common.getCurrentCompany();
    if (company != null)
        companyId = company.id;
    else
        companyId = '29d43197-c742-90b8-65d8-3a099166f987';
    // get data api getInfoForSo in item service
    var itemService = window.dMSpro.oMS.mdmService.controllers.salesOrders.salesOrder;

    itemService.getSOInfo(companyId, new Date(), null)
        .done(async result => {
            let resultJson = await Common.parseJSON(result);
            let data = Common.processInitData(resultJson);
            console.log(data);
            addListToData(data);
            loadControl(data);
        });

    var l = abp.localization.getResource("OMS");
    var returnOrderService = window.dMSpro.oMS.orderService.controllers.returnOrders.returnOrder;


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
    var loadControl = function (data) {
        $('#resizable').dxResizable({
            minHeight: 120,
            handles: "bottom"
        }).dxResizable('instance');

        // Sales Request herader form
        const frmReturnOrderDetails = $('#frmReturnOrderDetails').dxForm({
            labelMode: "floating",
            colCount: 3,
            customizeItem: function (item) {
                item.editorOptions = {
                    readOnly: true
                }
            },
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
                                type: 'required', message: ''
                            }]
                        },
                        {
                            dataField: "docType",
                            editorType: "dxSelectBox",
                            editorOptions: {
                                dataSource: docTypeStore,
                                displayExpr: 'text',
                                valueExpr: 'id',
                                showClearButton: true,
                                value: 0
                            },
                            label: {
                                visible: false,
                                text: l('EntityFieldName:OrderService:SalesRequest:DocType')
                            },
                            validationRules: [{
                                type: 'required', message: ''
                            }]
                        },
                        {
                            dataField: "docSource",
                            editorType: "dxSelectBox",
                            editorOptions: {
                                dataSource: docSourceStore,
                                displayExpr: 'text',
                                valueExpr: 'id',
                                showClearButton: true,
                                value: 0
                            },
                            label: {
                                visible: false,
                                text: l('EntityFieldName:OrderService:SalesRequest:DocSource')
                            },
                            validationRules: [{
                                type: 'required', message: ''
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
                                dataSource: data.customerList,
                                displayExpr: 'name',
                                valueExpr: 'id',
                                showClearButton: true,
                                //onValueChanged: function (e) {
                                //    $('.openItemsPopupButton').data('dxButton').option('disabled', false);
                                //    returnOrderDetailModel.unshift(JSON.parse(JSON.stringify(defaultEmptyModel)));
                                //    dgReturnOrderDetails.refresh();
                                //}
                            },
                            label: {
                                visible: false,
                                text: l('EntityFieldName:OrderService:SalesRequest:BusinessPartner')
                            },
                            validationRules: [{
                                type: 'required', message: ''
                            }]
                        },
                        {
                            dataField: "requestDate",
                            editorType: 'dxDateBox',
                            editorOptions: {
                                type: 'datetime',
                                value: new Date(),
                                displayFormat: "dd/MM/yyyy HH:mm",
                            },
                            label: {
                                visible: false,
                                text: l('EntityFieldName:OrderService:SalesRequest:RequestDate')
                            },
                            validationRules: [{
                                type: 'required', message: ''
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
                                type: 'required', message: ''
                            }]
                        },
                        {
                            dataField: "docTotalLineAmt",
                            editorType: "dxNumberBox",
                            editorOptions: {
                                format: '#,##0.##',
                                disabled: true,
                            },
                            label: {
                                visible: false,
                                text: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmt')
                            },
                            validationRules: [{
                                type: 'required', message: ''
                            }]
                        },
                        {
                            dataField: "docTotalLineAmtAfterTax",
                            editorType: "dxNumberBox",
                            editorOptions: {
                                format: '#,##0.##',
                                disabled: true,
                            },
                            label: {
                                visible: false,
                                text: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmtAfterTax')
                            },
                            validationRules: [{
                                type: 'required', message: ''
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
                                type: 'required', message: ''
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
                                type: 'required', message: ''
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
                                showClearButton: true,
                                onValueChanged: function (e) {
                                    calculatorDocTotal()
                                }
                            },
                            label: {
                                visible: false,
                                text: l('EntityFieldName:OrderService:SalesRequest:DocDiscountType')
                            },
                            validationRules: [{
                                type: 'required', message: ''
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
                                type: 'required', message: ''
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
                                type: 'required', message: ''
                            }]
                        }
                    ]
                },
            ]
        }).dxForm('instance');

        // Sales Request details grid
        const dgReturnOrderDetails = $('#dgReturnOrderDetails').dxDataGrid(
            jQuery.extend(dxDataGridConfiguration, {
                dataSource: returnOrderDetailModel,
                onInitialized: function (e) {
                    //todo
                },
                onInitNewRow: function (e) {
                    e.data.qty = 1;
                    e.data.discountAmt = 0;
                    e.data.discountPerc = 0;
                    e.data.discountType = 0;
                    e.data.transactionType = 0;
                    e.data.price = 0;
                },
                onSaved: function (e) {
                    calculatorDocTotal();
                   
                    if (editingEmptyRow) {
                        editingEmptyRow = false;
                        returnOrderDetailModel.unshift(JSON.parse(JSON.stringify(defaultEmptyModel)));
                        dgReturnOrderDetails.refresh();
                    }
                },
                onContentReady: function (e) {
                    $('.addNewButton').data('dxButton').option('visible', false);
                    $('.openItemsPopupButton').data('dxButton').option('visible', false);
                    $('.import-excel').data('dxButton').option('visible', false);
                    calculatorDocTotal();
                },
                onEditorPreparing: function (e) {
                    if (e.parentType === "dataRow" && (e.dataField === "vatId" || e.dataField === "priceAfterTax" || e.dataField === "discountAmt" || e.dataField === "lineAmt" || e.dataField === "lineAmtAfterTax")) {
                        e.editorOptions.disabled = true;
                    }
                },
                editing: {
                    mode: 'cell',
                    allowAdding: false,
                    allowUpdating: false,
                    allowDeleting: false,
                    useIcons: true,
                    texts: {
                        editRow: l("Edit"),
                        deleteRow: l("Delete"),
                        confirmDeleteMessage: l("DeleteConfirmationMessage")
                    }
                },
                columns: [
                    //{
                    //    caption: l("Actions"),
                    //    type: 'buttons',
                    //    width: 120,
                    //    buttons: ['edit', 'delete'],
                    //    fixedPosition: 'left'
                    //},
                    {
                        caption: l('EntityFieldName:OrderService:SalesRequestDetails:Item'),
                        dataField: 'itemId',
                        fixed: true,
                        fixedPosition: 'left',
                        lookup: {
                            dataSource() {
                                return {
                                    store: data.itemList,
                                    paginate: true,
                                    pageSize: pageSizeForLookup
                                };
                            },
                            displayExpr: function (e) {
                                return e.code + ' - ' + e.name
                            },
                            valueExpr: "id"
                        },
                        setCellValue: function (newData, value, currentData) {
                            var selectedItem = data.itemList.filter(i => i.id == value)[0];
                            var vat = vatList.filter(i => i.id == selectedItem.vatId)[0];

                            newData.itemId = value;
                            newData.uomGroupId = selectedItem.uomGroupId;
                            newData.vatId = selectedItem.vatId;
                            newData.taxRate = vat.rate;
                            newData.uomId = selectedItem.salesUomId;
                            newData.price = selectedItem.basePrice;
                            newData.priceAfterTax = newData.price + (newData.price * newData.taxRate) / 100;
                            newData.lineAmtAfterTax = newData.priceAfterTax * currentData.qty - currentData.discountAmt;
                            newData.lineAmt = newData.price * currentData.qty - currentData.discountAmt;
                            if (!currentData.itemId)
                                editingEmptyRow = true;
                        },
                    },
                    {
                        caption: l('EntityFieldName:OrderService:SalesRequestDetails:UOM'),
                        dataField: 'uomId',
                        lookup: {
                            dataSource(options) {
                                if (options.data != null) {
                                    var uomGroupId = options.data.uomGroupId;
                                    if (!uomGroupId) return;

                                    var uomGroup = data.uomGroupList.find(x => x = uomGroupId);
                                    var uOMListOfItem = [];
                                    uomGroup.forEach(x => {
                                        var uOM = data.uOMList.filter(y => y.id == x)[0];
                                        uOMListOfItem.push(uOM);
                                    })
                                    return {
                                        store: uOMListOfItem,
                                        paginate: true,
                                        pageSize: pageSizeForLookup
                                    };
                                } else {
                                    return {
                                        store: data.uOMList,
                                        paginate: true,
                                        pageSize: pageSizeForLookup
                                    };
                                }
                            },
                            displayExpr: "name",
                            valueExpr: "id"
                        },
                        setCellValue: function (newData, value, currentData) {
                            var form = $('#frmReturnOrderDetails').data('dxForm');
                            var customerId = form.getEditor('businessPartnerId').option('value');
                            var customer = data.customerList.filter(x => x.id == customerId)[0];
                            var price = data.priceList.find(x => x = customer.priceListId + '|' + currentData.itemId + '|' + value);
                            var priceAfterTax = price + (price * currentData.taxRate) / 100;
                            var lineAmtAfterTax = priceAfterTax * currentData.qty - currentData.discountAmt;
                            var lineAmt = price * currentData.qty - currentData.discountAmt;

                            newData.uomId = value;
                            newData.price = price;
                            newData.priceAfterTax = priceAfterTax;
                            newData.lineAmtAfterTax = lineAmtAfterTax;
                            newData.lineAmt = lineAmt;

                            needSummaryUpdate = true;
                        },
                    },
                    {
                        caption: l('EntityFieldName:OrderService:SalesRequestDetails:IsFree'),
                        dataField: 'isFree',
                        dataType: 'boolean',
                        width: 120,
                        setCellValue: function (newData, value, currentData) {
                            newData.isFree = value;
                            newData.discountType = 0;
                            if (value == true) {
                                newData.discountType = 0;
                                newData.discountAmt = 0;
                                newData.lineAmt = 0;
                                newData.lineAmtAfterTax = 0;
                            }
                            else {
                                var form = $('#frmReturnOrderDetails').data('dxForm');
                                var customerId = form.getEditor('businessPartnerId').option('value');
                                var customer = data.customerList.filter(x => x.id == customerId)[0];
                                var price = data.priceList.find(x => x = customer.priceListId + '|' + currentData.itemId + '|' + currentData.uomId);
                                var priceAfterTax = price + (price * currentData.taxRate) / 100;
                                var lineAmtAfterTax = priceAfterTax * currentData.qty - currentData.discountAmt;
                                var lineAmt = price * currentData.qty - currentData.discountAmt;

                                newData.price = price;
                                newData.priceAfterTax = priceAfterTax;
                                newData.lineAmtAfterTax = lineAmtAfterTax;
                                newData.lineAmt = lineAmt;
                            }
                            calculatorDocTotal();
                        }
                    },
                    {
                        caption: l('EntityFieldName:OrderService:SalesRequestDetails:Price'),
                        dataField: 'price',
                        dataType: 'number',
                        editorOptions: {
                            format: '#,##0.##',
                        },
                        format: ",##0.###",
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
                                    store: vatList,
                                    paginate: true,
                                    pageSize: pageSizeForLookup
                                };
                            },
                            displayExpr: "name",
                            valueExpr: "id"
                        },
                        visible: false,
                        width: 150,
                        //validationRules: [{ type: 'required', message: '' }]
                    },
                    {
                        caption: l('EntityFieldName:OrderService:SalesRequestDetails:PriceAfterTax'),
                        dataField: 'priceAfterTax',
                        dataType: 'number',
                        editorOptions: {
                            format: '#,##0.##',
                        },
                        format: ",##0.###",
                        validationRules: [{ type: 'required', message: '' }],
                        width: 150,
                        visible: false
                    },
                    {
                        caption: l('EntityFieldName:OrderService:SalesRequestDetails:Qty'),
                        dataField: 'qty',
                        dataType: 'number',
                        setCellValue: function (newData, value, currentData) {
                            newData.qty = value;
                            newData.lineAmt = value * currentData.price - currentData.discountAmt;
                            newData.lineAmtAfterTax = currentData.priceAfterTax * value - currentData.discountAmt;
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
                        caption: l('EntityFieldName:OrderService:SalesRequestDetails:Promotion'),
                        dataField: 'promotionId',
                        width: 150,
                        visible: false
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

                        },
                        validationRules: [{ type: 'required', message: '' }],
                        width: 200,
                        visible: false
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
                        validationRules: [{ type: 'required', message: '' }],
                        width: 150,
                        visible: false
                    },
                    {
                        caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountAmt'),
                        dataField: 'discountAmt',
                        dataType: 'number',
                        format: ",##0.###",
                        width: 150,
                        visible: false
                    },
                    {
                        caption: l('EntityFieldName:OrderService:SalesRequestDetails:LineAmt'),
                        dataField: 'lineAmt',
                        dataType: 'number',
                        format: ",##0.###",
                        width: 150
                    },
                    {
                        caption: l('EntityFieldName:OrderService:SalesRequestDetails:LineAmtAfterTax'),
                        dataField: 'lineAmtAfterTax',
                        dataType: 'number',
                        format: ",##0.###",
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
                        width: 150,
                        visible: false
                    },
                    {
                        caption: l('EntityFieldName:OrderService:SalesRequestDetails:Warehouse'),
                        dataField: 'warehouseId',
                        width: 200,
                        visible: false
                    },
                    {
                        caption: l('EntityFieldName:OrderService:SalesRequestDetails:WarehouseLocation'),
                        dataField: 'warehouseLocationId',
                        width: 200,
                        visible: false
                    }

                ],
                summary: {
                    totalItems: [
                        {
                            column: "discountAmt",
                            summaryType: "sum",
                            alignment: "left",
                            valueFormat: ",##0.###"
                        },
                        {
                            column: "lineAmt",
                            summaryType: "sum",
                            alignment: "left",
                            valueFormat: ",##0.###"
                        },
                        {
                            column: "lineAmtAfterTax",
                            summaryType: "sum",
                            alignment: "left",
                            valueFormat: ",##0.###"
                        }
                    ]
                }
            })).dxDataGrid("instance");

        initChooseItemsPopup(data.itemList);

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

            var header = frmReturnOrderDetails.option('formData');
            header.companyId = companyId;
            header.linkedSFAId = linkedSFAId;

            var returnOrderObject = {
                header: header,
                details: removeEmtyDetail(JSON.parse(JSON.stringify(returnOrderDetailModel)))
            };

            console.log("Save data: ", returnOrderObject);

            if (returnOrderHeaderId) {
                returnOrderService.updateDoc(returnOrderHeaderId, returnOrderObject, { contentType: "application/json" })
                    .done(result => {
                        abp.message.success(l('Congratulations'));
                        console.log(result);
                    })
                    .fail(result => {
                        var message = result.message;
                        try {

                            var details = JSON.parse(result.details);
                            Object.keys(details).forEach(function (key) {
                                message = message.replace(`{${key}}`, details[key]);
                            });
                        } catch { }
                        abp.message.error(message);
                    })
            } else
                returnOrderService.createDoc(returnOrderObject, { contentType: "application/json" })
                    .done(result => {
                        abp.message.success(l('Congratulations'));
                        returnOrderHeaderId = result.header.id;
                        sessionStorage.setItem('returnOrderHeaderId', returnOrderHeaderId);
                        console.log(result);
                    })
                    .fail(result => {
                        var message = result.message;
                        try {

                            var details = JSON.parse(result.details);
                            Object.keys(details).forEach(function (key) {
                                message = message.replace(`{${key}}`, details[key]);
                            });
                        } catch { }
                        abp.message.error(message);
                    })
        });

        initImportPopup('', 'ReturnOrder_Template', 'dgReturnOrderDetails');

        if (returnOrderHeaderId != null) {
            returnOrderService.getHeader(returnOrderHeaderId)
                .done(result => {
                    $('#frmReturnOrderDetails').data('dxForm').option('formData', result);
                });

            const args = {};
            args.filter = JSON.stringify(['docId', '=', returnOrderHeaderId])
            returnOrderService.getDetailListDevextremes(args)
                .done(result => {
                    returnOrderDetailModel = result.data;
                    //if (returnOrderDetailModel.find(x => x.itemId == null) == null)
                    //    returnOrderDetailModel.unshift(JSON.parse(JSON.stringify(defaultEmptyModel)));
                    gridDetails = $('#dgReturnOrderDetails').data('dxDataGrid')
                    gridDetails.option('dataSource', returnOrderDetailModel);
                    gridDetails.refresh();
                });
        }
    };


    function removeEmtyDetail(detailList) {
        var itemEmty = detailList.find(x => !x.itemId);
        var index = detailList.indexOf(itemEmty);
        detailList.splice(index, 1);
        return detailList;
    }

    function calculatorDocTotal() {

        // get data in grid details
        var dataRows = returnOrderDetailModel;
        var sumDiscountAmt = 0;
        var sumLineAmt = 0;
        var sumLineAmtAfterTax = 0;
        dataRows.forEach(x => {
            sumDiscountAmt = sumDiscountAmt + x.discountAmt;
            sumLineAmt = sumLineAmt + x.lineAmt;
            sumLineAmtAfterTax = sumLineAmtAfterTax + x.lineAmtAfterTax;
        })
        // caculator doc total
        var form = $('#frmReturnOrderDetails').data('dxForm');
        var docTotalLineDiscountAmt = sumDiscountAmt;
        var docTotalLineAmt = sumLineAmt;
        var docTotalLineAmtAfterTax = sumLineAmtAfterTax;
        var docDiscountType = form.getEditor('docDiscountType').option('value');
        var docDiscountPerc = (form.getEditor('docDiscountPerc').option('value')) / 100;
        var docDiscountAmt = form.getEditor('docDiscountAmt').option('value');
        form.updateData('docTotalLineDiscountAmt', docTotalLineDiscountAmt);
        form.updateData('docTotalLineAmt', docTotalLineAmt);
        form.updateData('docTotalLineAmtAfterTax', docTotalLineAmtAfterTax);

        if (docDiscountType == 0) {
            form.updateData('docDiscountAmt', docDiscountAmt);
            form.getEditor('docDiscountAmt').option('disabled', false);
            form.updateData('docTotalAmt', docTotalLineAmt - docDiscountAmt);
            form.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - docDiscountAmt);
        }
        if (docDiscountType == 1) {
            var _docDiscountAmt = docTotalLineAmt * docDiscountPerc;
            form.updateData('docDiscountAmt', _docDiscountAmt);
            form.getEditor('docDiscountAmt').option('disabled', true);
            form.updateData('docTotalAmt', docTotalLineAmt - _docDiscountAmt);
            form.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - _docDiscountAmt);
        }
        if (docDiscountType == 2) {
            var _docDiscountAmt = docTotalLineAmtAfterTax * docDiscountPerc;
            form.updateData('docDiscountAmt', _docDiscountAmt);
            form.getEditor('docDiscountAmt').option('disabled', true);
            form.updateData('docTotalAmt', docTotalLineAmt - _docDiscountAmt);
            form.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - _docDiscountAmt);
        }
    }

    function appendSelectedItems(selectedItems) {
        selectedItems.forEach(u => {
            var priceAfterTax = u.basePrice + (u.basePrice * vatList.filter(x => x.id == u.vatId)[0].rate) / 100;
            var lineAmtAfterTax = (priceAfterTax * parseInt(u.qty)) - 0;
            returnOrderDetailModel.unshift({
                id: u.id,
                itemId: u.id,
                vatId: u.vatId,
                taxRate: vatList.filter(x => x.id == u.vatId)[0].rate,
                uomId: u.salesUomId,
                price: u.basePrice,
                qty: parseInt(u.qty),
                priceAfterTax: priceAfterTax,
                lineAmtAfterTax: lineAmtAfterTax,
                lineAmt: u.basePrice * parseInt(u.qty) - 0,
                discountAmt: 0,
                discountPerc: 0,
                discountType: 0,
                transactionType: 0,
                uomGroupId: u.uomGroupId
            });
        });
        $('#frmReturnOrderDetails').data('dxDataGrid').refresh();
        calculatorDocTotal();
    }
    function addListToData(data) {

        // get customer list
        data.customerList = Object.keys(data.customerDictionary).map(function (key) {
            return data.customerDictionary[key];
        });
        // get price list
        data.priceList = Object.keys(data.priceDictionary).map(function (key) {
            return data.priceDictionary[key];
        });
        // get item list
        data.itemList = Object.keys(data.item).map(function (key) {
            data.item[key].qty = 1;
            return data.item[key];
        });
        // get UOM group list
        data.uomGroupList = Object.keys(data.uomGroup).map(function (key) {
            return data.uomGroup[key];
        });
        // get UOM list
        data.uOMList = Object.keys(data.uom).map(function (key) {
            return data.uom[key];
        });
        // get item group list
        data.itemGroupList = Object.keys(data.itemsInItemGroupsDictionary).map(function (key) {
            return data.itemsInItemGroupsDictionary[key];
        });
        // get vat list
        vatList = Object.keys(data.vat).map(function (key) {
            return data.vat[key];
        });

        // get route list
        data.routeList = Object.keys(data.routeDictionary).map(function (key) {
            return data.routeDictionary[key];
        });
        // get employee list
        data.employeeList = Object.keys(data.customersRoutesItemGroupsDictionary).map(function (key) {
            return data.customersRoutesItemGroupsDictionary[key];
        });
    };
});