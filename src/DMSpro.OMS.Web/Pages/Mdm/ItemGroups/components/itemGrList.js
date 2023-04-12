function renderItemList(headerId) {
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
        onInitNewRow: (e) => {
            e.data.itemGroupId = headerId;
        },
        onContentReady: (e) => {
            if (e.component.getDataSource().items().length > 0) {
                formInstance.getEditor('type').option('readOnly', true);
            } else {
                formInstance.getEditor('type').option('readOnly', false);
            }
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
                    //dataSource: getItemList,
                    dataSource: {
                        store: store.getItemList,
                        paginate: true,
                        pageSize: pageSizeForLookup
                    },
                    valueExpr: 'id',
                    displayExpr: function (e) {
                        return e.code + ' - ' + e.name
                    }
                },
                setCellValue: (newData, value, currentRowData) => {
                    newData.itemId = value
                    console.log(currentRowData);
                },
            },
        ]
    });
    grid.appendTo($('#popupBody'));
    gridInstance = grid.dxDataGrid('instance');
}