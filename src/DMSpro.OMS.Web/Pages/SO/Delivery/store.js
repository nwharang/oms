let store = () => {
    let salesOrderService = window.dMSpro.oMS.mdmService.controllers.salesOrders.salesOrder;
    var mainService = window.dMSpro.oMS.orderService.controllers.deliveries.delivery;
    let employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;

    return {
        getInfoSO: async () => {
            let companyId = (await Common.getCurrentCompany()).id
            return await salesOrderService.getInfoSO({ companyId }, new Date()).then(async result => {
                data = (await Common.parseJSON(result)).soInfo;
                console.log(data);
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
                    if (validUOM.find(e => e.uomId === key))
                        uOMList.push(data.uom[key]);
                })
                return {
                    companyId,
                    salesOrderStore: {
                        customerList: Object.keys(data.customerDictionary).map((key) => data.customerDictionary[key]),
                        priceList: Object.keys(data.priceDictionary).map(function (key) {
                            return { id: key, value: data.priceDictionary[key] };
                        }),
                        itemList,
                        uOMList,
                        uomGroupList: Object.keys(data.uomGroup).map((key) => data.uomGroup[key]),
                        itemGroupList: Object.keys(data.itemsInItemGroupsDictionary).map((key) => data.itemsInItemGroupsDictionary[key]),
                        uomGroupWithDetailsDictionary: Object.keys(data.uomGroupWithDetailsDictionary).map((key) => data.uomGroupWithDetailsDictionary[key]),
                        routeList: Object.keys(data.routeDictionary).map((key) => data.routeDictionary[key]),
                        employeeList: Object.keys(data.customersRoutesItemGroupsDictionary).map((key) => data.customersRoutesItemGroupsDictionary[key]),
                    },
                    vatList: Object.keys(data.vat).map((key) => data.vat[key])
                }
            })
        },
        mainStore: new DevExpress.data.CustomStore({
            key: 'id',
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
                mainService.get(key)
                    .done(data => {
                        d.resolve(data);
                    });
                return d.promise();
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