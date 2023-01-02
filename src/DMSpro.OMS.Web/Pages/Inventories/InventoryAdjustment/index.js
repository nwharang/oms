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
                items: ["DocNbr", "Status"]
            },
            {
                itemType: "group",
                items: ["Desc", "LinkedNbr"]
            },
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'Docdate',
                        editorType: 'dxDateBox'
                    },
                    "Reason"
                ]
            },
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'PostingDate',
                        editorType: 'dxDateBox'
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
                caption: "Base Qty",
                dataField: "baseqty"
            },
            {
                caption: "Base UMO",
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
        code: "item 1",
        name: "item 1",
        warehouse: "Main",
        whlocation: "Main",
        instock: 50,
        qty: 60,
        umo: "Lon",
        baseqty: 3,
        baseumo: "Thung"
    },
    {
        id: 2,
        code: "item 2",
        name: "item 2",
        warehouse: "Main",
        whlocation: "Main",
        instock: 50,
        qty: 60,
        umo: "Lon",
        baseqty: 3,
        baseumo: "Thung"
    },
    {
        id: 3,
        code: "item 3",
        name: "item 3",
        warehouse: "Main",
        whlocation: "Main",
        instock: 5,
        qty: 4,
        umo: "Cai",
        baseqty: 1,
        baseumo: "Hop"
    },
    {
        id: 4,
        code: "item 4",
        name: "item 4",
        warehouse: "Main",
        whlocation: "Main",
        instock: 24,
        qty: 24,
        umo: "Cai",
        baseqty: 6,
        baseumo: "Hop"
    }
];