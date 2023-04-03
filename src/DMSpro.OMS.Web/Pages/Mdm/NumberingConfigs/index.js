var numberingConfigService = window.dMSpro.oMS.mdmService.controllers.numberingConfigs.numberingConfig;
var numberingConfigDetailService = window.dMSpro.oMS.mdmService.controllers.numberingConfigDetails.numberingConfigDetail;
var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
$(function () {
    var l = abp.localization.getResource("OMS");

    var numberingConfigStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            numberingConfigService.getListDevextremes(args)
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
            numberingConfigService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return numberingConfigService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return numberingConfigService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return numberingConfigService.delete(key);
        }
    });

    var numberingConfigDetailStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            numberingConfigDetailService.getListDevextremes(args)
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
            numberingConfigDetailService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return numberingConfigDetailService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return numberingConfigDetailService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return numberingConfigDetailService.delete(key);
        }
    });

    var companyStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            companyService.getListDevextremes(args)
                .done(result => {
                    //result.data.push({});
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
            companyService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    });

    var gridgridNumberingConfigs = $('#gridNumberingConfigs').dxDataGrid({
        dataSource: numberingConfigStore,
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
        headerFilter: {
            visible: true,
        },
        // stateStoring: {
        //     enabled: true,
        //     type: 'localStorage',
        //     storageKey: 'gridNumberingConfigs',
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
            allowAdding: abp.auth.isGranted('MdmService.SystemConfig.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.SystemConfig.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.SystemConfig.Delete'),
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
        // toolbar: {
        //     items: [
        //         "groupPanel",
        //         "addRowButton",
        //         "columnChooserButton",
        //         "exportButton",
        //         {
        //             location: 'after',
        //             widget: 'dxButton',
        //             options: {
        //                 icon: "import",
        //                 elementAttr: {
        //                     //id: "import-excel",
        //                     class: "import-excel",
        //                 },
        //                 onClick(e) {
        //                     var gridControl = e.element.closest('div.dx-datagrid').parent();
        //                     var gridName = gridControl.attr('id');
        //                     var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
        //                     if (popup) popup.show();
        //                 },
        //             },
        //         },
        //         "searchPanel",
        //     ],
        // },
        columns: [
            {
                type: 'buttons',
                caption: l('Actions'),
                buttons: ['edit'],
                width: 110,
                fixedPosition: 'left'
            },
            {
                dataField: 'systemData.valueName',
                caption: l("EntityFieldName:MDMService:NumberingConfig:SystemDataId"),
                dataType: 'string'
            },
            {
                dataField: 'prefix',
                caption: l("EntityFieldName:MDMService:NumberingConfig:Prefix"),
                dataType: 'string'
            },

            {
                dataField: 'paddingZeroNumber',
                caption: l("EntityFieldName:MDMService:NumberingConfig:PaddingZeroNumber"),
                dataType: 'number'
            },
            {
                dataField: 'suffix',
                caption: l("EntityFieldName:MDMService:NumberingConfig:Suffix"),
                dataType: 'string'
            },
        ],
        masterDetail: {
            enabled: true,
            template(container, options) {
                $('<div>').dxDataGrid({
                    columnAutoWidth: true,
                    showBorders: true,
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
                    dataSource: new DevExpress.data.DataSource({
                        store: numberingConfigDetailStore,
                        filter: ['numberingConfigId', '=', options.key],
                    }),
                    editing: {
                        mode: "row",
                        allowAdding: true, //abp.auth.isGranted('MdmService.NumberingConfigDetails.Create'),
                        allowUpdating: true, //abp.auth.isGranted('MdmService.NumberingConfigDetails.Edit'),
                        allowDeleting: true, //abp.auth.isGranted('MdmService.NumberingConfigDetails.Delete'),
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
                    columns: [
                        {
                            type: 'buttons',
                            caption: l('Actions'),
                            buttons: ['edit'],
                            width: 110,
                        },
                        {
                            dataField: 'companyId',
                            dataType: 'string',
                            calculateDisplayValue(rowData) {
                                if (!rowData.company || rowData.company === null) return "";
                                return rowData.company.name;
                            },
                            lookup: {
                                dataSource: {
                                    store: companyStore,
                                    paginate: true,
                                    pageSize: pageSizeForLookup,

                                },
                                displayExpr: 'name',
                                valueExpr: 'id',
                                searchEnabled: true,
                                searchMode: 'contains'
                            }
                        },
                        {
                            dataField: 'prefix',
                            caption: l("EntityFieldName:MDMService:NumberingConfig:Prefix"),
                            dataType: 'string'
                        },
                        {
                            dataField: 'currentNumber',
                            caption: l("EntityFieldName:MDMService:NumberingConfig:CurrentNumber"),
                            dataType: 'number',
                            allowEditing: false,
                        },
                        {
                            dataField: 'paddingZeroNumber',
                            caption: l("EntityFieldName:MDMService:NumberingConfig:PaddingZeroNumber"),
                            dataType: 'number'
                        },
                        {
                            dataField: 'suffix',
                            caption: l("EntityFieldName:MDMService:NumberingConfig:Suffix"),
                            dataType: 'string'
                        },
                    ],

                    onEditorPreparing: function (e) {
                        if (e.dataField == 'companyId' && e.value != null) {
                            e.editorOptions.readOnly = true;
                        }
                    },

                }).appendTo(container);
            },
        },
    }).dxDataGrid('instance');

    initImportPopup('api/mdm-service/numbering-configs', 'NumberingConfigs', 'gridNumberingConfigs');
});
