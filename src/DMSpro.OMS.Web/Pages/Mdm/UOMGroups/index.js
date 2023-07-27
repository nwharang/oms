var uomGroupService = window.dMSpro.oMS.mdmService.controllers.uOMGroups.uOMGroup;
var uomGroupDetailService = window.dMSpro.oMS.mdmService.controllers.uOMGroupDetails.uOMGroupDetail;
var uomService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;
$(function () {
    var l = abp.localization.getResource("OMS");
    let detailDataSrc // Local varible for condition check
    let editingComponent; // Local varible for close unfinish editor
    let isEditing = false // Editing but not adding
    var uomGroupHeaderStore = new DevExpress.data.CustomStore({
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

    var uomGroupDetailsStore = new DevExpress.data.CustomStore({
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
        loadMode: "raw",
        cacheRawData: true,
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
    });

    const dataGrid = $('#gridUOMGroups').dxDataGrid({
        dataSource: uomGroupHeaderStore,
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
            let { name, concurrencyStamp } = { ...e.oldData, ...e.newData }
            e.newData = { name, concurrencyStamp }
        },

        toolbar: {
            items: [
                'addRowButton',
                //'columnChooserButton',
                "exportButton",
                // {
                //     location: 'after',
                //     widget: 'dxButton',
                //     options: {
                //         icon: "import",
                //         elementAttr: {
                //             class: "import-excel",
                //         },
                //         onClick(e) {
                //             var gridControl = e.element.closest('div.dx-datagrid').parent();
                //             var gridName = gridControl.attr('id');
                //             var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                //             if (popup) popup.show();
                //         },
                //     }
                // },
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
                editorOptions: {
                    maxLength: 20,
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
                            store: uomGroupDetailsStore,
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
                        searchPanel: {
                            visible: true
                        },
                        columnMinWidth: 50,
                        columnFixing: {
                            enabled: true,
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
                        onInitNewRow: async function (e) {
                            // Get cache of DataSource , do not change
                            detailDataSrc = this.getDataSource()._items
                            // If there prev open add new row to header , cancel unfinished edit , use to check if editing ?
                            if (editingComponent)
                                editingComponent.cancelEditData()
                            // Assign this edit to local varible for future close 
                            editingComponent = e.component

                            // Check if record exist
                            let isRecord = detailDataSrc.length >= 1

                            // No record
                            if (!isRecord)
                                e.data = {
                                    ...e.data,
                                    altQty: 1,
                                    baseQty: 1,
                                    isBase: true
                                }

                            // Record already exists
                            if (isRecord) {
                                e.data = {
                                    ...e.data,
                                    baseQty: 2,
                                    baseUOMId: detailDataSrc[0].baseUOMId,
                                    altQty: 1,
                                }
                            }
                            e.data.active = true
                        },
                        onRowInserting: function (e) {
                            e.data.uomGroupId = options.key
                        },
                        onEditCanceled: (e) => {
                            editingComponent = undefined
                            isEditing = false
                        },

                        onRowUpdating: (e) => {
                            e.newData = Object.assign({}, e.oldData, e.newData);
                            editingComponent = undefined
                            isEditing = false
                        },
                        onEditingStart: (e) => {
                            if (editingComponent)
                                editingComponent.cancelEditData()
                            // Assign this edit to local varible for future close 
                            editingComponent = e.component
                            isEditing = true
                        },
                        onContentReady: (e) => {
                            let data = e.component.getDataSource().items();
                            let foundedData = data.find(e => e.altUOMId === e.baseUOMId)?.id
                            if (data.length > 1 && foundedData) {
                                let component = e.component
                                component.getCellElement(component.getRowIndexByKey(foundedData), 0).html('').css('height', '42px')
                            }
                            if (data.length > 0 && foundedData) {
                                let component = e.component
                                component.getCellElement(component.getRowIndexByKey(foundedData), 'active').html('').css('height', '42px')
                            }
                        },
                        onEditorPreparing: (e) => {
                            let isFirstRow = detailDataSrc?.length < 1
                            let isBase = e.row?.data.baseUOMId === e.row?.data.altUOMId;
                            // Disable cell base on folowing arrays
                            let firstUomDetailDisableField = ["altQty", "baseQty", "baseUOMId", "active"]
                            let addNewUomDetailDisableField = ["altQty", "baseUOMId"]
                            let editBaseRowUOMDetailDisableField = ["altQty", "baseQty", "baseUOMId", "active"]
                            let editRowUOMDetailDisableField = ["altQty", "baseUOMId"]

                            // disable action cell on baseUOM row
                            // if not adding then return
                            if (!editingComponent || e.row?.rowType != "data") return
                            // On edit cell but not adding
                            if (isEditing) {
                                isBase ? disableCell(e, editBaseRowUOMDetailDisableField.indexOf(e.dataField) > -1) : disableCell(e, editRowUOMDetailDisableField.indexOf(e.dataField) > -1)
                                if (e.dataField === "altUOMId" && isBase) {
                                    e.editorOptions.onValueChanged = (v) => {
                                        // e.component.cellValue(e.component.getRowIndexByKey(e.row.key), 'altUOMId', v.value)
                                        e.setValue(v.value)
                                        e.component.cellValue(e.component.getRowIndexByKey(e.row.key), 'baseUOMId', v.value)
                                    }
                                }
                            }

                            // On first add new row
                            if (isFirstRow && !isEditing) {
                                disableCell(e, firstUomDetailDisableField.indexOf(e.dataField) > -1)
                                if (e.dataField === "altUOMId") {
                                    e.editorOptions.onValueChanged = (v) => {
                                        e.component.cellValue(e.component.getRowIndexByKey(e.row.key), 'altUOMId', v.value)
                                        e.component.cellValue(e.component.getRowIndexByKey(e.row.key), 'baseUOMId', v.value)
                                    }
                                }
                            }

                            // On add new row but not first time
                            if (!isFirstRow && !isEditing) {
                                disableCell(e, addNewUomDetailDisableField.indexOf(e.dataField) > -1)
                            }


                        },
                        onEditorPrepared: (e) => {
                            // if (isBase && e.row?.rowType != "data")

                            if (!editingComponent || e.row?.rowType != "data") return
                            let isFirstRow = detailDataSrc?.length < 1

                            if (!isFirstRow && e.dataField === "altUOMId") {
                                selectBox = e.editorElement.dxSelectBox('instance')
                                // Fillter BASEUOMID option in cell selection , if it exists
                                selectBox.getDataSource().loadOptions().filter = ['id', "<>", e.row?.data?.baseUOMId || 0]
                            }
                            if (isFirstRow && e.dataField === "active")
                                e.component.getCellElement(e.component.getRowIndexByKey(e.row.key), 'active').html('').css('height', '42px')
                        },
                        toolbar: {
                            items: [
                                "addRowButton",
                                "exportButton",
                                // {
                                //     location: 'after',
                                //     template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
                                //     onClick() {
                                //         //todo
                                //     },
                                // },
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
                                lookup: {
                                    dataSource: getUOMs,
                                    valueExpr: 'id',
                                    displayExpr(e) {
                                        if (e) {
                                            return `${e.code} - ${e.name}`
                                        }
                                        return "";
                                    },
                                    paginate: true,
                                    pageSize: pageSizeForLookup
                                },
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
                                editorOptions: {
                                    min: 2,
                                },
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
                                lookup: {
                                    dataSource: getUOMs,
                                    valueExpr: 'id',
                                    displayExpr(e) {
                                        if (e) {
                                            return `${e.code} - ${e.name}`
                                        }
                                        return "";
                                    },
                                    paginate: true,
                                    pageSize: pageSizeForLookup
                                },
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
        },
        onEditorPreparing: (e) => {
            if (e.row?.rowType != 'data') return
            if (e.row.data.id && e.dataField == 'code') {
                e.editorOptions.readOnly = true
            }
        },
    }).dxDataGrid('instance');

    initImportPopup('api/mdm-service/u-oMGroups', 'UOMGroups_Template', 'gridUOMGroups');

    /**
     * Disable editing cell base on condition
     * @param {Element} e 
     * @param {Boolean} arg 
     */
    let disableCell = (e, arg) => {
        if (arg) {
            let element = e.editorElement
            e.editorOptions.disabled = true
            element.parent().css('backgroundColor', "#e2e8f0")
        }
    }
});
