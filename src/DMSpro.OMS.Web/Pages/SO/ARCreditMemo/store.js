let mainService = window.dMSpro.oMS.orderService.controllers.arCreditMemos.arCreditMemo;
let salesOrderService = window.dMSpro.oMS.mdmService.controllers.salesOrders.salesOrder;
let companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;

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
                        deferred.resolve(result.data.sort((a, b) => Date.parse(a.requestDate) - Date.parse(b.requestDate)), {
                            totalCount: result.totalCount,
                            summary: result.summary,
                            groupCount: result.groupCount,
                        });
                    });

                return deferred.promise();
            }
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
            },
            {
                id: 3,
                text: l('In Progress')
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
            isRenderDiscount: false,
            permissionGroup: 'ArCreditMemos',
            title: l('Page.Title.ARCreditMemo'),
            isBaseDoc: true,
            action: (docData) => [
                {
                    text: l('Button.Action.CloseARCM'),
                    icon: "check",
                    onClick: () => mainService.closeDoc(docData.docId)
                        .then(() => {
                            docData.popupInstance.hide()
                            notify({ message: 'Success' })
                        })
                        .catch(e => notify({ type: 'error', message: 'Failed' }))
                },
                {
                    text: l('Button.Action.Cancel'),
                    icon: "close",
                    onClick: () => DevExpress.ui.dialog.confirm(l('ConfirmationMessage:OrderService:SalesRequest:Cancel'), "").done(e => {
                        if (e) mainService.cancelDoc(docData.docId)
                            .then(() => {
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
