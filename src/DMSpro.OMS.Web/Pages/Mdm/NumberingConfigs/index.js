var numberingConfigService = window.dMSpro.oMS.mdmService.controllers.numberingConfigs.numberingConfig;
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
            storageKey: 'gridNumberingConfigs',
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
            //var objectRequire = ['companyId', 'prefix', 'startNumber', 'length'];
            //for (var property in e.oldData) {
            //    if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
            //        e.newData[property] = e.oldData[property];
            //    }
            //}
        },
        toolbar: {
            items: [
                "groupPanel",
                "addRowButton",
                "columnChooserButton",
                "exportButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            //id: "import-excel",
                            class: "import-excel",
                        },
                        onClick(e) {
                            var gridControl = e.element.closest('div.dx-datagrid').parent();
                            var gridName = gridControl.attr('id');
                            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        },
                    },
                },
                "searchPanel",
            ],
        },
        columns: [
            {
                type: 'buttons',
                caption: l('Actions'),
                buttons: ['edit', 'delete'],
                width: 110,
                fixedPosition: 'left'
            },
            {
                dataField: 'companyId',
                calculateDisplayValue: "company.name",
                caption: l("EntityFieldName:MDMService:NumberingConfig:CompanyName"),
                lookup: {
                    valueExpr: 'id',
                    displayExpr: 'name',
                    dataSource: {
                        store: companyStore,
                        //filter: ['level', '=', 0],
                        paginate: true,
                        pageSize: pageSizeForLookup
                    }
                }
            },
            {
                dataField: 'startNumber',
                caption: l("EntityFieldName:MDMService:NumberingConfig:Numbnr"),
                dataType: 'number'
            },
            {
                dataField: 'prefix',
                caption: l("EntityFieldName:MDMService:NumberingConfig:Prefix"),
                dataType: 'string'
            },
            {
                dataField: 'length',
                caption: l("EntityFieldName:MDMService:NumberingConfig:Length"),
                dataType: 'number'
            }
        ]
    }).dxDataGrid('instance');

    initImportPopup('api/mdm-service/numbering-configs', 'NumberingConfigs', 'gridNumberingConfigs');
});
