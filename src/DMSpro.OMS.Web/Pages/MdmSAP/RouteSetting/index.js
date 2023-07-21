$(function () {
    let l = abp.localization.getResource("OMS");


    gridInfo.instance.mainGrid = $('#dgMCPHeaders').dxDataGrid({
        dataSource: store.mCPHeaderStore,
        remoteOperations: true,
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${name || "Exports"}.xlsx`);
                });
            });
            e.cancel = true;
        },
        showRowLines: true,
        showBorders: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnMinWidth: 50,
        columnAutoWidth: true,
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columnFixing: {
            enabled: true,
        },
        filterRow: {
            visible: true,
        },
        groupPanel: {
            visible: true,
        },
        headerFilter: {
            visible: true,
        },
        rowAlternationEnabled: true,
        searchPanel: {
            visible: true
        },
        // stateStoring: {
        //     enabled: true,
        //     type: 'localStorage',
        //     storageKey: 'dgMCPHeaders',
        // },
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
        toolbar: {
            items: [
                "groupPanel",
                {
                    name: "addRowButton",
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        onClick(e) {
                            console.log(e);
                        },
                    },
                },
                "columnChooserButton",
                "exportButton",
                "searchPanel",
            ],
        },
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 110,
                buttons: [
                    {
                        text: l('Button.ViewDetail'),
                        icon: "fieldchooser",
                        onClick: (e) => {
                            gridInfo.data = e.row.data
                            renderPopup()
                        }
                    },
                ],
                fixedPosition: "left",
            },
            {
                dataField: 'id',
                caption: l("Id"),
                dataType: 'string',
                allowEditing: false,
                visible: false,
            },
            {
                caption: l("EntityFieldName:MDMService:MCPHeader:Code"),
                dataField: "code",
                validationRules: [
                    {
                        type: "required"
                    },
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]{1,20}$',
                        message: l('ValidateError:Code')
                    }
                ]
            },
            {
                caption: l("EntityFieldName:MDMService:MCPHeader:Name"),
                dataField: "name",
                dataType: 'string'
            },
            {
                caption: "Route Mater", // Localize
                dataField: "salesOrgHierarchy.name",
            },
            {
                caption: "SalesPerson", // Localize
                dataField: "SalesPerson",
                dataType: 'string',
                allowSearch: false
            },
            {
                caption: "ManagerBy", // Localize
                dataField: "ManagerBy",
                dataType: 'string',
                allowSearch: false
            },
            {
                caption: l("EntityFieldName:MDMService:MCPHeader:EffectiveDate"),
                dataField: "effectiveDate",
                dataType: "date",
                format: "dd/MM/yyyy",
                editorOptions: {
                    format: "dd/MM/yyyy",
                }
            },
            {
                caption: l("EntityFieldName:MDMService:MCPHeader:EndDate"),
                dataField: "endDate",
                dataType: "date",
                format: "dd/MM/yyyy",
                editorOptions: {
                    format: "dd/MM/yyyy",
                }
            }
        ],
    }).dxDataGrid('instance')

    initImportPopup('api/mdm-service/m-cPHeaders', 'MCPHeaders_Template', 'dgMCPHeaders');

});
