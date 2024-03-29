function renderCusGrGeo(headerId, status) {
    if (!grid)
        grid = $('<div id=dataGridContainer class="ps-2">');
    grid.dxDataGrid({
        dataSource: {
            store: store.customerGeoStore(headerId),
            paginate: true,
            pageSize,
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
        paging: {
            enabled: true,
            pageSize: pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: allowedPageSizes,
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
            e.data.customerGroupId = headerId;
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
            {
                dataField: "geoMaster0Id",
                caption: l("EntityFieldName:MDMService:GeoMaster:Level0"),
                formItem: {
                    visible: true,
                },
                allowSearch: false,
                calculateDisplayValue: function (rowData) {
                    if (rowData.geoMaster0) {
                        return rowData.geoMaster0.name;
                    } else {
                        return "";
                    }

                },
                setCellValue(rowData, value) {
                    rowData.geoMaster0Id = value;
                    rowData.geoMaster1Id = null;
                    rowData.geoMaster2Id = null;
                    rowData.geoMaster3Id = null;
                    rowData.geoMaster4Id = null;
                },
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource(options) {
                        return {
                            store: store.geoMasterStore,
                            filter: ['level', '=', 0],
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                },
                dataType: 'string',
            },
            {
                dataField: "geoMaster1Id",
                caption: l("EntityFieldName:MDMService:GeoMaster:Level1"),
                allowSearch: false,
                calculateDisplayValue(rowData) {

                    if (rowData.geoMaster1) {
                        return rowData.geoMaster1.name;
                    }
                    return "";
                },
                //width: 110,
                setCellValue(rowData, value) {
                    rowData.geoMaster1Id = value;
                    rowData.geoMaster2Id = null;
                    rowData.geoMaster3Id = null;
                    rowData.geoMaster4Id = null;
                },
                lookup: {
                    valueExpr: 'id',
                    displayExpr: 'name',
                    dataSource(options) {
                        return {
                            store: store.geoMasterStore,
                            filter: options.data.geoMaster0Id ? ['parentId', '=', options.data.geoMaster0Id] : ['level', '=', null],
                            paginate: true,
                        };
                    },
                },
                dataType: 'string',
            },
            {
                dataField: "geoMaster2Id",
                caption: l("EntityFieldName:MDMService:GeoMaster:Level2"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (rowData.geoMaster2) {
                        return rowData.geoMaster2.name;
                    }
                    return "";
                },
                setCellValue(rowData, value) {
                    rowData.geoMaster2Id = value;
                    rowData.geoMaster3Id = null;
                    rowData.geoMaster4Id = null;
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: store.geoMasterStore,
                            filter: options.data.geoMaster1Id ? ['parentId', '=', options.data.geoMaster1Id] : ['level', '=', null],
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                dataType: 'string',
                //showInColumnChooser: false
            },
            {
                dataField: "geoMaster3Id",
                caption: l("EntityFieldName:MDMService:GeoMaster:Level3"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (rowData.geoMaster3) {
                        return rowData.geoMaster3.name;
                    }
                    return "";
                },
                setCellValue(rowData, value) {
                    rowData.geoMaster3Id = value;
                    rowData.geoMaster4Id = null;
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: store.geoMasterStore,
                            filter: options.data.geoMaster2Id ? ['parentId', '=', options.data.geoMaster2Id] : ['level', '=', null],
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                dataType: 'string',
            },
            {
                dataField: "geoMaster4Id",
                caption: l("EntityFieldName:MDMService:GeoMaster:Level4"),
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (rowData.geoMaster4) {
                        return rowData.geoMaster4.name;
                    }
                    return "";
                },
                setCellValue(rowData, value) {
                    rowData.geoMaster4Id = value;
                },
                lookup: {
                    dataSource(options) {
                        return {
                            store: store.geoMasterStore,
                            filter: options.data.geoMaster3Id ? ['parentId', '=', options.data.geoMaster3Id] : ['level', '=', null],
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                },
                dataType: 'string',
            },
        ]
    });
    grid.appendTo($('#popupBody'));
    gridInstance = grid.dxDataGrid('instance');
}