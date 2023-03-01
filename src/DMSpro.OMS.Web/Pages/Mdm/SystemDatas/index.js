var systemDataService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;
$(function () {
    var l = abp.localization.getResource("MdmService");

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
            systemDataService.getListDevextremes(args)
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
            systemDataService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return systemDataService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return systemDataService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return systemDataService.delete(key);
        }
    });

    var gridSystemData = $('#gridSystemDatas').dxDataGrid({
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
            storageKey: 'gridSystemDatas',
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
            allowAdding: abp.auth.isGranted('MdmService.SystemData.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.SystemData.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.SystemData.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
            //var objectRequire = ['code', 'valueCode', 'valueName'];
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
                            id: "import-excel",
                            class: "import-excel",
                        },
                        onClick() {
                            var popup = $('#popupImport').data('dxPopup');
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
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:SystemData:Code"),
                dataType: 'string'
            },
            {
                dataField: 'valueCode',
                caption: l("EntityFieldName:MDMService:SystemData:ValueCode"),
                dataType: 'string'
            },
            {
                dataField: 'valueName',
                caption: l("EntityFieldName:MDMService:SystemData:ValueName"),
                dataType: 'string'
            }
        ]
    }).dxDataGrid('instance');
    initImportPopup('api/mdm-service/system-datas', 'SystemDatasy_Template', 'gridSystemDatas');
});