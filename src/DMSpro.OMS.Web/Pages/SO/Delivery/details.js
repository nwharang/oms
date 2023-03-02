var DeliveryModel;
var DeliveryDetailData = [{
    itemCode: "1",
    itemName: "xxx",
    qty: 111
},
    {
        itemCode: "2",
        itemName: "yyyy",
        qty: 2
    },
];

$(function () {

    var l = abp.localization.getResource("MdmService");
    var itemsService = window.dMSpro.oMS.mdmService.controllers.items.item;
    var itemsStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            itemsService.getListDevextremes(args)
                .done(result => {
                    result.data.forEach(u => {
                        u.inventory = null;
                        u.qty = 1;
                    });

                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            itemsService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return itemsService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return itemsService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return itemsService.delete(key);
        }
    });

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
                items: [{
                    dataField: "docNbr",
                    validationRules: [{
                        type: 'required',
                    }]
                }, {
                    dataField: "status",
                    editorOptions: {
                        readOnly: true,
                    },
                }, {
                    dataField: 'docDate',
                    editorType: 'dxDateBox',
                    editorOptions: {
                        readOnly: true,
                    }
                }, {
                    dataField: 'deliveryDate',
                    editorType: 'dxDateBox',
                    validationRules: [{
                        type: 'required'
                    }],
                },
                    "postingDate", "orderType", "remark"]
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
            mode: "cell",
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
                //"addRowButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "add",
                        onClick(e) {
                            var popup = $(`#popupItems`).data('dxPopup');
                            popup.show();
                        },
                    },
                },

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
                type: 'buttons',
                caption: l("Actions"),
                buttons: ['delete'],
                fixed: true,
                fixedPosition: "left"
            },
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
        ]
    }).dxDataGrid("instance");

    $('#resizable').dxResizable({
        minHeight: 120,
        handles: "bottom"
    }).dxResizable('instance');

    $('#dgItems').dxDataGrid({
        dataSource: itemsStore,
        remoteOperations: true,
        showColumnLines: true,
        showRowLines: false,
        // rowAlternationEnabled: true,
        showBorders: false,
        export: {
            enabled: true,
        },
        onExporting: function (e) {
            if (e.format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Items');
                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet,
                    autoFilterEnabled: true,
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Items.xlsx');
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
                    doc.save('Items.pdf');
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
        searchPanel: {
            visible: true
        },
        stateStoring: { //save state in localStorage
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgItems',
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
            mode: 'cell',
            allowUpdating: true,
        },
        selection: {
            mode: 'multiple',
        },
        toolbar: {
            items: [
                //"groupPanel",
                "columnChooserButton",
                //"exportButton",
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
                dataField: 'qty',
                caption: l("Qty"),
                width: 100,
                dataType: 'number'
            },
            {
                dataField: 'code',
                caption: l("Item Code"),
                dataType: 'string',
                allowEditing: false
            },
            {
                dataField: 'name',
                caption: l("Item Name"),
                dataType: 'string',
                allowEditing: false
            },
            {
                dataField: 'inventory',
                caption: l("Inventory"),
                dataType: 'number',
                width: 100,
                allowEditing: false
            }
        ],
        //onSelectionChanged: function (e) {
        //    var selectedRowsData = e.component.getSelectedRowsData();
        //    if (selectedRowsData.length > 0) {
        //        $('#submitItemsButton').removeAttr('disabled');
        //    } else {
        //        $('#submitItemsButton').prop('disabled', true);
        //    }
        //}
       
    }).dxDataGrid("instance");

    const popupItems = $('#popupItems').dxPopup({
        width: "100vh",
        height: 500,
        container: '.panel-container',
        showTitle: true,
        title: 'Choose items',
        visible: false,
        dragEnabled: true,
        hideOnOutsideClick: false,
        showCloseButton: true,
        resizeEnabled: true,
        position: {
            at: 'center',
            my: 'center',
            collision: 'fit',
        },
        onShowing: function (e) {
            var heightGridContent = $('div.dx-overlay-content.dx-popup-normal.dx-popup-draggable.dx-resizable').innerHeight() - 310;
            $('#dgItems div.dx-datagrid-rowsview').css('height', heightGridContent + 'px');
        },
        onResize: function (e) {
            var heightGridContent = $('div.dx-overlay-content.dx-popup-normal.dx-popup-draggable.dx-resizable').innerHeight() - 310;
            $('#dgItems div.dx-datagrid-rowsview').css('height', heightGridContent + 'px');
        },
        toolbarItems: [{
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'before',
            options: {
                icon: 'fa fa-check hvr-icon',
                text: 'Submit',
                elementAttr: {
                    id: "submitItemsButton",
                    //disabled: true,
                },
                onClick() {
                    //todo
                    var selectedItems = $('#dgItems').data('dxDataGrid').getSelectedRowsData();
                    if (selectedItems.length > 0) {
                        selectedItems.forEach(u => {
                            DeliveryDetailData.unshift({
                                itemCode: u.code,
                                itemName: u.name,
                                qty: u.qty
                            }); 
                        });
                        var dataGrid = $('#dgDeliveries').dxDataGrid('instance');
                        dataGrid.refresh(); 
                    }
                    popupItems.hide();
                },
            },
        }, {
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                text: 'Cancel',
                onClick() {
                    popupItems.hide();
                },
            },
        }],
    }).dxPopup('instance');

    initImportPopup('', 'Deliveries_Template', 'dgDeliveries');
    initImportPopup('api/mdm-service/companies', 'Items_Template', 'dgItems');
});