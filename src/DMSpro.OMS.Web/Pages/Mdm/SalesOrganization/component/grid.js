let renderGrid = (e, headerData) => {
    if (!grid) grid = $('<div id=dataGridContainer class="ps-2">').css('flex-basis', '65%')
    grid.dxDataGrid({
        dataSource: store.salesOrgEmpAssignmentStore,
        remoteOperations: true,
        showBorders: true,
        showRowLines: true,
        showColumnLines: false,
        cacheEnabled: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,

        searchPanel: {
            visible: true
        },
        columnMinWidth: 50,
        columnChooser: {
            enabled: true,
            mode: "select"
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Export.xlsx');
                });
            });
            e.cancel = true;
        },
        // groupPanel: {
        //     visible: true,
        //     allowColumnDragging: false,
        // },
        // columnFixing: {
        //     enabled: true,
        // },
        // filterRow: {
        //     visible: true
        // },
        // headerFilter: {
        //     visible: true,
        // },
        //stateStoring: {
        //    enabled: true,
        //    type: 'localStorage',
        //    storageKey: 'salesOrgEmpAssignment',
        //},
        // paging: {
        //     enabled: true,
        //     pageSize: pageSize
        // },
        // pager: {
        //     visible: true,
        //     showPageSizeSelector: true,
        //     allowedPageSizes: allowedPageSizes,
        //     showInfo: true,
        //     showNavigationButtons: true
        // },
        editing: {
            mode: 'row',
            allowAdding: headerData.status == 0 || headerData.status == 1,
            allowUpdating: headerData.status == 0 || headerData.status == 1,
            allowDeleting: headerData.status == 0 || headerData.status == 1,
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onInitNewRow(e) {
            e.data.salesOrgHierarchyId = treeInstance.option("focusedRowKey");
            e.data.effectiveDate = new Date();
        },
        onRowUpdating: function (e) {
            var objectRequire = ['salesOrgHierarchyId', 'employeeProfileId', 'isBase', 'effectiveDate', 'endDate'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        toolbar: {
            items: [
                {
                    location: 'before',
                    template() {
                        return $('<div class="dx-fieldset-header">').append('Employee Assignment');
                    },
                },
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
                caption: l('EntityFieldName:MDMService:SalesOrgEmpAssignment:EmployeeFullName'),
                dataField: "employeeProfileId",
                validationRules: [{ type: "required" }],
                calculateDisplayValue: "employeeProfile.firstName",
                lookup: {
                    dataSource: {
                        store: store.employeeProfileStore,
                        filter: ['active', '=', true],
                        paginate: true,
                        pageSize: pageSizeForLookup
                    },
                    displayExpr: 'firstName',
                    valueExpr: 'id',
                }
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgEmpAssignment:IsBase'),
                dataField: "isBase",
                dataType: 'boolean'
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgEmpAssignment:Effective Date'),
                dataField: "effectiveDate",
                dataType: 'date',
                validationRules: [{ type: "required" }],
                editorOptions: {
                    min: new Date()
                }
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgEmpAssignment:EndDate'),
                dataField: "endDate",
                dataType: 'date',
                editorOptions: {
                    min: new Date()
                }
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgEmpAssignment:SalesOrgHierarchy'),
                dataField: "salesOrgHierarchyId",
                validationRules: [{ type: "required" }],
                visible: false,
                allowEditing: false,
            }
        ]
    })
    grid.appendTo(e)
    gridInstance = grid.dxDataGrid('instance')
}
