$(function () {
    var l = abp.localization.getResource("MdmService");

    $("#form").dxForm({
        formData: {
            Docdate: currentDate(),
            PostingDate: currentDate()
        },
        colCount: 4,
        items: [
            {
                itemType: "group",
                items: ["DocNbr", "Status",
                    {
                        dataField: 'Docdate',
                        editorType: 'dxDateBox'
                    }
                ]
            },
            {
                itemType: "group",
                items: ["LinkedNbr", "Desc",
                    {
                        dataField: 'PostingDate',
                        editorType: 'dxDateBox'
                    }
                ]
            },
            {
                itemType: "group",
                items: ["ReasonId", "FromWHLocId", "ToWHLocId"]
            },
            {
                itemType: "group",
                items: ["ToCpnyId", "ToWHId", "FromWHLocId"]
            }
        ]
    });

    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: inventoryDatas,
        keyExpr: "id",
        showBorders: true,
        focusedRowEnabled: true,
        searchPanel: {
            visible: true
        },
        allowColumnReordering: false,
        rowAlternationEnabled: true,
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
                caption: "Item Code",
                dataField: "code"
            },
            {
                caption: "Item Name",
                dataField: "name"
            },
            {
                caption: "Warehouse",
                dataField: "warehouse"
            },
            {
                caption: "WHLocation",
                dataField: "whlocation"
            },
            {
                caption: "Qty",
                dataField: "qty"
            },
            {
                caption: "UMO",
                dataField: "umo"
            },
            {
                caption: "BaseQty",
                dataField: "baseqty"
            },
            {
                caption: "BaseUMO",
                dataField: "baseumo"
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
        code: "Item 1",
        name: "item 1",
        warehouse: "Main",
        whlocation: "Kho Chính",
        qty: 4,
        umo: "Thung",
        baseqty: 96,
        baseumo: "Chai"
    },
    {
        id: 2,
        code: "Item 2",
        name: "item 2",
        warehouse: "Main",
        whlocation: "Kho Chính",
        qty: 4,
        umo: "Thung",
        baseqty: 96,
        baseumo: "Chai"
    },
    {
        id: 3,
        code: "Item 3",
        name: "item 3",
        warehouse: "Main",
        whlocation: "Kho Chính",
        qty: 23,
        umo: "Thung",
        baseqty: 1123,
        baseumo: "Chai"
    },
    {
        id: 4,
        code: "Item 4",
        name: "item 4",
        warehouse: "Main",
        whlocation: "Kho Chính",
        qty: 6,
        umo: "Thung",
        baseqty: 234,
        baseumo: "Chai"
    },
    {
        id: 5,
        code: "Item 5",
        name: "item 5",
        warehouse: "Main",
        whlocation: "Kho Phụ",
        qty: 4,
        umo: "Thung",
        baseqty: 96,
        baseumo: "Chai"
    },
    {
        id: 6,
        code: "Item 6",
        name: "item 6",
        warehouse: "Main1",
        whlocation: "Kho Chính 1",
        qty: 7,
        umo: "Thung",
        baseqty: 200,
        baseumo: "Chai"
    }
];