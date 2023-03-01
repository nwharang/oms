var DeliveryModel;
var DeliveryDetailData = [];

$(function () {
    DevExpress.config({
        editorStylingMode: 'underlined',
    });

    var l = abp.localization.getResource("MdmService"); 
    $("#frmDeliveryHeader").dxForm({
        formData: {
            company: "CEO Company",
            SRNbr: "hsdjsd939239j23",
            orderType: "JHeart",
            docDate: new Date(),
            deliveryDate: new Date(2022, 4, 13),
            postingDate: new Date(),
            remark: "",
            outletID: "01234567890",
            isActive: true,
            routeID: "1",
            route: "Route 1",
            employeeID: "JS13343JDD3",
            salesman: "Jay ne",
            status: "Open",
            linkedNbr: "JB893",
            SFAlinkedNbr: "AH2002",
            totalAmtNoTax: 400,
            totalAmtDiscount: 35,
            totalTaxAmt: 20,
            totalAmt: 420,
            docSource: "Đơn Manual",
        }, 
        labelMode: 'floating',
        colCount: 3,
        items: [
            {
                itemType: "group",
                items: ["SRNbr", "status", "docDate", "deliveryDate", "postingDate", "orderType", "remark"]
            },
            {
                itemType: "group",
                items: ["company", "route", "salesman", "linkedNbr", "SFAlinkedNbr"]
            },
            {
                itemType: "group",
                items: ["totalAmtNoTax", "totalAmtDiscount", "totalTaxAmt", "totalAmt"]
            }
        ]
    });  
    var dgDeliveries = $('#dgDeliveries').dxDataGrid({
        dataSource: DeliveryDetailData, 
        remoteOperations: true, 
        showColumnLines: true,
        showRowLines: false,
        rowAlternationEnabled: true,
        showBorders: false, 
        export: {
            enabled: true, 
        },
        onExporting: function (e) {
            if (e.format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Deliveries');
                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet,
                    autoFilterEnabled: true,
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Deliveries.xlsx');
                    });
                });
                e.cancel = true;
            }
            else if (e.format === 'pdf') {
                const doc = new jsPDF();
                DevExpress.pdfExporter.exportDataGrid({
                    jsPDFDocument: doc,
                    component: e.component,
                }).then(() => {
                    doc.save('Deliveries.pdf');
                });
            }
        },  
        allowColumnReordering: true, 
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnMinWidth: 50,
        columnAutoWidth: true,
        columnChooser: {
            enabled: true,
            allowSearch: true,
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
        searchPanel: {
            visible: true
        }, 
        stateStoring: { //save state in localStorage
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgDeliveries',
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
        editing: { 
            mode: "row",
            allowAdding: abp.auth.isGranted('OrderService.Deliveries.Create'),
            allowUpdating: abp.auth.isGranted('OrderService.Deliveries.Edit'),
            allowDeleting: true,//missing permission
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            },
        },
        toolbar: {
            items: [
                "groupPanel",
                "addRowButton",
                "columnChooserButton",
                "exportButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            //id: "import-excel",
                            class: "import-excel",
                        },
                        onClick(e) {
                            var gridControl = e.element.closest('div.dx-datagrid').parent();
                            var gridName = gridControl.attr('id');
                            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        },
                    },
                },
                "searchPanel",
            ],
        },
        columns: [
            {
                dataField: 'itemCode',
                caption: l("Item Code"),
                width: 110,
                dataType: 'string',
            },
            {
                dataField: 'itemName',
                caption: l("Item Name"),
                width: 200,
                dataType: 'string',
            },
            {
                dataField: 'UOM',
                caption: l("UOM"),
                width: 90,
                dataType: 'string',
            },
            {
                dataField: 'qty',
                caption: l("Qty"),
                width: 70,
                dataType: 'number',
            },
            {
                dataField: 'issueQty',
                caption: l("Issue Qty"),
                width: 90,
                dataType: 'number',
            },
            {
                dataField: 'price',
                caption: l("Price"),
                width: 110,
                dataType: 'number',
                format: 'currency',
            },
            {
                dataField: 'lineAmountNoTax',
                caption: l("LineAmtNoTax"),
                width: 110,
                dataType: 'number',
                format: 'currency',
            },
            {
                dataField: 'discount',
                caption: l("Discount %"),
                width: 110,
                dataType: 'number',
            },
            {
                dataField: 'discountLineAmount',
                caption: l("DiscountLineAmount"),
                width: 200,
                dataType: 'number',
                format: 'currency',
            },
            {
                dataField: 'taxRate',
                caption: l("TaxRate"),
                width: 110,
                dataType: 'number',
            },
            {
                dataField: 'taxRateAmount',
                caption: l("TaxRateAmount"),
                width: 110,
                dataType: 'number',
                format: 'currency',
            },
            {
                dataField: 'lineAmt',
                caption: l("LineAmt"),
                width: 70,
                dataType: 'number',
            },
            {
                dataField: 'baseQty',
                caption: l("BaseQty"),
                width: 110,
                dataType: 'number',
            },
            {
                dataField: 'baseUOM',
                caption: l("BaseUOM"),
                width: 110,
                dataType: 'number',
            },
            {
                dataField: 'warehourse',
                caption: l("Warehourse"),
                width: 110,
                dataType: 'string',
            },
            {
                dataField: 'WHLocation',
                caption: l("WHLocationn"),
                width: 110,
                dataType: 'string',
            },
            {
                dataField: 'taxCode',
                caption: l("TaxCode"),
                width: 90,
                dataType: 'string',
            },
            {
                dataField: 'tranType',
                caption: l("TranType"),
                width: 110,
                dataType: 'string',
            },
        ],
    }).dxDataGrid("instance");

    $('#resizable').dxResizable({
        minHeight: 120,
        handles: "bottom"
    }).dxResizable('instance');

    initImportPopup('api/mdm-service/companies', 'Deliveries_Template', 'dgDeliveries');  
});