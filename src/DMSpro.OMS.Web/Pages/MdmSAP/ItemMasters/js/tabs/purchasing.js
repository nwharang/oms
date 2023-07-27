let createPurchasing = () => {
    return {
        title: "Purchasing", // Localize
        icon: null,
        callback: () => {
            let container = $('<div/>')
            let form = $('<div/>').dxForm({
                formData: {
                    ...gridInfo.data,
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
                                dataField: 'purchaseUomCode',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    dataSource: {
                                        store: store.getUOMsGroupDetailStore,
                                        withDetails: true,
                                        filter: ["uomGroupCode", "=", gridInfo.data.uomGroupCode],
                                    },
                                    valueExpr: "uomCode",
                                    displayExpr: "uomCode",
                                    onContentReady: (e) => {
                                        e.component.option('onSelectionChanged', (e) => {
                                            form.option('formData.PurchasingUnit', e.selectedItem.uomCode)
                                            form.option('formData.itemPerPurchasingUOM', e.selectedItem.baseQty)
                                        })
                                    }
                                }
                            },
                            {
                                label: {
                                    text: 'Purchasing UOM Name'
                                },
                                dataField: 'buyUnitMeasure',
                                editorType: 'dxTextBox',
                                editorOptions: {
                                    readOnly: true
                                }
                            },
                            {
                                label: {
                                    text: 'Items per Purchasing Unit' // Localize
                                },
                                dataField: 'numInBuy',
                                editorType: 'dxNumberBox',
                                editorOptions: {
                                    readOnly: true
                                }
                            },
                            {
                                label: {
                                    text: 'Purchasing Tax Group' // Localize
                                },
                                dataField: 'purchaseVatGroupCode',
                                editorType: 'dxTextBox',
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
