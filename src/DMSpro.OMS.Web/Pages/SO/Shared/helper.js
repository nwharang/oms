let preLoad = getInfoSO()
$(() => {
    window.massInput = renderMassInput()
})

let helper = async ({ companyId, mainStore }, loadingCallback, option) => {
    if (option) var { docId, navigateData } = option
    let { discountTypeStore, transactionTypeStore, docStatusStore, render } = store()

    // Obj for type definition
    const docData = {
        isOpen: false,
        docId,
        currentData: {
            header: {},
            details: [],
        },
        readOnlyHeader: {},
        readOnlyDetails: [],
        coimngData: {
            next: {},
            previous: {}
        },
        gridInstance: null,
        formInstance: null,
        popupInstance: null,
        actionButton: null,
        saveButton: null,
        element: {
            popup: $('#popup'),
            form: $('<div id="formDataGrid">'),
            grid: $('<div id="detailsDataGrid" style="flex:1 0 auto;">')
        },
        calculateDocTotal: _.debounce(() => {
            // Calculate Doc total
            if (state().isError || !docData.isOpen || !docData.permission.edit || render.isBaseDoc) return
            try {
                let { gridInstance, formInstance } = docData, formData = docData.formInstance.option('formData')
                formInstance.beginUpdate()
                let { docDiscountType, docDiscountPerc, docDiscountAmt } = formData
                if (render.isRenderDiscount) {
                    formInstance.getEditor('docDiscountAmt')?.option('readOnly', docDiscountType != 0)
                    formInstance.getEditor('docDiscountPerc')?.option('readOnly', docDiscountType != 1)
                }
                if (!docDiscountPerc) docDiscountPerc = 0
                if (!docDiscountAmt) docDiscountAmt = 0
                let docTotalLineDiscountAmt = gridInstance.getTotalSummaryValue('docTotalLineDiscountAmt') || 0
                let docTotalLineAmt = gridInstance.getTotalSummaryValue('docTotalLineAmt') || 0
                let docTotalLineAmtAfterTax = gridInstance.getTotalSummaryValue('docTotalLineAmtAfterTax') || 0
                formInstance.updateData('docTotalLineDiscountAmt', docTotalLineDiscountAmt)
                formInstance.updateData('docTotalLineAmt', docTotalLineAmt)
                formInstance.updateData('docTotalLineAmtAfterTax', docTotalLineAmtAfterTax)
                switch (docDiscountType) {
                    case 0:
                        if (docTotalLineAmt - docDiscountAmt < 0) formInstance.updateData('docDiscountAmt', docTotalLineAmt);
                        else formInstance.updateData('docDiscountAmt', docDiscountAmt);
                        formInstance.updateData('docDiscountPerc', 0);
                        formInstance.updateData('docTotalAmt', docTotalLineAmt - docDiscountAmt);
                        formInstance.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - docDiscountAmt);
                        break;
                    case 1:
                        var discountAmt = docDiscountPerc * docTotalLineAmt / 100
                        formInstance.updateData('docDiscountAmt', 0);
                        formInstance.updateData('docTotalAmt', docTotalLineAmt - discountAmt);
                        formInstance.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax - discountAmt);
                        break;
                    default:
                        if (render.isRenderDiscount) {
                            formInstance.getEditor('docDiscountAmt').option('value', 0);
                            formInstance.getEditor('docDiscountPerc').option('value', 0);
                        }
                        formInstance.updateData('docTotalAmt', docTotalLineAmt);
                        formInstance.updateData('docTotalAmtAfterTax', docTotalLineAmtAfterTax);
                        break;
                }

            } catch (e) { console.log(e); }
            finally { docData.formInstance.endUpdate() }
        }, 750),
        /**  @param {object} data - Current Header Data @param {boolean} isOpen - Is Doc Open * @returns {Promise<boolean>} Doc have error ?*/
        validateSOItem: async (data, isOpen) => {
            // have employeeId, routeId but not found in list, OpenMode Only
            let { result } = await salesOrderService.getRouteAndEmployeeOfCustomer(data.businessPartnerId, companyId).then(data => JSON.parse(data))
            let routesList = Object.keys(result.routeDictionary).map((key) => result.routeDictionary[key])
            let employeesList = Object.keys(result.employeeDictionary).map((key) => result.employeeDictionary[key])
            if (data.employeeId)
                var employee = employeesList.find(e => e.id === data.employeeId)
            if (data.routeId)
                var route = routesList.find(e => e.id === data.routeId)
            return Boolean(((data.employeeId && !employee) || (data.routeId && !route)) && isOpen)
        },
        permission: {
            create: Boolean(abp.auth.isGranted(`OrderService.${render.permissionGroup}.Create`)),
            read: Boolean(abp.auth.isGranted(`OrderService.${render.permissionGroup}`)),
            edit: Boolean(abp.auth.isGranted(`OrderService.${render.permissionGroup}.Edit`)),
        },
        isError: null,
    }

    if (docId && !navigateData) docData.currentData = await mainService.getDoc(docId)
    docData.isOpen = !Boolean(docData.currentData.header.docStatus)
    docData.isError = await docData.validateSOItem(docData.currentData.header, docData.isOpen)
    if (navigateData) docData.currentData = navigateData
    docData.readOnlyHeader = _.clone(docData.currentData.header)  // Copy header data for compare determine haveEditData
    docData.readOnlyDetails = _.clone(docData.currentData.details)  // Copy details data for compare determine haveEditData

    const state = () => {
        return {
            isBusinessPartner: Boolean(docData.currentData.details.length > 0 || docData.currentData.header.employeeId || docData.currentData.header.routeId),
            isEmployeeRoute: Boolean(docData.currentData.details.length > 0),
            Render: Boolean(docData.currentData.details.length > 0),
            docDiscountType: Number(docData.currentData.header.docDiscountType),
            isSaveable: _.debounce(() => docData.saveButton.option('disabled', (JSON.stringify(docData.readOnlyDetails.sort()) === JSON.stringify(docData.currentData.details.sort()) && _.isEqual(docData.readOnlyHeader, docData.currentData.header) || !docData.isOpen)), 200),
            isError: docData.isError,
            isBaseDoc: Boolean(render.isBaseDoc && docData.baseDocId)
        }
    }

    function renderPopup() {
        docData.popupInstance = docData.element.popup.dxPopup({
            title: `${render.title} - #${docId ? docData.currentData.header.docNbr : "New"} - ${(() => {
                if (state().isError && docData.isOpen)
                    return "Error"
                return docStatusStore[docData.currentData.header.docStatus || 0].text
            })()}`,
            showTitle: true,
            height: '99%',
            width: "99%",
            animation: null,
            hideOnOutsideClick: false,
            dragEnabled: false,
            contentTemplate: (e) => {
                renderForm()
                renderGrid()
                return $('<div class="w-100 h-100"/>').append($('<div class="w-100 h-100 px-2"/>').append(docData.element.form).append(docData.element.grid)).dxScrollView({
                    scrollByContent: true,
                    scrollByThumb: true,
                    showScrollbar: 'onScroll'
                })
            },
            onHiding: () => $('#dgSOHeader').dxDataGrid('instance').refresh(), // Reload main datagrid
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
                        onClick: (e) => preLoad.then((data) => {
                            loadingPanel.show()
                            helper(data, () => loadingPanel.hide(), { navigateData: docData.coimngData.previous, docId: docData.coimngData.previous.header.id })
                        })
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
                        onClick: (e) => preLoad.then((data) => {
                            loadingPanel.show()
                            helper(data, () => loadingPanel.hide(), { navigateData: docData.coimngData.next, docId: docData.coimngData.next.header.id })
                        })
                    }
                },
                {
                    widget: "dxDropDownButton",
                    location: "after",
                    toolbar: "bottom",
                    options: {
                        dropDownOptions: {
                            width: 230,
                        },
                        icon: 'preferences',
                        text: 'Actions',
                        width: 120,
                        onContentReady: (e) => docData.actionButton = e.component,
                        disabled: !docData.isOpen || !docData.docId || state().isError,
                        items: render.action(docData)
                    },
                },
                {
                    widget: 'dxButton',
                    location: "after",
                    toolbar: "bottom",
                    options: {
                        text: 'Save',
                        icon: 'save',
                        visible: docData.permission.edit,
                        disabled: true,
                        onClick: () => {
                            loadingPanel.show()
                            if (docData.docId) var res = mainService.updateDoc(docData.docId, docData.currentData)
                            else var res = mainService.createDoc(docData.currentData)
                            res.then(() => preLoad.then(async (data) => helper(data, () => loadingPanel.hide(), { navigateData: await res, docId: (await res).header.id })))
                                .catch((err) => { if (err) loadingPanel.hide() })
                        },
                        onContentReady: (e) => docData.saveButton = e.component
                    }
                },
                {
                    widget: "dxButton",
                    location: "after",
                    toolbar: "bottom",
                    options: {
                        text: "Exit",
                        icon: "return",
                    },
                    onClick: () => docData.popupInstance.hide(),
                },
            ],

        }).dxPopup('instance')
    }
    function renderForm() {
        docData.formInstance = docData.element.form.dxForm({
            onFieldDataChanged: (e) => {
                if (state().isError) return
                docData.calculateDocTotal()
                // Match header data to formData - Do not change
                docData.currentData.header = e.component.option('formData')
                // Remake api so need to disable repaint , may change in future
                // Repaint to check error
                // e.component.repaint()
                state().isSaveable()
            },
            labelMode: "floatting",
            colCountByScreen: {
                lg: 2,
                md: 2,
                sm: 2,
                xs: 2,
            },
            formData: {
                requestDate: new Date,
                docTotalLineDiscountAmt: 0,
                docTotalLineAmt: 0,
                docTotalLineAmtAfterTax: 0,
                docTotalAmt: 0,
                docTotalAmtAfterTax: 0,
                docSource: 0,
                docType: 0,
                remark: "",
                companyId,
                ...docData.currentData.header
            },
            readOnly: state().isError || !docData.isOpen || !docData.permission.edit,
            items: [
                {
                    itemType: "group",
                    colCountByScreen: {
                        lg: 2,
                        md: 2,
                        sm: 2,
                    },
                    items: [
                        !(docData.isOpen && !state().isError) && {
                            label: {
                                text: l('EntityFieldName:OrderService:SalesRequest:BusinessPartner')
                            },
                            dataField: "businessPartnerDisplay",
                            editorType: 'dxTextBox',
                            editorOptions: {
                                readOnly: true,
                            },
                        },
                        (docData.isOpen && !state().isError) && {
                            label: {
                                text: l('EntityFieldName:OrderService:SalesRequest:BusinessPartner')
                            },
                            dataField: "businessPartnerId",
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                readOnly: render.isBaseDoc,
                                dataSource: {
                                    store: mainStore.customerList,
                                    paginate: true,
                                    pageSize,
                                },
                                displayExpr: (e) => {
                                    if (e) return `${e.code} - ${e.name}`
                                    return
                                },
                                onValueChanged: async (e) => {
                                    if (!render.isRenderEmployeeRoute) return
                                    loadingPanel.show()
                                    let { result } = await salesOrderService.getRouteAndEmployeeOfCustomer(e.value, companyId).then(data => JSON.parse(data))
                                    let routesList = Object.keys(result.routeDictionary).map((key) => result.routeDictionary[key])
                                    let employeesList = Object.keys(result.employeeDictionary).map((key) => result.employeeDictionary[key])
                                    docData.formInstance.getEditor('routeId').option('dataSource', routesList)
                                    docData.formInstance.getEditor('employeeId').option('dataSource', employeesList)
                                    docData.formInstance.updateData('routeId', routesList.length > 0 ? routesList[0].id : null)
                                    docData.formInstance.updateData('employeeId', employeesList.length > 0 ? employeesList[0].id : null)
                                    loadingPanel.hide()
                                },
                                valueExpr: 'id',
                            },
                            validationRules: [{ type: 'required' }],
                        },
                        {
                            label: {
                                text: l('EntityFieldName:OrderService:SalesRequest:RequestDate')
                            },
                            dataField: "requestDate",
                            editorType: 'dxDateBox',
                            editorOptions: {
                                displayFormat: "dd-MM-yyyy",
                                dateOutOfRangeMessage: "Date is out of range",
                                readOnly: render.isBaseDoc,
                            },
                            validationRules: [{ type: 'required' }],
                        },
                        !(docData.isOpen && !state().isError) && render.isRenderEmployeeRoute && {
                            label: {
                                text: l('EntityFieldName:OrderService:SalesRequest:Employee')
                            },
                            dataField: "employeeDisplay",
                            editorType: 'dxTextBox',
                            editorOptions: {
                                readOnly: true,
                            },
                        },
                        (docData.isOpen && !state().isError) && render.isRenderEmployeeRoute && {
                            label: {
                                text: l('EntityFieldName:OrderService:SalesRequest:Employee')
                            },
                            dataField: "employeeId",
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                readOnly: render.isBaseDoc,
                                valueExpr: 'id',
                                displayExpr: (e) => {
                                    if (e) return `${e.code} ${"- " + e.firstName || ""}`;
                                    return
                                },
                            },
                        },
                        !(docData.isOpen && !state().isError) && render.isRenderEmployeeRoute && {
                            label: {
                                text: l('EntityFieldName:OrderService:SalesRequest:Route')
                            },
                            dataField: "routeDisplay",
                            editorType: 'dxTextBox',
                            editorOptions: {
                                readOnly: true,
                            },
                        },
                        (docData.isOpen && !state().isError) && render.isRenderEmployeeRoute && {
                            label: {
                                text: l('EntityFieldName:OrderService:SalesRequest:Route')
                            },
                            dataField: "routeId",
                            editorType: 'dxSelectBox',
                            editorOptions: {
                                readOnly: render.isBaseDoc,
                                valueExpr: 'id',
                                displayExpr: (e) => {
                                    if (e) return `${e.code} ${"- " + e.name || ""}`;
                                    return
                                },
                            },
                        },
                        {
                            label: {
                                text: l('EntityFieldName:OrderService:SalesRequest:Remark')
                            },
                            dataField: "remark",
                            colSpan: 2,
                            editorType: 'dxTextBox',
                        },
                        {
                            itemType: 'empty',
                            colSpan: 2,
                        }
                    ]
                },
                {
                    itemType: "group",
                    colCountByScreen: {
                        lg: 3,
                        md: 3,
                        sm: 3,
                    },
                    items: [
                        render.isRenderDiscount && {
                            itemType: 'group',
                            colSpan: 3,
                            colCountByScreen: {
                                lg: 3,
                                md: 3,
                                sm: 3,
                            },
                            items: [
                                render.isRenderDiscount && {
                                    label: {
                                        text: l('EntityFieldName:OrderService:SalesRequest:DocDiscountType')
                                    },
                                    dataField: "docDiscountType",
                                    editorType: 'dxSelectBox',
                                    editorOptions: {
                                        dataSource: discountTypeStore,
                                        displayExpr: 'text',
                                        valueExpr: 'id',
                                        searchEnabled: true,
                                        showClearButton: true,
                                        readOnly: render.isBaseDoc,
                                    },
                                },
                                render.isRenderDiscount && {
                                    label: {
                                        text: l('EntityFieldName:OrderService:SalesRequest:DocDiscountPerc')
                                    },
                                    dataField: "docDiscountPerc",
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        readOnly: render.isBaseDoc,
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
                                },
                                render.isRenderDiscount && {
                                    label: {
                                        text: l('EntityFieldName:OrderService:SalesRequest:DocDiscountAmt')
                                    },
                                    dataField: "docDiscountAmt",
                                    editorType: 'dxNumberBox',
                                    editorOptions: {
                                        readOnly: render.isBaseDoc,
                                        format: '#,##0.##',
                                        min: 0,
                                    }
                                },
                            ]
                        },
                        {
                            itemType: 'group',
                            colSpan: 3,
                            colCountByScreen: {
                                lg: 2,
                                md: 2,
                                sm: 2,
                            },
                            items: [
                                {
                                    label: {
                                        text: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmt')
                                    },
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
                                    label: {
                                        text: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmtAfterTax')
                                    },
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
                                },
                            ]
                        },
                    ]
                },
            ],

        }).dxForm('instance')
    }
    function renderGrid() {
        docData.gridInstance = docData.element.grid.dxDataGrid({
            dataSource: docData.currentData.details,
            repaintChangesOnly: true,
            editing: {
                mode: 'batch',
                allowAdding: docData.isOpen && !state().isError && docData.permission.edit && !render.isBaseDoc,
                allowUpdating: docData.isOpen && !state().isError && docData.permission.edit && !render.isBaseDoc,
                allowDeleting: docData.isOpen && !state().isError && docData.permission.edit && !render.isBaseDoc,
                useIcons: true,
                texts: {
                    editRow: l("Edit"),
                },
                newRowPosition: 'last',
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
                storageKey: `dg${render.permissionGroup}Details`,
            },
            paging: {
                enabled: true,
                pageSize
            },
            pager: {
                visible: true,
                showPageSizeSelector: true,
                allowedPageSizes,
                showInfo: true,
                showNavigationButtons: true
            },
            toolbar: {
                items: [{
                    widget: 'dxButton',
                    options: {
                        icon: 'add',
                        visible: docData.isOpen && !state().isError && docData.permission.edit && !state().isBaseDoc,
                    },
                    onClick(e) {
                        if (!state().isError && docData.formInstance.validate().isValid) {
                            loadingPanel.show()
                            window.massInput.popup.show()
                        }
                    }

                }, "columnChooserButton",]
            },
            columns: [
                {
                    type: 'buttons',
                    caption: l('Actions'),
                    buttons: [
                        {
                            text: l("Delete"),
                            icon: 'trash',
                            visible: (e) => docData.isOpen && !state().isError && docData.permission.edit && !state().isBaseDoc,
                            onClick: (e) => {
                                e.component.deleteRow(e.row.rowIndex)
                                e.component.saveEditData().then(() => state().isSaveable())
                            }
                        }
                    ],
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
                    calculateDisplayValue: 'itemDisplay',
                    allowEditing: false,
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequestDetails:UOM'),
                    dataField: 'uomId',
                    lookup: {
                        dataSource: (e) => {
                            if (e?.data?.itemId) {
                                let uomGroupId = e.data.uomGroupId
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
                    setCellValue: async (newData, value, currentRowData) => {
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
                            let customerId = docData.formInstance.getEditor('businessPartnerId').option('value');
                            let { priceListId } = mainStore.customerList.find(x => x.id == customerId);
                            let priceList = await salesOrderService.getPriceOfItemsForSO(priceListId, currentRowData.itemId, { dataType: 'json' }).then(({ result }) => result)
                            let price = priceList[currentRowData.itemId][value];
                            if (!price) {
                                let validUom = mainStore.uomGroupWithDetailsDictionary.find(v => v.id === currentRowData.uomGroupId)?.data?.find(v => v.altUOMId === value)
                                price = priceList[currentRowData.itemId][validUom.baseUOMId] * validUom?.baseQty || 0
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
                    setCellValue: async (newData, value, currentRowData) => {
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
                            let customerId = docData.formInstance.getEditor('businessPartnerId').option('value');
                            let { priceListId } = mainStore.customerList.find(x => x.id == customerId);
                            let priceList = await salesOrderService.getPriceOfItemsForSO(priceListId, currentRowData.itemId, { dataType: 'json' }).then(({ result }) => result)
                            let price = priceList[currentRowData.itemId][currentRowData.uomId];
                            if (!price) {
                                let validUom = mainStore.uomGroupWithDetailsDictionary.find(v => v.id === currentRowData.uomGroupId)?.data?.find(v => v.altUOMId === currentRowData.uomId)
                                price = priceList[currentRowData.itemId][validUom.baseUOMId] * validUom?.baseQty || 0
                            }
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
                        dataSource: mainStore.vatList,
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
                render.isRenderDiscount && {
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
                render.isRenderDiscount && {
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
                render.isRenderDiscount && {
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
                        readOnly: true,
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
            onInitNewRow: (e) => {
                if (state().isError) return
                e.data = {
                    isFree: false,
                    price: 0,
                    qty: 1,
                    priceAfterTax: 0,
                    lineAmt: 0,
                    lineAmtAfterTax: 0,
                    transactionType: 0,
                }
            },
            onContentReady: () => {
                docData.calculateDocTotal()
                let { isSaveable, isBusinessPartner, isEmployeeRoute } = state()
                isSaveable()
                // Should some field in form section should be disabled
                if (!docData.isOpen || state().isError || !docData.permission.edit) return
                docData.formInstance.getEditor('businessPartnerId')?.option('readOnly', isBusinessPartner)
                docData.formInstance.getEditor('employeeId')?.option('readOnly', isEmployeeRoute)
                docData.formInstance.getEditor('routeId')?.option('readOnly', isEmployeeRoute)
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
        }).dxDataGrid("instance")
    }

    renderPopup()
    loadingCallback()
    docData.popupInstance.show()
    if (!docId) return

    mainService.getPrevDoc(docId).then(data => {
        $('#prevDocButton').dxButton('instance').option('disabled', !Boolean(data))
        docData.coimngData.previous = data
    })

    mainService.getNextDoc(docId).then(data => {
        $('#nextDocButton').dxButton('instance').option('disabled', !Boolean(data))
        docData.coimngData.next = data
    })
}

async function appendSelectedItems(selectedItems) {
    loadingPanel.show()
    let gridInstance = $("#detailsDataGrid").dxDataGrid('instance')
    let dataGridDataSource = gridInstance.getDataSource()
    let itemList = await dataGridDataSource.load()
    let { mainStore } = await preLoad
    let customerId = $('#formDataGrid').dxForm('instance').getEditor('businessPartnerId').option('value');
    // Get priceListId            
    let { priceListId } = mainStore.customerList.find(x => x.id == customerId);
    // Call API to get price
    let priceList = await salesOrderService.getPriceOfItemsForSO(priceListId, selectedItems.map(e => e.id), { dataType: 'json' }).then(({ result }) => result)
    selectedItems.forEach(async (u, k) => {
        let price = priceList[u.id][u.salesUOMId]
        if (!price) {
            let validUom = mainStore.uomGroupWithDetailsDictionary.find(v => v.id === u.uomGroupId)?.data?.find(v => v.altUOMId === u.salesUOMId)
            price = priceList[u.id][validUom.baseUOMId] * validUom?.baseQty || 0
        }
        let priceAfterTax = price + (price * mainStore.vatList.find(x => x.id == u.vatId).rate) / 100;
        let lineAmtAfterTax = (priceAfterTax * parseInt(u.qty));
        let lineAmt = price * u.qty
        let foundItem = itemList.find(item => item.itemId === u.id && item.isFree === u.isFree)
        if (foundItem)
            await dataGridDataSource.store().update(foundItem, {
                qty: foundItem.qty + u.qty,
                lineAmtAfterTax: foundItem.lineAmtAfterTax + lineAmtAfterTax,
                lineAmt: foundItem.lineAmt + lineAmt
            })
        else
            await dataGridDataSource.store().insert({
                itemDisplay: `(${u.code}) - ${u.name}`,
                uomDisplay: `${u.salesUOM.code} - ${u.salesUOM.name}`,
                isFree: u.isFree,
                itemId: u.id,
                vatId: u.vatId,
                taxRate: mainStore.vatList.find(x => x.id == u.vatId).rate,
                uomId: u.salesUOMId,
                price,
                priceAfterTax,
                qty: parseInt(u.qty),
                lineAmtAfterTax: !u.isFree ? lineAmtAfterTax : 0,
                lineAmt: !u.isFree ? price * parseInt(u.qty) : 0,
                transactionType: 0,
                uomGroupId: u.uomGroupId,
            })
    })
    loadingPanel.hide()
    gridInstance.refresh(true)
}