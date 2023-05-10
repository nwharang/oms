var l = abp.localization.getResource("OMS");
$(() => {

    var holidayService = window.dMSpro.oMS.mdmService.controllers.holidays.holiday;
    var holidayDetail = window.dMSpro.oMS.mdmService.controllers.holidayDetails.holidayDetail;

    let holidayStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            holidayService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        insert(values) {
            return holidayService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return holidayService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return holidayService.delete(key);
        },
        errorHandler: function (error) {

        }
    })

    var gridHolidays = $('#gridHolidays').dxDataGrid({
        remoteOperations: true,
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
        showRowLines: true,
        showBorders: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnMinWidth: 50,
        columnAutoWidth: true,
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columnFixing: {
            enabled: true,
        },
        filterRow: {
            visible: true,
        },
        groupPanel: {
            visible: true,
        },
        headerFilter: {
            visible: true,
        },
        rowAlternationEnabled: true,
        searchPanel: {
            visible: true
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgHolidaysHeaders',
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
        toolbar: {
            items: [
                "groupPanel",
                "addRowButton",
                "columnChooserButton",
                "exportButton",
                "searchPanel",
            ],
        },
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.Holidays.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.Holidays.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.Holidays.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },

        dataSource: holidayStore,
        // keyExpr: 'Id', 
        errorRowEnabled: false,
        onEditorPreparing: function (e) {
            if (e.dataField === "year" && e.rowType === 'data') {
                e.editorOptions.min = (new Date()).getFullYear();
                e.editorOptions.max = 2099;
            }
        },
        onRowUpdating: (e) => {
            e.newData = Object.assign({}, e.oldData, e.newData);
            if (e.newData.year) {
                e.cancel = new Promise((resolve, reject) => {
                    holidayService.getListDevextremes({ filter: JSON.stringify(['year', '=', e.newData.year]) }).then(({ data }) => {
                        if (data?.length > 0) {
                            resolve(true)
                            abp.message.warn(l("WarningMessage:MDMService:Holiday:InvalidInputYear"));
                        }
                        resolve(false)
                    })
                })
            }
        },
        onRowInserting: (e) => {
            if (e.data.year) {
                e.cancel = new Promise((resolve, reject) => {
                    holidayService.getListDevextremes({ filter: JSON.stringify(['year', '=', e.data.year]) }).then(({ data }) => {
                        if (data?.length > 0) {
                            abp.message.warn(l("WarningMessage:MDMService:Holiday:InvalidInputYear"));
                            resolve(true)
                        }
                        resolve(false)
                    })
                })
            }
        },
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 110,
                buttons: ['edit', 'delete'],
                fixedPosition: "left",
            },
            {
                dataField: 'year',
                dataType: 'number',
                caption: l("EntityFieldName:MDMService:Holiday:Year"),
                width: 100,
                validationRules: [{ type: "required" }, { type: "stringLength", max: 4 }],
            },
            {
                dataField: 'description',
                caption: l("EntityFieldName:MDMService:Holiday:Description"),
                validationRules: [{ type: "required" }]
            },
        ],
        masterDetail: {
            enabled: true,
            template(container, options) {
                const currentHeaderData = options.data;
                $(`<div class="grid-master-detail" id="grid_${currentHeaderData.id}">`)
                    .dxDataGrid({
                        dataSource: new DevExpress.data.CustomStore({
                            key: 'id',
                            load(loadOptions) {
                                const deferred = $.Deferred();
                                var args = {};
                                requestOptions.forEach((i) => {
                                    if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                                        args[i] = JSON.stringify(loadOptions[i]);
                                    }
                                });

                                holidayDetail.getListDevextremes(args)
                                    .done(result => {
                                        var data = result.data.filter(u => u.holidayId == options.key);
                                        deferred.resolve(data, {
                                            totalCount: result.totalCount,
                                            summary: result.summary,
                                            groupCount: result.groupCount,
                                        });
                                    });

                                return deferred.promise();
                            },
                            insert(values) {
                                return holidayDetail.create(values, { contentType: "application/json" });
                            },
                            update(key, values) {
                                return holidayDetail.update(key, values, { contentType: "application/json" });
                            },
                            remove(key) {
                                return holidayDetail.delete(key);
                            },
                        }),
                        // remoteOperations: true,
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
                        showRowLines: true,
                        showBorders: true,
                        allowColumnReordering: true,
                        allowColumnResizing: true,
                        columnResizingMode: 'widget',
                        dateSerializationFormat: "yyyy-MM-dd",
                        columnMinWidth: 50,
                        columnAutoWidth: true,
                        columnChooser: {
                            enabled: true,
                            mode: "select"
                        },
                        columnFixing: {
                            enabled: true,
                        },
                        filterRow: {
                            visible: true,
                        },
                        groupPanel: {
                            visible: true,
                        },
                        headerFilter: {
                            visible: true,
                        },
                        rowAlternationEnabled: true,
                        searchPanel: {
                            visible: true
                        },
                        stateStoring: { //save state in localStorage
                            enabled: true,
                            type: 'localStorage',
                            storageKey: 'dgHolidaysDetails',
                        },
                        paging: {
                            enabled: true,
                            pageSize: pageSize
                        },
                        pager: {
                            visible: true,
                            showPageSizeSelector: true,
                            allowedPageSizes,
                            showInfo: true,
                            showNavigationButtons: true
                        },
                        toolbar: {
                            items: [
                                "groupPanel",
                                "addRowButton",
                                "columnChooserButton",
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
                        editing: {
                            mode: "row",
                            allowAdding: abp.auth.isGranted('MdmService.Holidays.Create'),
                            allowUpdating: abp.auth.isGranted('MdmService.Holidays.Edit'),
                            allowDeleting: abp.auth.isGranted('MdmService.Holidays.Delete'),
                            useIcons: true,
                            texts: {
                                editRow: l("Edit"),
                                deleteRow: l("Delete"),
                                confirmDeleteMessage: l("DeleteConfirmationMessage")
                            }
                        },
                        onInitNewRow: function (e) {
                            e.data.holidayId = options.data.id;
                        },
                        onRowUpdating: function (e) {
                            e.newData = Object.assign({}, e.oldData, e.newData);
                        },
                        onEditorPreparing: function (e) {

                            if (e.dataField == "startDate") {
                                e.editorOptions.min = new Date();
                                e.editorOptions.max = new Date(2099, 12, 30);

                                if (e.row && e.row.data.endDate) {
                                    var maxDate = new Date(e.row.data.endDate);
                                    maxDate.setDate(maxDate.getDate());
                                    e.editorOptions.max = maxDate;
                                }

                                var onValueChanged = e.editorOptions.onValueChanged;
                                e.editorOptions.onValueChanged = function (e) {
                                    onValueChanged.call(this, e);

                                    var endDateCell = e.component.element().closest('td').next();
                                    var endDateDateBox = $(endDateCell).find('div.dx-datebox').data('dxDateBox');
                                    if (endDateDateBox) {
                                        var minDate = new Date(e.value);
                                        minDate.setDate(minDate.getDate());
                                        endDateDateBox.option('min', minDate);
                                    }
                                }
                            }
                            else if (e.dataField == "endDate") {
                                var minDate = new Date();
                                minDate.setDate(minDate.getDate());
                                e.editorOptions.min = minDate;
                                e.editorOptions.max = new Date(2099, 12, 31);

                                if (e.row && e.row.data.startDate) {
                                    minDate = new Date(e.row.data.startDate);
                                    minDate.setDate(minDate.getDate());
                                    e.editorOptions.min = minDate;
                                }

                                var onValueChanged = e.editorOptions.onValueChanged;
                                e.editorOptions.onValueChanged = function (e) {
                                    onValueChanged.call(this, e);

                                    var startDateCell = e.component.element().closest('td').prev();
                                    var startDateDateBox = $(startDateCell).find('div.dx-datebox').data('dxDateBox');
                                    if (startDateDateBox) {
                                        var maxDate = new Date(e.value);
                                        maxDate.setDate(maxDate.getDate());
                                        startDateDateBox.option('max', maxDate);
                                    }
                                }
                            }
                        },
                        columns: [
                            {
                                dataField: 'holidayId',
                                visible: false, width: 120,
                            },
                            {
                                type: 'buttons',
                                caption: l("Actions"),
                                width: 110,
                                buttons: ['edit', 'delete'],
                                fixedPosition: "left",
                            },
                            {
                                dataField: 'startDate',
                                caption: l("EntityFieldName:MDMService:HolidayDetail:StartDate"),
                                width: 130, dataType: "date",
                                format: "dd/MM/yyyy",
                                alignment: "right",
                                validationRules: [{ type: "required" }]
                            },
                            {
                                dataField: 'endDate',
                                caption: l("EntityFieldName:MDMService:HolidayDetail:EndDate"),
                                width: 130,
                                dataType: "date",
                                format: "dd/MM/yyyy",
                                alignment: "right",
                                validationRules: [{ type: "required" }]
                            },
                            {
                                allowEditing: false,
                                dataType: "number",
                                dataField: 'Days',
                                width: 120, alignment: "center",
                                calculateCellValue: function (rowData) {
                                    if (!rowData.startDate || !rowData.endDate)
                                        return "";
                                    return (((new Date(rowData.endDate)).getTime() - (new Date(rowData.startDate)).getTime()) / (1000 * 3600 * 24)) + 1;
                                }
                            },
                            {
                                dataField: 'description',
                                caption: l("EntityFieldName:MDMService:HolidayDetail:Description"),
                                validationRules: [{ type: "required" }, { type: "stringLength", max: 255 }],
                            }],
                    }).appendTo(container);
            },
        },
    }).dxDataGrid("instance");
});
