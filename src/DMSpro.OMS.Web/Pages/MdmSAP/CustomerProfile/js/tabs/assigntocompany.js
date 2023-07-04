let createAssignToCompany = () => {
    return {
        title: "Assign To Company", // Localize
        icon: null,
        callback: () => {
            let container = $('<div/>')
            let datagrid = $('<div/>').dxDataGrid({
                dataSource: [
                    {
                        ...gridInfo.data,
                        shipToCode: "TEST",
                        priceListCodeonDistribute: gridInfo.data.priceList?.name,
                        companyCode: gridInfo.data.linkedCompanyId,
                        branchCode: gridInfo.data.linkedCompanyId,
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
                        dataField: "shipToCode",
                        dataType: 'string',
                    },
                    {
                        caption: "Company Code", // Localize
                        dataField: "companyCode",
                        dataType: 'string',
                        lookup: {
                            dataSource: {
                                store: store.companiesLookup,
                                paginate: true,
                                pageSize
                            },
                            valueExpr: "id",
                            displayExpr: "code",
                        }
                    },
                    {
                        caption: "Branch Code", // Localize
                        dataField: "BranchCode",
                        dataType: 'string',
                    },
                    {
                        caption: "Price List Code on Distribute", // Localize
                        dataField: "priceListCodeonDistribute",
                        dataType: 'string',
                    },
                    {
                        caption: "Effective Date", // Localize
                        dataField: "effectiveDate",
                        dataType: 'date',
                    },
                    {
                        caption: "EndDate", // Localize
                        dataField: "endDate",
                        dataType: 'date',
                    },
                ]
            }).appendTo(container)
            return container
        }
    }
}