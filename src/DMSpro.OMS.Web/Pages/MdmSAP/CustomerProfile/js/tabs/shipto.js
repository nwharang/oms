let createShipTo = () => {
    return {
        title: "Ship To", // Localize
        icon: null,
        callback: () => {
            let container = $('<div/>')
            let datagrid = $('<div/>').dxDataGrid({
                dataSource: [
                    {
                        ...gridInfo.data,
                        shipToCode: "TEST",
                        shipToName: "TEST",
                        address: gridInfo.data.fullAddress,
                        type: "C",
                        Region: gridInfo.data.geoMaster0?.code,
                        RegionName: gridInfo.data.geoMaster0?.name,
                        Provine: gridInfo.data.geoMaster1?.code,
                        ProvineName: gridInfo.data.geoMaster1?.name,
                        District: gridInfo.data.geoMaster2?.code,
                        DistrictName: gridInfo.data.geoMaster2?.name,
                        Ward: gridInfo.data.geoMaster3?.code,
                        WardName: gridInfo.data.geoMaster3?.name,
                        latitude: `${parseFloat((Math.random() + 1) * 10).toFixed(4)}° N`,
                        longitude: `${parseFloat(Math.random() + 106).toFixed(4)}° E`,
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
                        caption: "Ship To Name", // Localize
                        dataField: "shipToName",
                        dataType: 'string',
                    },
                    {
                        caption: "Address", // Localize
                        dataField: "address",
                        dataType: 'string',
                    },
                    {
                        dataField: "regionCode",
                        caption: "Region", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "regionName",
                        caption: "RegionName", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "provinceCode",
                        caption: "Provine", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "provineName",
                        caption: "ProvineName", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "districtCode",
                        caption: "District", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "districtName",
                        caption: "DistrictName", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "wardCode",
                        caption: "Ward", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "wardName",
                        caption: "WardName", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "type",
                        caption: "Type", // Localize
                        dataType: 'string',
                        lookup: {
                            dataSource: enumValue.shipToType,
                            valueExpr: 'id',
                            displayExpr: 'text'
                        }
                    },
                    {
                        dataField: 'latitude',
                        caption: l("Latitude"), // Localize
                        dataType: 'string',
                    },
                    {
                        dataField: 'longitude',
                        caption: l("Longitude"), // Localize
                        dataType: 'string',
                    },
                ]
            }).appendTo(container)
            return container
        }
    }
}