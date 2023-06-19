let mainService = window.dMSpro.oMS.orderService.controllers.salesOrders.salesOrder;
let salesOrderService = window.dMSpro.oMS.mdmService.controllers.salesOrders.salesOrder;

let store = () => {
    return {
        mainStore: new DevExpress.data.CustomStore({
            key: 'id',
            sort: [
                { selector: "requestDate", desc: false }
            ],
            load(loadOptions) {
                const deferred = $.Deferred();
                const args = {};
                requestOptions.forEach((i) => {
                    if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                        args[i] = JSON.stringify(loadOptions[i]);
                    }
                });

                mainService.getHeaderListDevextremes(args)
                    .done(result => {
                        deferred.resolve(result.data.sort((a, b) => Date.parse(b.requestDate) - Date.parse(a.requestDate)), {
                            totalCount: result.totalCount,
                            summary: result.summary,
                            groupCount: result.groupCount,
                        });
                    });

                return deferred.promise();
            }
        }),
        customerInZoneStore: new DevExpress.data.CustomStore({
            key: 'id',
            load(loadOptions) {
                const deferred = $.Deferred();
                const args = {};
                requestOptions.forEach((i) => {
                    if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                        args[i] = JSON.stringify(loadOptions[i]);
                    }
                });
                customerInZoneService.getListDevextremes(args)
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
                return key == 0 ? customerInZoneService.get(key) : null;
            },
        }),
        docTypeStore: [
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
        ],
        docStatusStore: [
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
        ],
        docSourceStore: [
            {
                id: 0,
                text: l('EntityFieldName:OrderService:SalesRequest:Manual')
            },
            {
                id: 1,
                text: l('EntityFieldName:OrderService:SalesRequest:SFA')
            },
            {
                id: 2,
                text: l('EntityFieldName:OrderService:SalesRequest:BonBonShop')
            },
            {
                id: 3,
                text: l('EntityFieldName:OrderService:SalesRequest:Ecommerce')
            }
        ],
        discountTypeStore: [
            {
                id: 0,
                text: l('EntityFieldName:OrderService:SalesRequest:CashDiscount')
            },
            {
                id: 1,
                text: l('EntityFieldName:OrderService:SalesRequest:DiscountBeforeTax')
            },
            // {
            //     id: 2,
            //     text: l('EntityFieldName:OrderService:SalesRequest:DiscountAfterTax')
            // }
        ],
        transactionTypeStore: [
            {
                id: 0,
                text: l('EntityFieldName:OrderService:SalesRequest:Item')
            },
            {
                id: 1,
                text: l('EntityFieldName:OrderService:SalesRequest:Promotion')
            },
            {
                id: 2,
                text: l('EntityFieldName:OrderService:SalesRequest:Sampling')
            },
            {
                id: 3,
                text: l('EntityFieldName:OrderService:SalesRequest:Incentive')
            }
        ],
        render: {
            isRenderEmployeeRoute: true,
            isRenderDiscount: true,
            permissionGroup: 'SalesOrders',
            title: l('Page.Title.SalesOrders'),
            action: (docData) => [
                {
                    text: l('Button.Action.SOToDODoc'),
                    icon: "check",
                    onClick: () => mainService.createListDODoc([docData.docId])
                        .then(() => {
                            docData.popupInstance.hide()
                            notify({ message: 'Success' })
                        })
                        .catch(e => notify({ type: 'error', message: 'Failed' }))
                },
                {
                    text: l('Button.Action.Cancel'),
                    icon: "close",
                    onClick: () => DevExpress.ui.dialog.confirm(l('ConfirmationMessage:OrderService:SalesRequest:Cancel'), "")
                        .done(e => {
                            if (e) mainService.cancelDoc([docData.docId]).then(() => {
                                docData.popupInstance.hide()
                                notify({ message: 'Success' })
                            })
                                .catch(e => notify({ type: 'error', message: 'Failed' }))
                        })
                }
            ]
        }
    }
}