var uomGroupService = dMSpro.oMS.mdmSapService.uomGroups.uomGroup;
var uomGroupDetailService = dMSpro.oMS.mdmSapService.uomGroupDetails.uomGroupDetail
var uomService = dMSpro.oMS.mdmSapService.uoms.uom;

$(function () {
    var l = abp.localization.getResource("OMS");
    var uomGroupHeaderStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            loadOptions.withDetails = false;
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            uomGroupService.getListDevExtreme(args)
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
            uomGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
    });

    var uomGroupDetailsStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            uomGroupDetailService.getListDevExtreme(args)
                .done(result => {
                    let baseUom = result.data.find(e => e.altQty == e.baseQty)
                    result.data = result.data.map(e => ({ ...e, baseUomCode: baseUom?.uomCode }))
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
            uomGroupDetailService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
    });

    // get UOMs
    var getUOMs = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: "raw",
        cacheRawData: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            uomService.getListDevExtreme(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
    });

    const dataGrid = $('#gridUOMGroups').dxDataGrid({
        dataSource: uomGroupHeaderStore,
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
        onExporting: function (e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');
            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${name || "Exports"}.xlsx`);
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
            storageKey: 'gridUOMGroups',
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
                "exportButton",
                "searchPanel"
            ],
        },
        columns: [
            {
                type: 'buttons',
                buttons: [],
                caption: l("Actions"),
                width: 110,
                fixedPosition: 'left'
            },
            {
                caption: l("MdmSAPService.Entity.Code"),
                dataField: "code",
                editorOptions: {
                    maxLength: 20,
                },
                validationRules: [
                    {
                        type: "required"
                    },
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]{1,20}$',
                        message: l('ValidateError:Code')
                    }
                ]
            },
            {
                caption: l("MdmSAPService.Entity.Name"),
                dataField: "name",
                validationRules: [
                    {
                        type: "required",
                        message: 'Name is required'
                    }
                ]
            }
        ],

        masterDetail: {
            enabled: true,
            template(container, options) {
                const dataGridDetail = $('<div>')
                    .dxDataGrid({
                        dataSource: {
                            store: uomGroupDetailsStore,
                            filter: ['uomGroupId', '=', options.key],
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
                        export: {
                            enabled: true,
                        },
                        onExporting: function (e) {
                            const workbook = new ExcelJS.Workbook();
                            const worksheet = workbook.addWorksheet('Data');
                            DevExpress.excelExporter.exportDataGrid({
                                component: e.component,
                                worksheet,
                                autoFilterEnabled: true,
                            }).then(() => {
                                workbook.xlsx.writeBuffer().then((buffer) => {
                                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${name || "Exports"}.xlsx`);
                                });
                            });
                            e.cancel = true;
                        },
                        searchPanel: {
                            visible: true
                        },
                        columnMinWidth: 50,
                        columnFixing: {
                            enabled: true,
                        },
                        toolbar: {
                            items: [
                                "addRowButton",
                                "exportButton",
                                "searchPanel"
                            ],
                        },
                        columns: [
                            {
                                type: 'buttons',
                                caption: l('Actions'),
                                buttons: [],
                                width: 110,
                                fixedPosition: 'left'
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:AltQty"),
                                dataField: "altQty",
                                validationRules: [
                                    {
                                        type: "required",
                                        message: 'Alt quantity is required'
                                    }
                                ]
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:AltUomCode"),
                                dataField: "uomCode",
                                validationRules: [
                                    {
                                        type: "required",
                                        message: 'Alt UOM Code is required'
                                    }
                                ],
                            },
                            {
                                caption: '=',
                                alignment: 'center',
                                cellTemplate(container, options) {
                                    $('<div>')
                                        .append('<label>=</label>')
                                        .appendTo(container);
                                }
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:BaseQty"),
                                dataField: "baseQty",
                                editorOptions: {
                                    min: 2,
                                },
                                validationRules: [
                                    {
                                        type: "required",
                                        message: 'Base quantity is required'
                                    }
                                ]
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:BaseUomCode"),
                                dataField: "baseUomCode",
                                validationRules: [{ type: "required" }],
                            },
                            {
                                caption: l("EntityFieldName:MDMService:UOMGroupDetail:Active"),
                                dataField: "isActive",
                                width: 110,
                                alignment: 'center',
                                dataType: 'string',
                                cellTemplate(container, options) {
                                    $('<div>')
                                        .append($(options.value == "Y" ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                                        .appendTo(container);

                                }
                            }
                        ]
                    }).appendTo(container);
            }
        },
    }).dxDataGrid('instance');

    initImportPopup('api/mdm-service/u-oMGroups', 'UOMGroups_Template', 'gridUOMGroups');
});
