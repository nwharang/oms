$(function () {
    var l = abp.localization.getResource("OMS");
    let readOnly = true
    let rpcService = {

    }

    let enumValue = {
        whseType: [
            { id: "N", text: "Normal" },
            { id: "I", text: "In - transit" },
            { id: "V", text: "Van" },
            { id: "C", text: "Consignmen" },
        ]
    }

    let demoData = [
        {
            code: "HO",
            name: "Kho tổng",
            branch: "HO",
            whseType: "N",
            active: true,
            remakes: "Kho tổng của HO",
            county: "VN",
            province: "Đà Nẵng",
            district: "Cẩm Lệ",
            ward: "Phường Hòa Xuân",
            street: "Võ Chí Công",
        },
        {
            code: "VAN",
            name: "Kho van",
            branch: "NPP1",
            whseType: "V",
            active: true,
            remakes: "Kho van",
            county: "VN",
            province: "Hà Nội",
            district: "Ba Đình",
            ward: "Phường Trúc Bạch",
            street: "Phạm Hồng Thái",
        }
    ]

    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: demoData,
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,
        filterRow: {
            visible: true
        },
        groupPanel: {
            visible: true,
        },
        searchPanel: {
            visible: true
        },
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columnFixing: {
            enabled: true,
        },
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
        headerFilter: {
            visible: true,
        },
        // stateStoring: {
        //     enabled: true,
        //     type: 'localStorage',
        //     storageKey: 'gridSystemDatas',
        // },
        paging: {
            enabled: true,
            pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes,
            showInfo: true,
            showNavigationButtons: true
        },
        editing: {
            mode: 'popup',
            allowAdding: !readOnly && abp.auth.isGranted("InventoryService.Warehouses.Create"),
            allowUpdating: !readOnly && abp.auth.isGranted("InventoryService.Warehouses.Edit"),
            allowDeleting: !readOnly && abp.auth.isGranted("InventoryService.Warehouses.Delete"),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            },
            popup: {
                title: "Warehouses Details", // Localize
                height: 'fit-content',
                // width: "95%",
                animation: null,
                hideOnOutsideClick: false,
                dragEnabled: false,
            },
            form: {
                labelMode: "outside",
                colCount: 2,
                items: [
                    {
                        itemType: 'group',
                        items: [
                            "code",
                            "name",
                            "branch",
                            "whseType",
                            "remakes",
                            "active",
                        ]
                    },
                    {
                        itemType: 'group',
                        items: [
                            "county",
                            "province",
                            "district",
                            "ward",
                            "street",
                        ]
                    },
                ]
            }
        },
        toolbar: {
            items: [
                "groupPanel",
                "addRowButton",
                "columnChooserButton",
                "exportButton",
                !readOnly && {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
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
                width: 110,
                buttons: [
                    {
                        text: l('Button.ViewDetail'),
                        icon: "fieldchooser",
                        onClick: (e) => {
                            e.component.editRow(e.row.rowIndex)
                        }
                    },
                    'delete'
                ],
                fixedPosition: "left",
            },
            {
                dataField: "code",
                allowEditing: !readOnly,
                dataType: 'string',
                validationRules: [
                    {
                        type: "required"
                    },
                ]
            },
            {
                dataField: "name",
                allowEditing: !readOnly,
                dataType: 'string',
                validationRules: [
                    {
                        type: "required"
                    },
                ]
            },
            {
                dataField: "branch",
                allowEditing: !readOnly,
                dataType: 'string',
            },
            {
                dataField: "whseType",
                allowEditing: !readOnly,
                dataType: 'string',
                lookup: {
                    dataSource: enumValue.whseType,
                    displayExpr: 'text',
                    valueExpr: 'id',
                },
                validationRules: [
                    {
                        type: "required"
                    },
                ]
            },
            {
                dataField: "active",
                allowEditing: !readOnly,
            },
            {
                dataField: "remakes",
                allowEditing: !readOnly,
            },
            {
                dataField: "county",
                allowEditing: !readOnly,
            },
            {
                dataField: "province",
                allowEditing: !readOnly,
            },
            {
                dataField: "district",
                allowEditing: !readOnly,
            },
            {
                dataField: "ward",
                allowEditing: !readOnly,
            },
            {
                dataField: "street",
                allowEditing: !readOnly,
                dataType: 'string',
            },
        ],
    }).dxDataGrid("instance");
});