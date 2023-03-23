$(function () {
    var l = abp.localization.getResource("OMS");

    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: inventoryDatas,
        keyExpr: "Id",
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
            // formats: ['excel','pdf'],
            allowExportSelectedData: true,
        },
        groupPanel: {
            visible: true,
        },
        selection: {
            mode: 'single',
        },
        onExporting(e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('InventoryTransfers');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'InventoryTransfers.xlsx');
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
                            var w = window.open('/Inventories/InventoryTransfers/Details', '_blank');
                            w.sessionStorage.setItem("model", JSON.stringify(e.row.data));
                        }
                    },
                    'edit', 'delete'],
                visibleIndex:0,
            },
            {
                caption: "DocNbr",
                dataField: "DocNbr",
                visibleIndex: 1,
            },
            {
                caption: "Status",
                dataField: "Status",
            },
            {
                caption: "DocDate",
                dataField: "DocDate",
            },
            {
                caption: "Posting Date",
                dataField: "PostingDate",
                allowFiltering: false,
            },
            {
                caption: "Desc",
                dataField: "Desc",
                allowFiltering: false,
            },
           
        ],
        customizeColumns: function (columns) {
            for (var i = 0; i < columns.length; i++) {
                columns[i].visibleIndex = i;
            }
        }
    }).dxDataGrid("instance");
});

var inventoryDatas = [
    {
        Id: 1,
        Vendor: "IDP",
        DocNbr: "RP000",
        Desc:"",
        CreatedUser: "Trần Văn B",
        DocDate: "02/03/2023",
        DeliveryDate: "01/03/2023",
        PostingDate: "07/01/2023",
        Status: "Open",
        Remark: "Giao sau 14h",
        DocTotalAmt: 112456000,
        DocTotalAmtAfterTax: 112456000
    },
    {
        Id: 2,
        Vendor: "IDP",
        DocNbr: "RP002",
        Desc: "",
        CreatedUser: "Nguyễn Văn A",
        DocDate: "01/03/2023",
        DeliveryDate: "05/06/2023",
        PostingDate: "05/01/2023",
        Status: "Approved",
        Remark: "Ok, cho đi ngay",
        DocTotalAmt: 66321000,
        DocTotalAmtAfterTax: 66000000
    },
    {
        Id: 3,
        Vendor: "IDP",
        DocNbr: "RP003",
        Desc: "",
        CreatedUser: "Nguyễn Hiệp",
        DocDate: "01/03/2023",
        DeliveryDate: "07/08/2023",
        PostingDate: "10/09/2023",
        Status: "Rejected",
        Remark: "Không giao đi",
        DocTotalAmt: 56789000,
        DocTotalAmtAfterTax: 56111000
    },
];