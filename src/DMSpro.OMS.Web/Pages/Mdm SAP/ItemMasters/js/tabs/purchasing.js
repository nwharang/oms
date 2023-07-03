let createPurchasing = () => {
    return {
        title: "Purchasing", // Localize
        icon: null,
        callback: () => {
            let container = $('<div/>')
            let form = $('<div/>').dxForm({
                formData: {
                    ...gridInfo.data,
                    PurchasingUOMCode: gridInfo.data.purUOMId,
                    PurchasingUnit: gridInfo.data.purUOM.name,
                    itemPerPurchasingUOM: gridInfo.data.purUnitRate
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
                                    text: 'Purchasing UOM Code'
                                },
                                dataField: 'PurchasingUOMCode',
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
                                            form.option('formData.PurchasingUnit', e.selectedItem.altUOM.name)
                                            form.option('formData.itemPerPurchasingUOM', e.selectedItem.baseQty)
                                        })
                                    }
                                }
                            },
                            {
                                label: {
                                    text: 'Purchasing UOM Name'
                                },
                                dataField: 'PurchasingUnit',
                                editorType: 'dxTextBox',
                                editorOptions: {
                                    readOnly: true
                                }
                            },
                            {
                                label: {
                                    text: 'Items per Purchasing Unit' // Localize
                                },
                                dataField: 'itemPerPurchasingUOM',
                                editorType: 'dxNumberBox',
                                editorOptions: {
                                    readOnly: true
                                }
                            },
                            {
                                label: {
                                    text: 'Purchasing Tax Group' // Localize
                                },
                                dataField: 'PurchasingTaxGroup',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                }
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        items: [
                            createNumberBox('Length', 'length'),
                            createNumberBox('Width', 'width'),
                            createNumberBox('Height', 'height'),
                            createNumberBox('Volume', 'volume'),
                            createNumberBox('Weight', 'weight'),
                        ]
                    },
                    {
                        itemType: 'empty',
                        colSpan: 2
                    }
                ]
            }).appendTo(container).dxForm('instance')
            return container
        }
    }
}
