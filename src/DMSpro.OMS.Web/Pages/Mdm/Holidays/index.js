var holidayDetail = window.dMSpro.oMS.mdmService.controllers.holidayDetails.holidayDetail;
var l = abp.localization.getResource("MdmService");
var l1 = abp.localization.getResource("OMS");
$(() => {

    var holidayService = window.dMSpro.oMS.mdmService.controllers.holidays.holiday;

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
        stateStoring: { //save state in localStorage
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgMCPDetails',
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
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            id: "import-excel",
                            class: "import-excel",
                        },
                        onClick() {
                            var popup = $('#popupImport').data('dxPopup');
                            if (popup) popup.show();
                        },
                    },
                },
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
        onRowUpdating: function (e) {
            var objectRequire = ['year', 'description'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        dataSource: new DevExpress.data.CustomStore({
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
        }),
        // keyExpr: 'Id', 
        errorRowEnabled: false,
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
                caption: l("EntityFieldName:MDMService:Holiday:Year"),
                width: 100,
                validationRules: [{ type: "required" }],
            },
            {
                dataField: 'description',
                caption: l("EntityFieldName:MDMService:Holiday:Description"),
                validationRules: [{ type: "required" }],
            },
        ],
        masterDetail: {
            enabled: true,
            template(container, options) {
                $('<div class="grid-master-detail">')
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
                        stateStoring: { //save state in localStorage
                            enabled: true,
                            type: 'localStorage',
                            storageKey: 'dgMCPDetails',
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
                                {
                                    location: 'after',
                                    template: '<button  id="AddNewButton" type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                                    onClick(e) {
                                        e.element.closest('div.grid-master-detail').data('dxDataGrid').addRow();
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
                        editing: {
                            mode: "row",
                            //allowAdding: abp.auth.isGranted('MdmService.u-oMs.Create'),
                            //allowUpdating: abp.auth.isGranted('MdmService.u-oMs.Edit'),
                            //allowDeleting: abp.auth.isGranted('MdmService.u-oMs.Delete'),
                            allowAdding: true,
                            allowUpdating: true,
                            allowDeleting: true,
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
                                alignment: "right"
                            },
                            {
                                dataField: 'endDate',
                                caption: l("EntityFieldName:MDMService:HolidayDetail:EndDate"),
                                width: 130,
                                dataType: "date",
                                format: "dd/MM/yyyy",
                                alignment: "right"
                            }, {
                                allowEditing: false,
                                dataType: "number",
                                dataField: 'Days',
                                caption: l1("EntityFieldName:MDMService:HolidayDetail:Days"),
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
                            }],
                    }).appendTo(container);
            },
        },
    }).dxDataGrid("instance");

    initImportPopup('api/mdm-service/holidays', 'Holidays_Template', 'gridHolidays'); 

});
