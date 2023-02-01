var l = abp.localization.getResource("MdmService");
function masterDetailTemplate(_, masterDetailOptions) {
    return $('<div>').dxTabPanel({
        items: [{
            title: 'ROUTE ASSIGNMENT',
            template: createAssignmentTabTemplate(masterDetailOptions.data),
        }, {
            title: 'MCP',
            template: createMCPTabTemplate(masterDetailOptions.data),
        }],
    });
}

function createAssignmentTabTemplate(masterDetailData) {
    return function () {
        let dataGrid;
        function onProductChanged(id) {
            dataGrid.option('dataSource', createRouteAssignmentStore(id));
        }
        function onDataGridInitialized(e) {
            dataGrid = e.component;
        }
        return $('<div>').addClass('form-container').dxForm({
            labelLocation: 'top',
            items: [{
                //label: { text: 'SalesMan Assign Route' },
                template: createSalesManAssignRouteTemplate(onDataGridInitialized),
            }],
        });
    };
}

function createSalesManAssignRouteTemplate(onDataGridInitialized) {
    return function () {
        return $('<div>').dxDataGrid({
            onInitialized: onDataGridInitialized,
            paging: {
                pageSize: 5,
            },
            showBorders: true,
            columns: [
                {
                    dataField: 'EmployeeCode',
                },
                {
                    dataField: 'EmployeeName',
                },
                {
                    dataField: 'Route',
                }, {
                    dataField: 'RouteDescription',
                },
                {
                    dataField: 'EffectiveDate',
                },
                {
                    dataField: 'EndDate',
                },
                {
                    dataField: 'RouteType',
                },
                {
                    dataField: 'Suppervior',
                },
            ]
        });
    };
}

function createMCPTabTemplate(data) {
    return function () {
        let dataGrid;
        function onProductChanged(productID) {
            dataGrid.option('dataSource', createRouteAssignmentStore(productID));
        }
        function onDataGridInitialized(e) {
            dataGrid = e.component;
        }
        return $('<div>').addClass('form-container').dxForm({
            labelLocation: 'top',
            items: [{
               // label: { text: 'MCP History' },
                template: createMCPHistoryTemplate(onDataGridInitialized),
            }],
        });
    };
}

function createMCPHistoryTemplate(onDataGridInitialized) {
    return function () {
        return $('<div>').dxDataGrid({
            onInitialized: onDataGridInitialized,
            paging: {
                pageSize: 5,
            },
            showBorders: true,
            columns: [
                {
                    dataField: 'mCPCode',
                },
                {
                    dataField: 'npp',
                },
                {
                    dataField: 'description',
                }, 
                {
                    dataField: 'EffectiveDate',
                },
                {
                    dataField: 'EndDate',
                } 
            ]
        });
    };
} 

