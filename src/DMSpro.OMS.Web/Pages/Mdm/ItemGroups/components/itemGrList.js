function renderItemList(headerId, status) {
    if (!grid)
        grid = $('<div id=dataGridContainer class="ps-2">');
    grid.dxDataGrid({
        dataSource: store.getDataSourceListGrid(headerId),
        remoteOperations: true,
        repaintChangesOnly: true,
        showBorders: true,
        showRowLines: false,
        showColumnLines: true,
        cacheEnabled: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,
        width: '100%',
        searchPanel: {
            visible: true
        },
        // columnFixing: {
        //     enabled: true,
        // },
        columnMinWidth: 50,
        columnChooser: {
            enabled: true,
            mode: "select"
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
        editing: {
            mode: 'row',
            allowAdding: status < 1,
            allowUpdating: status < 1,
            allowDeleting: status < 1,
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onInitNewRow: (e) => {
            e.data.itemGroupId = headerId;
        },

        toolbar: {
            items: [
                "addRowButton",
            ],
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 100,
                buttons: ['edit', 'delete'],
            },
            {
                dataField: 'itemId',
                caption: l("EntityFieldName:MDMService:ItemGroupList:Item"),
                validationRules: [{ type: "required" }],
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (rowData.item) {
                        return rowData.item.name;
                    }
                    return "";
                },
                lookup: {
                    dataSource: {
                        store: store.getItemList,
                        filter: ['active', '=', 'true'],
                        paginate: true,
                        pageSize
                    },
                    valueExpr: 'id',
                    displayExpr: (e) => {
                        return e.code + ' - ' + e.name
                    }
                },
                setCellValue: (newData, value, currentRowData) => {
                    newData.itemId = value
                },
            },
        ]
    });
    grid.appendTo($('#popupBody'));
    gridInstance = grid.dxDataGrid('instance');
}