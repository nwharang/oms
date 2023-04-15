function renderGrid(e, { status, priceListId, id }) {
    if (!grid)
        grid = $('<div id="dataGridContainer" class="ps-2">')
            .css('width', "100%")
            .css('height', "100%")
    grid.dxDataGrid({
        dataSource: {
            store: store.priceUpdateDetailStore(id),
            paginate: true,
        },
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
        searchPanel: {
            visible: true
        },
        filterRow: {
            visible: true,
        },
        headerFilter: {
            visible: true,
        },
        columnMinWidth: 50,
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        export: {
            enabled: true,
        },
        paging: {
            enabled: true,
            pageSize: 20
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50],
            showInfo: true,
            showNavigationButtons: true
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
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "add",
                        elementAttr: {
                            id: 'massInputButton'
                        },
                        onClick(e) {
                            renderMassInputCus(id, priceListId)
                        },
                        visible: abp.auth.isGranted('MdmService.PriceUpdates.Create') && status == 0
                    },
                },
            ],
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 100,
                buttons: ["edit", "delete"],
            },
            {
                caption: l("EntityFieldName:MDMService:PriceUpdateDetail:Item"),
                dataField: "priceListDetail.itemId",
                lookup: {
                    dataSource: {
                        store: store.getItems,
                        paginate: true,
                    },
                    valueExpr: 'id',
                    displayExpr: (e) => {
                        if (e)
                            return `${e.code} - ${e.name}`
                        return 'name'
                    },
                },
                allowEditing: false
            },
            {
                caption: l('EntityFieldName:MDMService:PriceUpdateDetail:UOM'),
                dataField: "priceListDetail.uomId",
                lookup: {
                    dataSource: store.getUOMs,
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                width: 200,
                allowEditing: false
            },
            {
                caption: l("EntityFieldName:MDMService:PriceUpdateDetail:PriceBeforeUpdate"),
                dataField: "priceListDetail.price",
                format: '#,##0',
                allowEditing: false,
                width: 200,
            },
            {
                caption: l("EntityFieldName:MDMService:PriceUpdateDetail:NewPrice"),
                dataField: 'newPrice',
                dataType: 'number',
                format: '#,##0',
                width: 200,
                editorOptions: {
                    format: '#,##0',

                }
            }

        ]
    });
    if (e)
        grid.appendTo($(e));
    else
        grid.appendTo($('#popupBody'))
    gridInstance = grid.dxDataGrid('instance');
}