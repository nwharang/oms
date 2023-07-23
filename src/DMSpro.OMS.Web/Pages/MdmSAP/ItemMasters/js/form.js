let renderForm = async () => {
    gridInfo.instance.form = gridInfo.element.form.dxForm({
        labelMode: "outside",
        colCount: 5,
        formData: {
            ...gridInfo.data
        },
        readOnly,
        onFieldDataChanged: (e) => console.log(e),
        items: [
            {
                caption: 'GENERAL', // Localize
                itemType: 'group',
                colSpan: 2,
                items: [
                    'code',
                    'name',
                    'foreignName',
                    'erpCode',
                    {
                        dataField: 'active',
                        label: {
                            visible: false
                        },
                        template: () => {
                            let container = $('<div/>').css({ display: 'flex', justifyContent: 'space-between' })
                            let isActive = gridInfo.data.validFor == "Y" && gridInfo.data.frozenFor == "N"
                            $('<div/>').css({ maxWidth: '119px', width: '100%' }).dxRadioGroup({
                                readOnly,
                                items: [
                                    {
                                        text: 'Active',
                                        value: true
                                    },
                                    {
                                        text: 'Inactive',
                                        value: false
                                    }
                                ],
                                valueExpr: 'value',
                                displayExpr: 'text',
                                value: isActive
                            }).appendTo(container)
                            $('<div/>').dxForm({
                                labelMode: "outside",
                                readOnly,
                                items: [
                                    {
                                        label: {
                                            text: 'From' // Localize
                                        },
                                        dataField: 'startDate',
                                        editorType: 'dxDateBox',
                                        editorOptions: {
                                            value: isActive ? gridInfo.data.validFrom : gridInfo.data.frozenFrom,
                                            format: 'dd/mm/yyyy',
                                        },
                                    },
                                    {
                                        label: {
                                            text: 'To' // Localize
                                        },
                                        dataField: 'endDate',
                                        editorType: 'dxDateBox',
                                        editorOptions: {
                                            value: isActive ? gridInfo.data.validTo : gridInfo.data.frozenTo,
                                            format: 'dd/mm/yyyy',
                                        }
                                    }
                                ]
                            }).appendTo(container)

                            return container
                        }
                    },
                ],
            },
            {
                caption: 'MANAGEMENT', // Localize
                itemType: 'group',
                colSpan: 2,
                items: [
                    {
                        label: {
                            text: "Manage By"
                        },
                        editorType: 'dxTextBox',
                        editorOptions: {
                            value: (() => {
                                if (gridInfo.data.manBatchNum == "Y")
                                    return "Lot"
                                if (gridInfo.data.manSerialNum == "Y")
                                    return "Serial"
                                return "None"
                            })()
                        }
                    },
                    {
                        label: {
                            text: "Uom Group Code"
                        },
                        dataField: 'uomGroupCode',
                        editorType: 'dxTextBox',
                        // editorType: 'dxSelectBox',
                        // editorOptions: {
                        //     dataSource: store.getUOMsGroup,
                        //     valueExpr: "id",
                        //     displayExpr: "name",
                        // }
                    },
                    {
                        label: {
                            text: "Item Type"
                        },
                        dataField: 'salesType',
                        editorType: 'dxTextBox',
                        // editorType: 'dxSelectBox',
                        // editorOptions: {
                        //     dataSource: enumValue.itemTypes,
                        //     valueExpr: 'id',
                        //     displayExpr: 'text',
                        // }
                    },
                ]

            },
            {
                caption: 'OPTIONS', // Localize
                itemType: 'group',
                items: [
                    {
                        label : {
                            text : "Inventory Item"
                        },
                        dataField: 'isInventoryItem',
                        editorType: 'dxCheckBox',
                    },
                    {
                        label : {
                            text : "Purchase Item"
                        },
                        dataField: 'isPurchaseItem',
                        editorType: 'dxCheckBox',
                    },
                    {
                        label : {
                            text : "Sell Item"
                        },
                        dataField: 'isSellItem',
                        editorType: 'dxCheckBox',
                    }]
            },
            {
                itemType: 'empty',
                colSpan: 5
            },
            {
                itemType: 'empty',
                colSpan: 5
            },
        ],
    })

}