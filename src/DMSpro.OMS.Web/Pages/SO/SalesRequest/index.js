$(async function () {
    let salesRequestsHeaderService = window.dMSpro.oMS.orderService.controllers.salesRequests.salesRequest;
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
    let { salesRequestsHeaderStore, docTypeStore, docStatusStore, docSourceStore, discountTypeStore, getInfoSO } = store()
    let currentSelectedDoc = new Map();
    const InfoSO = await getInfoSO()
    const { renderPopup } = helper(InfoSO)
    let gridSalesRequests = $('#dgSalesRequestHeader').dxDataGrid({
        dataSource: { store: salesRequestsHeaderStore },
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
            storageKey: 'dgSalesRequestHeader',
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
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("Button.New.SalesRequest")}" style="height: 36px;"> <i class="fa fa-plus"></i> <span></span> </button>`,
                    onClick(e) {
                        renderPopup()
                    },
                },
                {
                    widget: "dxDropDownButton",
                    location: 'after',
                    options: {
                        icon: 'preferences',
                        text: 'Actions',
                        width: 120,
                        items: [
                            {
                                text: "Approve",
                                icon: "check",
                                onClick() {
                                    let array = []
                                    currentSelectedDoc.forEach((e, k) => {
                                        if (e) array.push(k)
                                    })
                                    salesRequestsHeaderService.createListSODoc(array)
                                        .done(() => {
                                            notify({ type: 'success', message: `${array.length} SRs Approved` })
                                            $('#dgSalesRequestHeader').dxDataGrid('instance').getDataSource().reload()
                                        }
                                        ).fail(() => {
                                            notify({ type: 'error', message: "SRs Approve Failed" })
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
                type: 'buttons',
                width: 75,
                buttons: [
                    {
                        text: l('Button.ViewDetail'),
                        icon: "info",
                        onClick: function (e) {
                            renderPopup(e.row.data.id)
                        }
                    }
                ],
                headerCellTemplate: (container) => {
                    container.css('cursor', 'auto')
                },
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
                caption: l('EntityFieldName:OrderService:SalesRequest:RequestDate'),
                dataField: 'requestDate',
                dataType: 'date',
                validationRules: [{ type: 'required' }],
                sortOrder: "desc",
                format: 'dd/MM/yyyy',
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocDate'),
                dataField: 'docDate',
                dataType: 'date',
                validationRules: [{ type: 'required' }],
                format: 'dd/MM/yyyy',
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
        onContentReady: (e) => {
            currentSelectedDoc.clear()
            $('.disabledActionCheckboxFormControl').each(function () {
                let id = $(this).attr('id')
                currentSelectedDoc.set(id, false)
            })
            $('.actionCheckboxFormControl').each(function () {
                let id = $(this).attr('id')
                currentSelectedDoc.set(id, false)
            })
        }
    }).dxDataGrid("instance");
    initImportPopup('', 'SalesRequest_Template', 'dgSalesRequestHeader');
});