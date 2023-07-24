let createShipTo = () => {
    return {
        title: "Ship To",
        icon: null,
        callback: () => {
            let container = $('<div/>')
            let datagrid = $('<div/>').dxDataGrid({
                dataSource: gridInfo.data.customerAddress,
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
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `CustomerAddress.xlsx`);
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
                        caption: l("MdmSAPService.Entity.ShipToName"),
                        dataField: "shipToName",
                        dataType: 'string',
                    },
                    {
                        caption: l("MdmSAPService.Entity.Address"),
                        dataField: "address",
                        dataType: 'string',
                    },
                    {
                        caption: l("MdmSAPService.Entity.Region"),
                        dataField: "regionCode",
                        dataType: "string",
                    },
                    {
                        caption: l("MdmSAPService.Entity.RegionName"),
                        dataField: "regionName",
                        dataType: "string",
                    },
                    {
                        caption: l("MdmSAPService.Entity.Provine"),
                        dataField: "provinceCode",
                        dataType: "string",
                    },
                    {
                        caption: l("MdmSAPService.Entity.ProvineName"),
                        dataField: "provineName",
                        dataType: "string",
                    },
                    {
                        caption: l("MdmSAPService.Entity.District"),
                        dataField: "districtCode",
                        dataType: "string",
                    },
                    {
                        caption: l("MdmSAPService.Entity.DistrictName"),
                        dataField: "districtName",
                        dataType: "string",
                    },
                    {
                        caption: l("MdmSAPService.Entity.Ward"),
                        dataField: "wardCode",
                        dataType: "string",
                    },
                    {
                        caption: l("MdmSAPService.Entity.WardName"),
                        dataField: "wardName",
                        dataType: "string",
                    },
                    {
                        caption: l("MdmSAPService.Entity.Type"),
                        dataField: "type",
                        dataType: 'string',
                        lookup: {
                            dataSource: enumValue.shipToType,
                            valueExpr: 'id',
                            displayExpr: 'text'
                        }
                    },
                    {
                        caption: l("MdmSAPService.Entity.Latitude"),
                        dataField: 'latitude',
                        dataType: 'string',
                    },
                    {
                        caption: l("MdmSAPService.Entity.Longitude"),
                        dataField: 'longitude',
                        dataType: 'string',
                    },
                ]
            }).appendTo(container)
            return container
        }
    }
}