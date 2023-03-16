$(async function () {
    var l = abp.localization.getResource("OMS");
    var salesOrderService = window.dMSpro.oMS.orderService.controllers.salesOrders.salesOrder;

    let companyId = null;
    let company = await Common.getCurrentCompany();
    if (company != null)
        companyId = company.id;

    /****custom store*****/
    var salesOrderStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {

            //console.log(loadOptions)

            if (loadOptions.filter == undefined) {
                loadOptions.filter = ['companyId', '=', companyId];
            } else {
                loadOptions.filter = [loadOptions.filter, 'and', ['companyId', '=', companyId]];
            }

            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            salesOrderService.getHeaderListDevextremes(args)
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
            salesOrderService.get(key)
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
    const dgProcessSalesOrder = $('#dgProcessSalesOrder').dxDataGrid(
        jQuery.extend(dxDataGridConfiguration, {
            dataSource: salesOrderStore,
            remoteOperations: false,
            selection: {
                mode: 'multiple',
            },
            stateStoring: { //save state in localStorage
                enabled: false,
                type: 'localStorage',
                storageKey: 'dgProcessSalesOrder',
            },
            toolbar: {
                items: [
                    {
                        location: 'before',
                        widget: 'dxButton',
                        options: {
                            icon: "fa fa-truck",
                            text: l("Button.DeliveryAll"),
                            onClick(e) {
                                DeliveryAll();
                            },
                        },
                    },
                    "groupPanel",
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
                    caption: l('No.'),
                    alignment: 'center',
                    cellTemplate: function (container, options) {
                        container.text(dgProcessSalesOrder.pageIndex() * dgProcessSalesOrder.pageSize() + options.rowIndex + 1);
                    },
                    allowResizing: false,
                    fixed: true,
                    width: 50
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocDate'),
                    dataField: 'docDate',
                    dataType: 'datetime',
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocNbr'),
                    dataField: 'docNbr',
                    dataType: 'string',
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocStatus'),
                    dataField: 'docStatus',
                    lookup: {
                        dataSource: docStatusStore,
                        displayExpr: "text",
                        valueExpr: "id"
                    },
                    filterValue: 0,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:Employee'),
                    dataField: 'employeeDisplay',
                    calculateDisplayValue: "employeeDisplay",
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:BusinessPartner'),
                    dataField: 'businessPartnerDisplay',
                    calculateDisplayValue: "businessPartnerDisplay",
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
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountAmt'),
                    dataField: 'docDiscountAmt',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: true,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:Remark'),
                    dataField: 'remark',
                    dataType: 'string',
                    visible: true,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:Company'),
                    dataField: 'companyId',
                    calculateDisplayValue: "company.name",
                    visible: false,
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
                    visible: false,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineDiscountAmt'),
                    dataField: 'docTotalLineDiscountAmt',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: false,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmt'),
                    dataField: 'docTotalLineAmt',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: false,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalLineAmtAfterTax'),
                    dataField: 'docTotalLineAmtAfterTax',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: false,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountType'),
                    dataField: 'docDiscountType',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: false,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocDiscountPerc'),
                    dataField: 'docDiscountPerc',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: false,
                    width: 200
                },
                {
                    caption: l('EntityFieldName:OrderService:SalesRequest:DocTotalAmtAfterTax'),
                    dataField: 'docTotalAmtAfterTax',
                    dataType: 'number',
                    format: ",##0.###",
                    visible: false,
                    width: 200
                },

                {
                    caption: l("Actions"),
                    type: 'buttons',
                    buttons: [
                        {
                            text: l('Button.Reject'),
                            cssClass: 'px-1',
                            onClick: function (e) {
                                RejectDelivery(e.row.data.id, false);
                            }
                        },
                        {
                            text: l('Button.Delivery'),
                            cssClass: 'px-1',
                            onClick: function (e) {
                                RejectDelivery(e.row.data.id, true);
                            }
                        },
                    ],
                    fixed: true,
                    fixedPosition: "right",
                    allowExporting: false,
                    width: 120
                },
            ],
            summary: {
                totalItems: [
                    {
                        column: "docTotalAmt",
                        summaryType: "sum",
                        alignment: "right",
                        valueFormat: ",##0.###",
                        displayFormat: `${l('EntityFieldName:OrderService:SalesRequest:DocTotalAmt')}: {0}`
                    },
                    {
                        column: "docDiscountAmt",
                        summaryType: "sum",
                        alignment: "right",
                        valueFormat: ",##0.###",
                        displayFormat: `${l('EntityFieldName:OrderService:SalesRequest:DocDiscountAmt')}: {0}`
                    }
                ]
            }
        })).dxDataGrid("instance");

    /****function*****/
    function RejectDelivery(id, type) {
        if (type) {
            abp.message.confirm(l('ConfirmationMessage.Delivery')).then(function (confirmed) {
                if (confirmed) {
                    salesOrderService.approveDoc(id, { contentType: "application/json" })
                        .done(result => {
                            abp.message.success(l('Congratulations'));
                            dgProcessSalesOrder.refresh();
                        })
                        .fail(result => {
                            var message = result.message;
                            abp.message.error(message);
                        });
                }
            });
        } else {
            abp.message.confirm(l('ConfirmationMessage.Reject')).then(function (confirmed) {
                if (confirmed) {
                    salesOrderService.cancelDoc(id, { contentType: "application/json" })
                        .done(result => {
                            abp.message.success(l('Congratulations'));
                            dgProcessSalesOrder.refresh();
                        })
                        .fail(result => {
                            var message = result.message;
                            abp.message.error(message);
                        });
                }
            });
        }
    }

    function DeliveryAll() {
        abp.message.confirm(l('ConfirmationMessage.DeliveryAll')).then(function (confirmed) {
            if (confirmed) {
                //var selectedRowsData = dgProcessSalesOrder.getSelectedRowsData();
                //let ids = [];
                //selectedRowsData.forEach(rowData => {
                //    ids.push(rowData.id);
                //});

                alert('coming soon!');
            }
        });
    }

    initImportPopup('', 'ProcessSalesOrder_Template', 'dgProcessSalesOrder');
});