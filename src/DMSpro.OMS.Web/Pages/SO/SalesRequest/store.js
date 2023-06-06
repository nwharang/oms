let mainService = window.dMSpro.oMS.orderService.controllers.salesRequests.salesRequest;
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
                        result.data.sort((a, b) => Date.parse(a.requestDate) - Date.parse(b.requestDate))
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
            isRenderEmployeeRoute: false,
            isRenderDiscount: true,
            permissionGroup: 'SalesRequests',
            title: l('Page.Title.SalesRequest'),
            action: [
                {
                    text: l('Button.Action.SRToSODoc'),
                    icon: "check",
                    onClick: () => mainService.createListSODoc([docData.docId]).then(() => {
                        docData.popupInstance.hide()
                    })
                },
                {
                    text: l('Button.Action.Cancel'),
                    icon: "close",
                    onClick: () => DevExpress.ui.dialog.confirm(l('ConfirmationMessage:OrderService:SalesRequest:Cancel'), "").done(e => {
                        if (e) mainService.cancelDoc([docData.docId]).then(() => {
                            docData.popupInstance.hide()
                        })
                    })
                }
            ]
        }
    }
}

let getInfoSO = async () => {
    let companyId = (await Common.getCurrentCompany()).id;
    return await salesOrderService.getInfoSO({ companyId }, new Date()).then(async result => {
        data = (await Common.parseJSON(result)).soInfo;
        let validUOM = Object.keys(data.priceDictionary).map(e => {
            key = e.split("|")
            return {
                priceListId: key[0],
                itemId: key[1],
                uomId: key[2],
                value: data.priceDictionary[key]
            }
        })
        itemList = []
        Object.keys(data.item).forEach((key) => {
            // if not in uom valid group then no data return
            if (validUOM.find(e => e.itemId === key)) {
                data.item[key].qty = 1;
                itemList.push(data.item[key]);
            }
        })
        let uOMList = []
        Object.keys(data.uom).forEach((key) => {
            uOMList.push(data.uom[key]);
        })
        let uomGroupWithDetailsDictionary = []
        Object.keys(data.uomGroupWithDetailsDictionary).forEach(key => {
            uomGroupWithDetailsDictionary.push({
                id: key,
                detailsDictionary: Object.keys(data.uomGroupWithDetailsDictionary[key].detailsDictionary).map(key1 => {
                    return {
                        ...data.uomGroupWithDetailsDictionary[key].detailsDictionary[key1],
                        ...data.uom[key1]
                    }
                })
            })
        })

        return {
            companyId,
            mainStore: {
                customerList: Object.keys(data.customerDictionary).map((key) => data.customerDictionary[key]),
                priceList: Object.keys(data.priceDictionary).map(function (key) {
                    return { id: key, value: data.priceDictionary[key] };
                }),
                itemList,
                uOMList,
                uomGroupList: Object.keys(data.uomGroup).map(function (key) {
                    return data.uomGroup[key];
                }),
                itemGroupList: Object.keys(data.itemsInItemGroupsDictionary).map((key) => data.itemsInItemGroupsDictionary[key]),
                uomGroupWithDetailsDictionary: Object.keys(data.uomGroupWithDetailsDictionary).map((key) => {
                    return {
                        id: key,
                        data: [
                            {
                                altQty: 1,
                                baseQty: 1,
                                altUOMId: data.uomGroupWithDetailsDictionary[key].baseUOMId,
                                baseUOMId: data.uomGroupWithDetailsDictionary[key].baseUOMId,
                                isBase: true
                            },
                            ...Object.keys(data.uomGroupWithDetailsDictionary[key].detailsDictionary).map(key1 => {
                                return {
                                    ...data.uomGroupWithDetailsDictionary[key].detailsDictionary[key1],
                                    baseUOMId: data.uomGroupWithDetailsDictionary[key].baseUOMId,
                                }
                            })
                        ]
                    }

                }),
            },
            vatList: Object.keys(data.vat).map((key) => data.vat[key])
        }
    })
}