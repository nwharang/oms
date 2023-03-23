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

    const gridInventoryAdjustmentDetails = $('#gridInventoryAdjustmentDetails').dxDataGrid({
        dataSource: inventoryDatas,
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'gridInventoryAdjustmentDetails',
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'InventoryCountingDetail.xlsx');
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
                caption: "Base Qty",
                dataField: "baseqty"
            },
            {
                caption: "Base UMO",
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