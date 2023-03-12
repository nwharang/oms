var popupVenderInformation;
function showDetails() {
    popupVenderInformation.show();
}

$(function () {
    var l = abp.localization.getResource("OMS");
    var returnOrderService = window.dMSpro.oMS.orderService.controllers.returnOrders.returnOrder;


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

    var returnOrderHeaderStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            returnOrderService.getHeaderListDevextremes(args)
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
            returnOrderService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return returnOrderService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return returnOrderService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return returnOrderService.delete(key);
        }
    });
    var gridPurchaseOrders = $('#dgReturnOrderHeader').dxDataGrid(
        jQuery.extend(dxDataGridConfiguration, {
            dataSource: returnOrderHeaderStore,
            remoteOperations: false,
            stateStoring: { //save state in localStorage
                enabled: false,
                type: 'localStorage',
                storageKey: 'dgReturnOrderHeader',
            },
            toolbar: {
                items: [
                    "groupPanel",
                    {
                        template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("Button.New.ReturnOrder")}" style="height: 36px;"> <i class="fa fa-plus"></i> <span></span> </button>`,
                        onClick() {
                            var newtab = window.open('/SO/ReturnOrder/Details', '_blank');
                            newtab.sessionStorage.removeItem("returnOrderHeaderId");
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
                                var newtab = window.open('/SO/ReturnOrder/Details', '_blank');
                                newtab.sessionStorage.setItem("returnOrderHeaderId", e.row.data.id);
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
                    calculateDisplayValue: "company.name",
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
                    },
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
                },
            ]
        })).dxDataGrid("instance");

    initImportPopup('', 'ReturnOrder_Template', 'dgReturnOrders');
});
