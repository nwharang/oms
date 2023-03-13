﻿$(function () {
    var l = abp.localization.getResource("OMS");
    var salesOrdersHeaderService = window.dMSpro.oMS.orderService.controllers.salesOrders.salesOrder;

    /****custom store*****/
    var salesRequestsHeaderStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            salesOrdersHeaderService.getHeaderListDevextremes(args)
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
            salesOrdersHeaderService.get(key)
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
    const dgSalesOrderHeader = $('#dgSalesOrderHeader').dxDataGrid(
        jQuery.extend(dxDataGridConfiguration, {
            dataSource: salesRequestsHeaderStore,
            remoteOperations: false,
            stateStoring: {
                enabled: false,
                type: 'localStorage',
                storageKey: 'dgSalesOrderHeader',
            },
            toolbar: {
                items: [
                    "groupPanel",
                    {
                        template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("Button.New.SalesRequest")}" style="height: 36px;"> <i class="fa fa-plus"></i> <span></span> </button>`,
                        onClick() {
                            var newtab = window.open('/SO/SalesOrders/Details', '_blank');
                            newtab.sessionStorage.removeItem("SalesOrderHeaderId");
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
                    caption: l("Actions"),
                    type: 'buttons',
                    buttons: [
                        {
                            text: l('Button.ViewDetail'),
                            icon: "fieldchooser",
                            onClick: function (e) {
                                var newtab = window.open('/SO/SalesOrders/Details', '_blank');
                                newtab.sessionStorage.setItem("SalesOrderHeaderId", e.row.data.id);
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
                    dataType: 'string'
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:Company'),
                    dataField: 'companyId',
                    calculateDisplayValue: "company.name"
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocType'),
                    dataField: 'docType',
                    lookup: {
                        dataSource: docTypeStore,
                        displayExpr: "text",
                        valueExpr: "id"
                    }
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocDate'),
                    dataField: 'docDate',
                    dataType: 'datetime'
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:Remark'),
                    dataField: 'remark',
                    dataType: 'string'
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocStatus'),
                    dataField: 'docStatus',
                    dataType: 'string',
                    lookup: {
                        dataSource: docStatusStore,
                        displayExpr: "text",
                        valueExpr: "id"
                    }
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineDiscountAmt'),
                    dataField: 'docTotalLineDiscountAmt',
                    dataType: 'number',
                    visible: true,
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmt'),
                    dataField: 'docTotalLineAmt',
                    dataType: 'number',
                    visible: true,
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmtAfterTax'),
                    dataField: 'docTotalLineAmtAfterTax',
                    dataType: 'number',
                    visible: true,
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountType'),
                    dataField: 'docDiscountType',
                    dataType: 'number',
                    visible: true,
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountPerc'),
                    dataField: 'docDiscountPerc',
                    dataType: 'number',
                    visible: true,
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountAmt'),
                    dataField: 'docDiscountAmt',
                    dataType: 'number',
                    visible: true,
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmt'),
                    dataField: 'docTotalAmt',
                    dataType: 'number',
                    visible: true,
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmtAfterTax'),
                    dataField: 'docTotalAmtAfterTax',
                    dataType: 'number',
                    visible: true,
                }
            ]
        })).dxDataGrid("instance");

    initImportPopup('', 'SalesOrder_Template', 'dgSalesOrderHeader');
});