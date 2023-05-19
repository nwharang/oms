$(function () {
    dataGridContainer = $('#gridItemGroups').dxDataGrid({
        dataSource: store.groupStore,
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
        export: {
            enabled: true,
        },
        onExporting: function (e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Companies');
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
        headerFilter: {
            visible: true,
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'gridItemGroups',
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
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.ItemGroups.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.ItemGroups.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.ItemGroups.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick(e) {
                        renderPopup({})
                    },
                },
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            class: "import-excel",
                        },
                        onClick(e) {
                            var gridControl = e.element.closest('div.dx-datagrid').parent();
                            var gridName = gridControl.attr('id');
                            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        },
                    }
                },
                "searchPanel"
            ],
        },
        onEditorPreparing: function (e) {
            if (e.dataField == "type" && e.parentType == "dataRow") {
                if (e.row.data.status != 0)
                    e.editorOptions.disabled = false;
                //e.editorOptions.disabled = !e.row.inserted;
            }
        },
        onRowInserting: function (e) {
            e.data.status = 0;
            if (e.data && e.data.id == 0) {
                e.data.id = null;
            }
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
        },
        columns: [
            {
                width: 100,
                type: 'buttons',
                caption: l("Actions"),
                alignment: 'left',
                buttons: [
                    {
                        text: "View Details",
                        icon: "fieldchooser",
                        hint: "View Details",
                        visible: function (e) {
                            return !e.row.isNewRow && !e.row.isEditing;
                        },
                        onClick: function (e) {
                            renderPopup(e.row.data)
                        },
                    },
                    {
                        name: 'edit',
                        visible: (e) => e.row.data.status < 1 && !e.row.isEditing,
                    },
                    {
                        name: 'delete',
                        visible: (e) => e.row.data.status < 1 && !e.row.isEditing,
                    },
                ],
            },
            {
                caption: l("EntityFieldName:MDMService:ItemGroup:Code"),
                dataField: "code",
                editorOptions: {
                    maxLength: 20,
                },
                allowEditing: false,
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
                caption: l("EntityFieldName:MDMService:ItemGroup:Name"),
                dataField: "name",
                validationRules: [{ type: "required" }],
                width: '500',
            },
            {
                caption: l("EntityFieldName:MDMService:ItemGroup:Type"),
                dataField: "type",
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: store.type,
                    displayExpr: 'text',
                    valueExpr: 'id',
                    paginate: true,
                    pageSize
                },
                allowEditing: false,
            },
            {
                caption: l("EntityFieldName:MDMService:ItemGroup:Status"),
                dataField: "status",
                allowEditing: false,
                lookup: {
                    dataSource: store.status,
                    displayExpr: 'text',
                    valueExpr: 'id',
                    paginate: true,
                    pageSize
                }
            }
        ]
    }).dxDataGrid('instance');

    initImportPopup('api/mdm-service/item-groups', 'ItemGroups_Template', 'gridItemGroups');
});
