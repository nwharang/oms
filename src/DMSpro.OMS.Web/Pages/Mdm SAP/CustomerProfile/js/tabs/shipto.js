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
                editing: {
                    mode: 'row',
                    allowAdding: !readOnly && abp.auth.isGranted('MdmService.Customers.Create'),
                    allowUpdating: !readOnly && abp.auth.isGranted('MdmService.Customers.Edit'),
                    allowDeleting: !readOnly && abp.auth.isGranted('MdmService.Customers.Delete'),
                    useIcons: true,
                    texts: {
                        editRow: l("Edit"),
                        deleteRow: l("Delete"),
                        confirmDeleteMessage: l("DeleteConfirmationMessage")
                    },
                },
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
                        !readOnly && {
                            location: 'after',
                            widget: 'dxButton',
                            options: {
                                icon: "import",
                                elementAttr: {
                                    class: "import-excel",
                                },
                                onClick(e) {
                                    let gridControl = e.element.closest('div.dx-datagrid').parent();
                                    let gridName = gridControl.attr('id');
                                    let popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                                    if (popup) popup.show();
                                },
                            }
                        },
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
                        dataField: "Region",
                        caption: "Region", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "RegionName",
                        caption: "RegionName", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "Provine",
                        caption: "Provine", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "ProvineName",
                        caption: "ProvineName", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "District",
                        caption: "District", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "DistrictName",
                        caption: "DistrictName", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "Ward",
                        caption: "Ward", // Localize
                        dataType: "string",
                    },
                    {
                        dataField: "WardName",
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