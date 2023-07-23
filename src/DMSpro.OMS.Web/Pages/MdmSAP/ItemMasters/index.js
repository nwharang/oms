$(async function () {

    gridInfo.instance.mainGrid = $('#dataGridItemMasters').dxDataGrid({
        dataSource: store.itemStore,
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,
        repaintChangesOnly: true,
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
        // stateStoring: {
        //     enabled: true,
        //     type: 'localStorage',
        //     storageKey: 'dataGridItemMasters',
        // },
        export: {
            enabled: true,
        },
        onExporting: function (e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');
            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `Exports.xlsx`);
                });
            });
            e.cancel = true;
        },
        headerFilter: {
            visible: true,
        },

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
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
        },
        toolbar: {
            items: [
                "groupPanel",
                'addRowButton',
                'columnChooserButton',
                "exportButton",
                "searchPanel"
            ]
        },
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                buttons: [
                    {
                        icon: "fieldchooser",
                        text: l('Button.ViewDetail'),
                        onClick: (e) => {
                            gridInfo.data = e.row.data
                            gridInfo.instance.loadingPanel.show()
                            renderPopup()
                        }
                    },
                    'delete'
                ],
                fixed: true,
                fixedPosition: "left",
                showInColumnChooser: false,
            },
            {
                dataField: 'id',
                caption: l("Id"),
                dataType: 'string',
                allowEditing: false,
                visible: false,
                formItem: {
                    visible: false
                },
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:Item:Code"),
                dataType: 'string',
                allowEditing: false,
                showInColumnChooser: false,
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:Item:Name"),
                dataType: 'string',
                validationRules: [{ type: "required" }],
                showInColumnChooser: false,
            },
            {
                dataField: 'foreignName',
                caption: l("EntityFieldName:MDMService:Item:ShortName"),
                dataType: 'string'
            },
            {
                caption: l('EntityFieldName:MDMService:Item:ManageItemBy'),
                dataType: 'string',
                calculateCellValue: (e) => {
                    if (e.manBatchNum == "Y")
                        return "Lot"

                    if (e.manSerialNum == "Y")
                        return "Serial"
                    return "None"
                },
                showInColumnChooser: false,
            },
            {
                dataField: 'uomGroupCode',
                caption: l('EntityFieldName:MDMService:Item:UOMGroupCode'),
                dataType: 'string',
                showInColumnChooser: false,
                // lookup: {
                //     dataSource: store.getUOMsGroup,
                //     valueExpr: "id",
                //     displayExpr: "name"
                // },
            },
            {
                dataField: 'salesType',
                caption: l("EntityFieldName:MDMService:Item:ItemTypeName"),
                dataType: 'string',
                showInColumnChooser: false,
                // lookup: {
                //     dataSource: enumValue.itemTypes,
                //     valueExpr: 'id',
                //     displayExpr: 'text'
                // }
            },
            {
                dataField: 'active',
                caption: l('EntityFieldName:MDMService:Item:Active'),
                alignment: 'center',
                showInColumnChooser: false,
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.data.validFor == "Y" ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                }
            },
        ]
    }).dxDataGrid('instance');

    initImportPopup('api/mdm-service/items', 'Items_Template', 'dataGridItemMasters');
});
