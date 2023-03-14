﻿var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
var priceListDetailsService = window.dMSpro.oMS.mdmService.controllers.priceListDetails.priceListDetail;
var uomService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;
var itemService = window.dMSpro.oMS.mdmService.controllers.items.item;
$(function () {
    var l = abp.localization.getResource("OMS");

    var customStore = new DevExpress.data.CustomStore({
        key: "id",
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
            id: 0,
            text: l('EntityFieldValue:MDMService:PriceList:ArithmeticOperation:ADD')
        },
        {
            id: 1,
            text: l('EntityFieldValue:MDMService:PriceList:ArithmeticOperation:SUBTRACT')
        },
        //{
        //    id: 2,
        //    text: l('EntityFieldValue:MDMService:PriceList:ArithmeticOperation:MULTIPLICATION')
        //},
        //{
        //    id: 3,
        //    text: l('EntityFieldValue:MDMService:PriceList:ArithmeticOperation:DIVISION')
        //}
    ];

    const arithmeticFactorType = [
        {
            id: 0,
            text: l('EntityFieldValue:MDMService:PriceList:ArithmeticFactorType:WHOLE_NUMBER')
        },
        {
            id: 1,
            text: l('EntityFieldValue:MDMService:PriceList:ArithmeticFactorType:PERCENTAGE')
        }
    ];

    const dataGrid = $('#gridPriceLists').dxDataGrid({
        key: 'id',
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
            if (e.format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('PriceLists');
                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet,
                    autoFilterEnabled: true,
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'PriceLists.xlsx');
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
                    doc.save('PriceLists.pdf');
                });
            }
        },
        headerFilter: {
            visible: true,
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'gridPriceLists',
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
            e.newData = Object.assign({}, e.oldData, e.newData);
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
                    calculateDisplayValue: 'basePriceList.code',
                    lookup: {
                        //dataSource: getPriceList,
                        dataSource: {
                            store: getPriceList,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        },
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
                        valueExpr: 'id',
                        displayExpr: 'text',
                        paginate: true,
                        pageSize: pageSizeForLookup
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
                        displayExpr: 'text',
                        paginate: true,
                        pageSize: pageSizeForLookup
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
                            filter: ['priceListId', '=', options.key],
                            paginate: true,
                            pageSize: pageSize,
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
                            storageKey: 'dgPriceListDetails' + options.key,
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
                        columns: [
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:PriceList"),
                                dataField: "priceListId",
                                lookup: {
                                    //dataSource: getPriceList,
                                    dataSource: {
                                        store: getPriceList,
                                        paginate: true,
                                        pageSize: pageSizeForLookup
                                    },
                                    valueExpr: 'id',
                                    displayExpr: 'code'
                                }
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:Item"),
                                dataField: "itemId",
                                lookup: {
                                    //dataSource: getItemList,
                                    dataSource: {
                                        store: getItemList,
                                        paginate: true,
                                        pageSize: pageSizeForLookup
                                    },
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
                                    //dataSource: getUOMs,
                                    dataSource: {
                                        store: getUOMs,
                                        paginate: true,
                                        pageSize: pageSizeForLookup
                                    },
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

    initImportPopup('api/mdm-service/price-lists', 'PriceLists_Template', 'gridPriceLists');
});