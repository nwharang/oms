let preLoad = getInfoSO()

let currentData = {}, isDocOpen
let helper = ({ companyId, salesOrderStore, vatList }) => {
    let salesRequestsHeaderService = window.dMSpro.oMS.orderService.controllers.salesRequests.salesRequest;
    let { discountTypeStore, transactionTypeStore, docStatusStore } = store()
    let gridInitialized = false, popup, form, grid;
    // Local Store
    let comingData = { next: {}, previous: {} }
    let genStoreForDropDownBox = (data) => new DevExpress.data.CustomStore({
        labelMode: 'raw',
        key: 'id',
        load() {
            return data
        }
    })
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

    let notify = (option) => {
        obj = { type: "success", position: "bottom right", message: "Message Placeholder", ...option };
        DevExpress.ui.notify({
            message: obj.message,
            height: 45,
            width: 250,
            minWidth: 250,
            type: obj.type,
            displayTime: 5000,
            animation: {
                show: {
                    type: 'fade', duration: 400, from: 0, to: 1,
                },
                hide: { type: 'fade', duration: 40, to: 0 },
            },
        }, {
            position: obj.position,
        })
        return obj
    }
    function renderForm(e, { header, details }, docId) {
        let defaultNewHeader = {
            requestDate: new Date().toString(),
            docTotalLineDiscountAmt: 0,
            docTotalLineAmt: 0,
            docTotalLineAmtAfterTax: 0,
            docTotalAmt: 0,
            docTotalAmtAfterTax: 0,
            docSource: 0,
            docType: 0,
            remark: "",
            companyId,
        }
        if (!header) header = {}
        let formContainer = $('<div class="w-100 h-100 position-relative d-flex flex-column">').appendTo(e)
        form = $('<div id="form-container">').dxForm({
            labelMode: "floatting",
            formData: {
                ...defaultNewHeader,
                ...header,
            },
            readOnly: Boolean(header.docStatus),
            colCountByScreen: {
                lg: 2,
                md: 2,
                sm: 2,
                xs: 2,
            },
            items: [
                {
                    itemType: "group",
                    caption: 'Documentation',
                    colCountByScreen: {
                        lg: 2,
                        md: 2,
                        sm: 2,
                    },
                    items: [
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
                                dateOutOfRangeMessage: "Date is out of range",
                                readOnly: true,
                            },
                            validationRules: [{ type: 'required' }],
                        },
                        {
                            dataField: "remark",
                            colSpan: 2,
                            editorType: 'dxTextBox',
                        },

                    ]
                },
                {
                    itemType: "group",
                    caption: 'Total Information',
                    colCountByScreen: {
                        lg: 3,
                        md: 3,
                        sm: 3,
                    },
                    items: [
                        {
                            dataField: "docDiscountType",
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                dataSource: discountTypeStore,
                                displayExpr: 'text',
                                valueExpr: 'id',
                                searchEnabled: true,
                                showClearButton: true,
                            },
                        },
                        {
                            dataField: "docDiscountPerc",
                            editorType: 'dxNumberBox',
                            editorOptions: {
                                format: '#0.00',
                                min: 0,
                                max: 100,
                                readOnly: true,
                                onValueChanged: () => {
                                    setTimeout(() => {
                                        recalulateDocTotal()
                                    }, 200)
                                }
                            },
                            customizeText: function (cellInfo) {
                                if (cellInfo.value)
                                    return cellInfo.value + " %";
                            },
                            format: '#0.00',
                            width: 100,
                        },
                        {
                            dataField: "docDiscountAmt",
                            editorType: 'dxNumberBox',
                            editorOptions: {
                                format: '#,##0.##',
                                min: 0,
                                value: 0,
                                onValueChanged: () => {
                                    setTimeout(() => {
                                        recalulateDocTotal()
                                    }, 200)
                                }
                            }
                        },
                        {
                            dataField: "docTotalAmt",
                            editorType: 'dxNumberBox',
                            editorOptions: {
                                readOnly: true,
                                elementAttr: {
                                    class: "priceTotalStyleBox"
                                },
                                format: '#,##0.##',
                                min: 0,
                            },
                        },
                        {
                            dataField: "docTotalAmtAfterTax",
                            editorType: 'dxNumberBox',
                            editorOptions: {
                                readOnly: true,
                                elementAttr: {
                                    class: "priceTotalStyleBox"
                                },
                                format: '#,##0.##',
                                min: 0,
                            }
                        }
                    ]
                },
            ],
            onFieldDataChanged: (e) => {
                // compare 2 objects to disable/enable save button
                if (e.dataField == 'businessPartnerId' && e.value) {
                    let newEditingOption = {
                        ...grid.dxDataGrid('instance').option("editing"),
                        allowAdding: true,
                        allowUpdating: true,
                        allowDeleting: true,
                    }
                    grid.dxDataGrid('instance').option('editing', newEditingOption)
                    $('#addNewDetailButton').dxButton('instance').option('visible', true)
                }
            },
            onContentReady: (e) => {
                let openState = !Boolean(currentData.header.docStatus)
                let docDiscountType = e.component.getEditor('docDiscountType')
                let docDiscountPerc = e.component.getEditor('docDiscountPerc')
                let docDiscountAmt = e.component.getEditor('docDiscountAmt')
                if (openState)
                    switch (docDiscountType.option('value')) {
                        case 0:
                            docDiscountPerc.option('readOnly', true)
                            docDiscountAmt.option('readOnly', false)
                            break;
                        case 1:
                        case 2:
                            docDiscountPerc.option('readOnly', false)
                            docDiscountAmt.option('readOnly', true)
                            break;
                        default:
                            docDiscountPerc.option('readOnly', false)
                            docDiscountAmt.option('readOnly', false)
                            break;
                    }
                docDiscountType.option('onSelectionChanged', () => {
                    docDiscountPerc.option('value', 0)
                    docDiscountAmt.option('value', 0)
                    setTimeout(() => {
                        recalulateDocTotal()
                    }, 200)
                })

            }
        })
        let formInstance = form.dxForm('instance')
        savedFormData = { ...formInstance.option('formData') }
        let resizeBox = $('<div>').dxResizable({
            handles: "bottom",
            maxHeight: 320, // 20 rem
            height: 176,
            minHeight: 32,
            elementAttr: {
                id: "resizeBox",
            }
        }).appendTo(formContainer)
        form.appendTo(resizeBox)
        renderDetailForm(details, formContainer, docId, Boolean(header.docStatus))

    }
    function renderDetailForm(detailsData, itemElement, docId, docStatus) {
        if (!detailsData) detailsData = []
        grid = $('<div id="detailsDataGrids" class="flex-grow-1">').css('padding', '0.5rem').css('margin-bottom', '-2rem').css('overflow-y', 'hidden').dxDataGrid({
            dataSource: detailsData || [],
            repaintChangesOnly: true,
            editing: {
                mode: 'batch',
                allowAdding: !Boolean(docStatus) && form.dxForm('instance').getEditor('businessPartnerId').option('value'),
                allowUpdating: !Boolean(docStatus) && form.dxForm('instance').getEditor('businessPartnerId').option('value'),
                allowDeleting: !Boolean(docStatus) && form.dxForm('instance').getEditor('businessPartnerId').option('value'),
                useIcons: true,
                texts: {
                    editRow: l("Edit"),
                },
                newRowPosition: 'last'
            },
            showRowLines: true,
            columnAutoWidth: true,
            showColumnLines: true,
            showRowLines: true,
            searchPanel: {
                visible: true
            },
            allowColumnResizing: true,
            rowAlternationEnabled: true,
            columnResizingMode: 'widget',
            columnChooser: {
                enabled: true,
                mode: "select"
            },
            groupPanel: {
                allowColumnDragging: false,
                visible: false,
            },
            stateStoring: {
                // enabled: true,
                type: 'localStorage',
                storageKey: 'dgSalesRequestDetails',
            },
            toolbar: {
                items: [{
                    widget: 'dxButton',
                    options: {
                        icon: 'add',
                        visible: false,
                        elementAttr: {
                            id: 'addNewDetailButton'
                        }
                    },
                    onClick(e) {
                        $("#popupItems").dxPopup('instance').show()
                    }

                }, "revertButton", "columnChooserButton",]
            },
            columns: [
                {
                    type: 'buttons',
                    caption: l('Actions'),
                    buttons: [{
                        name: 'delete',
                        onClick(e) {
                            let index = currentData.details.findIndex(v => v.itemId == e.row?.data.itemId)
                            if (index > -1)
                                currentData.details.splice(index, 1)
                            e.component.refresh().done(() => {
                                setTimeout(() => {
                                    recalulateDocTotal()
                                }, 200)
                            })
                        }
                    }],
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
                            width: 500,
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
                    setCellValue: function (newData, value, currentRowData) {
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
                            newData.lineAmtAfterTax = newData.priceAfterTax * currentRowData.qty - (currentRowData.discountAmt || 0);
                            newData.lineAmt = newData.price * currentRowData.qty - (currentRowData.discountAmt || 0);
                        }
                    },
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:UOM'),
                    dataField: 'uomId',
                    lookup: {
                        dataSource(e) {
                            if (e?.data?.uomGroupId) {
                                return salesOrderStore.uomGroupWithDetailsDictionary.find(v => v.id === e.data.uomGroupId).detailsDictionary
                            }
                            return salesOrderStore.uOMList
                        },
                        displayExpr: "name",
                        valueExpr: "id"
                    },
                    calculateDisplayValue: (e) => {
                        return salesOrderStore.uOMList.find(v => v.id === e.uomId)?.name || "None"
                    },
                    setCellValue: function (newData, value, currentRowData) {
                        let customerId = form.dxForm('instance').getEditor('businessPartnerId').option('value');
                        let customer = salesOrderStore.customerList.find(x => x.id == customerId);
                        let price = salesOrderStore.priceList.find(x => x.id == customer.priceListId + '|' + currentRowData.itemId + '|' + value)?.value || 0;
                        let priceAfterTax = price + (price * currentRowData.taxRate) / 100;
                        let lineAmtAfterTax = priceAfterTax * currentRowData.qty - (currentRowData.discountAmt || 0);
                        let lineAmt = price * currentRowData.qty - (currentRowData.discountAmt || 0);
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
                        let lineAmtAfterTax = currentRowData.priceAfterTax * currentRowData.qty - (currentRowData.discountAmt || 0);
                        let lineAmt = currentRowData.price * currentRowData.qty - (currentRowData.discountAmt || 0);
                        newData.isFree = value;
                        if (Boolean(value)) {
                            newData.lineAmt = 0
                            newData.lineAmtAfterTax = 0
                        }
                        else {
                            newData.lineAmt = lineAmt
                            newData.lineAmtAfterTax = lineAmtAfterTax
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
                    setCellValue: function (newData, value, currentRowData) {
                        newData.price = value;
                        newData.priceAfterTax = value + (value * currentRowData.taxRate) / 100;
                        newData.lineAmt = (value * currentRowData.qty - (currentRowData.discountAmt || 0)) * (100 - (currentRowData.discountPerc || 0)) / 100;
                        newData.lineAmtAfterTax = (newData.priceAfterTax * currentRowData.qty - (currentRowData.discountAmt || 0)) * (100 - (currentRowData.discountPerc || 0)) / 100
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
                    setCellValue: function (newData, value, currentRowData) {
                        newData.qty = value;
                        newData.lineAmt = (value * currentRowData.price - (currentRowData.discountAmt || 0)) * (100 - (currentRowData.discountPerc || 0)) / 100;
                        newData.lineAmtAfterTax = (currentRowData.priceAfterTax * value - (currentRowData.discountAmt || 0)) * (100 - (currentRowData.discountPerc || 0)) / 100;
                    },
                    validationRules: [{ type: 'required', message: '' }],
                    editorOptions: {
                        min: 1
                    }
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountType'),
                    dataField: 'discountType',
                    setCellValue: (newData, value, currentRowData) => {
                        newData.discountType = value;
                        switch (newData.discountType) {
                            case 0:
                                newData.discountAmt = 0;
                                newData.discountPerc = null
                                break;
                            case 1:
                                newData.discountAmt = null
                                newData.discountPerc = 0
                                break;
                            case 2:
                                newData.discountAmt = null
                                newData.discountPerc = 0
                                break;

                            default:
                                break;
                        }
                    },
                    lookup: {
                        dataSource: discountTypeStore,
                        displayExpr: 'text',
                        valueExpr: 'id',
                    },
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        dataSource: discountTypeStore,
                        displayExpr: 'text',
                        valueExpr: 'id',
                        showClearButton: true,
                    }
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountPerc'),
                    dataField: 'discountPerc',
                    // dataType: 'number',
                    editorType: 'dxNumberBox',
                    editorOptions: {
                        format: '#0.00',
                        min: 0,
                        max: 100,
                    },
                    customizeText: function (cellInfo) {
                        if (cellInfo.value)
                            return cellInfo.value + " %";
                    },
                    format: '#0.00',
                    width: 100,
                    setCellValue: function (newData, value, currentRowData) {
                        newData.discountPerc = value;
                        newData.discountAmt = null
                        switch (currentRowData.discountType) {
                            case 1: // 
                                var discountAmtCal = value * currentRowData.qty * currentRowData.price / 100
                                break;
                            case 2:
                                var discountAmtCal = value * currentRowData.qty * currentRowData.priceAfterTax / 100
                                break;
                        }
                        newData.lineDiscountAmt = discountAmtCal;
                        newData.lineAmt = currentRowData.qty * currentRowData.price - discountAmtCal;
                        newData.lineAmtAfterTax = currentRowData.priceAfterTax * currentRowData.qty - discountAmtCal;
                    },

                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountAmt'),
                    dataField: 'discountAmt',
                    editorType: 'dxNumberBox',
                    editorOptions: {
                        format: '#,##0.##',
                        min: 0,
                    },
                    format: '#,##0.##',
                    width: 100,
                    setCellValue: function (newData, value, currentRowData) {
                        newData.discountAmt = value;
                        newData.discountPerc = null;
                        switch (currentRowData.discountType) {
                            case 0:
                                newData.lineDiscountAmt = value;
                                newData.lineAmt = currentRowData.qty * currentRowData.price - value;
                                newData.lineAmtAfterTax = currentRowData.priceAfterTax * currentRowData.qty - value;
                                break;

                        }
                    },
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
                        column: 'lineAmt',
                        name: "docTotalLineAmt",
                        summaryType: 'sum',
                        valueFormat: '#,##0.##',
                    },
                    {
                        column: 'lineDiscountAmt',
                        name: "docTotalLineDiscountAmt",
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
            onContentReady: async (e) => {
                if (!Boolean(currentData.header.docStatus)) {
                    if (form.dxForm('instance').getEditor('businessPartnerId').option('value'))
                        $('#addNewDetailButton').dxButton('instance').option('visible', true)
                    else {
                        $('#addNewDetailButton').dxButton('instance').option('visible', false)
                    }
                }
                if (grid.dxDataGrid('instance').hasEditData())
                    setTimeout(() => {
                        recalulateDocTotal()
                    }, 200)
            },
            onInitNewRow: (e) => {
                e.data = {
                    ...e.data,
                    isFree: false,
                    price: 0,
                    qty: 1,
                    priceAfterTax: 0,
                    lineAmt: 0,
                    lineAmtAfterTax: 0,
                    transactionType: 0,
                }
            },
            onOptionChanged: (e) => {
                if (gridInitialized) {
                    if (grid?.dxDataGrid('instance') && form?.dxForm('instance')) {
                        $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", grid?.dxDataGrid('instance').hasEditData())

                    }
                }
            },
            onDisposing: () => {
                gridInitialized = false
            },
            onEditorPreparing: (e) => {
                if (e.row?.rowType != 'data') return
                let discountType = e.row.data.discountType
                if (e.dataField == "discountAmt")
                    e.cancel = discountType == 0 ? false : true
                if (e.dataField == "discountPerc")
                    e.cancel = discountType > 0 ? false : true

                // e.editorOptions.onValueChanged = (v) => {
                //     e.setValue(v.value)
                //     setTimeout(() => {
                //         recalulateDocTotal()
                //     }, 200)
                // }

            }
        })
        gridInstance = grid.dxDataGrid('instance')
        loadNavigationButton(docId)
        grid.appendTo(itemElement)
    }
    return {
        renderPopup: async (docId) => {
            if (docId)
                currentData = await salesRequestsHeaderService.getDoc(docId)
            else currentData = { header: {}, details: [] }
            isDocOpen = !Boolean(currentData.header.docStatus)
            if (!popup) popup = $('<div id="popup">')
            popup.dxPopup({
                title: `Sale Request - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[currentData.header.docStatus || 0].text}`,
                showTitle: true,
                height: '99%',
                width: "99%",
                hideOnOutsideClick: false,
                dragEnabled: false,
                contentTemplate: (e) => {
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
                                let newEditingOption = {
                                    ...grid.dxDataGrid('instance').option("editing"),
                                    allowAdding: !Boolean(comingData.previous.header.docStatus),
                                    allowUpdating: !Boolean(comingData.previous.header.docStatus),
                                    allowDeleting: !Boolean(comingData.previous.header.docStatus),
                                }
                                docId = comingData.previous.header.id;
                                form.dxForm("instance").option("formData", comingData.previous.header)
                                savedFormData = { ...form.dxForm('instance').option('formData') }
                                grid.dxDataGrid("instance").option('dataSource', comingData.previous.details)
                                form.dxForm('instance').option("readOnly", Boolean(comingData.previous.header.docStatus))
                                grid.dxDataGrid('instance').option("editing", newEditingOption)
                                $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", Boolean(comingData.previous.header.docStatus))
                                popup.dxPopup('instance').option("title", `Sale Request - #${docId ? comingData.previous.header.docNbr : "New"} - ${docStatusStore[comingData.previous.header.docStatus || 0].text}`)
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
                                let newEditingOption = {
                                    ...grid.dxDataGrid('instance').option("editing"),
                                    allowAdding: !Boolean(comingData.next.header.docStatus),
                                    allowUpdating: !Boolean(comingData.next.header.docStatus),
                                    allowDeleting: !Boolean(comingData.next.header.docStatus),
                                }
                                docId = comingData.next.header.id;
                                form.dxForm("instance").option("formData", comingData.next.header)
                                savedFormData = { ...form.dxForm('instance').option('formData') }
                                grid.dxDataGrid("instance").option('dataSource', comingData.next.details)
                                form.dxForm('instance').option("readOnly", Boolean(comingData.next.header.docStatus))
                                grid.dxDataGrid('instance').option("editing", newEditingOption)
                                $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", Boolean(comingData.next.header.docStatus))
                                popup.dxPopup('instance').option("title", `Sale Request - #${docId ? comingData.next.header.docNbr : "New"} - ${docStatusStore[comingData.next.header.docStatus || 0].text}`)
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
                                                    let newEditingOption = {
                                                        ...grid.dxDataGrid('instance').option("editing"),
                                                        allowAdding: false,
                                                        allowUpdating: false,
                                                        allowDeleting: false,
                                                    }
                                                    notify({ type: 'success', message: "SR Approved" })
                                                    form.dxForm('instance').option("readOnly", true)
                                                    grid.dxDataGrid('instance').option("editing", newEditingOption)
                                                    $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", true)
                                                    $('#saveButtonPopup').dxButton('instance').option('disabled', true);
                                                    popup.dxPopup('instance').option("title", `Sale Request - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[1].text}`)
                                                })
                                                .fail(() => {
                                                    notify({ type: 'error', message: "SR Approve Failed" })
                                                    popup.dxPopup('instance').option("title", `Sale Request - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[0].text}`)
                                                    popup.dxPopup('instance').repaint()
                                                })
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
                                                        let newEditingOption = {
                                                            ...grid.dxDataGrid('instance').option("editing"),
                                                            allowAdding: false,
                                                            allowUpdating: false,
                                                            allowDeleting: false,
                                                        }
                                                        notify({ type: 'success', message: "SR Rejected" })
                                                        form.dxForm('instance').option("readOnly", true)
                                                        grid.dxDataGrid('instance').option("editing", newEditingOption)
                                                        $('#saveButtonPopup').dxButton('instance').option('disabled', true);
                                                        popup.dxPopup('instance').option("title", `Sale Request - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[2].text}`)
                                                    })
                                                    .fail(() => {
                                                        notify({ type: 'error', message: "SR Reject Failed" })
                                                        popup.dxPopup('instance').option("title", `Sale Request - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[0].text}`)
                                                    })
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
                                $('#saveButtonPopup').dxButton('instance').option('disabled', true);
                                grid.dxDataGrid('instance').saveEditData().then((e) => {
                                    currentData.header = form.dxForm('instance').option('formData');
                                    currentData.details = grid.dxDataGrid('instance').getDataSource().items().filter(detail => detail.itemId)
                                    currentData.header.requestDate = new Date().toString();;
                                    if (currentData.details.length < 1) {
                                        return
                                    }
                                    if (docId && currentData.header && currentData.details.length > 0)
                                        salesRequestsHeaderService.updateDoc(docId, currentData)
                                            .done((data) => {
                                                currentData = data
                                                grid.dxDataGrid('instance').option('dataSource', data.details)
                                                $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", false)
                                                grid.dxDataGrid('instance').refresh()
                                                notify({ type: 'success', message: "Updated SR" })
                                            })
                                            .fail(() => {
                                                notify({ type: 'error', message: "SR Update Failed" })
                                                $('#saveButtonPopup').dxButton('instance').option('disabled', false);
                                            })
                                    else
                                        salesRequestsHeaderService.createDoc(currentData)
                                            .done((data) => {
                                                docId = data.header.id
                                                currentData = data
                                                grid.dxDataGrid('instance').option('dataSource', data.details)
                                                grid.dxDataGrid('instance').refresh()
                                                notify({ type: 'success', message: "SR Created" })
                                                $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", false)
                                                popup.dxPopup('instance').option("title", `Sale Request - #${docId ? data.header.docNbr : "New"} - ${docStatusStore[data.header.docStatus || 0].text}`)
                                                loadNavigationButton(docId)
                                            })
                                            .fail(() => {
                                                notify({ type: 'error', message: "SR Create Failed" })
                                                $('#saveButtonPopup').dxButton('instance').option('disabled', false);
                                            })

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
                },
                onContentReady: (e) => {
                    if (docId && !Boolean(currentData.header.docStatus)) { // Open
                        $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", false)
                    }
                    else {
                        $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", true)
                    }
                }
            })
            popup.appendTo('body')
            popup.dxPopup('instance').show()
        },
    }
}
function appendSelectedItems(selectedItems) {
    let gridInstance = $("#detailsDataGrids").dxDataGrid('instance')
    // let items = [...gridInstance.getDataSource().items()]
    // let items = currentData.details || [] // Array[] || []
    if (!currentData.details) currentData.details = []
    preLoad.then((data) => {
        selectedItems.forEach((u) => {
            let priceAfterTax = u.basePrice + (u.basePrice * data.vatList.find(x => x.id == u.vatId).rate) / 100;
            let lineAmtAfterTax = (priceAfterTax * parseInt(u.qty));
            let lineAmt = u.basePrice * u.qty
            // let store = $("#detailsDataGrids").dxDataGrid('instance').getDataSource().store()
            let foundItem = currentData.details.find(item => item?.itemId === u.id && item.isFree === u.isFree)
            if (foundItem) {
                foundItem.qty += u.qty
                foundItem.lineAmtAfterTax += lineAmtAfterTax
                foundItem.lineAmt += lineAmt
            } else {
                currentData.details.push({
                    isFree: u.isFree,
                    id: u.id,
                    itemId: u.id,
                    vatId: u.vatId,
                    taxRate: data.vatList.find(x => x.id == u.vatId).rate,
                    uomId: u.invUomId,
                    price: u.basePrice,
                    qty: parseInt(u.qty),
                    priceAfterTax: priceAfterTax,
                    lineAmtAfterTax: !u.isFree ? lineAmtAfterTax : 0,
                    lineAmt: !u.isFree ? u.basePrice * parseInt(u.qty) : 0,
                    transactionType: 0,
                    uomGroupId: u.uomGroupId
                })
            }
        })
    })
    gridInstance.refresh(true)
    setTimeout(() => {
        recalulateDocTotal()
    }, 200)
}

