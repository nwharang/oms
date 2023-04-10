$(function () {
    // language
    let l = abp.localization.getResource("OMS");
    // load mdmService
    let itemAttrValueService = window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue;
    let itemAttrService = window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute;
    let isFirstLoad = false;

    /**
     * 0 : Root
     * 1 : Flat
     * 2 : Hierarchy
     */
    // let _filter = JSON.stringify(['itemAttribute.hierarchyLevel', '<>', null])
    let createMode;
    let itemAttr
    //Custom store - for load, update, delete
    let customStore = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'raw',
        cacheRawData: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            // args.filter = _filter
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
            let d = new $.Deferred();
            itemAttrValueService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert({ attrValName, code, itemAttributeId, parentId }) {
            switch (createMode) {
                case 0:
                    return itemAttrValueService.createRoot({ attrValName, code, itemAttributeId })
                case 1:
                    return itemAttrValueService.createFlat({ attrValName, code, itemAttributeId })
                case 2:
                    return itemAttrValueService.createHierarchy({ attrValName, code, parentId })
            }
        },
        update(key, values) {
            return itemAttrValueService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return itemAttrValueService.delete(key);
        }
    });

    // get item attribute
    let getItemAttr = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'raw',
        cacheRawData: true,
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
    });
    getItemAttr.load({}).then((data) => {
        itemAttr = [...data]
    })
    const dataTreeContainer = $('#treeProdAttributeValue').dxTreeList({
        dataSource: customStore,
        // remoteOperations: {
        //     filtering: true,
        //     sorting: true,
        //     grouping: true,
        // },
        keyExpr: 'id',
        parentIdExpr: 'parentId',
        rootValue: null,
        autoExpandAll: false,
        expandNodesOnFiltering: false,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        focusedRowEnabled: true,
        allowColumnReordering: true,
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
        //     storageKey: 'treeProdAttributeValue',
        // },

        editing: {
            mode: 'row',
            allowAdding: abp.auth.isGranted('MdmService.ItemAttributes.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.ItemAttributes.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.ItemAttributes.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onEditorPreparing: (e) => {
            if ((e.dataField === 'code' || e.dataField === "itemAttributeId") && !e.row?.isNewRow)
                e.editorOptions.disabled = true;
            // Creating
            if (!e.row?.isNewRow) return
            if (e.dataField === "itemAttributeId" && createMode == 2) {
                let findChild = itemAttr.find(v => v.hierarchyLevel == e.row.data.level)
                e.cancel = !findChild
                e.setValue(findChild.id)
                e.editorOptions.value = findChild.id;
                e.editorOptions.disabled = true;
            }
        },
        onInitNewRow(e) {
            let row = e.component.getNodeByKey(e.data.parentId);
            e.data.level = row?.level + 1 || 0;
        },
        onRowUpdating: function (e) {
            let objectRequire = ['name', 'parentId', 'code', 'level'];
            for (let property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        onContentReady: function (e) {
            if (!isFirstLoad) {
                dataTreeContainer.option('filterValue', ['itemAttribute.hierarchyLevel', '<>', null])
                isFirstLoad = true;
            }
        },
        toolbar: {
            items: [
                {
                    widget: "dxButtonGroup",
                    location: 'center',
                    options: {
                        selectedItemKeys: ['Hierarchy'],
                        keyExpr: 'text',
                        onItemClick: (e) => {
                            if (e.itemData.text === 'Hierarchy')
                                dataTreeContainer.option('filterValue', ['itemAttribute.hierarchyLevel', '<>', null])

                            if (e.itemData.text === 'Attributes')
                                dataTreeContainer.option('filterValue', ['itemAttribute.hierarchyLevel', '=', null])
                            if (e.itemData.text === 'All')
                                dataTreeContainer.option('filterValue', [])
                        },
                        items: [
                            {
                                text: 'All',
                            },
                            {
                                text: 'Hierarchy',
                            },
                            {
                                text: 'Attributes',
                            },
                        ]
                    }
                },
                {
                    widget: "dxDropDownButton",
                    location: "after",
                    options: {
                        dropDownOptions: {
                            width: 230,
                        },
                        icon: 'preferences',
                        text: l('Actions'),
                        visible: true,
                        width: 120,
                        elementAttr: {
                            id: "actionButtonDetailsPanel",
                        },
                        items: [
                            {
                                text: l('Button:MDMService:ItemAttribute:CreateRoot'),
                                icon: "add",
                                onClick: () => {
                                    createMode = 0
                                    dataTreeContainer.addRow();
                                }
                            },
                            {
                                text: l('Button:MDMService:ItemAttribute:CreateHierarchy'),
                                icon: "add",
                                onClick: () => {
                                    createMode = 1
                                    dataTreeContainer.addRow();
                                }
                            }
                        ]
                    },
                },
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            class: "import-excel",
                        },
                        onClick(e) {
                            let gridControl = e.element.closest('div.dx-treelist');
                            let gridName = gridControl.attr('id');
                            let popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        }
                    }
                },
                "searchPanel"
            ],
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                alignment: 'right',
                buttons: [{
                    icon: 'add',
                    onClick(e) {
                        createMode = 2
                        dataTreeContainer.addRow(e.row.key)
                    },
                    cssClass: 'btnAddNewRow',
                    disabled: (e) => !(e.row.data?.itemAttribute?.hierarchyLevel !== null && !e.row.isEditing && abp.auth.isGranted('MdmService.ItemAttributes.Create'))


                }, {
                    name: 'delete',
                    cssClass: 'btnAddNewRow',
                    disabled: (e) => !(!e.row.node.hasChildren && !e.row.isEditing && abp.auth.isGranted('MdmService.ItemAttributes.Create'))
                }, 'edit'],
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
                ],
                width: '100%'
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:ItemAttributeValue:Code"),
                validationRules: [
                    {
                        type: "required",
                        message: 'Attribute value code is required'
                    }
                ],
                width: 200

            },
            {
                dataField: 'itemAttributeId',
                caption: l("EntityFieldName:MDMService:ItemAttributeValue:ItemAttributeName"),
                editorType: 'dxSelectBox',
                lookup: {
                    valueExpr: 'id',
                    displayExpr: 'attrName',
                    dataSource: (e) => {
                        return {
                            store: getItemAttr,
                            filter: e?.isEditing ? createMode == 0 ? ["hierarchyLevel", "=", "0"] : ["hierarchyLevel", "=", null] : null
                        }
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
                dataField: 'itemAttribute.hierarchyLevel',
                caption: l("EntityFieldName:MDMService:ItemAttributeValue:ItemAttributeName"),
                visible: false
            },
        ]
    }).dxTreeList("instance");

    initImportPopup('api/mdm-service/item-attribute-values', 'treeProdAttributeValue_Template', 'treeProdAttributeValue');
});
