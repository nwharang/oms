$(function () {
    var l = abp.localization.getResource("OMS");
    var l1 = abp.localization.getResource("OMS");
    var customerAttributeService = window.dMSpro.oMS.mdmService.controllers.customerAttributes.customerAttribute;

    var dataCusAttributes = [];
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

            //args["sort"] = [{"selector":"attrNo","desc": false}];

            customerAttributeService.getListDevextremes(args)
                .done(result => {
                    //console.log('data res:', result.data)
                    dataCusAttributes = result.data;
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });

            return deferred.promise();
        },
        byKey: function (key) {
            return key == 0 ? customerAttributeService.get(key) : null;
        },
        insert(values) {
            return customerAttributeService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return customerAttributeService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return customerAttributeService.delete(key);
        }
    });
	
    var gridCusAttribute = $('#dgCusAttributes').dxDataGrid({
        dataSource: customStore,
        keyExpr: "id",
        editing: {
            mode: "row",
            allowAdding: true,
            allowUpdating: abp.auth.isGranted('MdmService.CustomerAttributes.Edit'),
            allowDeleting: false,
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onEditorPreparing(e) {
            if (e.dataField == "hierarchyLevel") {
                var grid = e.component;
                var index = e.row.rowIndex;
                var value = grid.cellValue(index, "active");
                if (!value)
                    e.editorOptions.disabled = true;
            }
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
        },
        remoteOperations: true,
        showBorders: true,
        focusedRowEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        //columnAutoWidth: true,
        columnHidingEnabled: true,
        errorRowEnabled: false,
        filterRow: {
            visible: true
        },
        // searchPanel: {
        //     visible: true
        // },
        scrolling: {
            mode: 'standard'
        },
        columnMinWidth: 50,
        // columnChooser: {
        //     enabled: true,
        //     mode: "select"
        // },
        // columnFixing: {
        //     enabled: true,
        // },
        // export: {
        //     enabled: true,
        // },
        // onExporting(e) {
        //     if (e.format === 'xlsx') {
        //         const workbook = new ExcelJS.Workbook();
        //         const worksheet = workbook.addWorksheet('CustomerAttributes');
        //         DevExpress.excelExporter.exportDataGrid({
        //             component: e.component,
        //             worksheet,
        //             autoFilterEnabled: true,
        //         }).then(() => {
        //             workbook.xlsx.writeBuffer().then((buffer) => {
        //                 saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CustomerAttributes.xlsx');
        //             });
        //         });
        //         e.cancel = true;
        //     }
        //     else if (e.format === 'pdf') {
        //         const doc = new jsPDF();
        //         DevExpress.pdfExporter.exportDataGrid({
        //             jsPDFDocument: doc,
        //             component: e.component,
        //         }).then(() => {
        //             doc.save('CustomerAttributes.pdf');
        //         });
        //     }
        // },
        headerFilter: {
            visible: true,
        },
        // stateStoring: {
        //     enabled: true,
        //     type: 'localStorage',
        //     storageKey: 'dgCustomerAttributes',
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
                //"groupPanel",
                //{
                //    location: 'after',
                //    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                //    onClick() {
                //        gridCusAttribute.addRow();
                //    },
                //},
                //'columnChooserButton',
                //"exportButton",
                //{
                //    location: 'after',
                //    widget: 'dxButton',
                //    options: {
                //        icon: "import",
                //        elementAttr: {
                //            //id: "import-excel",
                //            class: "import-excel",
                //        },
                //        onClick(e) {
                //            var gridControl = e.element.closest('div.dx-datagrid').parent();
                //            var gridName = gridControl.attr('id');
                //            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                //            if (popup) popup.show();
                //        },
                //    },
                //}, 
                //"searchPanel"
            ],
        },
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 110,
                buttons: ['edit'],
                fixedPosition: 'left'
            },
            {
                dataField: 'attrNo',
                sortIndex: 0, sortOrder: "asc",
                width: 200,
                caption: l("EntityFieldName:MDMService:CustomerAttribute:AttrNo"),
                allowEditing: false,
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'attrName',
                width: 500,
                caption: l1("CustomerAttribute.Name"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            // {
            //     dataField: 'hierarchyLevel',
            //     caption: l1("CustomerAttribute.HierarchyLevel"),
            //     dataType: 'number',
            // },
            {
                dataField: 'active',
                caption: l1("CustomerAttribute.Active"),
                //allowEditing: false,
                width: 110,
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                },
            },
        ],
    }).dxDataGrid("instance");
});
