function renderItemAttr(headerId, status) {
    if (!grid)
        grid = $('<div id=dataGridContainer class="ps-2">');
    grid.dxDataGrid({
        dataSource: store.getDataSourceAttrGrid(headerId),
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
            ...itemAttr.map(e => {
                return {
                    dataField: 'attr' + e.attrNo + 'Id',
                    caption: e.attrName,
                    lookup: {
                        dataSource: {
                            store: store.itemAttrValueStore,
                            filter: ["itemAttributeId", "=", e.id]
                        },
                        valueExpr: 'id',
                        displayExpr: 'attrValName',
                    }
                };
            }),
        ]
    });
    grid.appendTo($('#popupBody'));
    gridInstance = grid.dxDataGrid('instance');
}