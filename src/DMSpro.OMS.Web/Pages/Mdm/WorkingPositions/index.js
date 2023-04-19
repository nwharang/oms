$(function () {
    var l = abp.localization.getResource("OMS");
    var workingPositionService = window.dMSpro.oMS.mdmService.controllers.workingPositions.workingPosition;

    /****custom store*****/
    var workingPositionStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            workingPositionService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            workingPositionService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return workingPositionService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return workingPositionService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return workingPositionService.delete(key);
        }
    });

    /****control*****/
    //DataGrid - Working Position
    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: workingPositionStore,
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Export.xlsx');
                });
            });
            e.cancel = true;
        },
        headerFilter: {
            visible: true,
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgWorkingPositions',
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
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.WorkingPositions.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.WorkingPositions.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.WorkingPositions.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onRowUpdating: function (e) {
            var objectRequire = ['name', 'description'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        dataGridContainer.addRow();
                    },
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
                width: 120,
                buttons: ['edit', 'delete'],
                fixedPosition: 'left'
            },
            {
                caption: l("EntityFieldName:MDMService:WorkingPosition:Code"),
                dataField: "code",
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:WorkingPosition:Name"),
                dataField: "name",
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:WorkingPosition:Description"),
                dataField: "description",
                dataType: 'string',
            }
        ],
        onEditorPreparing: function (e) {
            if (e.dataField === "code" && e.parentType === "dataRow") {
                e.editorOptions.disabled = !e.row.isNewRow;
            }
        },
    }).dxDataGrid("instance");
});