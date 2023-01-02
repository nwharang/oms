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
                items: [
                    {
                        dataField: 'Fromdate',
                        editorType: 'dxDateBox'
                    } 
                  ]
            }, {
                itemType: "group",
                items: [
                     {
                        dataField: 'DocDate',
                        editorType: 'dxDateBox'
                    }
                ]
            },
            {
                itemType: "group",
                items: [
                      {
                        itemType: 'button',
                        horizontalAlignment: 'left',
                        buttonOptions: {
                            text: 'Search',
                            type: 'btn-outline-default',
                            useSubmitBehavior: true,
                        }
                    }
                ]
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
            pageSize: 10
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
                {
                    name: "searchPanel",
                    location: 'after'
                }
            ]
        },
        columns: [
            {
                caption: "WareHourse",
                dataField: "WareHourse",
                width: 200
            },
            {
                caption: "Docdate",
                dataField: "Docdate"
            },
            {
                caption: "Purchase Receipt Nbr",
                dataField: "PurchaseReceiptnbr",
                width: 160
            },
            {
                caption: "Linked",
                dataField: "Linked"
            },
            {
                caption: "VAT Nbr",
                dataField: "VATNbr"
            },
            {
                caption: "Status",
                dataField: "Status"
            },
            {
                caption: "Quantity",
                dataField: "Quantity"
            },
            {
                caption: "Quantity Free Item",
                dataField: "QuantityFreeItem",
                width: 160
            },
            {
                caption: "TotalLineAmt",
                dataField: "TotalLineAmt",
                width: 160
            },
            {
                caption: "Discount",
                dataField: "Discount"
            },
            {
                caption: "TotalLineAmtNoTax",
                dataField: "TotalLineAmtNoTax",
                width: 160
            },
            {
                caption: "TotalTaxAmt",
                dataField: "TotalTaxAmt"
            },
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
        WareHourse: "Kho NPP 1",
        Docdate: "1-Nov-22", 
        PurchaseReceiptnbr: 1,
        Linked: "RPOO35",
        VATNbr: "9030249123",
        Status: "OPEN",
        Quantity: 10,
        QuantityFreeItem: 1,
        TotalLineAmt: "1,000,000",
        Discount: "0",
        TotalLineAmtNoTax: "909,091",
        TotalTaxAmt: "90909.1",
    },
    {
        id: 2,
        WareHourse: "Kho NPP 1 chi nhanh 2",
        Docdate: "11-May-22",
        PurchaseReceiptnbr: 1,
        Linked: "RPOO36",
        VATNbr: "9030249123",
        Status: "CONFIRMED",
        Quantity: 10,
        QuantityFreeItem: 1,
        TotalLineAmt: "10,000,000,000",
        Discount: "800,000",
        TotalLineAmtNoTax: "0",
        TotalTaxAmt: "0",
    },
    {
        id: 3,
        WareHourse: "Kho NPP 1 chi nhanh 2",
        Docdate: "1-MAY-22",
        PurchaseReceiptnbr: 1,
        Linked: "RPOO37",
        VATNbr: "9030249123",
        Status: "CANCEL",
        Quantity: 10,
        QuantityFreeItem: 1,
        TotalLineAmt: "1,000,000",
        Discount: "0",
        TotalLineAmtNoTax: "0",
        TotalTaxAmt: "0",
    }
];