$(function () {
    // language texts
    var l = abp.localization.getResource("MdmService");

    var dataSales = [
        {
            id: 1,
            itemCode: "item1",
            itemName: "John Heart",
            UOM: "Thung",
            qty: 3,
            issueQty: 0,
            price: 100000,
            lineAmountNoTax: 400000,
            discount: 0,
            discountLineAmount: 0,
            taxRate: "10",
            taxRateAmount: 40000,
            lineAmt: 440000,
            baseQty: 40,
            baseUOM: "Chai",
            warehourse: "Main",
            WHLocation: "ABC bcx",
            taxCode: "VAT10",
            tranType: "Selling",
        },
        {
            id: 2,
            itemCode: "item2",
            itemName: "San pham 2",
            UOM: "Thung",
            qty: 3,
            issueQty: 0,
            price: 100000,
            lineAmountNoTax: 300000,
            discount: 20,
            discountLineAmount: 60,
            taxRate: "10",
            taxRateAmount: 50000,
            lineAmt: 240000,
            baseQty: 30,
            baseUOM: "Chai",
            warehourse: "Main",
            WHLocation: "ABC bcx",
            taxCode: "VAT10",
            tranType: "Selling",
        },
        {
            id: 3,
            itemCode: "item3",
            itemName: "San pham 3",
            UOM: "Lon",
            qty: 4,
            issueQty: 0,
            price: 100000,
            lineAmountNoTax: 300000,
            discount: 0,
            discountLineAmount: 0,
            taxRate: "10",
            taxRateAmount: 33000,
            lineAmt: 530000,
            baseQty: 30,
            baseUOM: "Chai",
            warehourse: "Main",
            WHLocation: "ABC bcx",
            taxCode: "VAT10",
            tranType: "Sampling",
        }
    ];

    $("#frmSalesOrders").dxForm({
        formData: {
            customerCode: "cus001",
            customerName: "Cus Name 1",
            company: "CEO Company",
            SRNbr: "hsdjsd939239j23",
            orderType: "JHeart",
            docDate: new Date(),
            deliveryDate: new Date(2022, 4, 13),
            postingDate: new Date(),
            remark: "",
            outletID: "01234567890",
            isActive: true,
            routeID: "1",
            route: "Route 1",
            employeeID: "JS13343JDD3",
            salesman: "Jay ne",
            status: "Open",
            linkedNbr: "JB893",
            SFAlinkedNbr: "AH2002",
            totalAmtNoTax: 400,
            totalAmtDiscount: 35,
            totalTaxAmt: 20,
            totalAmt: 420,
            docSource: "Đơn Manual",
        }, 
        colCount: 2,
        items: [
            {
                itemType: "group",
                items: [
                    {
                        dataField: "SRNbr",
                        cssClass: "pr-5"
                    },
                    {
                        dataField: "status",
                        cssClass: "pr-5"
                    },
                    {
                        dataField: "docDate",
                        cssClass: "pr-5"
                    },
                    {
                        dataField: "deliveryDate",
                        cssClass: "pr-5"
                    },
                    {
                        dataField: "postingDate",
                        cssClass: "pr-5"
                    },
                    {
                        dataField: "orderType",
                        cssClass: "pr-5"
                    },
                    {
                        dataField: "remark",
                        cssClass: "pr-5"
                    }
                ]
            },
            {
                itemType: "group",
                items: [
                    {
                        dataField: "customerCode",
                        cssClass: "pl-5"
                    },
                    {
                        dataField: "customerName",
                        cssClass: "pl-5"
                    },
                    {
                        dataField: "route",
                        cssClass: "pl-5"
                    },
                    {
                        dataField: "salesman",
                        cssClass: "pl-5"
                    },
                    {
                        dataField: "linkedNbr",
                        cssClass: "pl-5"
                    },
                    {
                        dataField: "SFAlinkedNbr",
                        cssClass: "pl-5"
                    }
                ]
            }
        ]
    }); 

    var gridSales = $('#dgSalesOrders').dxDataGrid({
        dataSource: dataSales,
        keyExpr: "id",
        showBorders: true,
        //filterRow: {
        //    visible: true
        //},
        searchPanel: {
            visible: true
        },
        scrolling: {
            mode: 'standard'
        },
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        //headerFilter: {
        //    visible: true,
        //},
        paging:
        {
            pageSize: 10,
        },
        pager: {
            visible: true,
            allowedPageSizes: [10, 20, 'all'],
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true,
        },
        columns: [
            {
                dataField: 'itemCode',
                caption: l("Item Code"),
                width: 110,
                dataType: 'string',
            },
            {
                dataField: 'itemName',
                caption: l("Item Name"),
                width: 200,
                dataType: 'string',
            },
            {
                dataField: 'UOM',
                caption: l("UOM"),
                width: 90,
                dataType: 'string',
            },
            {
                dataField: 'qty',
                caption: l("Qty"),
                width: 70,
                dataType: 'number',
            },
            {
                dataField: 'issueQty',
                caption: l("Issue Qty"),
                width: 90,
                dataType: 'number',
            },
            {
                dataField: 'price',
                caption: l("Price"),
                width: 110,
                dataType: 'number',
                format: 'currency',
            },
            {
                dataField: 'lineAmountNoTax',
                caption: l("LineAmtNoTax"),
                width: 110,
                dataType: 'number',
                format: 'currency',
            },
            {
                dataField: 'discount',
                caption: l("Discount %"),
                width: 110,
                dataType: 'number',
            },
            {
                dataField: 'discountLineAmount',
                caption: l("DiscountLineAmount"),
                width: 200,
                dataType: 'number',
                format: 'currency',
            },
            {
                dataField: 'taxRate',
                caption: l("TaxRate"),
                width: 110,
                dataType: 'number',
            },
            {
                dataField: 'taxRateAmount',
                caption: l("TaxRateAmount"),
                width: 110,
                dataType: 'number',
                format: 'currency',
            },
            {
                dataField: 'lineAmt',
                caption: l("LineAmt"),
                width: 70,
                dataType: 'number',
            },
            {
                dataField: 'baseQty',
                caption: l("BaseQty"),
                width: 110,
                dataType: 'number',
            },
            {
                dataField: 'baseUOM',
                caption: l("BaseUOM"),
                width: 110,
                dataType: 'number',
            },
            {
                dataField: 'warehourse',
                caption: l("Warehourse"),
                width: 110,
                dataType: 'string',
            },
            {
                dataField: 'WHLocation',
                caption: l("WHLocationn"),
                width: 110,
                dataType: 'string',
            },
            {
                dataField: 'taxCode',
                caption: l("TaxCode"),
                width: 90,
                dataType: 'string',
            },
            {
                dataField: 'tranType',
                caption: l("TranType"),
                width: 110,
                dataType: 'string',
            },
        ],
    }).dxDataGrid("instance");

});