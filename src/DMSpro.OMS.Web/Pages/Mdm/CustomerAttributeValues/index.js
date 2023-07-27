$(function () {
    var l = abp.localization.getResource("OMS");
    var l1 = abp.localization.getResource("MdmService");
    var cusAttributesValueService = window.dMSpro.oMS.mdmService.controllers.customerAttributeValues.customerAttributeValue;
    var cusAttributeService = window.dMSpro.oMS.mdmService.controllers.customerAttributes.customerAttribute;

    var cusAttributes = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: 'raw',
        cacheRawData: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            cusAttributeService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        }
    });

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

            cusAttributesValueService.getListDevextremes(args)
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
            return key == 0 ? cusAttributesValueService.get(key) : null;
        },
        insert(values) {
            return cusAttributesValueService.create(values, { contentType: "application/json" });
        },
        update(key, { attrValName }) {
            return cusAttributesValueService.update(key, { attrValName }, { contentType: "application/json" });
        },
        remove(key) {
            return cusAttributesValueService.delete(key);
        }
    });
    var gridCustomerAttributeValues = $('#dgCustomerAttributeValues').dxDataGrid({
        dataSource: customStore,
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.CustomerAttributes.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.CustomerAttributes.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.CustomerAttributes.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onRowInserting: function (e) {
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
        // stateStoring: {
        //     enabled: true,
        //     type: 'localStorage',
        //     storageKey: 'dgCustomerAttributeValues',
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
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        gridCustomerAttributeValues.addRow();
                    },
                },
                'columnChooserButton',
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
                "searchPanel"
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
                caption: l1("EntityFieldName:MDMService:CustomerAttributeValue:Code"),
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
                dataField: 'attrValName',
                caption: l1("EntityFieldName:MDMService:CustomerAttributeValue:Name"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },

            {
                dataField: 'customerAttributeId',
                caption: l1("EntityFieldName:MDMService:CustomerAttributeValue:Attribute"),
                lookup: {
                    dataSource: {
                        store: cusAttributes,
                        filter: ["active", "=", true],
                    },
                    valueExpr: "id",
                    displayExpr: "attrName"
                },
                validationRules: [{ type: "required" }]
            },
        ],
        onEditorPreparing: (e) => {
            if (e.row?.rowType != "data" || e.row?.isNewRow) return
            if (e.dataField === "code") e.editorOptions.readOnly = true
        }
    }).dxDataGrid("instance");
    // initImportPopup('api/mdm-service/cus-attribute-values', 'CustomerAttributeValues_Template', 'dgCustomerAttributeValues');

});
