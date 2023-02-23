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
                items: ["DocNbr", "Status", "Desc"]
            },
            {
                itemType: "group",
                items: ["Reason", "LinkedNbr"]
            },
            {
                itemType: "group",
                items: ["User Counting", "User Confirm"]
            },
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'Docdate',
                        editorType: 'dxDateBox'
                    },
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
                caption: "InStock",
                dataField: "instock"
            },
            {
                caption: "Qty",
                dataField: "qty"
            },
            {
                caption: "DiffQty",
                dataField: "diffqty"
            },
            {
                caption: "ConfirmDiffQty",
                dataField: "confirmdiffqty"
            },
            {
                caption: "AbsDiffQty",
                dataField: "absdiffqty"
            },
            {
                caption: "UMO",
                dataField: "umo"
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
        diffqty: 10,
        confirmdiffqty: 56,
        absdiffqty: 4,
        umo: "Lon",
    },
    {
        id: 2,
        code: "item 2",
        name: "item 2",
        warehouse: "Main",
        whlocation: "Main",
        instock: 50,
        qty: 60,
        diffqty: 10,
        confirmdiffqty: 56,
        absdiffqty: 4,
        umo: "Lon",
    },
    {
        id: 3,
        code: "item 3",
        name: "item 3",
        warehouse: "Main",
        whlocation: "Main",
        instock: 5,
        qty: 4,
        diffqty: -1,
        confirmdiffqty: 4,
        absdiffqty: -1,
        umo: "Cai",
    },
    {
        id: 4,
        code: "item 4",
        name: "item 4",
        warehouse: "Main",
        whlocation: "Main",
        instock: 5,
        qty: 5,
        diffqty: 0,
        confirmdiffqty: 5,
        absdiffqty: 0,
        umo: "Cai",
    }
];