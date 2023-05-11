$(function () {
    var l = abp.localization.getResource("OMS");
    var vATService = window.dMSpro.oMS.mdmService.controllers.vATs.vAT;

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

            vATService.getListDevextremes(args)
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
            return key == 0 ? vATService.get(key) : null;
        },
        insert(values) {
            return vATService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return vATService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return vATService.delete(key);
        }
    });

    var gridVATs = $('#dgVATs').dxDataGrid({
        dataSource: customStore,
        //keyExpr: "id",
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.VATs.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.VATs.Edit'),
            allowDeleting: false,//abp.auth.isGranted('MdmService.VATs.Delete'),
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
        ...genaralConfig('VATs'),
        headerFilter: {
            visible: true,
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'dgVATs',
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
            e.data.rate = 0;
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
                // {
                //     location: 'after',
                //     widget: 'dxButton',
                //     options: {
                //         icon: "import",
                //         elementAttr: {
                //             //id: "import-excel",
                //             class: "import-excel",
                //         },
                //         onClick(e) {
                //             var gridControl = e.element.closest('div.dx-datagrid').parent();
                //             var gridName = gridControl.attr('id');
                //             var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                //             if (popup) popup.show();
                //         },
                //     },
                // },
                "searchPanel",
            ],
        },
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 110,
                buttons: ['edit', 'delete'],
                fixedPosition: 'left'
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:VAT:Code"),
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
                caption: l("EntityFieldName:MDMService:VAT:Name"),
                dataType: 'string',
                editorOptions: {
                    maxLength: 100
                },
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'rate',
                caption: l("EntityFieldName:MDMService:VAT:Rate") + " %",
                dataType: 'number',
                editorOptions: {
                    min: 0,
                    max: 100,
                    format: "#0'%'",
                    inputAttr: {
                        maxLength: 6
                    }
                },
                format: "#0'%'",
                alignment: 'center',
                validationRules: [{ type: "required" }],
                width: 150
            },
        ],
    }).dxDataGrid("instance");

    // initImportPopup('api/mdm-service/v-aTs', 'Vats_Template', 'dgVATs');
});
