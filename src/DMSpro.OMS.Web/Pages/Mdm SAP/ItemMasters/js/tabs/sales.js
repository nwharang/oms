let createSales = () => {
    return {
        title: "Sales", // Localize
        icon: null,
        callback: () => {
            let container = $('<div/>')
            let form = $('<div/>').dxForm({
                formData: {
                    ...gridInfo.data,
                    SalesUOMCode: gridInfo.data.salesUOMId,
                    SalesUnit: gridInfo.data.salesUOM.name,
                    itemPerSalesUOM: gridInfo.data.salesUnitRate
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
                                dataField: 'SalesUOMCode',
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
                                            form.option('formData.SalesUnit', e.selectedItem.altUOM.name)
                                            form.option('formData.itemPerSalesUOM', e.selectedItem.baseQty)
                                        })
                                    }
                                }
                            },
                            {
                                label: {
                                    text: 'Sales UOM Name'
                                },
                                dataField: 'SalesUnit',
                                editorType: 'dxTextBox',
                                editorOptions: {
                                    readOnly: true
                                }
                            },
                            {
                                label: {
                                    text: 'Items per Sales Unit' // Localize
                                },
                                dataField: 'itemPerSalesUOM',
                                editorType: 'dxNumberBox',
                                editorOptions: {
                                    readOnly: true
                                }
                            },
                            {
                                label: {
                                    text: 'Sales Tax Group' // Localize
                                },
                                dataField: 'SalesTaxGroup',
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
