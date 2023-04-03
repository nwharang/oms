let preLoad = getInfoSO()

let currentData = {}, isDocOpen
let helper = ({ companyId, mainStore, vatList }) => {
    let { discountTypeStore, transactionTypeStore, docStatusStore } = store()
    let popup, form, grid;
    // Local Store
    let comingData = { next: {}, previous: {} }
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
    function renderForm(e, { header, details }, docId) {
        let defaultNewHeader = {
            requestDate: new Date().toString(),
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
            editing: {
                readOnly: true,

            },
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
                                dataSource: mainStore.customerList,
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
                            dataField: "employeeId",
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                readOnly: true,
                                dataSource: mainStore.employeesList,
                                valueExpr: 'id',
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
                        lg: 2,
                        md: 2,
                        sm: 2,
                    },
                    items: [
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
        })
        let formInstance = form.dxForm('instance')
        savedFormData = { ...formInstance.option('formData') }
        let resizeBox = $('<div>').dxResizable({
            handles: "bottom",
            maxHeight: 320, // 20 rem
            height: 200,
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
                allowAdding: false,
                allowUpdating: false,
                allowDeleting: false,
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
                enabled: true,
                type: 'localStorage',
                storageKey: 'dgDODetails',
            },
            toolbar: {
                items: ["columnChooserButton",]
            },
            columns: [
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
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:UOM'),
                    dataField: 'uomId',
                    lookup: {
                        dataSource: mainStore.uOMList,
                        displayExpr: "name",
                        valueExpr: "id"
                    },
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:IsFree'),
                    dataField: 'isFree',
                    dataType: 'boolean',
                    width: "75",
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
                        readOnly: true,
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
                        column: 'lineAmtAfterTax',
                        name: 'docTotalLineAmtAfterTax',
                        summaryType: 'sum',
                        valueFormat: '#,##0.##',
                    },
                ],
            },
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
                title: `Return Order - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[currentData.header.docStatus || 0].text}`,
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
                                popup.dxPopup('instance').option("title", `Return Order - #${docId ? comingData.previous.header.docNbr : "New"} - ${docStatusStore[comingData.previous.header.docStatus || 0].text}`)
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
                                popup.dxPopup('instance').option("title", `Return Order - #${docId ? comingData.next.header.docNbr : "New"} - ${docStatusStore[comingData.next.header.docStatus || 0].text}`)
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
                                    text: "Close",
                                    icon: "close",
                                    onClick: () => {
                                        if (docId)
                                            mainService.closeDoc(docId)
                                                .done(() => {
                                                    let newEditingOption = {
                                                        ...grid.dxDataGrid('instance').option("editing"),
                                                        allowAdding: false,
                                                        allowUpdating: false,
                                                        allowDeleting: false,
                                                    }
                                                    notify({ type: 'success', message: "Close Return Order Successfully" })
                                                    form.dxForm('instance').option("readOnly", true)
                                                    grid.dxDataGrid('instance').option("editing", newEditingOption)
                                                    $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", true)
                                                    $('#saveButtonPopup').dxButton('instance').option('disabled', true);
                                                    popup.dxPopup('instance').option("title", `Sale Request - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[1].text}`)
                                                })
                                                .fail(() => {
                                                    notify({ type: 'error', message: "Close Credit Memo Failed" })
                                                    popup.dxPopup('instance').option("title", `Sale Request - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[0].text}`)
                                                    popup.dxPopup('instance').repaint()
                                                })
                                    }
                                },
                                {
                                    text: "Cancel",
                                    icon: "clear",
                                    onClick: () => {
                                        if (docId)
                                            mainService.cancelDoc(docId)
                                                .done(() => {
                                                    let newEditingOption = {
                                                        ...grid.dxDataGrid('instance').option("editing"),
                                                        allowAdding: false,
                                                        allowUpdating: false,
                                                        allowDeleting: false,
                                                    }
                                                    notify({ type: 'success', message: "Cancel Return Order Successfully" })
                                                    form.dxForm('instance').option("readOnly", true)
                                                    grid.dxDataGrid('instance').option("editing", newEditingOption)
                                                    $('#actionButtonDetailsPanel').dxDropDownButton('instance').option("disabled", true)
                                                    $('#saveButtonPopup').dxButton('instance').option('disabled', true);
                                                    popup.dxPopup('instance').option("title", `Sale Request - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[1].text}`)
                                                })
                                                .fail(() => {
                                                    notify({ type: 'error', message: "Cancel Credit Memo Failed" })
                                                    popup.dxPopup('instance').option("title", `Sale Request - #${docId ? currentData.header.docNbr : "New"} - ${docStatusStore[0].text}`)
                                                    popup.dxPopup('instance').repaint()
                                                })
                                    }
                                },
                            ]
                        },
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
                                $('#dgReturnOrderHeader').dxDataGrid('instance').getDataSource().reload()
                            }
                        },
                    },
                ],
            })
            popup.appendTo('body')
            popup.dxPopup('instance').show()
        },
    }
}