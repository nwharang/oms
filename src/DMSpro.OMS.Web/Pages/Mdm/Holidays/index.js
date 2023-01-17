
$(() => {
    var l = abp.localization.getResource("MdmService");
    var holidayService = window.dMSpro.oMS.mdmService.controllers.holidays.holiday;
    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    var holidayStore = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args  = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            holidayService.getListDevextremes(args)
                .done(result => {
                    debugger
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
        //byKey: function (key) {
        //    if (key == 0) return null;

        //    var d = new $.Deferred();
        //    geoMasterService.get(key)
        //        .done(data => {
        //            d.resolve(data);
        //        });
        //    return d.promise();
        //}
    });

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
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed"> <i class="fa fa-plus"></i> <span>New Holiday</span></button>',
                    onClick() {
                        gridHolidays.addRow();
                    },
                },
                {
                    location: 'before',
                    template: '<div><button type="button" class="btn btn-light btn-sm dropdown-toggle waves-effect waves-themed" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="fa fa-gear"></i> <span class="">Action</span>  </button><div class="dropdown-menu fadeindown"> <button class="dropdown-item" type="button">Confirmed</button> <button class="dropdown-item" type="button">Rejected</button></div></div>'
                },
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: 'refresh',
                        onClick() {
                            gridPurchaseRequests.refresh();
                        },
                    },
                },
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed"> <i class="fa fa-upload"></i> <span>Import from Excel</span> </button>',
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
        }, groupPanel: {
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
        dataSource: holidayStore,
        //    [{
        //    Id: 1,
        //    Year: 2022,
        //    Descr: "Định nghĩa ngày nghỉ 2022"
        //},
        //{
        //    Id: 2,
        //    Year: 2023,
        //    Descr: "Định nghĩa ngày nghỉ 2023"
        //},
        //{
        //    Id: 3,
        //    Year: 2024,
        //    Descr: "Định nghĩa ngày nghỉ 2024"
        //}],
        keyExpr: 'Id', 
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
            caption: 'Year',
            width: 100
            },
            {
                dataField: 'description',
                caption: 'Description',
            },
        ],
        masterDetail: {
            enabled: true,
            template(container, options) {
                const currentEmployeeData = options.data;

                //$('<div>')
                //    .addClass('master-detail-caption')
                //    .text(`Details:`)
                //    .appendTo(container);

                $('<div>')
                    .dxDataGrid({
                        columnAutoWidth: true,
                        showBorders: true,
                        columns: [
                            {
                                dataField: 'i',
                                caption: '#', width: 50
                            },
                            {
                                dataField: 'StartDate',
                                caption: 'Start Date',
                                width: 120, type: "date", format: "dd/MM/yyyy", alignment: "right"
                            },
                            {
                                dataField: 'EndDate',
                                caption: 'End Date',
                                width: 120, type: "date", format: "dd/MM/yyyy", alignment: "right"
                            }, {
                                dataField: 'Days',
                                caption: 'Days',
                                width: 120, alignment: "center"
                            },
                            {
                                dataField: 'Descr',
                                caption: 'Description',
                            }],
                        dataSource: new DevExpress.data.DataSource({
                            store: new DevExpress.data.ArrayStore({
                                key: 'Id',
                                data: [{
                                    Days: 10,
                                    i: 1,
                                    Id: 1,
                                    HolidayId: 1,
                                    StartDate: new Date(),
                                    EndDate: new Date(),
                                    Descr: "Nghỉ tết nguyên đán 2022"
                                },
                                {
                                    i: 2,
                                    Id: 2,
                                    HolidayId: 1,
                                    StartDate: new Date(),
                                    EndDate: new Date(),
                                    Descr: "Nghỉ tết nguyên đán 2023"
                                },
                                {
                                    i: 1,
                                    Id: 3,
                                    HolidayId: 2,
                                    StartDate: new Date(),
                                    EndDate: new Date(),
                                    Descr: "Nghỉ tết nguyên đán 2024"
                                }],
                            }),
                            filter: ['HolidayId', '=', options.key],
                        }),
                    }).appendTo(container);
            },
        },
    }).dxDataGrid("instance");
});
