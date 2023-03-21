$(function () {
    var l = abp.localization.getResource("MdmService");
    var salesChannelService = window.dMSpro.oMS.mdmService.controllers.salesChannels.salesChannel;

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            salesChannelService.getListDevextremes(args)
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
            return key == 0 ? salesChannelService.get(key) : null;
        },
        insert(values) {
            return salesChannelService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return salesChannelService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return salesChannelService.delete(key);
        }
    });
    var gridSalesChannels = $('#dgSalesChannels').dxDataGrid({
        dataSource: customStore,
        //keyExpr: "id",
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.SalesChannels.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.SalesChannels.Edit'),
            allowDeleting: false,//abp.auth.isGranted('MdmService.SalesChannels.Delete'),
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
            storageKey: 'dgSalesChannels',
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
        onInitNewRow(e) {
            e.data.active = true;
        },
        onEditorPreparing(e) {
            if (e.dataField === 'code' && e.row && !e.row.isNewRow) {
                e.editorOptions.disabled = true;
            }
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
                caption: l("Actions"),
                width: 120,
                buttons: ['edit', 'delete'],
                fixedPosition: 'left'
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:SalesChannel:Code"),
                dataType: 'string',
                editorOptions: {
                    maxLength: 20
                },
                validationRules: [{ type: "required" }],
                width: 250
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:SalesChannel:Name"),
                dataType: 'string',
                editorOptions: {
                    maxLength: 100
                },
                validationRules: [{ type: "required" }],
                minWidth: 250
            },
            {
                dataField: 'description',
                caption: l("EntityFieldName:MDMService:SalesChannel:Description"),
                dataType: 'string',
                minWidth: 250
            },
            {
                dataField: 'active',
                caption: l("EntityFieldName:MDMService:SalesChannel:Active"),
                width: 120,
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                },
                setCellValue(newData, value) {
                    const deferred = $.Deferred();
                    abp.message.confirm(l('ConfirmationMessage.ChangeValue')).then(function (confirmed) {
                        if (confirmed) {
                            deferred.resolve(newData.active = value);
                        } else {
                            deferred.resolve(newData.active = !value);
                        }
                    });
                    return deferred.promise();
                }
            }
        ],
    }).dxDataGrid("instance");

    initImportPopup('api/mdm-service/sales-channels', 'SalesChannels_Template', 'dgSalesChannels');
});
