﻿$(function () {
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
                items: ["LinkedNbr",
                    {
                        dataField: 'Docdate',
                        editorType: 'dxDateBox'
                    }
                ]
            },
            {
                itemType: "group",
                items: ["Desc",
                    {
                        dataField: 'PostingDate',
                        editorType: 'dxDateBox'
                    }
                ]
            },
            {
                itemType: "group",
                items: ["Reason"]
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
                caption: "Committed",
                dataField: "committed"
            },
            {
                caption: "Ordered",
                dataField: "ordered"
            },
            {
                caption: "Available",
                dataField: "available"
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
        warehouse: "Main",
        whlocation: "Kho Chính",
        instock: 20000,
        committed: 2000,
        ordered: 1000,
        available: 19000
    },
    {
        id: 2,
        code: "Item 2",
        warehouse: "Main2",
        whlocation: "Kho Phụ",
        instock: 10000,
        committed: 1000,
        ordered: 1000,
        available: 10000
    },
    {
        id: 3,
        code: "Item 3",
        warehouse: "Main",
        whlocation: "Kho Chính",
        instock: 50000,
        committed: 1000,
        ordered: 1000,
        available: 50000
    },
    {
        id: 4,
        code: "Item 4",
        warehouse: "Main3",
        whlocation: "Kho Phụ",
        instock: 90000,
        committed: 1000,
        ordered: 1000,
        available: 90000
    },
    {
        id: 5,
        code: "Item 5",
        warehouse: "Main3",
        whlocation: "Kho Chính",
        instock: 80000,
        committed: 1000,
        ordered: 1000,
        available: 8000
    },
    {
        id: 6,
        code: "Item 6",
        warehouse: "Main",
        whlocation: "Kho Chính",
        instock: 20000,
        committed: 2000,
        ordered: 1000,
        available: 19000
    },
    {
        id: 7,
        code: "Item 7",
        warehouse: "Main2",
        whlocation: "Kho Phụ",
        instock: 10000,
        committed: 1000,
        ordered: 1000,
        available: 10000
    },
    {
        id: 8,
        code: "Item 8",
        warehouse: "Main",
        whlocation: "Kho Chính",
        instock: 50000,
        committed: 1000,
        ordered: 1000,
        available: 50000
    },
    {
        id: 9,
        code: "Item 9",
        warehouse: "Main3",
        whlocation: "Kho Phụ",
        instock: 90000,
        committed: 1000,
        ordered: 1000,
        available: 90000
    },
    {
        id: 10,
        code: "Item 10",
        warehouse: "Main3",
        whlocation: "Kho Chính",
        instock: 80000,
        committed: 1000,
        ordered: 1000,
        available: 8000
    },
    {
        id: 11,
        code: "Item 11",
        warehouse: "Main",
        whlocation: "Kho Chính",
        instock: 20000,
        committed: 2000,
        ordered: 1000,
        available: 19000
    },
    {
        id: 12,
        code: "Item 12",
        warehouse: "Main2",
        whlocation: "Kho Phụ",
        instock: 10000,
        committed: 1000,
        ordered: 1000,
        available: 10000
    },
    {
        id: 13,
        code: "Item 13",
        warehouse: "Main",
        whlocation: "Kho Chính",
        instock: 50000,
        committed: 1000,
        ordered: 1000,
        available: 50000
    },
    {
        id: 14,
        code: "Item 14",
        warehouse: "Main3",
        whlocation: "Kho Phụ",
        instock: 90000,
        committed: 1000,
        ordered: 1000,
        available: 90000
    },
    {
        id: 15,
        code: "Item 15",
        warehouse: "Main3",
        whlocation: "Kho Chính",
        instock: 80000,
        committed: 1000,
        ordered: 1000,
        available: 8000
    }
];