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
                    {
                        dataField: 'code',
                        editorOptions: {
                            readOnly,
                        }
                    },
                    {
                        dataField: 'name',
                        editorOptions: {
                            readOnly,
                        }
                    },
                    {
                        dataField: 'shortName',
                        editorOptions: {
                            readOnly,
                        }
                    },
                    {
                        dataField: 'erpCode',
                        editorOptions: {
                            readOnly,
                        }
                    },
                    {
                        dataField: 'active',
                        label: {
                            visible: false
                        },
                        template: () => {
                            let container = $('<div/>').css({ display: 'flex', justifyContent: 'space-between' })
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
                                value: gridInfo.data.active
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
                                            format: 'dd/MM/yyyy',
                                        }
                                    },
                                    {
                                        label: {
                                            text: 'To' // Localize

                                        },
                                        dataField: 'endDate',
                                        editorType: 'dxDateBox',
                                        editorOptions: {
                                            format: 'dd/MM/yyyy',
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
                        dataField: 'manageItemBy',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            dataSource: enumValue.manageItem,
                            valueExpr: 'id',
                            displayExpr: 'text',
                            readOnly,
                        }
                    },
                    {
                        dataField: 'uomGroupId',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            dataSource: store.getUOMsGroup,
                            valueExpr: "id",
                            displayExpr: "name",
                            readOnly,
                        }
                    },
                    {
                        dataField: 'itemType',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            dataSource: enumValue.itemTypes,
                            valueExpr: 'id',
                            displayExpr: 'text',
                            readOnly,
                        }
                    },
                ]

            },
            {
                caption: 'OPTIONS', // Localize
                itemType: 'group',
                items: [
                    {
                        dataField: 'isInventoriable',
                        editorType: 'dxCheckBox',
                    },
                    {
                        dataField: 'isPurchasable',
                        editorType: 'dxCheckBox',
                    },
                    {
                        dataField: 'isSaleable',
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