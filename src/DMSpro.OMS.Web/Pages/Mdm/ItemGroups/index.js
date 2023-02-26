var itemGroupService = window.dMSpro.oMS.mdmService.controllers.itemGroups.itemGroup;
$(function () {
    var l = abp.localization.getResource("MdmService");

    const status = [
        {
            id: 0,
            text: l('EntityFieldValue:MDMService:ItemGroup:Status:OPEN')
        },
        {
            id: 1,
            text: l('EntityFieldValue:MDMService:ItemGroup:Status:RELEASED')
        },
        {
            id: 2,
            text: l('EntityFieldValue:MDMService:ItemGroup:Status:CANCELLED')
        }
    ];

    const types = [
        {
            id: 0,
            text: l('EntityFieldValue:MDMService:ItemGroup:Type:ATTRIBUTE')
        },
        {
            id: 1,
            text: l('EntityFieldValue:MDMService:ItemGroup:Type:LIST')
        }
    ];

    // custom store
    var groupStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            itemGroupService.getListDevextremes({})
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            itemGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return itemGroupService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return itemGroupService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return itemGroupService.delete(key);
        }
    });

    const dataGrid = $('#gridItemGroups').dxDataGrid({
        dataSource: groupStore,
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ItemGroups.xlsx');
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
                    onClick() {
                        dataGrid.addRow();
                    },
                },
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
                    onClick() {
                        //todo
                    },
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
        //onEditingStart: function (e) {
        //    e.component.option('column[4].allowEditing', false);
        //},
        onRowInserting: function (e) {
            e.data.status = 0;
            if (e.data && e.data.id == 0) {
                e.data.id = null;
            }
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
            //var objectRequire = ['code', 'name', 'type', 'description', 'status'];
            //for (var property in e.oldData) {
            //    if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
            //        e.newData[property] = e.oldData[property];
            //    }
            //}
        },
        columns: [
            {
                width: 100,
                type: 'buttons',
                caption: l("Actions"),
                buttons: [
                    {
                        text: "View Details",
                        icon: "fieldchooser",
                        hint: "View Details",
                        visible: function (e) {
                            return !e.row.isNewRow;
                        },
                        onClick: function (e) {
                            var w = window.open('/Mdm/ItemGroups/Details', '_blank');
                            if (e.row.isNewRow) {
                                w.sessionStorage.setItem("itemGroup", JSON.stringify({ id: 0 }));
                            } else {
                                w.sessionStorage.setItem("itemGroup", JSON.stringify(e.row.data));
                            }

                        }
                    },
                    'edit', 'delete'],
                fixedPosition: 'left'
            },
            {
                caption: l("EntityFieldName:MDMService:ItemGroup:Code"),
                dataField: "code",
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:ItemGroup:Name"),
                dataField: "name",
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:ItemGroup:Description"),
                dataField: "description"
            },
            {
                caption: l("EntityFieldName:MDMService:ItemGroup:Type"),
                dataField: "type",
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: types,
                    displayExpr: 'text',
                    valueExpr: 'id',
                    paginate: true,
                    pageSize: pageSizeForLookup
                }
            },
            {
                caption: l("EntityFieldName:MDMService:ItemGroup:Status"),
                dataField: "status",
                allowEditing: false,
                lookup: {
                    dataSource: status,
                    displayExpr: 'text',
                    valueExpr: 'id',
                    paginate: true,
                    pageSize: pageSizeForLookup
                }
            }
        ]
    }).dxDataGrid('instance');
});

$(window).focus(function () {
    $('#gridItemGroups').data('dxDataGrid').refresh();
});
