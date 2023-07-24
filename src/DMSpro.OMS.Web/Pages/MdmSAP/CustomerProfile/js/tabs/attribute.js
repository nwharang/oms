let createAttribute = () => {
    return {
        title: "Attribute", // Localize
        icon: null,
        callback: () => {
            let container = $('<div/>')
            let datagrid = $('<div/>').dxDataGrid({
                dataSource: gridInfo.data.customerAttribute,
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
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `CustomerAttribute.xlsx`);
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
                        caption: l("MdmSAPService.Entity.ShipToCode"),
                        dataField: "shipToCode",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 0", // Localize
                        dataField: "attrID0",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 1", // Localize
                        dataField: "attrID1",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 2", // Localize
                        dataField: "attrID2",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 3", // Localize
                        dataField: "attrID3",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 4", // Localize
                        dataField: "attrID4",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 5", // Localize
                        dataField: "attrID5",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 6", // Localize
                        dataField: "attrID6",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 7", // Localize
                        dataField: "attrID7",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 8", // Localize
                        dataField: "attrID8",
                        dataType: 'string',
                    },
                    {
                        caption: "Attribute 9", // Localize
                        dataField: "attrID9",
                        dataType: 'string',
                    },
                ]
            }).appendTo(container)
            return container
        }
    }
}
