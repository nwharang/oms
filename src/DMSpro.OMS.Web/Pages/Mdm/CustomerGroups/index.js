

$(function () {
    //Custom store - for load, update, delete
    dataGridContainer = $('#dgCusGroups').dxDataGrid({
        dataSource: {
            store: store.customerGroupStore,
            paginate: true,
            pageSize
        },
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,
        filterRow: {
            visible: true
        },
        groupPanel: {
            visible: true,
        },
        searchPanel: {
            visible: true
        },
        columnMinWidth: 50,
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columnFixing: {
            enabled: true,
        },
        export: {
            enabled: true,
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CustomerGroups.xlsx');
                });
            });
            e.cancel = true;
        },
        headerFilter: {
            visible: true,
        },
        // stateStoring: {
        //     enabled: true,
        //     type: 'localStorage',
        //     storageKey: 'dgCustomerGroups',
        // },
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
        onInitNewRow: (e) => {
            e.data.active = true;
            e.data.status = 1
        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.command === "edit") {
                let $links = e.cellElement.find(".dx-link");
                if (e.row.data.status == 1 || e.row.data.status == 'RELEASED')
                    $links.filter(".dx-link-edit").remove();
            }
        },
        onRowInserting: function (e) {
            e.data.status = 0;
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    widget: 'dxButton',
                    options: {
                        icon: 'add',
                        onClick(e) {
                            renderPopup({})
                        },
                        visible: abp.auth.isGranted('MdmService.CustomerGroups.Create')
                    }

                },
                'columnChooserButton',
                "exportButton",
                "searchPanel"
            ],
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 80,
                buttons: [{
                    text: l('Button.ViewDetail'),
                    icon: "fieldchooser",
                    onClick: function (e) {
                        renderPopup(e.row.data)
                    },
                    visible: abp.auth.isGranted('MdmService.CustomerGroups.Edit')
                }],
                fixedPosition: 'left'
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:CustomerGroup:Code"),
                editorOptions: {
                    maxLength: 20,
                    valueChangeEvent: 'keyup',
                },
                validationRules: [
                    {
                        type: "required"
                    },
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]{1,20}$',
                        message: l('ValidateError:Code')
                    }
                ],
                dataType: 'string',
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:CustomerGroup:Name"),
                validationRules: [{ type: "required" }],
                dataType: 'string',
            },
            // {
            //     dataField: 'effectiveDate',
            //     caption: l("EntityFieldName:MDMService:CustomerGroup:EffectiveDate"),
            //     dataType: 'date',
            // },
            {
                dataField: 'groupBy',
                caption: l("EntityFieldName:MDMService:CustomerGroup:GroupBy"),
                lookup: {
                    dataSource: store.GroupModes,
                    valueExpr: "id",
                    displayExpr: "text",
                    paginate: true,
                    pageSize: pageSizeForLookup
                }
            },
            {
                dataField: 'status',
                caption: l('EntityFieldName:MDMService:CustomerGroup:Status'),
                allowEditing: false,
                lookup: {
                    dataSource: store.cusStatus,
                    valueExpr: "id",
                    displayExpr: "text",
                }
            }
        ],
    }).dxDataGrid("instance");

    initImportPopup('api/mdm-service/customer-groups', 'Customer_Template', 'dgCusGroups');
});