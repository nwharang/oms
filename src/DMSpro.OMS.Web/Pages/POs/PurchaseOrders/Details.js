$(function () {
    var l = abp.localization.getResource("OMS");
    DevExpress.config({
        editorStylingMode: 'underlined',
    });
    $("#form").dxForm({
        formData: {
            // Docdate: currentDate(),
            // PostingDate: currentDate()
        },
        labelMode: 'floating',
        colCount: 4,
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
                    },  "Remark"]
            },
            {
                itemType: "group",
                items: ["Vendor", "LinkedNbr", "Warehouse"]
            },
            {
                itemType: "group",
                items: ["TotalAmtNoTax", "TotalDiscount", "TotalTaxAmt", "TotalLamt"]
            }
        ]
    });

    const gridPurchaseOrderDetails = $('#gridPurchaseOrderDetails').dxDataGrid({
        dataSource: inventoryDatas,
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'gridPurchaseOrderDetails',
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
        //selection: {
        //    mode: 'multiple',
        //},
        onExporting(e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Data.xlsx');
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
                fixedPosition: "left",
            },
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
            },
            {
                caption: "Qty",
                dataField: "Qty"
            },
            {
                caption: "OpenQty",
                dataField: "OpenQty"
            } ,
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
                width: 150
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
                caption: "WareHourse",
                dataField: "WareHourse"
            }, {
                caption: "WHLocation",
                dataField: "WHLocation"
            }, {
                caption: "TaxCode",
                dataField: "TaxCode"
            }, {
                caption: "TranType",
                dataField: "TranType"
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

    $('#resizable').dxResizable({
        minHeight: 130,
        handles: "bottom"
    }).dxResizable('instance');
});

var inventoryDatas = [
    {
        id: 1,
        code: "Item1",
        ItemName: "Sản phẩm 1",
        UOM: "Thung",
        Qty: 4,
        IssueQty: 0,
        Price: 100000,
        LineAmtNoTax: 400000,
        Discount: 0,
        DiscountLineAmount: 0,
        TaxRate: 10,
        TaxLineAmount: 40000,
        LineAmt: 440000,
        BaseQty: 40,
        BaseUOM: "Chai",
        WareHourse: "Main",
        WHLocation: "Main",
        TaxCode: "VAT10",
        TranType: "Selling"
    },
    {
        id: 2,
        code: "Item2",
        ItemName: "Sản phẩm 2",
        UOM: "Thung",
        Qty: 4,
        IssueQty: 0,
        Price: 100000,
        LineAmtNoTax: 300000,
        Discount: 20,
        DiscountLineAmount: 60000,
        TaxRate: 10,
        TaxLineAmount: 24000,
        LineAmt: 264000,
        BaseQty: 40,
        BaseUOM: "Chai",
        WareHourse: "Main",
        WHLocation: "Main",
        TaxCode: "VAT10",
        TranType: "Selling"
    },
    {
        id: 3,
        code: "Item3",
        ItemName: "Sản phẩm 3",
        UOM: "Lon",
        Qty: 10,
        IssueQty: 0,
        Price: 0,
        LineAmtNoTax: 0,
        Discount: 0,
        DiscountLineAmount: 0,
        TaxRate: 0,
        TaxLineAmount: 0,
        LineAmt: 0,
        BaseQty: 10,
        BaseUOM: "Chai",
        WareHourse: "Main",
        WHLocation: "Main",
        TaxCode: "VAT10",
        TranType: "Sampling"
    }
];