$(function () {
    var l = abp.localization.getResource("OMS");
    var geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;

    var isFirstLoad = true;

    /****custom store*****/
    var geoMasterStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            geoMasterService.getListDevextremes(args)
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
            geoMasterService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert({ code, name, parentId }) {
            return geoMasterService.create({ code, name, parentId }, { contentType: "application/json" });
        },
        update(key, { name }) {
            return geoMasterService.update(key, { name }, { contentType: "application/json" });
        },
        remove(key) {
            return geoMasterService.delete(key);
        }
    });

    /****control*****/
    //TreeList - GeoMaster
    const tlGeoMaster = $('#tlGeoMaster').dxTreeList({
        dataSource: geoMasterStore,
        remoteOperations: {
            filtering: true,
            sorting: true,
            grouping: true,
        },
        keyExpr: 'id',
        parentIdExpr: 'parentId',
        rootValue: null,
        // remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        autoExpandAll: false,
        focusedRowEnabled: true,
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
            enabled: false,
            type: 'localStorage',
            storageKey: 'tlGeoMaster',
        },
        editing: {
            mode: 'row',
            allowAdding: function (e) {
                if (abp.auth.isGranted('MdmService.GeoMasters.Create')) {
                    return e.row.level < 4;
                }
                return false;
            },
            allowUpdating: abp.auth.isGranted('MdmService.GeoMasters.Edit'),
            allowDeleting: false,//abp.auth.isGranted('MdmService.GeoMasters.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onEditorPreparing(e) {
            if (e.dataField === 'parentId' && e.editorOptions.value == 0) {
                e.editorOptions.value = '';//tlGeoMaster.getKeyByRowIndex(0); //tlGeoMaster.getRootNode().children[0].key;
            }

            if (e.dataField === 'code' && e.row && !e.row.isNewRow) {
                e.editorOptions.disabled = true;
            }
        },
        onInitNewRow(e) {
            var row = e.component.getNodeByKey(e.data.parentId) ? e.component.getNodeByKey(e.data.parentId).data : null;
            if (row) {
                e.data.level = row.level + 1;
            } else if (e.data.parentId == 0) {
                e.data.level = 0;
            }
        },
        onRowInserting: function (e) {
            if (e.data && e.data.parentId == 0) {
                e.data.parentId = null;
            }
        },
        onRowUpdating: function (e) {
            var objectRequire = ['name', 'parentId', 'code', 'level'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        onContentReady: function (e) {
            if (isFirstLoad && localStorage.getItem("tlGeoMaster") == null) {
                e.component.forEachNode(node => {
                    if (node.level < 1) {
                        // Expand if condition is met
                        e.component.expandRow(node.key);
                    }
                });
                isFirstLoad = false;
            }
        },
        toolbar: {
            items: [
                "groupPanel",
                "addRowButton",
                "columnChooserButton",
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
                            var gridControl = e.element.closest('div.dx-treelist');
                            var gridName = gridControl.attr('id');
                            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        },
                    }
                },
                "searchPanel"
            ]
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: ['add', 'edit', 'delete'],
                fixedPosition: 'left'
            },
            {
                caption: l("EntityFieldName:MDMService:GeoMaster:Id"),
                dataField: "id",
                allowEditing: false,
                editorOptions: {
                    readOnly: true,
                },
                visible: false,
            },

            {
                caption: l("EntityFieldName:MDMService:GeoMaster:Code"),
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
                caption: l("EntityFieldName:MDMService:GeoMaster:Name"),
                dataField: "name",
                editorOptions: {
                    maxLength: 100
                },
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:GeoMaster:Level"),
                dataField: "level",
                alignment: 'center',
                allowEditing: false,
                width: 150
            }
        ],
    }).dxTreeList("instance");

    /****event*****/
    /****button*****/
    /****function*****/
    initImportPopup('api/mdm-service/geo-masters', 'GeoMaster_Template', 'tlGeoMaster');
});