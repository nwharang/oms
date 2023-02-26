$(function () {
    // language
    var l = abp.localization.getResource("OMS");
    // load mdmService
    var itemAttrValueService = window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue;
    var itemAttrService = window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute;

    //Custom store - for load, update, delete
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
            itemAttrValueService.getListDevextremes(args)
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
            itemAttrValueService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return itemAttrValueService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return itemAttrValueService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return itemAttrValueService.delete(key);
        }
    });

    // get item attribute
    var getItemAttr = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = { filter: JSON.stringify(['active', '=', true]) };
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            itemAttrService.getListDevextremes(args)
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
            itemAttrService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    });

    const dataTreeContainer = $('#treeProdAttributeValue').dxTreeList({
        dataSource: customStore,
        keyExpr: 'id',
        parentIdExpr: 'parentId',
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        autoExpandAll: true,
        focusedRowEnabled: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,
        //columnHidingEnabled: true,
        //errorRowEnabled: false,
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
            storageKey: 'treeProdAttributeValue',
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
            mode: 'row',
            allowAdding: abp.auth.isGranted('MdmService.ItemAttributeValues.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.ItemAttributeValues.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.ItemAttributeValues.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onEditorPreparing(e) {
            if (e.dataField === 'parentId' && e.editorOptions.value == 0) {
                e.editorOptions.value = '';
            }
        },
        onInitNewRow(e) {
            var row = e.component.getNodeByKey(e.data.parentId) ? e.component.getNodeByKey(e.data.parentId).data : null;
        },
        onRowInserting: function (e) {
            if (e.data && e.data.parentId == 0) {
                e.data.parentId = null;
            }
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
            //var objectRequire = ['id', 'attrValName', 'itemAttributeId', 'parentId'];
            //for (var property in e.oldData) {
            //    if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
            //        e.newData[property] = e.oldData[property];
            //    }
            //}
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        dataTreeContainer.addRow();
                    },
                },
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
                    onClick() {
                        //todo
                    },
                },
                "searchPanel"
            ],
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: ['add', 'edit', 'delete'],
                fixedPosition: 'left'
            },
            {
                dataField: 'attrValName',
                caption: l("EntityFieldName:MDMService:ItemAttributeValue:AttrValName"),
                validationRules: [
                    {
                        type: "required",
                        message: 'Attribute value name is required'
                    }
                ]
            },
            {
                dataField: 'itemAttributeId',
                caption: l("EntityFieldName:MDMService:ItemAttributeValue:ItemAttributeName"),
                editorType: 'dxSelectBox',
                calculateDisplayValue: 'itemAttribute.attrName',
                lookup: {
                    valueExpr: 'id',
                    displayExpr: 'attrName',
                    dataSource: {
                        store: getItemAttr,
                        paginate: true,
                        pageSize: pageSizeForLookup
                    }
                },
                validationRules: [
                    {
                        type: "required",
                        message: 'Attribute is required'
                    }
                ]
            },
            {
                caption: l("EntityFieldName:MDMService:ProdAttributeValue:ParentProdAttributeValueId"),
                dataField: 'parentId',
                editorType: 'dxSelectBox',
                visible: false,
                lookup: {
                    valueExpr: 'id',
                    displayExpr: 'name',
                    dataSource(options) {
                        return {
                            store: customStore,
                            filter: options.data ? ["!", ["name", "=", options.data.name]] : null,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    }
                }
            }
        ]
    }).dxTreeList("instance");
});
