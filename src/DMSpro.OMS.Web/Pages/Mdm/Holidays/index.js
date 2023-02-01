var holidayDetail = window.dMSpro.oMS.mdmService.controllers.holidayDetails.holidayDetail;
var l = abp.localization.getResource("MdmService");
var l1 = abp.localization.getResource("OMS");
$(() => {
   
    var holidayService = window.dMSpro.oMS.mdmService.controllers.holidays.holiday; 
    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];
     
    var gridHolidays = $('#gridHolidays').dxDataGrid({
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'storage',
        },
        scrolling: {
            columnRenderingMode: 'virtual',
        },
        searchPanel: {
            visible: true
        },
        allowColumnResizing: true,
        allowColumnReordering: true,
        paging: {
            enabled: true,
            pageSize: 10
        },
        rowAlternationEnabled: true,
        filterRow: {
            visible: true,
            applyFilter: 'auto',
        },
        headerFilter: {
            visible: false,
        },
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100],
            showInfo: true,
            showNavigationButtons: true
        },
        toolbar: {
            items: [
                {
                    location: 'before',
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed"> <i class="fa fa-plus"></i> <span>${l("Button.New.Holiday")}</span></button>`,
                    onClick() {
                        gridHolidays.addRow();
                    },
                },
               
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: 'refresh',
                        onClick() {
                            gridHolidays.refresh();
                        },
                    },
                },
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed"> <i class="fa fa-upload"></i> <span>${l("ImportFromExcel")}</span> </button>`,
                    onClick() {
                        //todo
                    },
                },
            ],
        },
        export: {
            enabled: true,
            // formats: ['excel','pdf'],
            allowExportSelectedData: true,
        },
        groupPanel: {
            visible: true,
        },
        selection: {
            mode: 'single',
        },
        onExporting(e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('PurchaseRequests');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'PurchaseRequests.xlsx');
                });
            });
            e.cancel = true;
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
            loadMode: "raw",
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
                width: 100,
                type: 'buttons',
                caption: l('Actions'),
                buttons: [ 
                    'edit', 'delete']
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
                            loadMode: "raw", 
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
                        selection: {
                            mode: 'single',
                        },
                        columnAutoWidth: true,
                        showBorders: true,
                        pager: {
                            visible: true,
                            showPageSizeSelector: true,
                            allowedPageSizes: [10, 20, 50, 100],
                            showInfo: true,
                            showNavigationButtons: true
                        },
                        toolbar: {
                            items: [
                                {
                                    location: 'before',
                                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed"> <i class="fa fa-plus"></i> <span>${l("Button.New.HolidayDetail")}</span></button>`,
                                    onClick(e) {
                                        e.element.closest('div.grid-master-detail').data('dxDataGrid').addRow(); 
                                    },
                                }, 
                                {
                                    location: 'after',
                                    widget: 'dxButton',
                                    options: {
                                        icon: 'refresh',
                                        onClick(e) {
                                            e.element.closest('div.grid-master-detail').data('dxDataGrid').refresh();
                                        },
                                    },
                                },
                                'columnChooserButton', 
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
                                width: 100,
                                type: 'buttons',
                                caption: l('Actions'),
                                buttons: ['edit', 'delete']
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
});
