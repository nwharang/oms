var l = abp.localization.getResource("MdmService");
var model = JSON.parse(sessionStorage.getItem("model"));
console.log(model);
document.title = `PO - ${model.DocNbr} | OMS`;

$(function () {

    DevExpress.config({
        editorStylingMode: 'underlined',
    });

    $('#tabpanel-container').dxTabPanel({
        items: [{
            title: "Details",
            icon: "detailslayout",
            template: initDetailsTab()
        }
            //, {
            //title: "Promotional Information",
            //icon: "money",
            //template: initPromotionalTab()
            //}
        ]
    }).dxTabPanel('instance');

    $("#top-section").dxForm({
        formData: {
            // Docdate: currentDate(),
            // PostingDate: currentDate()
        },
        labelMode: 'floating',
        colCount: 4,
        items: [
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'RPONbr',
                        //editorType: 'string',
                        //editorOptions: {
                        //    // items: positions,
                        //    searchEnabled: true,
                        //    value: '',
                        //},
                        validationRules: [{
                            type: 'required',
                            message: '',
                        }],
                          
                    },
                    {
                        dataField: 'Status',
                        editorOptions: {
                            readOnly: true,
                        },
                    }
                ]
            },
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'RequestDate',
                        editorType: 'dxDateBox',
                        validationRules: [{
                            type: 'required',
                            message: '',
                        }],
                    },
                    {
                        dataField: 'DocDate',
                        editorType: 'dxDateBox',
                        editorOptions: {
                            readOnly: true,
                        }
                    }
                ]
            },
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'Vendor',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            placeholder: ' ',
                        },
                        validationRules: [{
                            type: 'required',
                            message: '',
                        }]
                    }]
            },
            {
                itemType: "group",
                items: ["TotalTaxAmt", "TotalLineAmt"]
            }
        ]
    });

    $("#bottom-remark").dxForm({
        labelMode: 'floating',
        colCount: 2,
        items: [
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'ReMark',
                        colSpan: 2,
                        editorType: 'dxTextArea',
                        editorOptions: {
                            height: 90,
                        },
                    }]
            }
        ]
    });

    $('#txtBarCode').dxTextBox({
        value: '',
        placeholder: "Type barcode...",
        height: 32,
        width: 200,
        showClearButton: true,
    });


    $('#resizable').dxResizable({
        minHeight: 120,
        handles: "bottom"
    }).dxResizable('instance');
});
function initDetailsTab() {
    return function () {
        return $('<div id="gridDetails">')
            .dxDataGrid({
                dataSource: inventoryDatas,
                remoteOperations: true,
                export: {
                    enabled: true,
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
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Export.xlsx');
                        });
                    });
                    e.cancel = true;
                },
                editing: {
                    mode: "row",
                    allowAdding: true,//abp.auth.isGranted('OrderService.PurchaseRequests.Create'),
                    allowUpdating: true,// abp.auth.isGranted('OrderService.PurchaseRequests.Edit'),
                    allowDeleting: true,//abp.auth.isGranted('OrderService.PurchaseRequests.Delete'), 
                    useIcons: true,
                    texts: {
                        editRow: l("Edit"),
                        deleteRow: l("Delete"),
                        confirmDeleteMessage: l("DeleteConfirmationMessage")
                    }
                },
                showRowLines: true,
                showBorders: true,
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnResizingMode: 'widget',
                columnMinWidth: 50,
                columnAutoWidth: true,
                columnChooser: {
                    enabled: true,
                    mode: "select"
                },
                columnFixing: {
                    enabled: true,
                },
                filterRow: {
                    visible: true,
                },
                groupPanel: {
                    visible: true,
                },
                headerFilter: {
                    visible: true,
                },
                rowAlternationEnabled: true,
                searchPanel: {
                    visible: true
                },
                stateStoring: { //save state in localStorage
                    enabled: true,
                    type: 'localStorage',
                    storageKey: 'gridPurchaseRequests',
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
                        //"groupPanel",
                       
                        {
                            location: 'before',
                            template: '<button  id="AddNewButton" type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                            onClick(e) {
                                e.element.closest('div.dx-datagrid.dx-gridbase-container').parent().data('dxDataGrid').addRow();
                            },
                        },
                        {
                            location: 'before',
                            widget: 'dxTextBox',
                            options: {
                                // text: 'Add Row',
                                placeholder: "Type barcode..."
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
                onEditorPreparing: function (e) {
                    if (e.dataField == "code" && e.parentType == "dataRow") {
                        e.editorName = "dxDropDownBox";
                        e.editorOptions.dropDownOptions = {
                            //height: 500
                        };
                        e.editorOptions.contentTemplate = function (args, container) {
                            var value = args.component.option("value"),
                                $dataGrid = $("<div>").dxDataGrid({
                                    width: '100%',
                                    dataSource: args.component.option("dataSource"),
                                    keyExpr: "ID",
                                    columns: [{
                                        caption: "Item Code",
                                        dataField: "Name"
                                    }, "BarCode"],
                                    hoverStateEnabled: true,
                                    paging: { enabled: true, pageSize: pageSize },
                                    filterRow: { visible: true },
                                    scrolling: { mode: "infinite" },
                                    height: '90%',
                                    showRowLines: true,
                                    showBorders: true,
                                    selection: { mode: "single" },
                                    selectedRowKeys: value,
                                    onSelectionChanged: function (selectedItems) {
                                        var keys = selectedItems.selectedRowKeys;
                                        args.component.option("value", keys);
                                    }
                                });

                            var dataGrid = $dataGrid.dxDataGrid("instance");

                            args.component.on("valueChanged", function (args) {
                                var value = args.value;

                                dataGrid.selectRows(value, false);
                            });
                            container.append($dataGrid);
                            return container;
                        };
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
                        width: 300,
                        caption: "Item Code",
                        dataField: "code",
                        calculateDisplayValue: function (rowData) {
                            if (!rowData || !rowData.code) return "";

                            var displayText = products.filter(function (item) { return item.ID == rowData.code })[0].Name;
                            if (displayText)
                                return displayText;
                            return "";
                        },
                        lookup: {
                            dataSource: {
                                store: {
                                    type: "array",
                                    data: products,
                                    key: "ID"
                                }
                            },
                            displayExpr: "Name",
                            valueExpr: "ID"
                        },
                        //fixed: true,
                    },
                    {
                        width: 200,
                        caption: "Item Name",
                        dataField: "ItemName",
                        //  fixed: true,
                    },
                    {

                        caption: "UOM",
                        dataField: "UOM"
                    },
                    {

                        caption: "Price",
                        dataField: "Price"
                    }, {

                        caption: "Qty",
                        dataField: "Qty"
                    }, {

                        caption: "BaseQty",
                        dataField: "BaseQty"
                    }, {

                        caption: "BaseUOM",
                        dataField: "BaseUOM"
                    },
                    {

                        caption: "IsFree",
                        dataField: "IsFree",
                        dataType: "boolean",
                        calculateCellValue: function (rowData) {
                            let _val;
                            rowData.IsFree === "TRUE" ? _val = true : _val = false;
                            return _val;
                        },
                        setCellValue: function (newData, value, currentRowData) {
                            value ? newData.IsFree = "TRUE" : newData.IsFree = "FALSE";
                        }
                    },
                    {

                        caption: "Desc",
                        dataField: "Desc"
                    }, {

                        caption: "TaxCode",
                        dataField: "TaxCode"
                    }, {

                        caption: "TaxRate",
                        dataField: "TaxRate"
                    }, {

                        caption: "LineAmt",
                        dataField: "LineAmt"
                    }
                ],
            })
    }

}
function initPromotionalTab() {
    return function () {
        return "";

        return $('<div id="gridPromotional">')
            .dxDataGrid({
                dataSource: inventoryDatas,
                // keyExpr: "id",
                stateStoring: {
                    enabled: true,
                    type: 'localStorage',
                    storageKey: 'storage',
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
                    mode: "select" // or "select"
                },
                //columnFixing: {
                //    enabled: true
                //},
                pager: {
                    visible: true,
                    showPageSizeSelector: true,
                    allowedPageSizes: allowedPageSizes,
                    showInfo: true,
                    showNavigationButtons: true
                },
                toolbar: {
                    items: [{
                        location: 'before',
                        widget: 'dxButton',
                        options: {
                            icon: 'fa fa-plus',
                            text: 'Add Row',
                            onClick() {
                                gridDetails.addRow();
                            },
                        },
                    }, {
                        location: 'before',
                        widget: 'dxTextBox',
                        options: {
                            // text: 'Add Row',
                            placeholder: "Type barcode..."
                        },
                    },
                    {
                        location: 'after',
                        widget: 'dxButton',
                        options: {
                            icon: 'refresh',
                            onClick() {
                                gridDetails.refresh();
                            },
                        },
                    },
                        'columnChooserButton',
                        'exportButton',
                    {
                        location: 'after',
                        widget: 'dxButton',
                        options: {
                            icon: 'fa fa-upload',
                            text: "Import From Excel",
                            onClick() {
                                //dataGridContainer.refresh();
                            },
                        },
                    },
                    ],
                },
                export: {
                    enabled: true,
                    // formats: ['excel','pdf'],
                    allowExportSelectedData: true,
                },
                editing: {
                    mode: "row",
                    //allowAdding: abp.auth.isGranted('MdmService.u-oMs.Create'),
                    //allowUpdating: abp.auth.isGranted('MdmService.u-oMs.Edit'),
                    //allowDeleting: abp.auth.isGranted('MdmService.u-oMs.Delete'),
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
                onEditorPreparing: function (e) {
                    if (e.dataField == "code" && e.parentType == "dataRow") {
                        e.editorName = "dxDropDownBox";
                        e.editorOptions.dropDownOptions = {
                            //height: 500
                        };
                        e.editorOptions.contentTemplate = function (args, container) {
                            var value = args.component.option("value"),
                                $dataGrid = $("<div>").dxDataGrid({
                                    width: '100%',
                                    dataSource: args.component.option("dataSource"),
                                    keyExpr: "ID",
                                    columns: [{
                                        caption: "Item Code",
                                        dataField: "Name"
                                    }, "BarCode"],
                                    hoverStateEnabled: true,
                                    paging: { enabled: true, pageSize: pageSize },
                                    filterRow: { visible: true },
                                    scrolling: { mode: "infinite" },
                                    height: '90%',
                                    showRowLines: true,
                                    showBorders: true,
                                    selection: { mode: "single" },
                                    selectedRowKeys: value,
                                    onSelectionChanged: function (selectedItems) {
                                        var keys = selectedItems.selectedRowKeys;
                                        args.component.option("value", keys);
                                    }
                                });

                            var dataGrid = $dataGrid.dxDataGrid("instance");

                            args.component.on("valueChanged", function (args) {
                                var value = args.value;

                                dataGrid.selectRows(value, false);
                            });
                            container.append($dataGrid);
                            return container;
                        };
                    }
                },
                columns: [
                    {
                        width: 100,
                        type: 'buttons',
                        caption: l('Actions'),
                        buttons: ['edit', 'delete'],
                        //fixed: true,
                    },
                    {
                        width: 300,
                        caption: "Item Code",
                        dataField: "code",
                        calculateDisplayValue: function (rowData) {
                            if (!rowData || !rowData.code) return "";

                            var displayText = products.filter(function (item) { return item.ID == rowData.code })[0].Name;
                            if (displayText)
                                return displayText;
                            return "";
                        },
                        lookup: {
                            dataSource: {
                                store: {
                                    type: "array",
                                    data: products,
                                    key: "ID"
                                }
                            },
                            displayExpr: "Name",
                            valueExpr: "ID"
                        },
                        //fixed: true,
                    },
                    {
                        width: 200,
                        caption: "Item Name",
                        dataField: "ItemName",
                        //  fixed: true,
                    },
                    {

                        caption: "UOM",
                        dataField: "UOM"
                    },
                    {

                        caption: "Price",
                        dataField: "Price"
                    }, {

                        caption: "Qty",
                        dataField: "Qty"
                    }, {

                        caption: "BaseQty",
                        dataField: "BaseQty"
                    }, {

                        caption: "BaseUOM",
                        dataField: "BaseUOM"
                    },
                    {

                        caption: "IsFree",
                        dataField: "IsFree",
                        dataType: "boolean",
                        calculateCellValue: function (rowData) {
                            let _val;
                            rowData.IsFree === "TRUE" ? _val = true : _val = false;
                            return _val;
                        },
                        setCellValue: function (newData, value, currentRowData) {
                            value ? newData.IsFree = "TRUE" : newData.IsFree = "FALSE";
                        }
                    },
                    {

                        caption: "Desc",
                        dataField: "Desc"
                    }, {

                        caption: "TaxCode",
                        dataField: "TaxCode"
                    }, {

                        caption: "TaxRate",
                        dataField: "TaxRate"
                    }, {

                        caption: "LineAmt",
                        dataField: "LineAmt"
                    }
                ],
            })
    }
}
var products = [{
    "ID": 1,
    "Name": "Item 1",
    "BarCode": "ABC-abc-1234"
}, {
    "ID": 2,
    "Name": "Item 2",
    "BarCode": "A-0010-Z"
}, {
    "ID": 3,
    "Name": "Item 3",
    "BarCode": "A-0050-Z"
}, {
    "ID": 4,
    "Name": "Item 4",
    "BarCode": "A-0060-Z"
}, {
    "ID": 5,
    "Name": "Item 35",
    "BarCode": "45-0060-Z"
}];
var inventoryDatas = [
    {
        id: 1,
        code: 5,//product id
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
        TranType: "Selling",
        Desc: "Quần áo",
        IsFree: "TRUE",
    },
    {

        id: 2,
        code: 2,//product id
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
        TranType: "Selling",
        Desc: "Mỹ phẩm",
        IsFree: "TRUE",
    },
    {
        id: 3,
        code: 4,//product id
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
        TranType: "Sampling",
        Desc: "Bia",
        IsFree: "FALSE",
    }
];