$(function () {
    var l = abp.localization.getResource("MdmService");

    $("#form").dxForm({
        formData: {
            // Docdate: currentDate(),
            // PostingDate: currentDate()
        },
        colCount: 3,
        items: [
            {
                itemType: "group",
                items: ["PONbr", "Status",
                    {
                        dataField: 'DocDate',
                        editorType: 'dxDateBox'
                    }, {
                        dataField: 'DeliveryDate',
                        editorType: 'dxDateBox'
                    }, {
                        dataField: 'PostingDate',
                        editorType: 'dxDateBox'
                    }, "Remark"]
            },
            {
                itemType: "group",
                items: ["Vendor", "LinkedNbr", "Warehouse"]
            },
            {
                itemType: "group",
                items: ["TotalAmtNoTax", "TotalTaxAmt", "TotalAmount", "TotalLAmt"]
            }
        ]
    });

    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: inventoryDatas,
        keyExpr: "id",
        showBorders: true,
        focusedRowEnabled: true,
        columnWidth: 100,
        scrolling: {
            columnRenderingMode: 'virtual',
        },
        searchPanel: {
            visible: true
        },
        allowColumnReordering: false,
        scrolling: {
            mode: 'standard'
        },
        paging: {
            enabled: true,
            pageSize: pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: allowedPageSizes,
            showInfo: true,
            showNavigationButtons: true
        },
        toolbar: {
            items: [
                {
                    name: "searchPanel",
                    location: 'after'
                }
            ]
        },
        columns: [
            {
                caption: "Item Code",
                dataField: "code"
            },
            {
                caption: "Item Name",
                dataField: "ItemName"
            },
            {
                caption: "UOM",
                dataField: "UOM"
            }, {
                caption: "Qty",
                dataField: "Qty"
            },
            {
                caption: "Price",
                dataField: "Price"
            },
            {
                caption: "LineAmtNoTax",
                dataField: "LineAmtNoTax",
                width: 160
            },
            {
                caption: "Discount %",
                dataField: "Discount",
            },
            {
                caption: "DiscountLineAmount",
                dataField: "DiscountLineAmount",
                width: 160
            }, {
                caption: "TaxRate",
                dataField: "TaxRate"
            }, {
                caption: "TaxLineAmount",
                dataField: "TaxLineAmount",
                width: 160
            }, {
                caption: "LineAmt",
                dataField: "LineAmt"
            }, {
                caption: "BaseQty",
                dataField: "BaseQty"
            }, {
                caption: "BaseUOM",
                dataField: "BaseUOM"
            }, {
                caption: "Warehourse",
                dataField: "Warehourse"
            }, {
                caption: "WHLocation",
                dataField: "WHLocation"
            }, {
                caption: "TaxCode",
                dataField: "TaxCode"
            }, {
                caption: "TranType",
                dataField: "TranType"
            }
        ],
    }).dxDataGrid("instance");

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        console.log("ExportToExcelButton is called.");
    });

    function currentDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        return mm + '/' + dd + '/' + yyyy;
    }
});

var inventoryDatas = [
    {
        id: 1,
        code: "Item1",
        ItemName: "Sản phẩm 1",
        UOM: "Thung",
        Qty: 4,
        IssueQty: 0,
        Price: "100,000",
        LineAmtNoTax: "400,000",
        Discount: 0,
        DiscountLineAmount: 0,
        TaxRate: 10,
        TaxLineAmount: "40,000",
        LineAmt: "440,000",
        BaseQty: 40,
        BaseUOM: "Chai",
        WareHourse: "Main",
        WHLocation: "Main",
        TaxCode: "VAT10",
        TranType: "Selling",
        Desc: "Quần áo"
    },
    {
        id: 2,
        code: "Item2",
        ItemName: "Sản phẩm 2",
        UOM: "Thung",
        Qty: 4,
        IssueQty: 0,
        Price: "100,000",
        LineAmtNoTax: "300,000",
        Discount: 20,
        DiscountLineAmount: "60,000",
        TaxRate: 10,
        TaxLineAmount: "24,000",
        LineAmt: "264,000",
        BaseQty: 40,
        BaseUOM: "Chai",
        WareHourse: "Main",
        WHLocation: "Main",
        TaxCode: "VAT10",
        TranType: "Selling",
        Desc: "Mỹ phẩm"
    } 
];