
$(function () {
    var l = abp.localization.getResource("MdmService");

   // DevExpress.setTemplateEngine('underscore');
   $('#tabpanel-container').dxTabPanel({
        height: 260,
        items: [{
            title: "Details",
            icon: "detailslayout",
            template: function () {
                return $('#details1') 
            }
        }, {
            title: "Promotional Information",
            icon: "money",
            template: function () {
                return $('#details2') 
            }
        }]
    }).dxTabPanel('instance');
   
    $("#form").dxForm({
        formData: {
            // Docdate: currentDate(),
            // PostingDate: currentDate()
        },
        colCount: 4,
        items: [
            {
                itemType: "group",
                items: ["RPONbr", "Status",
                    {
                        dataField: 'DocDate',
                        editorType: 'dxDateBox',
                    }]
            },
            {
                itemType: "group",
                items: [{
                    dataField: 'RequiredDate',
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
                items: ["TotalLineAmtNoTax", "TotalTaxAmt", "TotalLineAmt"]
            }
        ]
    });

    
    $('#txtBarCode').dxTextBox({
        value: '',
        placeholder: "Type barcode...",
        height: 32,
        width:200,
        showClearButton: true,
    });
    //$("#cbBarCodes").dxAutocomplete({
    //    dataSource: products,  
    //    placeholder: 'Type barcode...',
    //    showClearButton: true,
    //    valueExpr: 'ID',
    //    itemTemplate(data) {
    //        return $(`<div>${data.Name} (${data.BarCode})</div>`);
    //    },
    //});

    const dataGridContainer = $('#gridDetails').dxDataGrid({
        dataSource: inventoryDatas,
        keyExpr: "id",
        showBorders: true,
       // focusedRowEnabled: true,
       // columnWidth: 100,
         scrolling: {
             columnRenderingMode: 'virtual',
          },
        searchPanel: {
            visible: true
        },
        allowColumnResizing: true,
        allowColumnReordering: false, 
        paging: {
            enabled: true,
            pageSize: 10
        }, 
        rowAlternationEnabled: true,
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
                            paging: { enabled: true, pageSize: 10 },
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
                type: 'buttons',
                caption: l('Actions'),
                buttons: ['edit', 'delete'],
            }, 
            {
                width: 300,
                caption: "Item Code",
                dataField: "code",
                calculateDisplayValue: function (rowData) {
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
                }
            } ,
            {
                caption: "Item Name",
                dataField: "ItemName"
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
    }).dxDataGrid("instance");
      $('#dataGridContainer2').dxDataGrid({
        dataSource: inventoryDatas,
        keyExpr: "id",
        showBorders: true,
        focusedRowEnabled: true,
        //columnWidth: 100,
        // scrolling: {
        //     columnRenderingMode: 'virtual',
        //  },
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
      }).dxDataGrid("instance");


    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        console.log("ExportToExcelButton is called.");
    });

    $("button[name=btnAddRow]").click(function (e) {
        var grid = $('#' + $(this).attr('data-target')).data('dxDataGrid');
        grid.addRow(); 
    });
    function currentDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        return mm + '/' + dd + '/' + yyyy;
    }
});

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