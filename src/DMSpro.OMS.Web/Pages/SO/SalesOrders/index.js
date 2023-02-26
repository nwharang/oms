var popupVenderInformation;
function showDetails() {
    popupVenderInformation.show();
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

$(function () {
    var l = abp.localization.getResource("MdmService");
    var gridPurchaseOrders = $('#gridPurchaseOrders').dxDataGrid({
        dataSource: [{
            Vendor: "IDP",
            DocNbr: "RP001",
            CreatedUser: "Phượng Nguyễn",
            DocDate: "02/03/2023",
            DeliveryDate: "01/01/2023",
            PostingDate: "07/01/2023",
            Status: "Open",
            Remark: "Giao sau 14h",
            DocTotalAmt: 122456000,
            DocTotalAmtAfterTax: 112155000
        },
        {
            Vendor: "IDP",
            DocNbr: "RP002",
            CreatedUser: "Minh Lien",
            DocDate: "01/03/2023",
            DeliveryDate: "12/02/2023",
            PostingDate: "05/01/2023",
            Status: "Approved",
            Remark: "Ok, cho đi ngay",
            DocTotalAmt: 63371000,
            DocTotalAmtAfterTax: 68700000
        },
        {
            Vendor: "IDP",
            DocNbr: "RP003",
            CreatedUser: "Nguyễn Hiệp",
            DocDate: "01/03/2023",
            DeliveryDate: "01/06/2023",
            PostingDate: "10/01/2023",
            Status: "Rejected",
            Remark: "Không giao đi",
            DocTotalAmt: 5689000,
            DocTotalAmtAfterTax: 56011000
        }],
        // keyExpr: "id",
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'gridPurchaseOrders',
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
                    template: '<div><button type="button" class="btn btn-light btn-sm dropdown-toggle waves-effect waves-themed hvr-icon-pop" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height:36px"> <i class="fa fa-gear hvr-icon"></i> <span class="">Action</span>  </button><div class="dropdown-menu fadeindown"> <button class="dropdown-item" type="button">Confirmed</button> <button class="dropdown-item" type="button">Rejected</button></div></div>'
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
            // formats: ['excel','pdf'],
            allowExportSelectedData: true,
        },
        groupPanel: {
            visible: true,
        },
        selection: {
            mode: 'multiple',
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Data.xlsx');
                });
            });
            e.cancel = true;
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
                buttons: [
                    {
                        text: "View Details",
                        icon: "fieldchooser",
                        hint: "View Details",
                        onClick: function (e) {
                            var w = window.open('/SO/SalesOrders/Details', '_blank');
                            w.sessionStorage.setItem("model", JSON.stringify(e.row.data));
                        }
                    },
                    'edit', 'delete']
            },
            {
                caption: "Vendor",
                dataField: "Vendor",
                cellTemplate: function (element, info) {
                    element.append(`<a href="javascript:showDetails()">${info.text}</a>`);
                },
                alignment: "center",
                cssClass: "increaseFontWeight"
            },
            {
                caption: "DocNbr",
                dataField: "DocNbr",
            },
            {
                caption: "Created User",
                dataField: "CreatedUser",
            },
            {
                caption: "DocDate",
                dataField: "DocDate",
            },
            {
                caption: "Delivery Date",
                dataField: "DeliveryDate",
            },
            {
                caption: "Posting Date",
                dataField: "PostingDate",
                allowFiltering: false
            },
            {
                caption: "Status",
                dataField: "Status",
            },
            {
                caption: "Remark",
                dataField: "Remark",
                allowFiltering: false
            },
            {
                caption: "Doc Total Amt",
                dataField: "DocTotalAmt",
                customizeText: function (cellInfo) {
                    return cellInfo.valueText + "đ";
                },
                allowFiltering: false,
                alignment: 'right',
                format: ",##0.###",
                summaryType: "sum",
            },
            {
                caption: "Doc Total Amt After Tax",
                dataField: "DocTotalAmtAfterTax",
                customizeText: function (cellInfo) {
                    return cellInfo.valueText + "đ";
                },
                allowFiltering: false,
                format: ",##0.###",
                summaryType: "sum",
                alignment: 'right',
            },
        ],
        summary: {
            totalItems: [{
                column: 'DocTotalAmt',
                summaryType: 'sum',
                valueFormat: ",##0.###",
                customizeText: function (data) {
                    return data.valueText + "đ";
                },
            }, {
                column: 'DocTotalAmtAfterTax',
                summaryType: 'sum',
                valueFormat: ",##0.###",
                customizeText: function (data) {
                    return data.valueText + "đ";
                },
            }],
        },
    }).dxDataGrid("instance");

    popupVenderInformation = $("#popupVenderInformation").dxPopup({
        width: 600,
        height: 400,
        showTitle: true,
        container: '.page-content',
        title: 'Vendor Information',
        visible: false,
        dragEnabled: false,
        hideOnOutsideClick: true,
        showCloseButton: true,
        position: {
            at: 'center',
            my: 'center',
            collision: 'fit',
        },
    }).dxPopup('instance');
});
