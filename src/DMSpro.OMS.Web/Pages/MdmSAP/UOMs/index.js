﻿var uOMsService = dMSpro.oMS.mdmSapService.uoms.uom;
$(function () {
    // language
    var l = abp.localization.getResource("OMS");

    var uomStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            args.withDetails = true;
            uOMsService.getListDevExtreme(args)
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
            uOMsService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
    });

    var gridUOMs = $('#gridUOMs').dxDataGrid({
        dataSource: uomStore,
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
            storageKey: 'gridUOMs',
        },
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
                "groupPanel",
                "exportButton",
                "searchPanel",
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
                dataField: 'code',
                caption: l("MdmSAPService.Entity.Code"),
                dataType: 'string',
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
                dataField: 'name',
                caption: l("MdmSAPService.Entity.Name"),
                dataType: 'string',
                validationRules: [
                    {
                        type: 'required',
                        message: 'Name is required'
                    },
                    {
                        type: "stringLength",
                        max: 100,
                        message: l('WarnMessage.FieldLength').replace("{0}", 100)
                    }
                ]
            }
        ]
    }).dxDataGrid('instance');
});