// isSave
// isNotSave
function debounce(func, delay) {
    let debounceTimer
    return function () {
        const context = this
        const args = arguments
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            func.apply(context, args)
        }, delay)
    }
}

function recalulateDocTotal() {
    let formInstance = $("#form-container").dxForm('instance')
    let gridInstance = $("#detailsDataGrids").dxDataGrid('instance')
    if (!formInstance || !gridInstance) return
    if (gridInstance.hasEditData()) {
        debounce(gridInstance.saveEditData(), 250)
    }
    let { docDiscountType, docDiscountPerc, docDiscountAmt } = formInstance.option('formData')
    let docTotalLineDiscountAmt = gridInstance.getTotalSummaryValue('docTotalLineDiscountAmt') || 0
    let docTotalLineAmt = gridInstance.getTotalSummaryValue('docTotalLineAmt') || 0
    let docTotalLineAmtAfterTax = gridInstance.getTotalSummaryValue('docTotalLineAmtAfterTax') || 0
    let totalDiscountAmt = docTotalLineDiscountAmt + docDiscountAmt
    formInstance.updateData('docTotalLineDiscountAmt', docTotalLineDiscountAmt)
    formInstance.updateData('docTotalLineAmt', docTotalLineAmt)
    formInstance.updateData('docTotalLineAmtAfterTax', docTotalLineAmtAfterTax)
    formInstance.updateData('totalDiscountAmt', totalDiscountAmt);
    switch (docDiscountType) {
        case 0:
            formInstance.updateData('docDiscountAmt', docDiscountAmt);
            formInstance.getEditor('docDiscountPerc').option('readOnly', true);
            formInstance.getEditor('docDiscountAmt').option('readOnly', false);
            formInstance.updateData('docTotalAmt', docTotalLineAmt - docDiscountAmt);
            formInstance.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - docDiscountAmt);
            break;
        case 1:
            var discountAmt = docDiscountPerc * docTotalLineAmt / 100
            formInstance.updateData('docDiscountAmt', 0);
            formInstance.getEditor('docDiscountAmt').option('readOnly', true);
            formInstance.getEditor('docDiscountPerc').option('readOnly', false);
            formInstance.updateData('docTotalAmt', docTotalLineAmt - discountAmt);
            formInstance.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - discountAmt);
            break;
        case 2:
            var discountAmt = docDiscountPerc * docTotalLineAmtAfterTax / 100
            formInstance.updateData('docDiscountAmt', 0);
            formInstance.getEditor('docDiscountAmt').option('readOnly', true);
            formInstance.getEditor('docDiscountPerc').option('readOnly', false);
            formInstance.updateData('docTotalAmt', docTotalLineAmt - discountAmt);
            formInstance.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - discountAmt);
            break;
        default:
            formInstance.getEditor('docDiscountAmt').option('readOnly', true);
            formInstance.getEditor('docDiscountPerc').option('readOnly', true);
            formInstance.getEditor('docDiscountAmt').option('value', 0);
            formInstance.getEditor('docDiscountPerc').option('value', 0);
            formInstance.updateData('docTotalAmt', docTotalLineAmt);
            formInstance.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax);
            break;
    }
    if (currentData.details.length > 0) {
        $('#saveButtonPopup').dxButton('instance').option('disabled', false);
        formInstance.getEditor('businessPartnerId').option('readOnly', true);
    } else {
        formInstance.getEditor('businessPartnerId').option('readOnly', false);
    }
}