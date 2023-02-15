var l = abp.localization.getResource("MdmService");
$(function () {
    var salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;

    var salesOrgHierarchyStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            var filter = ["isSellingZone", "=", true];
            if (loadOptions.searchValue != null && loadOptions.searchValue != '') {
                filter = [["isSellingZone", "=", true], "and", [loadOptions.searchExpr, loadOptions.searchOperation, loadOptions.searchValue]];
            }

            const deferred = $.Deferred();
            salesOrgHierarchyService.getListDevextremes({ filter: JSON.stringify(filter) })
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
            salesOrgHierarchyService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return salesOrgHierarchyService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return salesOrgHierarchyService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return salesOrgHierarchyService.delete(key);
        }
    });

    var dgMCPHeaders = $('#dgMCPHeaders')
        .dxDataGrid({
            dataSource: dataSource,
            editing: {
                mode: "row",
                allowAdding: abp.auth.isGranted('MdmService.MCPHeaders.Create'),
                allowUpdating: abp.auth.isGranted('MdmService.MCPHeaders.Delete'),
                allowDeleting: abp.auth.isGranted('MdmService.MCPHeaders.Delete'),
                useIcons: true,
                texts: {
                    editRow: l("Edit"),
                    deleteRow: l("Delete"),
                    confirmDeleteMessage: l("DeleteConfirmationMessage")
                }
            },
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
                storageKey: 'dgMCPHeaders',
            },
            paging: {
                enabled: true,
                pageSize: 10
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
                    "groupPanel",
                    {
                        location: 'after',
                        template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                        onClick() {
                            dgMCPHeaders.addRow();
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
            columns: [
                {
                    type: 'buttons',
                    caption: l("Actions"),
                    width: 110,
                    buttons: ['edit', 'delete'],
                    fixedPosition: "left",
                },
                {
                    caption: "Company Name",
                    dataField: "outletId",
                },
                {
                    caption: "SellingZone",
                    dataField: "outletName",
                },
                {
                    caption: "RouteCode",
                    dataField: "address"
                }, {
                    caption: "RouteName",
                    dataField: "address"
                }, {
                    caption: "Employee",
                    dataField: "address"
                }, {
                    caption: "MCP Code",
                    dataField: "address"
                }, {
                    caption: "MCP Description",
                    dataField: "address"
                },
                {
                    caption: "Effective Date",
                    dataField: "effectiveDate"
                }, {

                    caption: "EndDate",
                    dataField: "endDate"
                }, {

                    caption: "GPS Lock",
                    dataField: "distance"
                }, {

                    caption: "Num of customer",
                    dataField: "distance"
                }, {

                    caption: "Monday",
                    dataField: "Monday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }
                , {

                    caption: "Tuesday",
                    dataField: "Tuesday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {

                    caption: "Wednesday",
                    dataField: "Wednesday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {

                    caption: "Thursday",
                    dataField: "Thursday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {

                    caption: "Friday",
                    dataField: "Friday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {

                    caption: "Saturday",
                    dataField: "Saturday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {

                    caption: "Sunday",
                    dataField: "Sunday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }
            ],
        })
});

var dataSource = [
    {
        id: 1,
        outletId: "C001",
        outletName: "Cửa hàng A2",
        address: "Quận 2, Hồ Chí Minh",
        effectiveDate: "01/01/2023",
        endDate: "02/11/2023",
        distance: 100,
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true,
        Friday: true,
        Saturday: true,
        Sunday: true,
        Week1: true,
        Week2: true,
        Week3: true,
        Week4: true,
    },
    {
        id: 2,
        outletId: "C002",
        outletName: "Cửa hàng A2",
        address: "Quận 2, Hồ Chí Minh",
        effectiveDate: "10/01/2023",
        endDate: "12/11/2023",
        distance: 100,
        Monday: true,
        Tuesday: true,
        Wednesday: false,
        Thursday: false,
        Friday: true,
        Saturday: true,
        Sunday: true,
        Week1: true,
        Week2: false,
        Week3: false,
        Week4: true,
    },
    {
        id: 3,
        outletId: "C003",
        outletName: "Cửa hàng A3",
        address: "Quận 4, Hồ Chí Minh",
        effectiveDate: "15/01/2023",
        endDate: "15/11/2023",
        distance: 400,
        Monday: false,
        Tuesday: false,
        Wednesday: true,
        Thursday: true,
        Friday: false,
        Saturday: false,
        Sunday: false,
        Week1: true,
        Week2: false,
        Week3: false,
        Week4: false,
    }
];