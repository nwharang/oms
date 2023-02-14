var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
var priceListDetailsService = window.dMSpro.oMS.mdmService.controllers.priceListDetails.priceListDetail;
var uomService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;
var itemService = window.dMSpro.oMS.mdmService.controllers.items.item;
$(function () {
    var l = abp.localization.getResource("MdmService");
    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    var customStore = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            priceListService.getListDevextremes(args)
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
            priceListService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return priceListService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return priceListService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return priceListService.delete(key);
        }
    });

    // get detail store
    var detailStore = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            priceListDetailsService.getListDevextremes(args)
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
            priceListDetailsService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    });

    // get price list
    var getPriceList = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            priceListService.getListDevextremes(args)
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
            priceListService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    // get UOM list
    var getUOMs = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
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

    // get item list
    var getItemList = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            itemService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        }
    });

    const arithmeticOperation = [
        {
            id: 'ADD',
            text: l('EntityFieldValue:MDMService:PriceList:ArithmeticOperation:ADD')
        },
        {
            id: 'SUBTRACT',
            text: l('EntityFieldValue:MDMService:PriceList:ArithmeticOperation:SUBTRACT')
        },
        {
            id: 'MULTIPLICATION',
            text: l('EntityFieldValue:MDMService:PriceList:ArithmeticOperation:MULTIPLICATION')
        },
        {
            id: 'DIVISION',
            text: l('EntityFieldValue:MDMService:PriceList:ArithmeticOperation:DIVISION')
        }
    ];

    const arithmeticFactorType = [
        {
            id: 'WHOLE_NUMBER',
            text: l('EntityFieldValue:MDMService:PriceList:ArithmeticFactorType:WHOLE_NUMBER')
        },
        {
            id: 'PERCENTAGE',
            text: l('EntityFieldValue:MDMService:PriceList:ArithmeticFactorType:PERCENTAGE')
        }
    ];

    const dataGrid = $('#gridPriceLists').dxDataGrid({
        dataSource: customStore,
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
            storageKey: 'dgPriceLists',
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
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.PriceLists.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.PriceLists.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.PriceLists.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onRowUpdating: function (e) {
            var objectRequire = ['code', 'name', 'active', 'basePriceListId', 'arithmeticOperation', 'arithmeticFactor', 'arithmeticFactorType'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        onEditorPrepared: function (e) {
            if (e.dataField == 'basePriceListId' && e.parentType == 'dataRow' && e.row.isNewRow) {
                const items = e.component.getDataSource().items();
                const value = e.component.option("value");
                if (!value) {
                    $('.fieldBasePrice > div.dx-selectbox').data('dxSelectBox').option('value', items[0].id);
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
                        dataGrid.addRow();
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
        columns:
            [
                {
                    type: 'buttons',
                    buttons: ['edit'],
                    caption: l('Actions'),
                    width: 120,
                    fixedPosition: 'left'
                },
                {
                    dataField: 'code',
                    caption: l("EntityFieldName:MDMService:PriceList:Code"),
                    validationRules: [{ type: "required" }]
                },
                {
                    dataField: 'name',
                    caption: l("EntityFieldName:MDMService:PriceList:Name"),
                    validationRules: [{ type: "required" }]
                },
                {
                    dataField: 'active',
                    caption: l("EntityFieldName:MDMService:PriceList:Active"),
                    alignment: 'center',
                    dataType: 'boolean',
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                            .appendTo(container);
                    },
                    width: 120
                },
                {
                    caption: l("EntityFieldName:MDMService:PriceList:BasePriceList"),
                    dataField: "basePriceListId",
                    cssClass: 'fieldBasePrice',
                    editorType: 'dxSelectBox',
                    lookup: {
                        dataSource: getPriceList,
                        valueExpr: 'id',
                        displayExpr: 'code'
                    },
                    width: 200
                },
                {
                    dataField: 'arithmeticOperation',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticOperation"),
                    cssClass: 'fieldOperation',
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        searchPanel: true,
                        dataSource: arithmeticOperation,
                        searchPanel: true,
                        valueExpr: 'id',
                        displayExpr: 'text'
                    },
                    width: 180
                },
                {
                    dataField: 'arithmeticFactor',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticFactor"),
                    cssClass: 'fieldFactor',
                    dataType: 'number',
                    width: 180
                },
                {
                    dataField: 'arithmeticFactorType',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticFactorType"),
                    cssClass: 'fieldFactorType',
                    editorType: 'dxSelectBox',
                    editorOptions: {
                        dataSource: arithmeticFactorType,
                        searchEnabled: true,
                        valueExpr: 'id',
                        displayExpr: 'text'
                    },
                    width: 200
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
                            filter: ['priceListId', '=', options.key]
                        },
                        keyExpr: 'id',
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
                            storageKey: 'dgPriceListDetails' + options.key,
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
                        columns: [
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:PriceList"),
                                dataField: "priceListId",
                                lookup: {
                                    dataSource: getPriceList,
                                    valueExpr: 'id',
                                    displayExpr: 'code'
                                }
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:Item"),
                                dataField: "itemId",
                                lookup: {
                                    dataSource: getItemList,
                                    valueExpr: 'id',
                                    displayExpr: function (e) {
                                        return e.code + ' - ' + e.name
                                    }
                                }
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:UOM"),
                                dataField: "uomId",
                                lookup: {
                                    dataSource: getUOMs,
                                    valueExpr: 'id',
                                    displayExpr: 'code'
                                }
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:BasedOnPrice"),
                                dataField: "basedOnPrice"
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:Price"),
                                dataField: "price",
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:Description"),
                                dataField: "description",
                                dataType: "string"
                            }
                        ]
                    }).appendTo(container);
            }
        }
    }).dxDataGrid('instance');

    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }
});
