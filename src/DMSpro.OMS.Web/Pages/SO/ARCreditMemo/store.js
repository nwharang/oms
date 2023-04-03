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
            if (validUOM.find(e => e.uomId === key))
                uOMList.push(data.uom[key]);
        })

        let employeesList = Object.keys(data.employeeDictionary).map((key) => data.employeeDictionary[key])
        let routesList = Object.keys(data.routeDictionary).map((key) => data.routeDictionary[key])
        let customerEmployeesList = [];
        let customerRoutesList = [];
        Object.keys(data.customersRoutesDictionary).forEach((key) => {
            customerRoutesList.push({ id: key, data: data.customersRoutesDictionary[key].map(cusRoute => routesList.find(route => route.id == cusRoute)) })
        });
        Object.keys(data.customerEmployeesDictionary).forEach((key) => {
            customerEmployeesList.push({ id: key, data: data.customerEmployeesDictionary[key].map(cusEmp => employeesList.find(emp => emp.id == cusEmp)) })
        });
        let specialCustomer = Object.keys(data.customerIdsWithoutRoute).map((key) => data.customerIdsWithoutRoute[key])
        let employeesRoute = []
        let routesEmployee = []
        // employeesInRoutesDictionary
        // routesWithEmployeesDictionary
        Object.keys(data.employeesInRoutesDictionary).forEach((key) => {
            employeesRoute.push({ id: key, data: data.employeesInRoutesDictionary[key].map(empRoute => routesList.find(route => route.id == empRoute)) })
        });
        Object.keys(data.routesWithEmployeesDictionary).forEach((key) => {
            routesEmployee.push({ id: key, data: data.routesWithEmployeesDictionary[key].map(routeEmp => employeesList.find(route => route.id == routeEmp)) })
        });
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
                uomGroupWithDetailsDictionary: Object.keys(data.uomGroupWithDetailsDictionary).map((key) => data.uomGroupWithDetailsDictionary[key]),
                employeesList,
                routesList,
                customerEmployeesList,
                customerRoutesList,
                employeesRoute,
                routesEmployee,
                specialCustomer,
            },
            vatList: Object.keys(data.vat).map((key) => data.vat[key])
        }
    })
}
