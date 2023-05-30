let preLoad = getInfoSO()

let helper = ({ companyId, mainStore, vatList }, loadingCallback) => {
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
            mainService.getPrevDoc(docId).done(data => {
                comingData.previous = data
                // Incase user cancel popup before data or button loaded
                try {
                    $('#prevDocButton').dxButton('instance').option("disabled", !Boolean(comingData.previous))
                } catch (e) { }
            })
            mainService.getNextDoc(docId).done(data => {
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
                                readOnly: true,
                                dataSource: {
                                    store: mainStore.customerList,
                                    paginate: true,
                                    pageSize
                                },
                                displayExpr(e) {
                                    if (e)
                                        return `${e.code} - ${e.name}`
                                    return
                                },
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
                            dataField: "employeeId",
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                readOnly: true,
                                dataSource: mainStore.employeesList,
                                valueExpr: 'id',
                                placeholder: "",
                                displayExpr(e) {
                                    if (e)
                                        return `${e.code} ${"- " + e.firstName || ""}`;
                                    return
                                },
                            },
                            lookup: {
                                dataSource: mainStore.employeesList,
                                valueExpr: 'id',
                                displayExpr(e) {
                                    if (e)
                                        return `${e.code} ${"- " + e.name || ""}`;
                                    return
                                },
                            },
                        },
                        {
                            dataField: "routeId",
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                readOnly: true,
                                dataSource: mainStore.routesList,
                                valueExpr: 'id',
                                placeholder: "",
                                displayExpr(e) {
                                    if (e)
                                        return `${e.code} ${"- " + e.name || ""}`;
                                    return
                                },
                            },
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
                let businessPartnerId = e.component.getEditor('businessPartnerId')
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
                routeId = e.component.getEditor('routeId')
                employeeId = e.component.getEditor('employeeId')
                routeId.option("dataSource", {
                    store: mainStore.customerRoutesList.find(arr => arr.id == businessPartnerId.option("value"))?.data || [],
                })
                employeeId.option("dataSource", {
                    store: mainStore.customerEmployeesList.find(arr => arr.id == businessPartnerId.option("value"))?.data || [],
                })
                businessPartnerId.option('onSelectionChanged', ({ selectedItem }) => {
                    if (mainStore.customerEmployeesList.find(eploy => eploy.id === selectedItem.id)?.data.length > 0 && mainStore.customerRoutesList.find(route => route.id === selectedItem.id)?.data.length > 0) {
                        routeId.option("dataSource", {
                            store: mainStore.customerRoutesList.find(arr => arr.id == selectedItem.id).data,
                        })
                        employeeId.option("dataSource", {
                            store: mainStore.customerEmployeesList.find(arr => arr.id == selectedItem.id).data,
                        })
                        routeId.option('value', mainStore.customerRoutesList.find(arr => arr.id == selectedItem.id).data[0].id)
                        employeeId.option('value', mainStore.customerEmployeesList.find(arr => arr.id == selectedItem.id).data[0].id)
                    }
                    else {
                        routeId.option('value', null)
                        employeeId.option('value', null)
                    }
                })
            }
        })
        let resizeBox = $('<div>').dxResizable({
            handles: "bottom",
            maxHeight: 320, // 20 rem
            height: 208,
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
            // stateStoring: {
            //     enabled: true,
            //     type: 'localStorage',
            //     storageKey: 'dgSalesRequestDetails',
            // },
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
                        loadingPanel.show()
                        $("#popupItems").dxPopup('instance').show()
                    }

                }, "columnChooserButton",]
            },
            columns: [
                {
                    type: 'buttons',
                    caption: l('Actions'),
                    buttons: ["delete"],
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
                        dataSource: mainStore.itemList,
                        displayExpr(e) { return e.code + ' - ' + e.name },
                        valueExpr: "id",
                    },
                    allowEditing: false,
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:UOM'),
                    dataField: 'uomId',
                    lookup: {
                        dataSource: (e) => {
                            if (e?.data?.id) {
                                let uomGroupId = mainStore.itemList.find(v => v.id === e.data.itemId).uomGroupId
                                let validUom = mainStore.uomGroupWithDetailsDictionary.find(v => v.id === uomGroupId)?.data
                                if (!validUom) return mainStore.uOMList
                                let dataSource = mainStore.uOMList.filter(e => validUom.find(v => e.id === v.altUOMId))
                                return dataSource
                            }
                            return mainStore.uOMList
                        },
                        displayExpr: (e) => {
                            if (e) return `(${e.code}) - ${e.name}`
                        },
                        valueExpr: "id"
                    },
                    setCellValue: function (newData, value, currentRowData) {
                        newData.uomId = value;
                        if (currentRowData.isFree) {
                            newData.price = 0;
                            newData.priceAfterTax = 0;
                            newData.lineAmtAfterTax = 0;
                            newData.lineAmt = 0;
                            newData.discountType = null
                            newData.discountPerc = null
                            newData.discountAmt = null
                        } else {
                            let customerId = form.dxForm('instance').getEditor('businessPartnerId').option('value');
                            let customer = mainStore.customerList.find(x => x.id == customerId);
                            let price = mainStore.priceList.find(x => x.id == customer.priceListId + '|' + currentRowData.itemId + '|' + value)?.value;
                            if (!price) {
                                let uomGroupId = mainStore.itemList.find(v => v.id === currentRowData.itemId).uomGroupId
                                let validUom = mainStore.uomGroupWithDetailsDictionary.find(v => v.id === uomGroupId)?.data?.find(v => v.altUOMId === value)
                                price = mainStore.priceList.find(x => x.id == customer.priceListId + '|' + currentRowData.itemId + '|' + validUom.baseUOMId)?.value * validUom?.baseQty || 0
                            }
                            let priceAfterTax = price + (price * currentRowData.taxRate) / 100;
                            let lineAmtAfterTax = priceAfterTax * currentRowData.qty - (currentRowData.discountAmt || 0);
                            let lineAmt = price * currentRowData.qty - (currentRowData.discountAmt || 0);
                            newData.price = price;
                            newData.priceAfterTax = priceAfterTax;
                            newData.lineAmtAfterTax = lineAmtAfterTax;
                            newData.lineAmt = lineAmt;
                        }
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
                            newData.lineAmt = 0
                            newData.lineAmtAfterTax = 0
                            newData.lineDiscountAmt = 0
                            newData.discountType = null
                            newData.discountPerc = null
                            newData.discountAmt = null
                            newData.price = 0
                            newData.priceAfterTax = 0
                        }
                        else {
                            let customerId = form.dxForm('instance').getEditor('businessPartnerId').option('value');
                            let customer = mainStore.customerList.find(x => x.id == customerId);
                            let price = mainStore.priceList.find(x => x.id == customer.priceListId + '|' + currentRowData.itemId + '|' + currentRowData.uomId)?.value || 0;
                            let priceAfterTax = price + (price * currentRowData.taxRate) / 100;
                            switch (currentRowData.discountType) {
                                case 0:
                                    var discountAmtCal = currentRowData.discountAmt
                                    break;
                                case 1: // 
                                    var discountAmtCal = currentRowData.discountPerc * currentRowData.qty * currentRowData.price / 100
                                    break;
                                case 2:
                                    var discountAmtCal = currentRowData.discountPerc * currentRowData.qty * currentRowData.priceAfterTax / 100
                                    break;
                            }
                            newData.price = price;
                            newData.priceAfterTax = priceAfterTax;
                            newData.lineAmt = price * currentRowData.qty - (discountAmtCal || 0);
                            newData.lineAmtAfterTax = priceAfterTax * currentRowData.qty - (discountAmtCal || 0)
                            newData.lineDiscountAmt = (discountAmtCal || 0)
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
                        let discountAmt = newData.price * (currentRowData.discountPerc || 0) / 100 - (currentRowData.discountAmt || 0)
                        newData.lineAmt = value * currentRowData.qty - discountAmt;
                        newData.lineAmtAfterTax = newData.priceAfterTax * currentRowData.qty - discountAmt
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
                    setCellValue: function (newData, value, currentRowData) {
                        newData.qty = value;
                        newData.lineAmt = (value * currentRowData.price - (currentRowData.discountAmt || 0)) * (100 - (currentRowData.discountPerc || 0)) / 100;
                        newData.lineAmtAfterTax = (currentRowData.priceAfterTax * value - (currentRowData.discountAmt || 0)) * (100 - (currentRowData.discountPerc || 0)) / 100;
                    },
                    validationRules: [{ type: 'required', message: '' }],
                    editCellTemplate: (cellElement, cellInfo) => {
                        return $("<div/>").dxNumberBox({
                            value: cellInfo.data.qty,
                            min: 1,
                            onValueChanged: (e) => {
                                cellInfo.setValue(e.value);
                            },
                            onKeyDown(e) {
                                const { event } = e;
                                const str = event.key || String.fromCharCode(event.which);
                                if (/^[.,e]$/.test(str)) {
                                    event.preventDefault();
                                }
                            },
                        })
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
                                if (value > currentRowData.qty * currentRowData.price) {
                                    newData.discountAmt = currentRowData.qty * currentRowData.price
                                }
                                else
                                    newData.discountAmt = value
                                newData.lineDiscountAmt = newData.discountAmt;
                                newData.lineAmt = currentRowData.qty * currentRowData.price - newData.discountAmt;
                                newData.lineAmtAfterTax = currentRowData.priceAfterTax * currentRowData.qty - newData.discountAmt;
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
                loadingCallback()
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
                let formInstance = $("#form-container").dxForm('instance')
                if (currentData.details.length > 0) {
                    $('#saveButtonPopup').dxButton('instance').option('disabled', false);
                    formInstance.getEditor('businessPartnerId').option('readOnly', true);
                    formInstance.getEditor('routeId').option('readOnly', true);
                    formInstance.getEditor('employeeId').option('readOnly', true);
                } else {
                    $('#saveButtonPopup').dxButton('instance').option('disabled', true);
                    formInstance.getEditor('businessPartnerId').option('readOnly', false);
                    formInstance.getEditor('routeId').option('readOnly', false);
                    formInstance.getEditor('employeeId').option('readOnly', false);
                }
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
                if (e.dataField == "discountType") {
                    e.editorOptions.readOnly = e.row.data.isFree
                    e.cancel = e.row.data.isFree
                }
                if (e.dataField == "discountAmt")
                    e.editorOptions.readOnly = discountType == 0 && !e.row.data.isFree ? false : true
                if (e.dataField == "discountPerc")
                    e.editorOptions.readOnly = discountType > 0 && !e.row.data.isFree ? false : true
                if (e.dataField == "price")
                    e.editorOptions.readOnly = e.row.data.isFree
            },
            onRowRemoved: (e) => {
                let formInstance = $("#form-container").dxForm('instance')
                if (currentData.details.length > 0) {
                    $('#saveButtonPopup').dxButton('instance').option('disabled', false);
                    formInstance.getEditor('businessPartnerId').option('readOnly', true);
                    formInstance.getEditor('routeId').option('readOnly', true);
                    formInstance.getEditor('employeeId').option('readOnly', true);
                } else {
                    $('#saveButtonPopup').dxButton('instance').option('disabled', true);
                    formInstance.getEditor('businessPartnerId').option('readOnly', false);
                    formInstance.getEditor('routeId').option('readOnly', false);
                    formInstance.getEditor('employeeId').option('readOnly', false);
                }
            }
        })
        gridInstance = grid.dxDataGrid('instance')
        loadNavigationButton(docId)
        grid.appendTo(itemElement)
    }
    return {
        renderPopup: async (docId) => {
            if (docId)
                currentData = await mainService.getDoc(docId)
            else currentData = { header: {}, details: [] }
            isDocOpen = !Boolean(currentData.header.docStatus)
            if (!popup) popup = $('<div id="popup">')
            popup.dxPopup({
                title: `Sale Order - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[currentData.header.docStatus || 0].text}`,
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
                                let formInstance = form.dxForm("instance")
                                let gridInstance = grid.dxDataGrid("instance")
                                let popupInstance = popup.dxPopup('instance')
                                popupInstance.beginUpdate()
                                docId = comingData.previous.header.id;
                                let newEditingOption = {
                                    ...grid.dxDataGrid('instance').option("editing"),
                                    allowAdding: !Boolean(comingData.previous.header.docStatus),
                                    allowUpdating: !Boolean(comingData.previous.header.docStatus),
                                    allowDeleting: !Boolean(comingData.previous.header.docStatus),
                                }
                                currentData = comingData.previous
                                formInstance.option("formData", comingData.previous.header)
                                gridInstance.option('dataSource', comingData.previous.details)
                                formInstance.option("readOnly", Boolean(comingData.previous.header.docStatus))
                                gridInstance.option("editing", newEditingOption)
                                $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", Boolean(comingData.previous.header.docStatus))
                                popupInstance.option("title", `Sale Order - #${docId ? comingData.previous.header.docNbr : "New"} - ${docStatusStore[comingData.previous.header.docStatus || 0].text}`)
                                if (currentData.details.length > 0) {
                                    $('#saveButtonPopup').dxButton('instance').option('disabled', false);
                                    formInstance.getEditor('businessPartnerId').option('readOnly', true);
                                    formInstance.getEditor('routeId').option('readOnly', true);
                                    formInstance.getEditor('employeeId').option('readOnly', true);
                                } else {
                                    $('#saveButtonPopup').dxButton('instance').option('disabled', true);
                                    formInstance.getEditor('businessPartnerId').option('readOnly', false);
                                    formInstance.getEditor('routeId').option('readOnly', false);
                                    formInstance.getEditor('employeeId').option('readOnly', false);
                                }
                                loadNavigationButton(docId)
                                popupInstance.endUpdate()
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
                                let formInstance = form.dxForm("instance")
                                let gridInstance = grid.dxDataGrid("instance")
                                let popupInstance = popup.dxPopup('instance')
                                popupInstance.beginUpdate()
                                docId = comingData.next.header.id;
                                let newEditingOption = {
                                    ...grid.dxDataGrid('instance').option("editing"),
                                    allowAdding: !Boolean(comingData.next.header.docStatus),
                                    allowUpdating: !Boolean(comingData.next.header.docStatus),
                                    allowDeleting: !Boolean(comingData.next.header.docStatus),
                                }
                                currentData = comingData.next
                                formInstance.option("formData", comingData.next.header)
                                gridInstance.option('dataSource', comingData.next.details)
                                formInstance.option("readOnly", Boolean(comingData.next.header.docStatus))
                                gridInstance.option("editing", newEditingOption)
                                $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", Boolean(comingData.next.header.docStatus))
                                popupInstance.option("title", `Sale Order - #${docId ? comingData.next.header.docNbr : "New"} - ${docStatusStore[comingData.next.header.docStatus || 0].text}`)
                                if (currentData.details.length > 0) {
                                    $('#saveButtonPopup').dxButton('instance').option('disabled', false);
                                    formInstance.getEditor('businessPartnerId').option('readOnly', true);
                                    formInstance.getEditor('routeId').option('readOnly', true);
                                    formInstance.getEditor('employeeId').option('readOnly', true);
                                } else {
                                    $('#saveButtonPopup').dxButton('instance').option('disabled', true);
                                    formInstance.getEditor('businessPartnerId').option('readOnly', false);
                                    formInstance.getEditor('routeId').option('readOnly', false);
                                    formInstance.getEditor('employeeId').option('readOnly', false);
                                }
                                loadNavigationButton(docId)
                                popupInstance.endUpdate()
                            }
                        }
                    },
                    {
                        widget: "dxDropDownButton",
                        location: "after",
                        toolbar: "bottom",
                        options: {
                            dropDownOptions: {
                                width: 120,
                            },
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
                                            mainService.createListDODoc([docId])
                                                .done(() => {
                                                    let newEditingOption = {
                                                        ...grid.dxDataGrid('instance').option("editing"),
                                                        allowAdding: false,
                                                        allowUpdating: false,
                                                        allowDeleting: false,
                                                    }
                                                    notify({ type: 'success', message: "SO Approved" })
                                                    form.dxForm('instance').option("readOnly", true)
                                                    grid.dxDataGrid('instance').option("editing", newEditingOption)
                                                    $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", true)
                                                    $('#saveButtonPopup').dxButton('instance').option('disabled', true);
                                                    popup.dxPopup('instance').option("title", `Sale Order - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[1].text}`)
                                                })
                                                .fail(() => {
                                                    notify({ type: 'error', message: "SO Approve Failed" })
                                                    popup.dxPopup('instance').option("title", `Sale Order - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[0].text}`)
                                                    popup.dxPopup('instance').repaint()
                                                })
                                    }
                                },
                                {
                                    text: "Reject",
                                    icon: "close",
                                    onClick: () => DevExpress.ui.dialog.confirm("<i> Do you wish to continue this action?</i>", "Rejecting Sale Order")
                                        .done((e) => {
                                            if (e) {
                                                mainService.cancelDoc(docId)
                                                    .done(() => {
                                                        let newEditingOption = {
                                                            ...grid.dxDataGrid('instance').option("editing"),
                                                            allowAdding: false,
                                                            allowUpdating: false,
                                                            allowDeleting: false,
                                                        }
                                                        notify({ type: 'success', message: "SO Rejected" })
                                                        form.dxForm('instance').option("readOnly", true)
                                                        grid.dxDataGrid('instance').option("editing", newEditingOption)
                                                        $('#saveButtonPopup').dxButton('instance').option('disabled', true);
                                                        popup.dxPopup('instance').option("title", `Sale Order - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[2].text}`)
                                                    })
                                                    .fail(() => {
                                                        notify({ type: 'error', message: "SO Reject Failed" })
                                                        popup.dxPopup('instance').option("title", `Sale Order - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[0].text}`)
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
                                    let tempData = grid.dxDataGrid('instance').getDataSource().store().load()
                                    currentData.header.requestDate = new Date().toString();
                                    if (currentData.details.length < 1) {
                                        return
                                    }
                                    tempData.then((data) => {
                                        currentData.details = data.filter(detail => detail.itemId)
                                        if (docId && currentData.header && currentData.details.length > 0)
                                            mainService.updateDoc(docId, currentData)
                                                .done((data) => {
                                                    currentData = data
                                                    grid.dxDataGrid('instance').option('dataSource', data.details)
                                                    grid.dxDataGrid('instance').refresh()
                                                    notify({ type: 'success', message: "Updated SO" })
                                                    $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", false)
                                                })
                                                .fail(() => {
                                                    notify({ type: 'error', message: "SO Update Failed" })
                                                    $('#saveButtonPopup').dxButton('instance').option('disabled', false);
                                                })
                                        else
                                            mainService.createDoc(currentData)
                                                .done((data) => {
                                                    docId = data.header.id
                                                    currentData = data
                                                    grid.dxDataGrid('instance').option('dataSource', data.details)
                                                    grid.dxDataGrid('instance').refresh()
                                                    notify({ type: 'success', message: "SO Created" })
                                                    $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", false)
                                                    popup.dxPopup('instance').option("title", `Sale Order - #${docId ? data.header.docNbr : "New"} - ${docStatusStore[data.header.docStatus || 0].text}`)
                                                    loadNavigationButton(docId)
                                                })
                                                .fail(() => {
                                                    notify({ type: 'error', message: "SO Create Failed" })
                                                    $('#saveButtonPopup').dxButton('instance').option('disabled', false);
                                                })

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
                                $('#dgSalesOrderHeader').dxDataGrid('instance').getDataSource().reload()
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
    if (!currentData.details) currentData.details = []
    preLoad.then(({ mainStore, vatList }) => {
        selectedItems.forEach((u) => {
            let customerId = $('#form-container').dxForm('instance').getEditor('businessPartnerId').option('value');
            let customer = mainStore.customerList.find(x => x.id == customerId);
            let price = mainStore.priceList.find(x => x.id == customer.priceListId + '|' + u.id + '|' + u.salesUomId)?.value || 0;
            let priceAfterTax = price + (price * vatList.find(x => x.id == u.vatId).rate) / 100;
            let lineAmtAfterTax = (priceAfterTax * parseInt(u.qty));
            let lineAmt = price * u.qty
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
                    taxRate: vatList.find(x => x.id == u.vatId).rate,
                    uomId: u.salesUomId,
                    price,
                    priceAfterTax,
                    qty: parseInt(u.qty),
                    lineAmtAfterTax: !u.isFree ? lineAmtAfterTax : 0,
                    lineAmt: !u.isFree ? price * parseInt(u.qty) : 0,
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
    if (!docDiscountPerc) docDiscountPerc = 0
    if (!docDiscountAmt) docDiscountAmt = 0
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
        formInstance.getEditor('routeId').option('readOnly', true);
        formInstance.getEditor('employeeId').option('readOnly', true);
    } else {
        $('#saveButtonPopup').dxButton('instance').option('disabled', true);
        formInstance.getEditor('businessPartnerId').option('readOnly', false);
        formInstance.getEditor('routeId').option('readOnly', false);
        formInstance.getEditor('employeeId').option('readOnly', false);
    }
}