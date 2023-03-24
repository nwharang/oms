let store = () => {
    var salesRequestsHeaderService = window.dMSpro.oMS.orderService.controllers.salesRequests.salesRequest;
    let salesOrderService = window.dMSpro.oMS.mdmService.controllers.salesOrders.salesOrder;
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    return {
        getInfoSO: async () => {
            let companyId = (await Common.getCurrentCompany()).id
            return await salesOrderService.getInfoSO({ companyId }, new Date()).then(async result => {
                data = (await Common.parseJSON(result)).soInfo;
                return {
                    companyId,
                    salesOrderStore: {
                        customerList: Object.keys(data.customerDictionary).map((key) => data.customerDictionary[key]),
                        priceList: Object.keys(data.priceDictionary).map(function (key) {
                            return { id: key, value: data.priceDictionary[key] };
                        }),
                        itemList: Object.keys(data.item).map((key) => {
                            data.item[key].qty = 1;
                            return data.item[key];
                        }),
                        uomGroupList: Object.keys(data.uomGroup).map((key) => data.uomGroup[key]),
                        uOMList: Object.keys(data.uom).map((key) => data.uom[key]),
                        itemGroupList: Object.keys(data.itemsInItemGroupsDictionary).map((key) => data.itemsInItemGroupsDictionary[key]),
                    },
                    vatList: Object.keys(data.vat).map((key) => data.vat[key])
                }
            })
        },
        salesRequestsHeaderStore: new DevExpress.data.CustomStore({
            key: 'id',
            // usedefaultSearch: true,
            load(loadOptions) {
                const deferred = $.Deferred();
                const args = {};

                requestOptions.forEach((i) => {
                    if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                        args[i] = JSON.stringify(loadOptions[i]);
                    }
                });

                salesRequestsHeaderService.getHeaderListDevextremes(args)
                    .done(result => {
                        deferred.resolve(result.data, {
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
            {
                id: 2,
                text: l('EntityFieldName:OrderService:SalesRequest:DiscountAfterTax')
            }
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
    }
}