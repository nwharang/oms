let renderGrid = async () => {
    gridInfo.instance.grid = gridInfo.element.grid.dxDataGrid({
        dataSource: {
            store: store.mCPDetailsStore,
            filter: ['mcpHeaderId', '=', gridInfo.data.id],
            map: (e) => ({ ...e, customerType: "C" })
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `RouteDetails.xlsx`);
                });
            });
            e.cancel = true;
        },
        columns: [
            {
                dataField: "code",
                caption: "Code", // Localize
                dataType: 'string',
            },
            {
                dataField: "customer.code",
                caption: "Customer Code", // Localize
                dataType: 'string',
            },
            {
                dataField: "customer.name",
                caption: "Customer Name", // Localize
                dataType: 'string',
            },
            {
                dataField: "customer.fullAddress",
                caption: "Address", // Localize
                dataType: 'string',
            },
            {
                dataField: "customer.linkedCompanyId",
                caption: "Company", // Localize
                dataType: 'string',
                lookup: {
                    dataSource: store.companyStore,
                    valueExpr: "id",
                    displayExpr: "code",
                },
                allowSearch: false
            },
            {
                dataField: "branch",
                caption: "Branch", // Localize
                dataType: 'string',
                allowSearch: false
            },
            {
                dataField: "effectiveDate",
                caption: l("EntityFieldName:MDMService:MCPDetail:EffectiveDate"),
                dataType: "date",
                format: 'dd/MM/yyyy',
            },
            {
                dataField: "endDate",
                caption: l("EntityFieldName:MDMService:MCPDetail:EndDate"),
                dataType: "date",
                format: 'dd/MM/yyyy',
            },
            {
                dataField: "visitOrder",
                caption: l("EntityFieldName:MDMService:MCPDetail:VisitOrder"),
                dataType: "number",
            },
            {
                dataField: "monday",
                caption: l("EntityFieldName:MDMService:MCPDetail:Monday"),
                dataType: "boolean",

            },
            {
                dataField: "tuesday",
                caption: l("EntityFieldName:MDMService:MCPDetail:Tuesday"),
                dataType: "boolean",

            },
            {
                dataField: "wednesday",
                caption: l("EntityFieldName:MDMService:MCPDetail:Wednesday"),
                dataType: "boolean",

            },
            {
                dataField: "thursday",
                caption: l("EntityFieldName:MDMService:MCPDetail:Thursday"),
                dataType: "boolean",

            },
            {
                dataField: "friday",
                caption: l("EntityFieldName:MDMService:MCPDetail:Friday"),
                dataType: "boolean",

            },
            {
                dataField: "saturday",
                caption: l("EntityFieldName:MDMService:MCPDetail:Saturday"),
                dataType: "boolean",

            },
            {
                dataField: "sunday",
                caption: l("EntityFieldName:MDMService:MCPDetail:Sunday"),
                dataType: "boolean",

            },
            {
                dataField: "week1",
                caption: l("EntityFieldName:MDMService:MCPDetail:Week1"),
                dataType: "boolean",

            },
            {
                dataField: "week2",
                caption: l("EntityFieldName:MDMService:MCPDetail:Week2"),
                dataType: "boolean",

            },
            {
                dataField: "week3",
                caption: l("EntityFieldName:MDMService:MCPDetail:Week3"),
                dataType: "boolean",

            },
            {
                dataField: "week4",
                caption: l("EntityFieldName:MDMService:MCPDetail:Week4"),
                dataType: "boolean",

            },
            {
                dataField: "customerType",
                caption: "Customer Type", // Localize
                dataType: "string",
                lookup: {
                    dataSource: enumValue.customerType,
                    displayExpr: 'text',
                    valueExpr: 'id',
                },
                allowSearch: false
            },
        ]
    })

}