function createRouteAssignmentStore(id) {
    return DevExpress.data.AspNet.createStore({
        key: 'OrderID',
        loadParams: { ProductID: productID },
        // loadUrl: `${url}/GetOrdersByProduct`,
    });
}
$(function () {
    var routeService = window.dMSpro.oMS.mdmService.controllers.routes.route;
    var salesOrgHierarchiesService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;
    var systemDataService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;
    var salesOrgHeaderService = window.dMSpro.oMS.mdmService.controllers.salesOrgHeaders.salesOrgHeader;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    var salesOrgHeaders = [];
    var salesOrgHierarchies = [];
    var salesOrgHierarchiesStore = new DevExpress.data.CustomStore({
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
            salesOrgHierarchiesService.getListDevextremes(args)
                .done(result => {
                    console.log(result.data)
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        }
    });
    var systemDataStore = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
        load() {
            const deferred = $.Deferred();
            systemDataService.getListDevextremes({
                filter: JSON.stringify(['code', '=', 'MD06'])
            }).done(result => {
                deferred.resolve(result.data, {
                    totalCount: result.totalCount,
                    summary: result.summary,
                    groupCount: result.groupCount,
                });
            });

            return deferred.promise();
        }
    });

    var gridRoutes = $('#gridRoutes').dxDataGrid({
        dataSource: new DevExpress.data.CustomStore({
            key: "id",
            loadMode: 'raw',
            load(loadOptions) {
                const deferred = $.Deferred();
                const args = {};
                requestOptions.forEach((i) => {
                    if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                        args[i] = JSON.stringify(loadOptions[i]);
                    }
                });
                salesOrgHeaderService.getListDevextremes({}).done(t => {
                    salesOrgHeaders = t.data;
                    salesOrgHierarchiesService.getListDevextremes({}).done(u => {
                        salesOrgHierarchies = u.data;
                        routeService.getListDevextremes(args)
                            .done(result => {
                                result.data.forEach(x => {
                                    var obj = salesOrgHierarchies.filter(u => u.id == x.salesOrgHierarchyId)[0];
                                    x.name = obj.name;
                                    x.sellingZone = null;
                                    x.salesOrgName = null;
                                    x.salesOrgActive = false;
                                    if (obj.parentId) {
                                        var parent = salesOrgHierarchies.filter(u => u.id == obj.parentId)[0];
                                        x.sellingZone = parent.name;
                                        if (parent.salesOrgHeaderId) {
                                            var header = salesOrgHeaders.filter(u => u.id == parent.salesOrgHeaderId)[0];
                                            x.salesOrgName = header.name;
                                            x.salesOrgActive = header.active;
                                        }
                                    }
                                });
                                deferred.resolve(result.data, {
                                    totalCount: result.totalCount,
                                    summary: result.summary,
                                    groupCount: result.groupCount
                                });
                            });
                    });
                })
                return deferred.promise();
            },
            insert(values) {
                return routeService.create(values, { contentType: 'application/json' });
            },
            update(key, values) {
                return routesService.update(key, values, { contentType: 'application/json' });
            },
            remove(key) {
                return routesService.delete(key);
            }
        }),
        // keyExpr: "id",
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'storage',
        },
        showBorders: true,
        columnAutoWidth: true,
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
        masterDetail: {
            enabled: true,
            template: masterDetailTemplate,
        },
        //columnChooser: {
        //    enabled: true,
        //    mode: "select"
        //},
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
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed"> <i class="fa fa-plus"></i> <span>${l("Button.New.Route")}</span></button>`,
                    onClick() {
                        gridRoutes.addRow();
                    },
                },

                //{
                //    location: 'after',
                //    widget: 'dxButton',
                //    options: {
                //        icon: 'refresh',
                //        onClick() {
                //            gridRoutes.refresh();
                //        },
                //    },
                //},
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed"> <i class="fa fa-upload"></i> </button>`,
                    onClick() {
                        //todo
                    },
                },
                "searchPanel"
            ],
        },
        export: {
            enabled: true,
            allowExportSelectedData: true,
        }, groupPanel: {
            visible: true,
        },
        selection: {
            mode: 'single',
        },

        onExporting(e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Routes');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Routes.xlsx');
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
        onEditorPreparing: function (e) {
            if (e.dataField == "salesOrgHierarchyId" && e.parentType == "dataRow") {
                e.editorName = "dxDropDownBox";
                e.editorOptions.dropDownOptions = {
                    //height: 500
                };
                e.editorOptions.contentTemplate = function (args, container) {
                    var value = args.component.option("value"),
                        $dataGrid = $("<div>").dxDataGrid({
                            width: '100%',
                            dataSource: args.component.option("dataSource"),
                            //keyExpr: "id",
                            columns: [,
                                {
                                    caption: "Item Code",
                                    dataField: "code"
                                }, {
                                    caption: "Name",
                                    dataField: "name"
                                }],
                            hoverStateEnabled: true,
                            paging: { enabled: true, pageSize: 10 },
                            filterRow: { visible: true },
                            scrolling: { mode: "infinite" },
                            height: '90%',
                            showRowLines: true,
                            showBorders: true,
                            selection: { mode: "single" },
                            selectedRowKeys: value,
                            onSelectionChanged: function (selectedItems) {
                                var keys = selectedItems.selectedRowKeys;
                                args.component.option("value", keys);
                            }
                        });

                    var dataGrid = $dataGrid.dxDataGrid("instance");

                    args.component.on("valueChanged", function (args) {
                        var value = args.value;

                        dataGrid.selectRows(value, false);
                        if (value != args.previousValue) {
                            var items = dataGrid.getDataSource().items();
                            var obj = items.filter(x => x.id == value)[0];
                            e.component.cellValue(e.row.rowIndex, "name", obj.name);
                            e.component.cellValue(e.row.rowIndex, "parentId", obj.parentId);
                        }
                    });
                    container.append($dataGrid);
                    return container;
                };
            } else if (e.dataField == "routeTypeId" && e.parentType == "dataRow") {
                e.editorName = "dxDropDownBox";
                e.editorOptions.dropDownOptions = {
                    //height: 500
                };
                e.editorOptions.contentTemplate = function (args, container) {
                    var value = args.component.option("value"),
                        $dataGrid = $("<div>").dxDataGrid({
                            width: '100%',
                            dataSource: args.component.option("dataSource"),
                            //keyExpr: "id",
                            columns: [,
                                {
                                    caption: "Item Code",
                                    dataField: "valueCode"
                                }, {
                                    caption: "Name",
                                    dataField: "valueName"
                                }],
                            hoverStateEnabled: true,
                            paging: { enabled: true, pageSize: 10 },
                            filterRow: { visible: true },
                            scrolling: { mode: "infinite" },
                            height: '90%',
                            showRowLines: true,
                            showBorders: true,
                            selection: { mode: "single" },
                            selectedRowKeys: value,
                            onSelectionChanged: function (selectedItems) {
                                var keys = selectedItems.selectedRowKeys;
                                args.component.option("value", keys);
                            }
                        });

                    var dataGrid = $dataGrid.dxDataGrid("instance");

                    args.component.on("valueChanged", function (args) {
                        var value = args.value;

                        dataGrid.selectRows(value, false);
                    });
                    container.append($dataGrid);
                    return container;
                };
            }
        },
        columns: [
            {
                width: 100,
                type: 'buttons',
                caption: l('Actions'),
                buttons: ['edit', 'delete']
            },
            {
                dataField: "salesOrgHierarchyId",
                caption: l("Code"),
                lookup: {
                    dataSource: salesOrgHierarchiesStore,
                    valueExpr: 'id',
                    displayExpr: 'code',
                },
            },
            {
                dataField: "name",
                caption: l("Name"),
                allowEditing: false,

            },
            {
                dataField: "routeTypeId",
                caption: l("RouteType"),
                //allowEditing: false,
                lookup: {
                    dataSource: systemDataStore,
                    valueExpr: 'id',
                    displayExpr: 'valueName',
                },
            },
            {
                dataField: "salesOrgName",
                caption: l("SalesOrg"),
                allowEditing: false,

            },
            {
                dataField: "sellingZone",
                caption: l("SellingZone"),
                allowEditing: false,
            },
            {
                dataField: "name",
                caption: l("SalesSuppervisor"),
                allowEditing: false,

            },
            {
                dataField: "name",
                caption: l("Employee"),
                allowEditing: false,

            },
            {
                dataField: "name",
                caption: l("ItemGroup"),
                allowEditing: false,

            },
            {
                dataField: "name",
                caption: l("MCP"),
                allowEditing: false,

            },
            {
                dataField: "salesOrgActive",
                caption: l("Active"),
                allowEditing: false,
            },
            {
                dataField: "name",
                caption: l("Checkin"),
                allowEditing: false,

            },
            {
                dataField: "gpsLock",
                caption: l("GBPLock"),
            },
            {
                dataField: "outRoute",
                caption: l("OutRoute"),
            }
        ]
    }).dxDataGrid("instance");
});
