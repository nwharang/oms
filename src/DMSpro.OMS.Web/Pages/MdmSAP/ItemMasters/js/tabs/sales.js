let createSales = () => {
    return {
        title: "Sales", // Localize
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
                                    text: 'Sales UOM Code'
                                },
                                dataField: 'salesUomCode',
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
                                            form.option('formData.SalesUnit', e.selectedItem.uomCode)
                                            form.option('formData.itemPerSalesUOM', e.selectedItem.baseQty)
                                        })
                                    }
                                }
                            },
                            {
                                label: {
                                    text: 'Sales UOM Name'
                                },
                                dataField: 'salesUnitMeasure',
                                editorType: 'dxTextBox',
                                editorOptions: {
                                    readOnly: true
                                }
                            },
                            {
                                label: {
                                    text: 'Items per Sales Unit' // Localize
                                },
                                dataField: 'numInSale',
                                editorType: 'dxNumberBox',
                                editorOptions: {
                                    readOnly: true
                                }
                            },
                            {
                                label: {
                                    text: 'Sales Tax Group' // Localize
                                },
                                dataField: 'salesVatGroupCode',
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
