$(function () {
    let l = abp.localization.getResource("OMS");
    let readOnly = true

    let priceListService = dMSpro.oMS.mdmSapService.priceLists.priceList;
    let priceListDetailsService = dMSpro.oMS.mdmSapService.priceListByItems.priceListByItem;
    let itemService = dMSpro.oMS.mdmSapService.items.item
    let itemStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            itemService.getListDevExtreme(args)
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

            let d = new $.Deferred();
            itemService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
    });
    let customStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            priceListService.getListDevExtreme(args)
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

            let d = new $.Deferred();
            priceListService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
    });

    let detailStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            priceListDetailsService.getListDevExtreme(args)
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
            let d = new $.Deferred();
            priceListDetailsService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
    });

    let getPriceList = new DevExpress.data.CustomStore({
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

            let d = new $.Deferred();
            priceListService.get(key)
                .done(data => {
                    d.resolve(data);
                });
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
        {
            id: 2,
            text: l('EntityFieldValue:MDMService:PriceList:ArithmeticOperation:MULTIPLICATION')
        },
        {
            id: 3,
            text: l('EntityFieldValue:MDMService:PriceList:ArithmeticOperation:DIVISION')
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
        filterRow: {
            visible: true
        },
        groupPanel: {
            visible: true,
        },
        searchPanel: {
            visible: true
        },
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
                const worksheet = workbook.addWorksheet('Data');
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
            pageSize
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
                "addRowButton",
                "columnChooserButton",
                "exportButton",
                "searchPanel"
            ],
        },
        columns:
            [
                {
                    type: 'buttons',
                    buttons: [],
                    caption: l('Actions'),
                    name: "Actions",
                    fixedPosition: 'left'
                },
                {
                    dataField: 'priceListCode',
                    caption: l("EntityFieldName:MDMService:PriceList:Code"),
                    validationRules: [
                        {
                            type: "required"
                        },
                        {
                            type: 'pattern',
                            pattern: '^[a-zA-Z0-9]{1,20}$',
                            message: l('ValidateError:Code')
                        }
                    ],
                    cellTemplate: (cellElement, component, c) => {
                        return $('<div />').text(component.value).css('color', component.data.isBase ? "#1d4ed8" : "")
                    }
                },
                {
                    dataField: 'priceListName',
                    caption: l("EntityFieldName:MDMService:PriceList:Name"),
                    validationRules: [{ type: "required" }]
                },
                {
                    dataField: 'validFor',
                    caption: l("EntityFieldName:MDMService:PriceList:Active"),
                    calculateCellValue: (e) => e.validFor == "Y",
                    cellTemplate(container, options) {
                        $('<div class="text-center">')
                            .append($(options.data.validFor == "Y" ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                            .appendTo(container);
                    }
                },
                {
                    caption: l("EntityFieldName:MDMService:PriceList:BasePriceList"),
                    dataField: "basePriceListCode",
                },
                {
                    // dataField: 'arithmeticOperation',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticOperation"),
                    calculateCellValue: (e) => e.arithmeticOperation || 2,
                    lookup: {
                        dataSource: arithmeticOperation,
                        valueExpr: 'id',
                        displayExpr: 'text'
                    },
                },
                {
                    dataField: 'factor',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticFactor"),
                    dataType: 'number',
                    editorOptions: {
                        min: 0,
                    },
                },
                {
                    dataField: 'isGrossPrice',
                    caption: "Price Mode", // Localize
                    cellTemplate(container, options) {
                        $('<div class="text-center">')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                            .appendTo(container);
                    }
                },
            ],

        masterDetail: {
            enabled: true,
            template(container, options) {
                const currentHeaderData = options.data;
                const dataGridDetail = $(`<div>`)
                    .dxDataGrid({
                        dataSource: {
                            store: detailStore,
                            filter: ['priceListCode', '=', currentHeaderData.priceListCode],
                        },
                        key: "id",
                        editing: {
                            mode: 'row',
                            allowUpdating: !readOnly && !options.data.isReleased && abp.auth.isGranted('MdmService.PriceLists.Edit'),
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
                        filterRow: {
                            visible: true
                        },
                        groupPanel: {
                            visible: true,
                        },
                        searchPanel: {
                            visible: true
                        },
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
                                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'PriceListByItem.xlsx');
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
                            pageSize
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
                                "addRowButton",
                                "groupPanel",
                                "columnChooserButton",
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
                                fixedPosition: 'left'
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:PriceList"),
                                dataField: "priceListCode",
                                allowEditing: false,
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:Item"),
                                dataField: "itemCode",
                                allowEditing: false,
                            },
                            {
                                caption: "ItemDescription",
                                allowEditing: false,
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:UOM"),
                                dataField: "uomCode",
                                allowEditing: false,
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:BasedOnPrice"),
                                // dataField: "basedOnPrice",
                                allowEditing: false,
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:Price"),
                                dataField: "price",
                                dataType: 'number',
                                validationRules: [{ type: "required" }]
                            },
                        ],
                    }).appendTo(container);
            }
        }
    }).dxDataGrid('instance');
});
