$(async function () {
    let deliveryHeaderService = window.dMSpro.oMS.orderService.controllers.deliveries.delivery;
    let salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;

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
    var l = abp.localization.getResource("OMS");
    let { mainStore, employeeProfileStore, docTypeStore, docStatusStore, docSourceStore, discountTypeStore } = store()
    let currentSelectedDoc = new Map()
    const InfoSO = await store().getInfoSO()
    const { renderPopup } = helper(InfoSO)
    let mainDataGrid = $('#dgDeliveryHeader').dxDataGrid({
        dataSource: { store: mainStore },
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        columnAutoWidth: true,
        searchPanel: {
            visible: true
        },
        allowColumnResizing: true,
        allowColumnReordering: true,
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
        columnFixing: {
            enabled: true,
        },
        groupPanel: {
            visible: true,
        },
        export: {
            enabled: true,
            allowExportSelectedData: true,
        },
        onExporting(e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('PurchaseRequests');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'PurchaseRequests.xlsx');
                });
            });
            e.cancel = true;
        },
        headerFilter: {
            visible: true,
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgDeliveryHeader',
        },
        paging: {
            enabled: true,
            pageSize: 10
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 50, 100],
            showInfo: true,
            showNavigationButtons: true
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    widget: "dxDropDownButton",
                    location: 'after',
                    options: {
                        icon: 'preferences',
                        text: 'Actions',
                        width: 150,
                        items: [
                            {
                                text: "Create AR Invoice",
                                onClick() {
                                    let array = []
                                    currentSelectedDoc.forEach((e, k) => {
                                        if (e) array.push(k)
                                    })
                                    deliveryHeaderService.createListARInvoiceDoc(array)
                                        .done(() => {
                                            notify({ type: 'success', message: `${array.length} AR Created` })
                                            $('#dgDeliveryHeader').dxDataGrid('instance').getDataSource().reload()
                                        }
                                        ).fail(() => {
                                            notify({ type: 'error', message: "ARs Create Failed" })
                                        })
                                }
                            },
                            {
                                text: "Create Return Order",
                                onClick() {
                                    let array = []
                                    currentSelectedDoc.forEach((e, k) => {
                                        if (e) array.push(k)
                                    })
                                    deliveryHeaderService.createListRODoc(array)
                                        .done(() => {
                                            notify({ type: 'success', message: `${array.length} ROs Created` })
                                            $('#dgDeliveryHeader').dxDataGrid('instance').getDataSource().reload()
                                        }
                                        ).fail(() => {
                                            notify({ type: 'error', message: "ROs Create Failed" })
                                        })
                                }
                            },
                        ]
                    },

                },
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            class: "import-excel",
                        },
                        onClick(e) {
                            var gridControl = e.element.closest('div.dx-datagrid').parent();
                            var gridName = gridControl.attr('id');
                            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        },
                    },
                },
                "searchPanel"
            ],
        },
        columns: [
            {
                cssClass: "text-center",
                headerCellTemplate(container) {
                    $('<div>').dxCheckBox({
                        onValueChanged: (e) => {
                            $('.actionCheckboxFormControl').each(function () {
                                let id = $(this).attr('id')
                                if (e.value) {
                                    $(this).dxCheckBox('instance').option('value', e.value)
                                    currentSelectedDoc.set(id, true)
                                }
                                else {
                                    $(this).dxCheckBox('instance').option('value', e.value)

                                }
                            })
                        }
                    }).appendTo(container)
                },
                cellTemplate(container, option) {
                    let disabled = Boolean(option.data.docStatus)
                    $('<div>').dxCheckBox({
                        elementAttr: {
                            class: Boolean(option.data.docStatus) ? 'disabledActionCheckboxFormControl' : "actionCheckboxFormControl",
                            id: option.data.id
                        },
                        disabled,
                        onValueChanged: (e) => {
                            currentSelectedDoc.set(e.element.attr('id'), e.value)
                        }
                    }).appendTo(container)
                },
                fixed: true,
                fixedPosition: "left",
                allowExporting: false,
            },
            {
                caption: l("Actions"),
                type: 'buttons',
                buttons: [
                    {
                        text: l('Button.ViewDetail'),
                        icon: "fieldchooser",
                        onClick: function (e) {
                            renderPopup(e.row.data.id)
                        }
                    }
                ],
                fixed: true,
                fixedPosition: "left",
                allowExporting: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocNbr'),
                dataField: 'docNbr',
                dataType: 'string',
                validationRules: [{ type: 'required' }],
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocType'),
                dataField: 'docType',
                lookup: {
                    dataSource: docTypeStore,
                    displayExpr: "text",
                    valueExpr: "id"
                },
                validationRules: [{ type: 'required' }],
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocSource'),
                dataField: 'docSource',
                dataType: 'string',
                lookup: {
                    dataSource: docSourceStore,
                    displayExpr: "text",
                    valueExpr: "id"
                },
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:Remark'),
                dataField: 'remark',
                dataType: 'string'
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:BusinessPartner'),
                editorType: 'dxSelectBox',
                dataField: 'businessPartnerId',
                validationRules: [{ type: 'required' }],
                lookup: {
                    dataSource: InfoSO.salesOrderStore.customerList,
                    displayExpr: 'name',
                    valueExpr: 'id',
                },
            },
            {
                dataField: "routeId",
                editorType: "dxSelectBox",
                editorOptions: {
                    dataSource: {
                        store: InfoSO.salesOrderStore.routeList
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
                dataField: "employeeId",
                editorType: 'dxSelectBox',
                editorOptions: {
                    dataSource: {
                        store: InfoSO.salesOrderStore.employeeList,
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
                caption: l('EntityFieldName:OrderService:SalesRequest:RequestDate'),
                dataField: 'requestDate',
                dataType: 'datetime',
                format: 'M/d/yyyy, HH:mm',
                validationRules: [{ type: 'required' }],
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocDate'),
                dataField: 'docDate',
                dataType: 'datetime',
                format: 'M/d/yyyy, HH:mm',
                validationRules: [{ type: 'required' }],
                visible: false,

            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocStatus'),
                dataField: 'docStatus',
                dataType: 'string',
                lookup: {
                    dataSource: docStatusStore,
                    valueExpr: "id",
                    displayExpr: "text",
                },
                visible: true,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineDiscountAmt'),
                dataField: 'docTotalLineDiscountAmt',
                dataType: 'number',
                width: 100,
                validationRules: [{ type: 'required' }],
                allowEditing: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmt'),
                dataField: 'docTotalLineAmt',
                dataType: 'number',
                visible: true,
                validationRules: [{ type: 'required' }],
                allowEditing: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmtAfterTax'),
                dataField: 'docTotalLineAmtAfterTax',
                dataType: 'number',
                width: 100,
                visible: true,
                validationRules: [{ type: 'required' }],
                allowEditing: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmt'),
                dataField: 'docTotalAmt',
                dataType: 'number',
                visible: true,
                allowEditing: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmtAfterTax'),
                dataField: 'docTotalAmtAfterTax',
                dataType: 'number',
                visible: true,
                validationRules: [{ type: 'required' }],
                allowEditing: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountType'),
                dataField: 'docDiscountType',
                dataType: 'string',
                lookup: {
                    dataSource: discountTypeStore,
                    valueExpr: "id",
                    displayExpr: "text",
                },
                validationRules: [{ type: 'required' }],
                visible: true,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountPerc'),
                dataField: 'docDiscountPerc',
                dataType: 'number',
                validationRules: [{ type: 'required' }],
                format: '#0.00 %',
                width: 100,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountAmt'),
                dataField: 'docDiscountAmt',
                dataType: 'number',
                validationRules: [{ type: 'required' }],
                width: 100,
            },

        ],
        summary: {
            totalItems: [{
                column: 'docTotalLineAmt',
                summaryType: 'sum',
                valueFormat: ",##0.###",
            }, {
                column: 'docTotalLineAmtAfterTax',
                summaryType: 'sum',
                valueFormat: ",##0.###",
            }],
        },
    }).dxDataGrid("instance");

    initImportPopup('', 'Delivery_Template', 'dgDeliveryHeader');
});