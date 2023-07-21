let createAttribute = () => {
    return {
        title: "Attribute", // Localize
        icon: null,
        callback: () => {
            let container = $('<div/>')
            let datagrid = $('<div/>').dxDataGrid({
                dataSource: [
                    {
                        ...gridInfo.data,
                    }
                ],
                allowColumnResizing: true,
                columnResizingMode: 'widget',
                columnAutoWidth: true,
                remoteOperations: true,
                showRowLines: true,
                showBorders: true,
                cacheEnabled: true,
                rowAlternationEnabled: true,
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
                columnMinWidth: 50,
                columnChooser: {
                    enabled: true,
                    mode: "select"
                },
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
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `ItemInventory.xlsx`);
                        });
                    });
                    e.cancel = true;
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
                        caption: "Ship To Code", // Localize
                        dataField: "ShipToCode",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 0", // Localize
                        dataField: "AttrName0",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 1", // Localize
                        dataField: "AttrName1",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 2", // Localize
                        dataField: "AttrName2",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 3", // Localize
                        dataField: "AttrName3",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 4", // Localize
                        dataField: "AttrName4",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 5", // Localize
                        dataField: "AttrName5",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 6", // Localize
                        dataField: "AttrName6",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 7", // Localize
                        dataField: "AttrName7",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 8", // Localize
                        dataField: "AttrName8",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 9", // Localize
                        dataField: "AttrName9",
                        dataType: 'string',
                    },
                ]
            }).appendTo(container)
            return container
        }
    }
}
