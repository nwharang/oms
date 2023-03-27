let helper = async ({ companyId = "", salesOrderStore = {}, vatList = {} }) => {
    console.log("helper.js");
    console.log(salesOrderStore);
    let salesRequestsHeaderService = window.dMSpro.oMS.orderService.controllers.salesRequests.salesRequest;
    let { discountTypeStore, transactionTypeStore, docTypeStore, docSourceStore, docStatusStore } = store()
    let gridInitialized = false, popup, form, grid;
    // Local Store
    let savedFormData = {}
    let currentData = { header: {}, details: [] }
    let comingData = { next: {}, previous: {} }
    let genStoreForDropDownBox = (data) => new DevExpress.data.CustomStore({
        labelMode: 'raw',
        key: 'id',
        load() {
            return data
        }
    })
    let compareObject = (obj1, obj2) => {
        return JSON.stringify(obj1) === JSON.stringify(obj2)
    }
    let loadNavigationButton = (docId) => {
        if (docId) {
            salesRequestsHeaderService.getPrevDoc(docId).done(data => {
                comingData.previous = data
                // Incase user cancel popup before data or button loaded
                try {
                    $('#prevDocButton').dxButton('instance').option("disabled", !Boolean(comingData.previous))
                } catch (e) { }
            })
            salesRequestsHeaderService.getNextDoc(docId).done(data => {
                comingData.next = data
                // Incase user cancel popup before data or button loaded
                try {
                    $('#nextDocButton').dxButton('instance').option("disabled", !Boolean(comingData.next))
                } catch (e) { }
            })
        }
    }
    let notify = ({ type = "success", position = "bottom right", message = "Message Placeholder" }) => DevExpress.ui.notify({
        message,
        height: 45,
        width: 250,
        minWidth: 250,
        type,
        displayTime: 5000,
        animation: {
            show: {
                type: 'fade', duration: 400, from: 0, to: 1,
            },
            hide: { type: 'fade', duration: 40, to: 0 },
        },
    }, {
        position
    })
    let recalulateDocTotal = () => {
        let formInstance = form.dxForm('instance')
        let gridInstance = grid.dxDataGrid('instance')
        if (!formInstance || !gridInstance || !gridInstance.getDataSource()) return
        let { docDiscountType, docDiscountPerc, docDiscountAmt } = formInstance.option('formData')
        let docTotalLineDiscountAmt = gridInstance.getTotalSummaryValue('docTotalLineDiscountAmt')
        let docTotalLineAmt = gridInstance.getTotalSummaryValue('docTotalLineAmt')
        let docTotalLineAmtAfterTax = gridInstance.getTotalSummaryValue('docTotalLineAmtAfterTax')
        formInstance.updateData('docTotalLineDiscountAmt', docTotalLineDiscountAmt)
        formInstance.updateData('docTotalLineAmt', docTotalLineAmt)
        formInstance.updateData('docTotalLineAmtAfterTax', docTotalLineAmtAfterTax)
        let noNegative = (a, b) => a - b <= 0 ? 0 : a - b
        switch (docDiscountType) {
            case 0:
                formInstance.updateData('docDiscountAmt', docDiscountAmt);
                formInstance.getEditor('docDiscountPerc').option('disabled', true);
                formInstance.getEditor('docDiscountAmt').option('disabled', false);
                formInstance.updateData('docTotalAmt', noNegative(docTotalLineAmt, docDiscountAmt));
                formInstance.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - docDiscountAmt);
                break;
            case 1:
                var _docDiscountAmt = docTotalLineAmt * docDiscountPerc;
                formInstance.updateData('docDiscountAmt', _docDiscountAmt);
                formInstance.getEditor('docDiscountAmt').option('disabled', true);
                formInstance.getEditor('docDiscountPerc').option('disabled', false);
                formInstance.updateData('docTotalAmt', noNegative(docTotalLineAmt, _docDiscountAmt));
                formInstance.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - _docDiscountAmt);
                break;
            case 2:
                var _docDiscountAmt = docTotalLineAmtAfterTax * docDiscountPerc;
                formInstance.updateData('docDiscountAmt', _docDiscountAmt);
                formInstance.getEditor('docDiscountAmt').option('disabled', true);
                formInstance.getEditor('docDiscountPerc').option('disabled', false);
                formInstance.updateData('docTotalAmt', noNegative(docTotalLineAmt, _docDiscountAmt));
                formInstance.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - _docDiscountAmt);
                break;
        }
    }
    function renderForm(e, { header = {}, details = [] }, docId) {
        let defaultNewHeader = {
            requestDate: new Date().toString(),
            docTotalLineDiscountAmt: 0,
            docTotalLineAmt: 0,
            docTotalLineAmtAfterTax: 0,
            docDiscountType: 0,
            docDiscountPerc: 0,
            docDiscountAmt: 0,
            docTotalAmt: 0,
            docTotalAmtAfterTax: 0,
            docSource: 0,
            docType: 0,
            remake: "",
            companyId,
        }
        form = $('<div id="form-container">').dxForm({
            labelMode: "floatting",
            formData: {
                ...defaultNewHeader,
                ...header,
            },
            disabled: Boolean(header.docStatus),
            colCount: 3,
            items: [
                {
                    itemType: "group",
                    caption: 'Documentation',
                    items: [
                        {
                            label: {
                                text: l('EntityFieldName:OrderService:SalesRequest:DocNbr')
                            },
                            dataField: "docNbr",
                            editorOptions: {
                                disabled: true,
                            },
                        },
                        {
                            label: {
                                text: l('EntityFieldName:OrderService:SalesRequest:DocType')
                            },
                            dataField: "docType",
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                dataSource: docTypeStore,
                                displayExpr: "text",
                                valueExpr: "id"
                            },
                            validationRules: [{ type: 'required' }],
                        },
                        {
                            label: {
                                text: l('EntityFieldName:OrderService:SalesRequest:DocSource')
                            },
                            dataField: "docSource",
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                dataSource: docSourceStore,
                                displayExpr: "text",
                                valueExpr: "id",
                            },
                        },
                        {
                            label: {
                                text: l('EntityFieldName:OrderService:SalesRequest:Remark')
                            },
                            dataField: "remark",
                        },
                        {
                            label: {
                                text: l('EntityFieldName:OrderService:SalesRequest:BusinessPartner')
                            },
                            dataField: "businessPartnerId",
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                dataSource: salesOrderStore.customerList,
                                displayExpr: 'name',
                                valueExpr: 'id',
                                searchEnabled: true,
                                elementAttr: {
                                    id: "businessPartnerId",
                                }
                            },
                            validationRules: [{ type: 'required' }],

                        },
                        {
                            dataField: "requestDate",
                            editorType: 'dxDateBox',
                            editorOptions: {
                                displayFormat: "dd-MM-yyyy",
                                min: new Date().toString(),
                                dateOutOfRangeMessage: "Date is out of range",
                                disabled: true,
                            },
                            validationRules: [{ type: 'required' }],
                        }
                    ]
                },
                {
                    itemType: "group",
                    caption: 'Alternative Minimum Tax',
                    items: [
                        {
                            dataField: "docTotalLineDiscountAmt",
                            editorType: 'dxNumberBox',
                            editorOptions: {
                                disabled: true,
                                format: '#,##0.##',
                                min: 0,
                            }
                        },
                        {
                            dataField: "docTotalLineAmt",
                            editorType: 'dxNumberBox',
                            editorOptions: {
                                disabled: true,
                                format: '#,##0.##',
                                min: 0,
                            }
                        },
                        {
                            dataField: "docTotalLineAmtAfterTax",
                            editorType: 'dxNumberBox',
                            editorOptions: {
                                disabled: true,
                                format: '#,##0.##',
                                min: 0,
                            }
                        },
                        {
                            dataField: "docTotalAmt",
                            editorType: 'dxNumberBox',
                            editorOptions: {
                                disabled: true,
                                format: '#,##0.##',
                                min: 0,
                            }
                        },
                        {
                            dataField: "docTotalAmtAfterTax",
                            editorType: 'dxNumberBox',
                            editorOptions: {
                                disabled: true,
                                format: '#,##0.##',
                                min: 0,
                            }
                        }
                    ]

                },
                {
                    itemType: "group",
                    caption: 'Discount Information',
                    items: [
                        {
                            dataField: "docDiscountType",
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                dataSource: discountTypeStore,
                                displayExpr: 'text',
                                valueExpr: 'id',
                                searchEnabled: true,
                            },
                        },
                        {
                            dataField: "docDiscountPerc",
                            editorType: 'dxNumberBox',
                            editorOptions: {
                                format: '##0.## %',
                                min: 0,
                                max: 1,
                                disabled: true,
                            }
                        },
                        {
                            dataField: "docDiscountAmt",
                            editorType: 'dxNumberBox',
                            editorOptions: {
                                format: '#,##0.##',
                                min: 0,
                                value: 0
                            }
                        },
                        {
                            dataField: "docStatus",
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                dataSource: docStatusStore,
                                displayExpr: 'text',
                                valueExpr: 'id',
                                disabled: true,
                            },

                        },
                    ]
                },
                {
                    itemType: "group",
                    colSpan: 3,
                    template: (e, itemElement) => {
                        renderDetailForm(details, itemElement, docId, Boolean(header.docStatus))
                    }
                }
            ],
            onFieldDataChanged: (e) => {
                // compare 2 objects to disable/enable save button
                if (!form?.dxForm('instance') || !grid?.dxDataGrid('instance')) return
                $('#saveButtonPopup').dxButton('instance').option('disabled', compareObject(savedFormData, formInstance.option('formData')))
                setTimeout(() => {
                    recalulateDocTotal()
                }, 200)
                if (e.dataField == 'businessPartnerId' && e.value) {
                    grid.dxDataGrid('instance').option('disabled', false)
                }
            }
        })
        let formInstance = form.dxForm('instance')
        savedFormData = { ...formInstance.option('formData') }
        form.appendTo(e)
    }
    function renderDetailForm(detailsData, itemElement, docId, docStatus) {
        grid = $('<div id="detailsDataGrids">').css('padding', '0.5rem').css('overflow-y', 'hidden').css('max-height', '50vh').dxDataGrid({
            dataSource: detailsData || [],
            repaintChangesOnly: true,
            editing: {
                mode: 'batch',
                allowAdding: true,
                allowUpdating: true,
                allowDeleting: true,
                useIcons: true,
                texts: {
                    editRow: l("Edit"),
                },
                newRowPosition: 'last'
            },
            showRowLines: true,
            // cacheEnabled: true,
            columnAutoWidth: true,
            showColumnLines: true,
            showRowLines: true,
            searchPanel: {
                visible: true
            },
            allowColumnResizing: true,
            // allowColumnReordering: true,
            rowAlternationEnabled: true,
            columnResizingMode: 'widget',
            filterRow: {
                visible: true,
                applyFilter: 'auto',
            },
            columnChooser: {
                enabled: true,
                mode: "select"
            },
            groupPanel: {
                allowColumnDragging: false,
                visible: false,
            },
            headerFilter: {
                visible: true,
            },
            stateStoring: {
                enabled: true,
                type: 'localStorage',
                storageKey: 'dgSalesRequestDetails',
            },
            paging: {
                enabled: true,
                pageSize: 10
            },
            pager: {
                visible: true,
                showPageSizeSelector: true,
                allowedPageSizes: [10, 20, 50],
                showInfo: true,
                showNavigationButtons: true
            },
            toolbar: {
                items: ['addRowButton', "revertButton", "searchPanel"]
            },
            columns: [
                {
                    type: 'buttons',
                    caption: l('Actions'),
                    buttons: ['delete'],
                    width: 75,
                    fixed: true,
                    fixedPosition: 'left',
                    allowFiltering: false,

                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:Item'),
                    dataField: 'itemId',
                    fixed: true,
                    fixedPosition: 'left',
                    lookup: {
                        dataSource: salesOrderStore.itemList,
                        displayExpr(e) { return e.code + ' - ' + e.name },
                        valueExpr: "id",
                    },
                    editCellTemplate: (cellElement, cellInfo) => {
                        return $('<div>').dxDropDownBox({
                            dataSource: salesOrderStore.itemList,
                            value: cellInfo.value,
                            valueExpr: "id",
                            displayExpr(e) { return e.code + ' - ' + e.name },
                            width: '500px',
                            placeholder: 'Select a value...',
                            contentTemplate: (e) => {
                                let content = $('<div>').dxDataGrid({
                                    dataSource: genStoreForDropDownBox(salesOrderStore.itemList),
                                    hoverStateEnabled: true,
                                    scrolling: { mode: 'virtual' },
                                    height: 250,
                                    selection: { mode: 'single' },
                                    selectedRowKeys: [cellInfo.value],
                                    focusedRowEnabled: true,
                                    focusedRowKey: cellInfo.value,
                                    filterRow: {
                                        visible: true,
                                        applyFilter: 'auto',
                                    },
                                    columns: [
                                        {
                                            dataField: 'code'
                                        },
                                        {
                                            dataField: 'name'
                                        },
                                    ],
                                    onSelectionChanged(selectionChangedArgs) {
                                        e.component.option('value', selectionChangedArgs.selectedRowKeys[0]);
                                        cellInfo.setValue(selectionChangedArgs.selectedRowKeys[0]);
                                        if (selectionChangedArgs.selectedRowKeys.length > 0) {
                                            e.component.close();
                                        }
                                    },
                                })
                                e.component.on('valueChanged', (args) => {
                                    content.dxDataGrid('instance').selectRows(args.value, false);
                                    e.component.close();
                                    setTimeout(() => {
                                        recalulateDocTotal()
                                    }, 200)
                                });
                                return content
                            }
                        })
                    },
                    setCellValue: function (newData, value, currentData) {
                        let selectedItem = salesOrderStore.itemList.find(i => i.id == value);
                        let vat = vatList.find(i => i.id == selectedItem?.vatId);
                        if (selectedItem) {
                            newData.itemId = value;
                            newData.uomGroupId = selectedItem.uomGroupId;
                            newData.vatId = selectedItem.vatId;
                            newData.taxRate = vat.rate;
                            newData.uomId = selectedItem.salesUomId;
                            newData.price = selectedItem.basePrice;
                            newData.priceAfterTax = newData.price + (newData.price * newData.taxRate) / 100;
                            newData.lineAmtAfterTax = newData.priceAfterTax * currentData.qty - currentData.discountAmt;
                            newData.lineAmt = newData.price * currentData.qty - currentData.discountAmt;
                        }
                    },
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:UOM'),
                    dataField: 'uomId',
                    lookup: {

                        dataSource: salesOrderStore.uOMList,
                        displayExpr: "name",
                        valueExpr: "id"
                    },
                    setCellValue: function (newData, value, currentData) {
                        let customerId = form.dxForm('instance').getEditor('businessPartnerId').option('value');
                        let customer = salesOrderStore.customerList.find(x => x.id == customerId);
                        let price = salesOrderStore.priceList.find(x => x.id == customer.priceListId + '|' + currentData.itemId + '|' + value)?.value || 0;
                        let priceAfterTax = price + (price * currentData.taxRate) / 100;
                        let lineAmtAfterTax = priceAfterTax * currentData.qty - currentData.discountAmt;
                        let lineAmt = price * currentData.qty - currentData.discountAmt;
                        newData.uomId = value;
                        newData.price = price;
                        newData.priceAfterTax = priceAfterTax;
                        newData.lineAmtAfterTax = lineAmtAfterTax;
                        newData.lineAmt = lineAmt;
                    },
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:IsFree'),
                    dataField: 'isFree',
                    dataType: 'boolean',
                    width: "75",
                    setCellValue: (newData, value, currentRowData) => {
                        newData.isFree = value;
                        if (value) {
                            newData.price = 0
                            newData.priceAfterTax = 0
                            newData.discountType = 0
                            newData.discountAmt = 0
                            newData.lineAmt = 0
                            newData.lineAmtAfterTax = 0
                        }
                        else {
                            let thisData = {}
                            if (detailsData.length > 0)
                                thisData = detailsData?.find(e => e.id === currentRowData.id)
                            newData.price = thisData?.price || 0
                            newData.priceAfterTax = thisData?.priceAfterTax || 0
                            newData.discountType = thisData?.discountType || 0
                            newData.discountAmt = thisData?.discountAmt || 0
                            newData.lineAmt = thisData?.lineAmt || 0
                            newData.lineAmtAfterTax = thisData?.lineAmtAfterTax || 0
                        }
                    }
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:Promotion'),
                    dataField: 'promotionId',
                    width: 150,
                    visible: false,
                    allowEditing: false,
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:Price'),
                    dataField: 'price',
                    dataType: 'number',
                    editorOptions: {
                        format: '#,##0.##',
                    },
                    format: '#,##0.##',
                    validationRules: [{ type: 'required', message: '' }],
                    setCellValue: function (newData, value, currentData) {
                        newData.price = value;
                        newData.priceAfterTax = value + (value * currentData.taxRate) / 100;
                        newData.lineAmt = value * currentData.qty - currentData.discountAmt;
                        newData.lineAmtAfterTax = newData.priceAfterTax * currentData.qty - currentData.discountAmt;
                    },
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:VAT'),
                    dataField: 'vatId',
                    lookup: {
                        dataSource: vatList,
                        displayExpr: "name",
                        valueExpr: 'id'
                    },
                    allowEditing: false,
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:PriceAfterTax'),
                    dataField: 'priceAfterTax',
                    dataType: 'number',
                    editorOptions: {
                        format: '#,##0.##',
                    },
                    format: '#,##0.##',
                    allowEditing: false,
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
                },

                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountType'),
                    dataField: 'discountType',
                    lookup: {
                        dataSource: discountTypeStore,
                        displayExpr: 'text',
                        valueExpr: 'id'
                    },

                    visible: false
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountPerc'),
                    dataField: 'discountPerc',
                    dataType: 'number',
                    editorOptions: {
                        format: '#0.00 %',
                    },
                    format: '#0.00 %',
                    width: 100,
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
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountAmt'),
                    dataField: 'discountAmt',
                    dataType: 'number',
                    editorOptions: {
                        format: '#,##0.##',
                    },
                    format: '#,##0.##',
                    width: 100,
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:LineAmt'),
                    dataField: 'lineAmt',
                    dataType: 'number',
                    editorOptions: {
                        format: '#,##0.##',
                    },
                    allowEditing: false,
                    format: '#,##0.##',
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:LineAmtAfterTax'),
                    dataField: 'lineAmtAfterTax',
                    dataType: 'number',
                    editorOptions: {
                        format: '#,##0.##',
                    },
                    allowEditing: false,
                    format: '#,##0.##',
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
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:Warehouse'),
                    dataField: 'warehouseId',
                    visible: false
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:WarehouseLocation'),
                    dataField: 'warehouseLocationId',
                    visible: false
                },

            ],
            summary: {
                recalculateWhileEditing: true,
                totalItems: [
                    {
                        column: 'itemId',
                        summaryType: 'count',
                        customizeText: (data) => "Total Item : " + data.value
                        // valueFormat: ",##0.###",
                    },
                    {
                        column: 'price',
                        summaryType: 'sum',
                        valueFormat: '#,##0.##',
                    },
                    {
                        column: 'priceAfterTax',
                        summaryType: 'sum',
                        valueFormat: '#,##0.##',
                    },
                    {
                        column: 'discountAmt',
                        name: "docTotalLineDiscountAmt",
                        summaryType: 'sum',
                        valueFormat: '#,##0.##',
                    },
                    {
                        column: 'lineAmt',
                        name: "docTotalLineAmt",
                        summaryType: 'sum',
                        valueFormat: '#,##0.##',
                    },
                    {
                        column: 'lineAmtAfterTax',
                        name: 'docTotalLineAmtAfterTax',
                        summaryType: 'sum',
                        valueFormat: '#,##0.##',
                    },
                ],
            },
            onContentReady: (e) => {
                if (!form.dxForm('instance').option('formData').businessPartnerId) {
                    grid.dxDataGrid('instance').option('disabled', true)
                    $('#businessPartnerId').dxSelectBox('instance').option('disabled', false)
                }
                if (form.dxForm('instance').option('formData').businessPartnerId && (grid.dxDataGrid('instance').hasEditData() || grid.dxDataGrid('instance').getDataSource().items().length > 0)) {
                    grid.dxDataGrid('instance').option('disabled', false)
                    $('#businessPartnerId').dxSelectBox('instance').option('disabled', true)
                }
            },
            onInitNewRow: (e) => {
                e.data = {
                    ...e.data,
                    isFree: false,
                    price: 0,
                    qty: 1,
                    priceAfterTax: 0,
                    discountType: 0,
                    discountAmt: 0,
                    discountPerc: 0,
                    lineAmt: 0,
                    lineAmtAfterTax: 0,
                    transactionType: 0,
                }
            },
            onOptionChanged: () => {
                if (gridInitialized) {
                    if (grid?.dxDataGrid('instance') && form?.dxForm('instance')) {
                        $('#saveButtonPopup').dxButton('instance').option('disabled', !grid?.dxDataGrid('instance').hasEditData())
                    }
                }
            },
            onDisposing: () => {
                gridInitialized = false
            },
            onEditorPreparing: (e) => {
                if (e.row?.rowType != 'data') return
                e.editorOptions.onValueChanged = (v) => {
                    e.setValue(v.value)
                    setTimeout(() => {
                        recalulateDocTotal()
                    }, 200)
                }
            },
            onEditorPrepared: (e) => {
                if (e.row?.rowType === "data")
                    gridInitialized = true
            }

        })
        gridInstance = grid.dxDataGrid('instance')
        loadNavigationButton(docId)
        grid.appendTo(itemElement)
    }
    return {
        renderPopup: async (docId) => {
            currentData = docId ? await salesRequestsHeaderService.getDoc(docId) : { header: {}, details: {} }
            if (!popup) popup = $('<div id="#popup">')
            popup.dxPopup({
                title: 'Sale Request',
                showTitle: true,
                height: '95%',
                width: "95%",
                hideOnOutsideClick: false,
                dragEnabled: false,
                contentTemplate: async (e) => {
                    renderForm(e, currentData, docId)
                },
                toolbarItems: [
                    {
                        widget: "dxButton",
                        location: "center",
                        toolbar: "bottom",
                        options: {
                            icon: "chevronprev",
                            text: "Back",
                            elementAttr: {
                                id: 'prevDocButton',
                            },
                            disabled: true,
                            onClick: function (e) {
                                docId = comingData.previous.header.id;
                                form.dxForm("instance").option("formData", comingData.previous.header)
                                grid.dxDataGrid("instance").option('dataSource', comingData.previous.details)
                                form.dxForm('instance').option("disabled", Boolean(comingData.previous.header.docStatus))
                                grid.dxDataGrid('instance').option("disabled", Boolean(comingData.previous.header.docStatus))
                                loadNavigationButton(docId)
                            }
                        }
                    },
                    {
                        widget: "dxButton",
                        location: "center",
                        toolbar: "bottom",
                        options: {
                            icon: "chevronnext",
                            text: "Next",
                            elementAttr: {
                                id: 'nextDocButton',
                            },
                            disabled: true,
                            onClick: function (e) {
                                docId = comingData.next.header.id;
                                form.dxForm("instance").option("formData", comingData.next.header)
                                grid.dxDataGrid("instance").option('dataSource', comingData.next.details)
                                form.dxForm('instance').option("disabled", Boolean(comingData.next.header.docStatus))
                                grid.dxDataGrid('instance').option("disabled", Boolean(comingData.next.header.docStatus))
                                $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", Boolean(comingData.next.header.docStatus))
                                loadNavigationButton(docId)
                            }
                        }
                    },
                    {
                        widget: "dxDropDownButton",
                        location: "after",
                        toolbar: "bottom",
                        options: {
                            icon: 'preferences',
                            text: 'Actions',
                            disabled: Boolean(currentData.header.docStatus),
                            width: 120,
                            elementAttr: {
                                id: "actionButtonDetailsPanel",
                            },
                            items: [
                                {
                                    text: "Approve",
                                    icon: "check",
                                    onClick: () => {
                                        if (docId)
                                            salesRequestsHeaderService.createListSODoc([docId])
                                                .done(() => {
                                                    notify({ type: 'success', message: "SR Approved" })
                                                    form.dxForm('instance').option("disabled", true)
                                                    grid.dxDataGrid('instance').option("disabled", true)
                                                    $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", true)
                                                }
                                                ).fail(() => {
                                                    notify({ type: 'error', message: "SR Approve Failed" })
                                                    popup.dxPopup('instance').repaint()
                                                }
                                                )
                                    }
                                },
                                {
                                    text: "Reject",
                                    icon: "close",
                                    onClick: () => DevExpress.ui.dialog.confirm("<i> Do you wish to continue this action?</i>", "Rejecting Sale Request")
                                        .done((e) => {
                                            if (e) {
                                                salesRequestsHeaderService.cancelDoc(docId)
                                                    .done(() => {
                                                        notify({ type: 'success', message: "SR Rejected" })
                                                        form.dxForm('instance').option("disabled", true)
                                                        grid.dxDataGrid('instance').option("disabled", true)
                                                    })
                                                    .fail(() => notify({ type: 'error', message: "SR Reject Failed" }))
                                            }
                                        })
                                }
                            ]
                        },
                    },
                    {
                        widget: 'dxButton',
                        location: "after",
                        toolbar: "bottom",
                        options: {
                            disabled: true, // Condition here
                            text: 'Save',
                            icon: 'save',
                            elementAttr: {
                                id: 'saveButtonPopup'
                            },
                            onClick() {
                                grid.dxDataGrid('instance').saveEditData().then(() => {
                                    currentData.header = form.dxForm('instance').option('formData');
                                    currentData.details = grid.dxDataGrid('instance').getDataSource().items().filter(detail => detail.itemId)
                                    currentData.header.requestDate = new Date().toString();;
                                    if (currentData.details.length < 1) {
                                        return
                                    }
                                    if (docId && currentData.header && currentData.details.length > 0)
                                        salesRequestsHeaderService.updateDoc(docId, currentData)
                                            .done(() => notify({ type: 'success', message: "SR Updated" }))
                                            .fail(() => notify({ type: 'error', message: "SR Update Failed" }))
                                    else
                                        salesRequestsHeaderService.createDoc(currentData)
                                            .done((data) => {
                                                notify({ type: 'success', message: "SR Created" })
                                                docId = data.header.id
                                                loadNavigationButton(docId)
                                            })
                                            .fail(() => notify({ type: 'error', message: "SR Create Failed" }))
                                })
                            }
                        }
                    },
                    {
                        widget: "dxButton",
                        location: "after",
                        toolbar: "bottom",
                        options: {
                            text: "Exit",
                            icon: "return",
                            onClick: function () {
                                popup.dxPopup('instance').hide()
                                $('#dgSalesRequestHeader').dxDataGrid('instance').getDataSource().reload()
                            }
                        },
                    },
                ],
                onHiding: () => {
                    gridInitialized = false
                }
            })
            popup.appendTo('body')
            popup.dxPopup('instance').show()
        },

    }
}
