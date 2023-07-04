let createInventory = () => {
    return {
        title: "Inventory", // Localize
        icon: null,
        callback: () => {
            let container = $('<div/>')
            let inventoryForm = $('<div/>').dxForm({
                formData: {
                    ...gridInfo.data,
                    valuationMethod: 'A',
                    InventoryUOMCode: gridInfo.data.inventoryUOMId,
                    InventoryUnit: gridInfo.data.inventoryUOM.name,
                    itemPerInventoryUOM: 1
                },
                labelMode: "outside",
                colCount: 2,
                readOnly,
                items: [
                    {
                        itemType: "group",
                        items: [
                            {
                                label: {
                                    text: 'Inventory UOM Code'
                                },
                                dataField: 'InventoryUOMCode',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    dataSource: {
                                        store: store.getUOMsGroupDetailStore,
                                        filter: [["uomGroupId", "=", gridInfo.data.uomGroupId || 0], 'and', ['active', '=', true]],
                                    },
                                    valueExpr: "altUOMId",
                                    displayExpr: "altUOM.code",
                                    onContentReady: (e) => {
                                        e.component.option('onSelectionChanged', (e) => {
                                            inventoryForm.option('formData.InventoryUnit', e.selectedItem.altUOM.name)
                                            inventoryForm.option('formData.itemPerInventoryUOM', e.selectedItem.baseQty)
                                        })
                                    }
                                }
                            },
                            {
                                label: {
                                    text: 'Inventory UOM Name'
                                },
                                dataField: 'InventoryUnit',
                                editorType: 'dxTextBox',
                                editorOptions: {
                                    readOnly: true
                                }
                            },
                            {
                                label: {
                                    text: 'Items per Inventory Unit' // Localize
                                },
                                dataField: 'itemPerInventoryUOM',
                                editorType: 'dxNumberBox',
                                editorOptions: {
                                    readOnly: true
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        items: [
                            {
                                label: {
                                    text: 'Valuation Method'
                                },
                                dataField: 'valuationMethod',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    dataSource: enumValue.valuationMethod,
                                    valueExpr: 'id',
                                    displayExpr: 'text',
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'empty',
                        colSpan: 2
                    }
                ]
            }).appendTo(container).dxForm('instance')
            let dataGridInventory = $('<div class="p-3"/>').dxDataGrid({
                dataSource: [{
                    '#': 0,
                    whseCode: 'PlaceHolder',
                    whsename: 'PlaceHolder',
                    company: 'PlaceHolder',
                    branch: 'PlaceHolder',
                    inStock: '0',
                    committed: '0',
                    Ordered: '0',
                    Available: '0',
                }],
                allowColumnResizing: true,
                columnResizingMode: 'widget',
                columnAutoWidth: true,
                remoteOperations: true,
                showRowLines: true,
                showBorders: true,
                cacheEnabled: true,
                rowAlternationEnabled: true,
                repaintChangesOnly: true,
                filterRow: {
                    visible: true
                },
                groupPanel: {
                    visible: true,
                },
                searchPanel: {
                    visible: true
                },
                headerFilter: {
                    visible: true,
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
                columnMinWidth: 50,
                columnChooser: {
                    enabled: true,
                    mode: "select"
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
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `ItemInventory.xlsx`);
                        });
                    });
                    e.cancel = true;
                },
                toolbar: {
                    items: [
                        "groupPanel",
                        'addRowButton',
                        'columnChooserButton',
                        "exportButton",
                        "searchPanel"
                    ]
                },
                columns: [
                    {
                        dataField: '#',
                        width: 50
                    },
                    {
                        dataField: 'whseCode',
                        validationRules: [
                            {
                                type: "stringLength",
                                max: 20,
                                message: l('WarnMessage.FieldLength').replace('{0}', 20),
                            }
                        ],
                    },
                    {
                        dataField: 'whsename',
                        validationRules: [
                            {
                                type: "stringLength",
                                max: 100,
                                message: l('WarnMessage.FieldLength').replace('{0}', 100),
                            }
                        ],
                    },
                    {
                        dataField: 'company',
                        validationRules: [
                            {
                                type: "stringLength",
                                max: 50,
                                message: l('WarnMessage.FieldLength').replace('{0}', 50),
                            }
                        ],
                    },
                    {
                        dataField: 'branch',
                        validationRules: [
                            {
                                type: "stringLength",
                                max: 20,
                                message: l('WarnMessage.FieldLength').replace('{0}', 20),
                            }
                        ],
                    },
                    {
                        dataField: 'inStock',
                        dataType: 'number',
                        validationRules: [
                            {
                                type: "stringLength",
                                max: 20,
                                message: l('WarnMessage.FieldLength').replace('{0}', 20),
                            }
                        ],
                    },
                    {
                        dataField: 'committed',
                        dataType: 'number',
                        validationRules: [
                            {
                                type: "stringLength",
                                max: 20,
                                message: l('WarnMessage.FieldLength').replace('{0}', 20),
                            }
                        ],
                    },
                    {
                        dataField: 'Ordered',
                        dataType: 'number',
                        validationRules: [
                            {
                                type: "stringLength",
                                max: 20,
                                message: l('WarnMessage.FieldLength').replace('{0}', 20),
                            }
                        ],
                    },
                    {
                        dataField: 'Available',
                        dataType: 'number',
                        validationRules: [
                            {
                                type: "stringLength",
                                max: 20,
                                message: l('WarnMessage.FieldLength').replace('{0}', 20),
                            }
                        ],
                    },
                ]
            }).appendTo(container)
            return container
        }
    }
}