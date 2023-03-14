var uomGroupService = window.dMSpro.oMS.mdmService.controllers.uOMGroups.uOMGroup;
var uomGroupDetailService = window.dMSpro.oMS.mdmService.controllers.uOMGroupDetails.uOMGroupDetail;
var uomService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;
$(function () {
    var l = abp.localization.getResource("OMS");

    var groupStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            uomGroupService.getListDevextremes(args)
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
            uomGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return uomGroupService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return uomGroupService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return uomGroupService.delete(key);
        }
    });

    var detailStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            uomGroupDetailService.getListDevextremes(args)
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
            uomGroupDetailService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return uomGroupDetailService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return uomGroupDetailService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return uomGroupDetailService.delete(key);
        }
    });

    // get UOMs
    var getUOMs = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            uomService.getListDevextremes(args)
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
            uomService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    });

    const dataGrid = $('#gridUOMGroups').dxDataGrid({
        dataSource: groupStore,
        //keyExpr: 'id',
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
            if (e.format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('UOMGroups');
                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet,
                    autoFilterEnabled: true,
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'UOMGroups.xlsx');
                    });
                });
                e.cancel = true;
            }
            else if (e.format === 'pdf') {
                const doc = new jsPDF();
                DevExpress.pdfExporter.exportDataGrid({
                    jsPDFDocument: doc,
                    component: e.component,
                }).then(() => {
                    doc.save('UOMGroups.pdf');
                });
            }
        },
        headerFilter: {
            visible: true,
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'gridUOMGroups',
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
            allowAdding: abp.auth.isGranted('MdmService.UOMGroups.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.UOMGroups.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.UOMGroups.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
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
        columns: [
            {
                type: 'buttons',
                buttons: ['edit', 'delete'],
                caption: l("Actions"),
                width: 110,
                fixedPosition: 'left'
            },
            {
                caption: l("EntityFieldName:MDMService:UOM:Code"),
                dataField: "code",
                validationRules: [
                    {
                        type: "required",
                        message: 'Code is required'
                    }
                ]
            },
            {
                caption: l("EntityFieldName:MDMService:UOM:Name"),
                dataField: "name",
                validationRules: [
                    {
                        type: "required",
                        message: 'Name is required'
                    }
                ]
            }
        ],
        masterDetail: {
            enabled: true,
            template(container, options) {
                const currentHeaderData = options.data;
                const dataGridDetail = $('<div>')
                    .dxDataGrid({
                        dataSource: {
                            store: detailStore,
                            filter: ['uomGroupId', '=', options.key]
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
                            storageKey: 'dgUOMGroupDetails' + options.key,
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
                            allowAdding: abp.auth.isGranted('MdmService.UOMGroupDetails.Create'),
                            allowUpdating: abp.auth.isGranted('MdmService.UOMGroupDetails.Edit'),
                            allowDeleting: abp.auth.isGranted('MdmService.UOMGroupDetails.Delete'),
                            useIcons: true,
                            texts: {
                                editRow: l("Edit"),
                                deleteRow: l("Delete"),
                                confirmDeleteMessage: l("DeleteConfirmationMessage")
                            }
                        },
                        onInitNewRow: function (e) {
                            e.data.active = true;
                        },
                        onRowInserting: function (e) {
                            e.data.uomGroupId = options.key
                        },
                        onRowUpdating: function (e) {
                            e.newData = Object.assign({}, e.oldData, e.newData);
                        },
                        toolbar: {
                            items: [
                                "groupPanel",
                                "addRowButton",
                                //{
                                //    location: 'after',
                                //    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                                //    onClick() {
                                //        dataGrid.addRow();
                                //    },
                                //},
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
                        columns: [
                            {
                                type: 'buttons',
                                caption: l('Actions'),
                                buttons: ['edit', 'delete'],
                                width: 110,
                                fixedPosition: 'left'
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:AltQty"),
                                dataField: "altQty",
                                validationRules: [
                                    {
                                        type: "required",
                                        message: 'Alt quantity is required'
                                    }
                                ]
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:AltUomCode"),
                                dataField: "altUOMId",
                                validationRules: [
                                    {
                                        type: "required",
                                        message: 'Alt UOM Code is required'
                                    }
                                ],
                                editorType: 'dxSelectBox',
                                calculateDisplayValue: 'altUOM.code',
                                lookup: {
                                    dataSource: getUOMs,
                                    valueExpr: 'id',
                                    displayExpr: 'code',
                                    paginate: true,
                                    pageSize: pageSizeForLookup
                                }
                            },
                            {
                                caption: '=',
                                alignment: 'center',
                                cellTemplate(container, options) {
                                    $('<div>')
                                        .append('<label>=</label>')
                                        .appendTo(container);
                                }
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:BaseQty"),
                                dataField: "baseQty",
                                validationRules: [
                                    {
                                        type: "required",
                                        message: 'Base quantity is required'
                                    }
                                ]
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:BaseUomCode"),
                                dataField: "baseUOMId",
                                validationRules: [{ type: "required" }],
                                editorType: 'dxSelectBox',
                                calculateDisplayValue: 'baseUOM.code',
                                lookup: {
                                    dataSource: getUOMs,
                                    valueExpr: 'id',
                                    displayExpr: 'code',
                                    paginate: true,
                                    pageSize: pageSizeForLookup
                                }
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:Active"),
                                dataField: "active",
                                width: 110,
                                alignment: 'center',
                                dataType: 'boolean',
                                cellTemplate(container, options) {
                                    $('<div>')
                                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                                        .appendTo(container);
                                }
                            }
                        ]
                    }).appendTo(container);
            }
        }
    }).dxDataGrid('instance');

    initImportPopup('api/mdm-service/u-oMGroups', 'UOMGroups_Template', 'gridUOMGroups');
});