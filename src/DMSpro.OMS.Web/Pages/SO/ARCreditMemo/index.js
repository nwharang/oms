$(function () {
    var l = abp.localization.getResource("OMS");
    var arCreditMemoService = window.dMSpro.oMS.orderService.controllers.arCreditMemos.arCreditMemo;

    /****custom store*****/
    var arCreditMemoHeaderStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            arCreditMemoService.getHeaderListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            arCreditMemoService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

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

    const docStatusStore = [
        {
            id: 0,
            text: l('EntityFieldName:OrderService:SalesRequest:DocStatus.Open')
        },
        {
            id: 1,
            text: l('EntityFieldName:OrderService:SalesRequest:DocStatus.Released')
        },
        {
            id: 2,
            text: l('EntityFieldName:OrderService:SalesRequest:DocStatus.Cancelled')
        }
    ];

    /****control*****/
    const dgArCreditMemoHeaders = $('#dgArCreditMemoHeaders').dxDataGrid(
        jQuery.extend(dxDataGridConfiguration, {
            dataSource: arCreditMemoHeaderStore,
            stateStoring: {
                enabled: true,
                type: 'localStorage',
                storageKey: 'dgReturnOrderHeader',
            },
            showBorders: true,
            columnAutoWidth: true,
            scrolling: {
                columnRenderingMode: 'virtual',
            },
            searchPanel: {
                visible: true
            },
            allowColumnResizing: true,
            allowColumnReordering: true,
            paging: {
                enabled: true,
                pageSize: pageSize
            },
            rowAlternationEnabled: true,
            filterRow: {
                visible: true,
                applyFilter: 'auto',
            },
            headerFilter: {
                visible: false,
            },
            columnChooser: {
                enabled: true,
                mode: "select"
            },
            pager: {
                visible: true,
                showPageSizeSelector: true,
                allowedPageSizes: allowedPageSizes,
                showInfo: true,
                showNavigationButtons: true
            },
            export: {
                enabled: true,
                // formats: ['excel','pdf'],
                allowExportSelectedData: true,
            },
            groupPanel: {
                visible: true,
            },
            selection: {
                mode: 'multiple',
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
            toolbar: {
                items: [
                    "groupPanel",
                    {
                        template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("Button.New.SalesRequest")}" style="height: 36px;"> <i class="fa fa-plus"></i> <span></span> </button>`,
                        onClick() {
                            var newtab = window.open('/SO/ARCreditMemo/Details', '_blank');
                            newtab.sessionStorage.removeItem("ARCreditMemoHeaderId");
                        },
                    },
                    {
                        location: 'after',
                        template: '<div><button type="button" class="btn btn-light btn-sm dropdown-toggle waves-effect waves-themed hvr-icon-pop" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height:36px"> <i class="fa fa-gear hvr-icon"></i> <span class="">Action</span>  </button><div class="dropdown-menu fadeindown"> <button class="dropdown-item" type="button">Confirm</button></div></div>'
                    },
                    'columnChooserButton',
                    "exportButton",
                    {
                        location: 'after',
                        widget: 'dxButton',
                        options: {
                            icon: "import",
                            elementAttr: {
                                //id: "import-excel",
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
                    caption: l("Actions"),
                    type: 'buttons',
                    buttons: [
                        {
                            text: l('Button.ViewDetail'),
                            icon: "fieldchooser",
                            onClick: function (e) {
                                var newtab = window.open('/SO/ARCreditMemo/Details', '_blank');
                                newtab.sessionStorage.setItem("ARCreditMemoHeaderId", e.row.data.id);
                            }
                        }
                    ],
                    fixed: true,
                    fixedPosition: "left",
                    allowExporting: false,
                    width: 120
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocNbr'),
                    dataField: 'docNbr',
                    dataType: 'string',
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:Company'),
                    dataField: 'companyId',
                    calculateDisplayValue: "company.name",
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocType'),
                    dataField: 'docType',
                    lookup: {
                        dataSource: docTypeStore,
                        displayExpr: "text",
                        valueExpr: "id"
                    },
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocDate'),
                    dataField: 'docDate',
                    dataType: 'datetime',
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:Remark'),
                    dataField: 'remark',
                    dataType: 'string',
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocStatus'),
                    dataField: 'docStatus',
                    dataType: 'string',
                    lookup: {
                        dataSource: docStatusStore,
                        displayExpr: "text",
                        valueExpr: "id"
                    },
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineDiscountAmt'),
                    dataField: 'docTotalLineDiscountAmt',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: true,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmt'),
                    dataField: 'docTotalLineAmt',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: true,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmtAfterTax'),
                    dataField: 'docTotalLineAmtAfterTax',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: true,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountType'),
                    dataField: 'docDiscountType',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: true,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountPerc'),
                    dataField: 'docDiscountPerc',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: true,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountAmt'),
                    dataField: 'docDiscountAmt',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: true,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmt'),
                    dataField: 'docTotalAmt',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: true,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmtAfterTax'),
                    dataField: 'docTotalAmtAfterTax',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: true,
                    width: 200
                }
            ],
            summary: {
                totalItems: [{
                    column: 'docTotalLineAmt',
                    summaryType: 'sum',
                    valueFormat: ",##0.###"
                }, {
                    column: 'docTotalLineAmtAfterTax',
                    summaryType: 'sum',
                    valueFormat: ",##0.###"
                }],
            }
        })).dxDataGrid("instance");

    /****function*****/
    var bc = new BroadcastChannel('ARCreditMemoHeader');
    bc.onmessage = function (ev) {
        if (ev.data == 'reload') {
            dgArCreditMemoHeaders.refresh();
        }
    }

    initImportPopup('', 'ARCreditMemo_Template', 'dgArCreditMemoHeaders');
});