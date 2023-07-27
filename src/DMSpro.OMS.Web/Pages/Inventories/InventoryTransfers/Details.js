$(function () {
    var l = abp.localization.getResource("OMS");

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

    const gridInventoryTransfersDetails = $('#gridInventoryTransfersDetails').dxDataGrid({
        dataSource: inventoryDatas,
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'gridInventoryTransfersDetails',
        },
        showBorders: true,
        columnAutoWidth: true,
        scrolling: {
            columnRenderingMode: 'virtual',
        },
        searchPanel: {
            visible: true
        },
        allowColumnResizing: true,
        allowColumnReordering: true,
        paging: {
            enabled: true,
            pageSize: pageSize
        },
        rowAlternationEnabled: true,
        filterRow: {
            visible: true,
            applyFilter: 'auto',
        },
        headerFilter: {
            visible: false,
        },
        columnChooser: {
            enabled: true,
            mode: "select"
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
                "groupPanel",
                {
                    location: 'after',
                    template: '<button  id="AddNewButton" type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick(e) {
                        e.element.closest('div.dx-datagrid.dx-gridbase-container').parent().data('dxDataGrid').addRow();
                    },
                },
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;">  Allocation </button>',
                    onClick(e) {
                        e.element.closest('div.dx-datagrid.dx-gridbase-container').parent().data('dxDataGrid').addRow();
                    },
                },
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;">Scan Imei</button>',
                    onClick(e) {
                        e.element.closest('div.dx-datagrid.dx-gridbase-container').parent().data('dxDataGrid').addRow();
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
        export: {
            enabled: true,
        },
        groupPanel: {
            visible: true,
        },
        onExporting(e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'InventoryInventoryTransfersDetail.xlsx');
                });
            });
            e.cancel = true;
        },
        editing: {
            mode: "row",
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        columns: [
            {
                width: 100,
                type: 'buttons',
                caption: l('Actions'),
                buttons: ['edit', 'delete'],
                fixed: true,
                fixedPosition: "left",
            },
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