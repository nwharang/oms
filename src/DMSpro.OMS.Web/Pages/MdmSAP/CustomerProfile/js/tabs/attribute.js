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
                    ...getAttrField(),
                ]
            }).appendTo(container)
            return container
        }
    }
}
