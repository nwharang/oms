$(function () {
    let l = abp.localization.getResource("OMS");
    let readOnly = true
    
    let priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
    let priceListDetailsService = window.dMSpro.oMS.mdmService.controllers.priceListDetails.priceListDetail;

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

            let d = new $.Deferred();
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
            let d = new $.Deferred();
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
            allowAdding: !readOnly && abp.auth.isGranted('MdmService.PriceLists.Create'),
            allowUpdating: !readOnly && abp.auth.isGranted('MdmService.PriceLists.Edit'),
            allowDeleting: !readOnly && abp.auth.isGranted('MdmService.PriceLists.Delete'),
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
                            visible: !readOnly,
                            disabled: (e) => e.row.isNewRow || e.row.data.isReleased
                        }
                    ],
                    caption: l('Actions'),
                    name: "Actions",
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
                            message: l('ValidateError:Code')
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
                    dataField: 'active',
                    caption: l("EntityFieldName:MDMService:PriceList:Active"),
                    dataType: 'boolean',
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                            .appendTo(container);
                    }
                },
                {
                    caption: l("EntityFieldName:MDMService:PriceList:BasePriceList"),
                    dataField: "basePriceListId",
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
                },
                {
                    dataField: 'arithmeticOperation',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticOperation"),
                    lookup: {
                        dataSource: arithmeticOperation,
                        valueExpr: 'id',
                        displayExpr: 'text'
                    },
                },
                {
                    dataField: 'arithmeticFactor',
                    caption: l("EntityFieldName:MDMService:PriceList:ArithmeticFactor"),
                    dataType: 'number',
                    editorOptions: {
                        min: 0,
                    },
                },
                {
                    dataField: 'PriceMode',
                    caption: "Price Mode", // Localize
                    dataType: 'boolean',
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                            .appendTo(container);
                    }
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
                                dataField: "priceList.code",
                                allowEditing: false,
                            },
                            {
                                caption: l("EntityFieldName:MDMService:PriceListDetail:Item"),
                                dataField: "item.code",
                                sortIndex: 0,
                                sortOrder: "asc",
                                allowEditing: false,
                            },
                            {
                                caption: "ItemDescription",
                                dataField: "item.name",
                                sortIndex: 0,
                                sortOrder: "asc",
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
                        ],
                        onRowUpdating: (e) => {
                            let { uomId, itemId, concurrencyStamp, basedOnPrice } = e.oldData
                            let newData = {
                                uomId, itemId, concurrencyStamp, basedOnPrice,
                                ...e.newData,
                            }
                            e.newData = newData;
                        }
                    }).appendTo(container);
            }
        }
    }).dxDataGrid('instance');
});
