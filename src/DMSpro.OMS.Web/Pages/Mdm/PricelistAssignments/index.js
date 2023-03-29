var pricelistAssignmentService = window.dMSpro.oMS.mdmService.controllers.pricelistAssignments.pricelistAssignment;
var pricelistService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
var customerService = window.dMSpro.oMS.mdmService.controllers.customerGroups.customerGroup;
$(function () {
    var l = abp.localization.getResource("OMS");

    // custom store
    var priceListStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            pricelistService.getListDevextremes(args)
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
            pricelistService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return pricelistService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return pricelistService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return pricelistService.delete(key);
        }
    });

    var pricelistAssignmentStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            pricelistAssignmentService.getListDevextremes(args)
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
            pricelistAssignmentService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return pricelistAssignmentService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return pricelistAssignmentService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return pricelistAssignmentService.delete(key);
        }
    });

    var getCustomers = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            customerService.getListDevextremes(args)
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
            customerService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    });

    //// get customers
    //var customers = [];
    //var urlCustomersLookup = abp.appPath + 'api/mdm-service/pricelist-assignments/customer-group-lookup' +
    //    abp.utils.buildQueryString([
    //        { name: 'maxResultCount', value: 1000 }
    //    ]);
    //$.ajax({
    //    url: `${urlCustomersLookup}`,
    //    dataType: 'json',
    //    async: false,
    //    success: function (data) {
    //        console.log('data call geoList ajax: ', data);
    //        customers = data.items;
    //    }
    //});
    //var getCustomers = function () {
    //    return customers;
    //}

    const dataGrid = $('#gridPriceListAssignment').dxDataGrid({
        dataSource: priceListStore,
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
                const worksheet = workbook.addWorksheet('PriceListAssignment');
                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet,
                    autoFilterEnabled: true,
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'PriceListAssignment.xlsx');
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
                    doc.save('PriceListAssignment.pdf');
                });
            }
        },
        headerFilter: {
            visible: true,
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'gridPriceListAssignment',
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
                'columnChooserButton',
                "exportButton",
                //{
                //    location: 'after',
                //    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
                //    onClick() {
                //        //todo
                //    },
                //},
                "searchPanel"
            ],
        },
        columns: [
            {
                caption: l("EntityFieldName:MDMService:PriceListAssignment:PriceListCode"),
                dataField: "code",
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("EntityFieldName:MDMService:PriceListAssignment:PriceListName"),
                dataField: "name",
                validationRules: [{ type: "required" }]
            }
        ],
        masterDetail: {
            enabled: true,
            template(container, options) {
                const currentHeaderData = options.data;
                const dataGridDetail = $(`<div id="grid_${currentHeaderData.id}">`)
                    .dxDataGrid({
                        dataSource: {
                            store: pricelistAssignmentStore,
                            filter: ['priceListId', '=', options.key]
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
                            storageKey: 'dgPriceListAssignmentDetail' + options.key,
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
                            allowAdding: abp.auth.isGranted('MdmService.PricelistAssignments.Create'),
                            allowUpdating: false,
                            allowDeleting: false
                        },
                        onRowInserting: function (e) {
                            e.data.priceListId = options.key
                        },
                        toolbar: {
                            items: [
                                "groupPanel",
                                "addRowButton",
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
                                caption: l("EntityFieldName:MDMService:CustomerGroup:Name"),
                                dataField: "customerGroupId",
                                editorType: 'dxSelectBox',
                                lookup: {
                                    //dataSource: getCustomers,
                                    dataSource: {
                                        store: getCustomers,
                                        paginate: true,
                                        pageSize: pageSizeForLookup
                                    },
                                    valueExpr: 'id',
                                    displayExpr: function (e) {
                                        return e.code + ' - ' + e.name
                                    }
                                }
                            }
                        ]
                    }).appendTo(container);
                initImportPopup('api/mdm-service/pricelist-assignments', 'PricelistAssignments_Template', `grid_${currentHeaderData.id}`);
            }
        }
    }).dxDataGrid('instance');
});