let preLoad
try {
    preLoad = getInfoSO();
} catch (error) {
    console.log(error);
}


let helper = ({ companyId, salesOrderStore, vatList }) => {
    let salesRequestsHeaderService = window.dMSpro.oMS.orderService.controllers.salesRequests.salesRequest;
    let { discountTypeStore, transactionTypeStore, docStatusStore } = store()
    let gridInitialized = false, popup, form, grid;
    // Local Store
    let savedFormData = {}
    let currentData = {}
    let comingData = { next: {}, previous: {} }
    let genStoreForDropDownBox = (data) => new DevExpress.data.CustomStore({
        labelMode: 'raw',
        key: 'id',
        load() {
            return data
        }
    })
    let genStoreUpsert = (data) => new DevExpress.data.CustomStore({
        // data : Array[]
        labelMode: 'raw',
        key: 'id',
        load() {
            return data
        },
        insert({ id, arg, incomingData }) {
            // incomingData : Object
            // arg isFree
            let foundItem = data.find(item => item?.id === id && item.isFree === arg)
            if (foundItem) {
                foundItem.qty += incomingData.qty
                foundItem.price += incomingData.price
                foundItem.priceAfterTax += incomingData.priceAfterTax
                foundItem.lineAmtAfterTax += incomingData.lineAmtAfterTax
                foundItem.lineAmt += incomingData.lineAmt
            } else {
                data.push(incomingData)
            }
            return data
        },
        update(id, newData) {
            let foundItem = data.find(item => item?.id === id)
            foundItem = newData
            return data
        },
        remove(id) {
            let foundItemIndex = data.findIndex(item => item?.id === id)
            data.splice(foundItemIndex, 1)
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
    let notify = ({ type = "success", position = "bottom left", message = "Message Placeholder" }) => DevExpress.ui.notify({
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
    function renderForm(e, { header, details }, docId) {
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
                                min: new Date().toString(),
                                dateOutOfRangeMessage: "Date is out of range",
                                disabled: true,
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
                            dataField: "docTotalLineAmtAfterTax",
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
                if (!form?.dxForm('instance') || !grid?.dxDataGrid('instance')) return
                $('#saveButtonPopup').dxButton('instance').option('disabled', compareObject(savedFormData, formInstance.option('formData')))
                $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", !compareObject(savedFormData, formInstance.option('formData')))
                setTimeout(() => {
                    recalulateDocTotal()
                }, 200)
            }
        })
        let formInstance = form.dxForm('instance')
        savedFormData = { ...formInstance.option('formData') }
        let resizeBox = $('<div>').dxResizable({
            handles: "bottom",
            maxHeight: 320, // 20 rem
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
            dataSource: genStoreUpsert(detailsData) || [],
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
            stateStoring: {
                enabled: true,
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
                    buttons: ['edit', 'delete'],
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
                            newData.lineAmtAfterTax = newData.priceAfterTax * currentData.qty - currentData.docDiscountAmt;
                            newData.lineAmt = newData.price * currentData.qty - currentData.docDiscountAmt;
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
                        let lineAmtAfterTax = priceAfterTax * currentData.qty - currentData.docDiscountAmt;
                        let lineAmt = price * currentData.qty - currentData.docDiscountAmt;
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
                            newData.docDiscountType = 0
                            newData.docDiscountAmt = 0
                            newData.lineAmt = 0
                            newData.lineAmtAfterTax = 0
                        }
                        else {
                            let thisData = {}
                            if (detailsData.length > 0)
                                thisData = detailsData?.find(e => e.id === currentRowData.id)
                            newData.price = thisData?.price || 0
                            newData.priceAfterTax = thisData?.priceAfterTax || 0
                            newData.docDiscountType = thisData?.docDiscountType || 0
                            newData.docDiscountAmt = thisData?.docDiscountAmt || 0
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
                        newData.lineAmt = value * currentData.qty - currentData.docDiscountAmt;
                        newData.lineAmtAfterTax = newData.priceAfterTax * currentData.qty - currentData.docDiscountAmt;
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
                        newData.lineAmt = value * currentData.price - currentData.docDiscountAmt;
                        newData.lineAmtAfterTax = currentData.priceAfterTax * value - currentData.docDiscountAmt;
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
                    dataField: 'docDiscountType',
                    lookup: {
                        dataSource: discountTypeStore,
                        displayExpr: 'text',
                        valueExpr: 'id'
                    },
                    // editorOptions: {
                    //     onSelectionChanged: (e) => {
                    //         console.log(e.value);
                    //         switch (e.value) {
                    //             case value:

                    //                 break;

                    //             default:
                    //                 break;
                    //         }
                    //     }
                    // }
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountPerc'),
                    dataField: 'docDiscountPerc',
                    dataType: 'number',
                    editorOptions: {
                        format: '#0.00 %',
                    },
                    format: '#0.00 %',
                    width: 100,
                    setCellValue: function (newData, value, currentData) {
                        newData.docDiscountPerc = value;
                        switch (currentData.docDiscountType) {
                            case 1:
                                newData.docDiscountAmt = currentData.price * value;
                                newData.lineAmt = currentData.qty * currentData.price - newData.docDiscountAmt;
                                newData.lineAmtAfterTax = currentData.priceAfterTax * currentData.qty - newData.docDiscountAmt;
                                break;
                            case 2:
                                newData.docDiscountAmt = currentData.priceAfterTax * value;
                                newData.lineAmt = currentData.qty * currentData.price - newData.docDiscountAmt;
                                newData.lineAmtAfterTax = currentData.priceAfterTax * currentData.qty - newData.docDiscountAmt;
                                break;
                            default:
                                newData.docDiscountPerc = 0;
                                newData.docDiscountAmt = 0;
                        }
                    },
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:DiscountAmt'),
                    dataField: 'docDiscountAmt',
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
                // {
                //     caption: l('EntityFieldName:OrderService:SalesRequestDetails:Warehouse'),
                //     dataField: 'warehouseId',
                //     visible: false
                // },
                // {
                //     caption: l('EntityFieldName:OrderService:SalesRequestDetails:WarehouseLocation'),
                //     dataField: 'warehouseLocationId',
                //     visible: false
                // },

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
                        column: 'docDiscountAmt',
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
            onContentReady: async (e) => {
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
                    docDiscountType: 0,
                    docDiscountAmt: 0,
                    docDiscountPerc: 0,
                    lineAmt: 0,
                    lineAmtAfterTax: 0,
                    transactionType: 0,
                }
            },
            onOptionChanged: () => {
                if (gridInitialized) {
                    if (grid?.dxDataGrid('instance') && form?.dxForm('instance')) {
                        $('#saveButtonPopup').dxButton('instance').option('disabled', !grid?.dxDataGrid('instance').hasEditData())
                        $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", grid?.dxDataGrid('instance').hasEditData())

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

            },
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
                                                        allowAdding: true,
                                                        allowUpdating: true,
                                                        allowDeleting: true,
                                                    }
                                                    notify({ type: 'success', message: "SR Approved" })
                                                    form.dxForm('instance').option("readOnly", true)
                                                    grid.dxDataGrid('instance').option("editing", newEditingOption)
                                                    $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", true)
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
                                                            allowAdding: true,
                                                            allowUpdating: true,
                                                            allowDeleting: true,
                                                        }
                                                        notify({ type: 'success', message: "SR Rejected" })
                                                        form.dxForm('instance').option("readOnly", true)
                                                        grid.dxDataGrid('instance').option("editing", newEditingOption)
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
                                setTimeout(() => {
                                    recalulateDocTotal()
                                }, 200)
                                grid.dxDataGrid('instance').saveEditData().then(() => {
                                    currentData.header = form.dxForm('instance').option('formData');
                                    currentData.details = grid.dxDataGrid('instance').getDataSource().items().filter(detail => detail.itemId)
                                    currentData.header.requestDate = new Date().toString();;
                                    if (currentData.details.length < 1) {
                                        return
                                    }
                                    if (docId && currentData.header && currentData.details.length > 0)
                                        salesRequestsHeaderService.updateDoc(docId, currentData)
                                            .done(() => notify({ type: 'success', message: "Updated SR" }))
                                            .fail(() => notify({ type: 'error', message: "SR Update Failed" }))
                                    else
                                        salesRequestsHeaderService.createDoc(currentData)
                                            .done((data) => {
                                                notify({ type: 'success', message: "SR Created" })
                                                $('#saveButtonPopup').dxButton('instance').option('disabled', true)
                                                docId = data.header.id
                                                popup.dxPopup('instance').option("title", `Sale Request - #${docId ? data.header.docNbr : "New"} - ${docStatusStore[data.header.docStatus || 0].text}`)
                                                loadNavigationButton(docId)
                                            })
                                            .fail(() => {
                                                notify({ type: 'error', message: "SR Create Failed" })
                                                $('#saveButtonPopup').dxButton('instance').option('disabled', false)
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
                onContentReady: () => {
                    if (docId)
                        $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", false)
                    else
                        $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", true)
                }
            })
            popup.appendTo('body')
            popup.dxPopup('instance').show()
        },

    }
}
let appendSelectedItems = (selectedItems) => {
    preLoad.then((data) => {
        selectedItems.forEach((u) => {
            let priceAfterTax = u.basePrice + (u.basePrice * data.vatList.find(x => x.id == u.vatId).rate) / 100;
            let lineAmtAfterTax = (priceAfterTax * parseInt(u.qty)) - 0;
            let gridInstance = $("#detailsDataGrids").dxDataGrid('instance')
            let store = $("#detailsDataGrids").dxDataGrid('instance').getDataSource().store()
            store.insert({
                id: u.id, arg: u.isFree, incomingData: {
                    isFree: u.isFree,
                    id: u.id,
                    itemId: u.id,
                    vatId: u.vatId,
                    taxRate: data.vatList.find(x => x.id == u.vatId).rate,
                    uomId: u.salesUomId,
                    price: u.basePrice,
                    qty: parseInt(u.qty),
                    priceAfterTax: priceAfterTax,
                    lineAmtAfterTax: !u.isFree ? lineAmtAfterTax : 0,
                    lineAmt: !u.isFree ? u.basePrice * parseInt(u.qty) - 0 : 0,
                    docDiscountAmt: 0,
                    docDiscountPerc: 0,
                    docDiscountType: 0,
                    transactionType: 0,
                    uomGroupId: u.uomGroupId
                }
            })
                .then(() => $("#detailsDataGrids").data('dxDataGrid').refresh())

        })
    })
}