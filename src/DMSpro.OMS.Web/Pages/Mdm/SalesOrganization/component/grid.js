let renderGrid = (e, headerData) => {
    if (!grid) grid = $('<div id=dataGridContainer class="ps-2">')
        .css('max-width', '65%').css('width', "100%")
        .css('height', "100%")
    grid.dxDataGrid({
        dataSource: store.salesOrgEmpAssignmentStore,
        dateSerializationFormat: "yyyy-MM-dd",
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
            e.data.isBase = false
        },
        onRowUpdating: function (e) {
            var objectRequire = ['salesOrgHierarchyId', 'employeeProfileId', 'isBase', 'effectiveDate', 'endDate'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        onRowInserting: (e) => {
            if (e.data.isBase) {
                let promise = new Promise((resolve, reject) => {
                    let findItem = e.component.getDataSource().load({}).then(data => data.filter(v => moment(e.data.effectiveDate).isBefore(v.endDate, 'day') && v.isBase))
                    findItem.then(e => {
                        if (e.length > 0) {
                            abp.message.warn(l('WarningMessage:MDMService:SalesOrg:InvalidEffectiveDate'));
                            resolve(true)
                        }
                        resolve(false)
                    })
                })
                e.cancel = promise
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
                format: 'dd-MM-yyyy',
                validationRules: [{ type: "required" }],

            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgEmpAssignment:EndDate'),
                dataField: "endDate",
                format: 'dd-MM-yyyy',
                dataType: 'date',
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgEmpAssignment:SalesOrgHierarchy'),
                dataField: "salesOrgHierarchyId",
                visible: false,
                allowEditing: false,
            }
        ],

    })
    grid.appendTo(e)
    gridInstance = grid.dxDataGrid('instance')
}
