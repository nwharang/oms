$(function () {
    var l = abp.localization.getResource("OMS");
    var salesRequestsHeaderService = window.dMSpro.oMS.orderService.controllers.salesRequests.salesRequest;
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;

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

            salesRequestsHeaderService.getHeaderListDevextremes(args)
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
            salesRequestsHeaderService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return salesRequestsHeaderService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return salesRequestsHeaderService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return salesRequestsHeaderService.delete(key);
        }
    });

    var companyStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            companyService.getListDevextremes(args)
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
            companyService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    var customerStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            customerService.getListDevextremes(args)
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
            customerService.get(key)
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

    const discountTypeStore = [
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
    ];

    const docSourceStore = [
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
    ];

    const transactionTypeStore = [
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
    const dgSalesRequestHeader = $('#dgSalesRequestHeader').dxDataGrid({
        dataSource: salesRequestsHeaderStore,
        remoteOperations: false,
        cacheEnabled: true,
        export: {
            enabled: true,
            // allowExportSelectedData: true,
        },
        onExporting(e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('SalesRequestHeader');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'SalesRequestHeader.xlsx');
                });
            });
            e.cancel = true;
        },
        showRowLines: true,
        showBorders: true,
        focusedRowEnabled: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnMinWidth: 50,
        columnAutoWidth: true,
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columnFixing: {
            enabled: true,
        },
        filterRow: {
            visible: true,
        },
        groupPanel: {
            visible: true,
        },
        headerFilter: {
            visible: true,
        },
        rowAlternationEnabled: true,
        searchPanel: {
            visible: true
        },
        //scrolling: {
        //    mode: 'standard'
        //},
        stateStoring: { //save state in localStorage
            enabled: false,
            type: 'localStorage',
            storageKey: 'dgSalesRequestHeader',
        },
        paging: {
            enabled: true,
            pageSize: pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100],
            showInfo: true,
            showNavigationButtons: true
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("Button.New.SalesRequest")}" style="height: 36px;"> <i class="fa fa-plus"></i> <span></span> </button>`,
                    onClick() {
                        var newtab = window.open('/SO/SalesRequest/Details', '_blank');
                        newtab.sessionStorage.setItem("SalesRequestModel", null);
                    },
                },
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
                    onClick() {
                        //todo
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
                            var newtab = window.open('/SO/SalesRequest/Details', '_blank');
                            newtab.sessionStorage.setItem("SalesRequestModel", JSON.stringify(e.row.data));
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
                calculateDisplayValue: "name",
                lookup: {
                    dataSource() {
                        return {
                            store: companyStore,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr: "name",
                    valueExpr: "id"
                },
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocType'),
                dataField: 'docType',
                lookup: {
                    dataSource: docTypeStore,
                    displayExpr: "text",
                    valueExpr: "id"
                },
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocDate'),
                dataField: 'docDate',
                dataType: 'datetime'
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DeliveryDate'),
                dataField: 'deliveryDate',
                dataType: 'date',
                visible: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:PostingDate'),
                dataField: 'postingDate',
                dataType: 'datetime',
                visible: false,
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
                caption: l('EntityFieldName:OrderService:SalesRequest:BusinessPartner'),
                dataField: 'businessPartnerDisplay',
                calculateDisplayValue: "name",
                lookup: {
                    dataSource() {
                        return {
                            store: customerStore,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr: "name",
                    valueExpr: "id"
                },
                visible: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:Route'),
                dataField: 'routeDisplay',
                dataType: 'string',
                visible: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:Employee'),
                dataField: 'employeeDisplay',
                dataType: 'string',
                visible: false,
            },

            {
                caption: l('EntityFieldName:OrderService:SalesRequest:LinkedDoc'),
                dataField: 'linkedDoc',
                visible: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:LinkedSFA'),
                dataField: 'linkedSFAId',
                visible: false,
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
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocBaseType'),
                dataField: 'docBaseType',
                dataType: 'number',
                visible: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:BaseDoc'),
                dataField: 'baseDocId',
                dataType: 'string',
                visible: false,
            },
            {
                caption: l('EntityFieldName:OrderService:SalesRequest:DocSource'),
                dataField: 'docSource',
                dataType: 'number',
                visible: false,
            },
        ]
    }).dxDataGrid("instance");

    /****button*****/

    /****function*****/

});