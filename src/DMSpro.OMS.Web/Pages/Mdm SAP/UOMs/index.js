var uOMsService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;
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

            uOMsService.getListDevextremes(args)
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
        insert(values) {
            return uOMsService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return uOMsService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return uOMsService.delete(key);
        }
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
            const worksheet = workbook.addWorksheet('Companies');
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
            allowAdding: false,
            allowUpdating: false,
            allowDeleting: false,
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onRowUpdating: function (e) {
            let { name, concurrencyStamp } = { ...e.oldData, ...e.newData }
            e.newData = { name, concurrencyStamp }
        },
        onEditorPreparing: function (e) {
            if (e.dataField == 'code' && e.value != null) {
                e.editorOptions.disabled = true;
            }
        },
        toolbar: {
            items: [
                "groupPanel",
                "addRowButton",
                "exportButton",
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
                caption: l("EntityFieldName:MDMService:UOM:Code"),
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
                caption: l("EntityFieldName:MDMService:UOM:Name"),
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
    initImportPopup('api/mdm-service/u-oMs', 'UOMs_Template', 'gridUOMs');
});
