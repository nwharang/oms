﻿$(function () {
    var l = abp.localization.getResource("MdmService");
    var geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;

    /****custom store*****/
    var geoMasterStore = new DevExpress.data.CustomStore({
        key: 'id',
        //parentId: 'parentId',
        load(loadOptions) {
            console.log(loadOptions);

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
        insert(values) {
            return geoMasterService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return geoMasterService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return geoMasterService.delete(key);
        }
    });

    /****control*****/
    //TreeList - GeoMaster
    const dataTreeContainer = $('#dataTreeContainer').dxTreeList({
        dataSource: {
            store: geoMasterStore,
            paginate: true,
            pageSize: 10,
        },
        keyExpr: 'id',
        parentIdExpr: 'parentId',
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        autoExpandAll: true,
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
            enabled: true,
            type: 'localStorage',
            storageKey: 'dataTreeContainer',
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
            mode: 'row',
            allowAdding: abp.auth.isGranted('MdmService.GeoMasters.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.GeoMasters.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.GeoMasters.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onEditorPreparing(e) {
            if (e.dataField === 'parentId' && e.editorOptions.value == 0) {
                e.editorOptions.value = '';//dataTreeContainer.getKeyByRowIndex(0); //dataTreeContainer.getRootNode().children[0].key;
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
            // for create first data - if parentId = 0, update parentId = null
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
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        dataTreeContainer.addRow();
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
                caption: l("EntityFieldName:MDMService:GeoMaster:Code"),
                dataField: "code",
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:GeoMaster:Name"),
                dataField: "name",
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:GeoMaster:ParentName"),
                dataField: "parentId",
                calculateDisplayValue: "parent.name",
                lookup: {
                    dataSource(options) {
                        return {
                            store: geoMasterStore,
                            filter: options.data ? ["!", ["name", "=", options.data.name]] : null,
                            //filter: options.data ? ["!", ["parentId", "=", options.data.parentId]] : null,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id',
                }
            },
            {
                caption: l("EntityFieldName:MDMService:GeoMaster:Level"),
                dataField: "level",
                alignment: 'left',
                allowEditing: false
            }
        ],
        //stateStoring: { //save state in localStorage
        //    enabled: true,
        //    type: 'localStorage',
        //    storageKey: 'dataTreeContainer',
        //},
    }).dxTreeList("instance");
    initImportPopup('api/mdm-service/geo-masters', 'GeoMaster_Template', 'dataTreeContainer');

    /****event*****/
    //$("input#Search").on("input", function () {
    //    dataTreeContainer.searchByText($(this).val());
    //});

    ///****button*****/
    //$("#NewGeoMasterButton").click(function () {
    //    dataTreeContainer.addRow();
    //});

    //$("#ExportToExcelButton").click(function (e) {
    //    e.preventDefault();

    //    geoMasterService.getDownloadToken().then(
    //        function (result) {
    //            var url = abp.appPath + 'api/mdm-service/geo-masters/as-excel-file' +
    //                abp.utils.buildQueryString([
    //                    { name: 'downloadToken', value: result.token }
    //                ]);

    //            var downloadWindow = window.open(url, '_blank');
    //            downloadWindow.focus();
    //        }
    //    )
    //});

    /****function*****/

});