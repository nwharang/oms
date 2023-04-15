$(async function () {
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

    var l = abp.localization.getResource("OMS");
    let { mainStore, docTypeStore, docStatusStore, docSourceStore, discountTypeStore } = store()
    let currentSelectedDoc = new Map();
    let mainGrid = $('#dgSalesOrderHeader').dxDataGrid({
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
            // allowExportSelectedData: true,
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
            storageKey: 'dgSalesOrderHeader',
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
                    widget: "dxButton",
                    options: {
                        icon: 'add',
                    },
                    onClick(e) {
                        preLoad.then((data) => {
                            helper(data).renderPopup()
                        })
                    },
                },
                {
                    widget: "dxDropDownButton",
                    location: 'after',
                    options: {
                        dropDownOptions: {
                            width: 120,
                        },
                        icon: 'preferences',
                        text: 'Actions',
                        items: [
                            {
                                text: "Approve",
                                icon: "check",
                                onClick() {
                                    let array = []
                                    currentSelectedDoc.forEach((e, k) => {
                                        if (e) array.push(k)
                                    })
                                    mainService.createListDODoc(array)
                                        .done(() => {
                                            notify({ type: 'success', message: `${array.length} SOs Approved` })
                                            $('#dgSalesOrderHeader').dxDataGrid('instance').getDataSource().reload()
                                        }
                                        ).fail(() => {
                                            notify({ type: 'error', message: "SOs Approve Failed" })
                                        })
                                }
                            },
                        ]
                    },

                },
                'columnChooserButton',
                "exportButton",
                // {
                //     location: 'after',
                //     widget: 'dxButton',
                //     options: {
                //         icon: "import",
                //         elementAttr: {
                //             class: "import-excel",
                //         },
                //         onClick(e) {
                //             var gridControl = e.element.closest('div.dx-datagrid').parent();
                //             var gridName = gridControl.attr('id');
                //             var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                //             if (popup) popup.show();
                //         },
                //     },
                // },
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
                            preLoad.then((data) => {
                                helper(data).renderPopup(e.row.data.id)
                            })

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
                caption: l('EntityFieldName:OrderService:SalesRequest:Route'),
                dataField: 'routeId',
                calculateDisplayValue: "routeDisplay",
                lookup: {
                    store: "routeDisplay",
                    displayExpr: "name",
                    valueExpr: 'id'
                },
                dataType: 'string',
                validationRules: [{ type: 'required' }],
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:Employee'),
                dataField: 'employeeId',
                calculateDisplayValue: "employeeDisplay",
                lookup: {
                    store: "employeeDisplay",
                    displayExpr: "name",
                    valueExpr: 'id'
                },
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
                lookup: {
                    store: "businessPartnerId",
                    displayExpr: "name",
                    valueExpr: 'id'
                },
                validationRules: [{ type: 'required' }],
                calculateDisplayValue: "businessPartnerDisplay"
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:RequestDate'),
                dataField: 'requestDate',
                dataType: 'date',
                format: 'dd/MM/yyyy',
                validationRules: [{ type: 'required' }],
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocDate'),
                dataField: 'docDate',
                dataType: 'date',
                format: 'dd/MM/yyyy',
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
                format: '#,##0.##',
                width: 100,
                validationRules: [{ type: 'required' }],
                allowEditing: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmt'),
                dataField: 'docTotalAmt',
                format: '#,##0.##',
                dataType: 'number',
                visible: true,
                allowEditing: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmtAfterTax'),
                dataField: 'docTotalAmtAfterTax',
                format: '#,##0.##',
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
                format: '#,##0.##',
                validationRules: [{ type: 'required' }],
                width: 100,
            },

        ],
        summary: {
            totalItems: [
                {
                    column: 'docTotalLineDiscountAmt',
                    summaryType: 'sum',
                    valueFormat: ",##0.###",
                },
                {
                    column: 'docTotalAmt',
                    summaryType: 'sum',
                    valueFormat: ",##0.###",
                },
                {
                    column: 'docTotalAmtAfterTax',
                    summaryType: 'sum',
                    valueFormat: ",##0.###",
                },
                {
                    column: 'docDiscountAmt',
                    summaryType: 'sum',
                    valueFormat: ",##0.###",
                },
            ],
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
        },
    }).dxDataGrid("instance");
    preLoad.then((data) => {
        initChooseItemsPopup([...data.mainStore.itemList].map(e => { e.isFree = false; return e }))
    })
    // initImportPopup('', 'SalesRequest_Template', 'dgSalesOrderHeader');
})
