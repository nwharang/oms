$(function () {
    /**
     * Flow : https://cdn.discordapp.com/attachments/549203328458817541/1092489669079470191/basic-flow.png
     */
    dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: store.salesOrgHeaderStore,
        remoteOperations: true,
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
        columnMinWidth: 50,
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
        //     storageKey: 'dgSalesOrganization',
        // },
        paging: {
            enabled: true,
            pageSize: 50
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: allowedPageSizes,
            showInfo: true,
            showNavigationButtons: true
        },
        editing: {
            // allowAdding: true,
            useIcons: true
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    widget: 'dxButton',
                    options: {
                        icon: 'add',
                        onClick(e) {
                            renderPopup(null)
                        }
                    }

                },
                'columnChooserButton',
                "exportButton",
                // {
                //     location: 'after',
                //     widget: 'dxButton',
                //     options: {
                //         icon: "import",
                //         elementAttr: {
                //             class: "import-excel",
                //         },
                //         onClick(e) {
                //             var gridControl = e.element.closest('div.dx-datagrid').parent();
                //             var gridName = gridControl.attr('id');
                //             var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                //             if (popup) popup.show();
                //         }
                //     }
                // },
                "searchPanel"
            ],
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 80,
                buttons: [{
                    text: l('Button.ViewDetail'),
                    icon: "fieldchooser",
                    onClick: function (e) {
                        renderPopup(e.row.data)
                    }
                }],
                fixedPosition: 'left'
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgHeader:Code'),
                dataField: "code",
                validationRules: [
                    {
                        type: "required"
                    },
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]{1,20}$',
                        message: l('ValidateingCodeField')
                    }
                ]
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgHeader:Name'),
                dataField: "name"
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgHeader:Active'),
                dataField: 'status',
                lookup: {
                    dataSource: store.docStatus,
                    valueExpr: "id",
                    displayExpr: "text",
                },
                width: 100
            }
        ]
    }).dxDataGrid("instance");
    // initImportPopup('api/mdm-service/sales-org-headers', 'SalesOrgHeader_Template', 'dataGridContainer');
});