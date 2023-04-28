﻿var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
var priceListDetailsService = window.dMSpro.oMS.mdmService.controllers.priceListDetails.priceListDetail;
var uomService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;
var itemService = window.dMSpro.oMS.mdmService.controllers.items.item;
$(function () {
    var l = abp.localization.getResource("OMS");
    var isReleasedStore = [
        {
            id: true,
            text: l('EntityFieldValue:MDMService:PriceList:Status:Released')
        },
        {
            id: false,
            text: l('EntityFieldValue:MDMService:PriceList:Status:Open')
        }
    ]
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
            return priceListService.create({ ...values, active: true }, { contentType: 'application/json' });
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
        },
        insert(values) {
            return priceListDetailsService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return priceListDetailsService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return priceListDetailsService.delete(key);
        }
    });

    // get price list
    var getPriceList = new DevExpress.data.CustomStore({
        key: "id",
        useDefaultSearch: true,
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
        useDefaultSearch: true,
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
        // stateStoring: {
        //     enabled: true,
        //     type: 'localStorage',
        //     storageKey: 'gridPriceLists',
        // },
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
        onEditorPreparing: (e) => {
            if (e.row?.rowType == "data" && e.row?.isNewRow) {
                let itemsLength = e.component.getDataSource().items().length;
                if (['isBase', 'isDefaultForCustomer', 'isDefaultForVendor'].indexOf(e.dataField) > -1 && itemsLength === 0) {
                    e.editorOptions.onContentReady = (v) => {
                        v.component.option('value', true)
                    }
                    e.editorOptions.readOnly = true
                }
            }
            // Disable Edit some field if Base PriceList
            if (e.row?.data.isBase) {
                if (['name', 'isDefaultForCustomer', 'isDefaultForVendor'].indexOf(e.dataField) == -1) {
                    e.editorOptions.readOnly = true
                    e.editorOptions.placeholder = null
                }
            }
        },
        onEditorPrepared: function (e) {
            //if (e.row?.rowType == "data" && Boolean(e.dataField) && e.parentType == 'dataRow' && e.row.isNewRow){
            //    const items = e.component.getDataSource().items();
            //    const value = e.component.option("value");
            //}
        },
        onInitNewRow: (e) => {
            // on new row ,set 3 checkbox default value to false
            e.data = {
                ...e.data,
                isBase: false,
                isDefaultForCustomer: false,
                isDefaultForVendor: false,
            }
        },
        toolbar: {
            items: [
                //"groupPanel",
                "addRowButton",
                "columnChooserButton",
                //"exportButton",
                //{
                //    location: 'after',
                //    widget: 'dxButton',
                //    options: {
                //        icon: "import",
                //        elementAttr: {
                //            class: "import-excel",
                //        },
                //        onClick(e) {
                //            var gridControl = e.element.closest('div.dx-datagrid').parent();
                //            var gridName = gridControl.attr('id');
                //            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                //            if (popup) popup.show();
                //        },
                //    }
                //},
                //"searchPanel"
            ],
        },
        columns:
            [
                {
                    type: 'buttons',
                    buttons: [
                        'edit',
                        {
                            text: l('Button:MDMService:PriceListAssignment:Release'),
                            icon: 'tags',
                            onClick: (e) => {
                                priceListService.release(e.row.data.id, { contentType: "application/json" }).then(() => {
                                    dataGrid.refresh()
                                })
                            },
                            disabled: (e) => e.row.isNewRow || e.row.data.isReleased
                        }
                    ],
                    caption: l('Actions'),
                    width: 100,
                    fixedPosition: 'left'
                },
                {
                    dataField: 'code',
                    caption: l("EntityFieldName:MDMService:PriceList:Code"),
                    validationRules: [
                        {
                            type: "required"
                        },
                        {
                            type: 'pattern',
                            pattern: '^[a-zA-Z0-9]{1,20}$',
                            message: l('ValidateingCodeField')
                        }
                    ],
                    cellTemplate: (cellElement, component, c) => {
                        return $('<div />').text(component.value).css('color', component.data.isBase ? "#1d4ed8" : "")
                    }
                },
                {
                    dataField: 'name',
                    caption: l("EntityFieldName:MDMService:PriceList:Name"),
                    validationRules: [{ type: "required" }]
                },
                {
                    dataField: 'isReleased',
                    caption: l("EntityFieldName:MDMService:PriceList:Active"),
                    alignment: 'center',
                    dataType: 'text',
                    lookup: {
                        dataSource: isReleasedStore,
                        valueExpr: 'id',
                        displayExpr: 'text',
                    },
                    allowEditing: false,
                    width: 120
                },
                {
                    caption: l("EntityFieldName:MDMService:PriceList:BasePriceList"),
                    dataField: "basePriceListId",
                    cssClass: 'fieldBasePrice',
                    editorType: 'dxSelectBox',
                    calculateDisplayValue: 'basePriceList.code',
                    elementAttr: {
                        class: "basePriceListSelectBox",
                    },
                    lookup: {
                        dataSource: (e) => {
                            if (e.data)
                                return {
                                    store: getPriceList,
                                    filter: ["isBase", "=", true],
                                    paginate: true,
                                    pageSize
                                }
                            else {
                                return {
                                    store: getPriceList,
                                    filter: ['id', '<>', null],
                                    paginate: true,
                                    pageSize
                                }
                            }
                        },
                        valueExpr: 'id',
                        displayExpr: 'code'
                    },
                    //editorOptions: {
                    //     //dataSource: {
                    //     //    store: getPriceList,
                    //     //    filter: ["isFirstPriceList", "=", true],
                    //     //},
                    //     //valueExpr: 'id',
                    //     //displayExpr: 'code'
                    // },
                    width: 200
                },
                {
                    dataField: 'arithmeticOperation',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticOperation"),
                    cssClass: 'fieldOperation',
                    lookup: {
                        dataSource: arithmeticOperation,
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
                    editorOptions: {
                        min: 0,
                    },
                    width: 180
                },
                {
                    dataField: 'arithmeticFactorType',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticFactorType"),
                    cssClass: 'fieldFactorType',
                    lookup: {
                        dataSource: arithmeticFactorType,
                        valueExpr: 'id',
                        displayExpr: 'text'
                    },
                    width: 200
                },
                // {
                //     dataField: 'isBase',
                //     caption: l("EntityFieldName:MDMService:PriceList:IsBase"),
                //     alignment: 'center',
                //     cellTemplate(container, options) {
                //         $('<div>')
                //             .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                //             .appendTo(container);
                //     },
                //     width: 120,
                // },
                {
                    dataField: 'isDefaultForCustomer',
                    caption: l("EntityFieldName:MDMService:PriceList:IsDefaultForCustomer"),
                    alignment: 'center',
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                            .appendTo(container);
                    },
                    width: 120,
                },
                {
                    dataField: 'isDefaultForVendor',
                    caption: l("EntityFieldName:MDMService:PriceList:IsDefaultForVendor"),
                    alignment: 'center',
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                            .appendTo(container);
                    },
                    width: 120
                },
            ],

        masterDetail: {
            enabled: true,
            template(container, options) {
                const currentHeaderData = options.data;
                const dataGridDetail = $(`<div id="grid_${currentHeaderData.id}">`)
                    .dxDataGrid({
                        dataSource: {
                            store: detailStore,
                            filter: ['priceListId', '=', options.key],
                            paginate: true,
                            pageSize,
                        },
                        key: "id",
                        editing: {
                            mode: 'row',
                            allowUpdating: !options.data.isReleased && abp.auth.isGranted('MdmService.PriceLists.Edit'),
                            useIcons: true,
                            texts: {
                                editRow: l("Edit"),
                            }
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
                        // stateStoring: {
                        //     enabled: true,
                        //     type: 'localStorage',
                        //     storageKey: 'dgPriceListDetails' + options.key,
                        // },
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
                                "addRowButton",
                                "groupPanel",
                                //"columnChooserButton",
                                "exportButton",
                                "searchPanel"
                            ],
                        },
                        columns: [
                            {
                                type: 'buttons',
                                buttons: [
                                    'edit',
                                ],
                                caption: l('Actions'),
                                width: 100,
                                fixedPosition: 'left'
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:PriceList"),
                                dataField: "priceList.code",
                                allowEditing: false,
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:Item"),
                                dataField: "item.name",
                                sortIndex: 0, sortOrder: "asc",
                                calculateDisplayValue: (e) => {
                                    if (e)
                                        return e.item.code + " - " + e.item.name
                                },
                                allowEditing: false,
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:UOM"),
                                dataField: "uom.name",
                                allowEditing: false,
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:BasedOnPrice"),
                                dataField: "basedOnPrice",
                                allowEditing: false,
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:Price"),
                                dataField: "price",
                                dataType: 'number',

                                validationRules: [{ type: "required" }]
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:Description"),
                                dataField: "description",
                                dataType: "string",
                                validationRules: [{ type: "required" }]
                            }
                        ],
                        onRowUpdating: (e) => {
                            // console.log(e.newData?.description);
                            let { uomId, itemId, concurrencyStamp, description, basedOnPrice } = e.oldData
                            let newData = {
                                uomId, itemId, concurrencyStamp, description, basedOnPrice,
                                ...e.newData,
                            }
                            e.newData = newData;
                        }
                    }).appendTo(container);
                // initImportPopup('api/mdm-service/price-list-details', 'PriceListDetails_Template', `grid_${currentHeaderData.id}`);
            }
        }
    }).dxDataGrid('instance');

    // initImportPopup('api/mdm-service/price-lists', 'PriceLists_Template', 'gridPriceLists');
});
