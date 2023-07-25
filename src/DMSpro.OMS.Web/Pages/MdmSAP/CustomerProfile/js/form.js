let renderForm = async () => {
    console.log(gridInfo.data);

    gridInfo.instance.form = gridInfo.element.form.dxForm({
        labelMode: "outside",
        colCount: 2,
        formData: {
            ...gridInfo.data
        },
        readOnly,
        onFieldDataChanged: (e) => console.log(e),
        items: [
            {
                itemType: 'group',
                items: [
                    {
                        dataField: 'code',

                    },
                    {
                        dataField: 'name',

                    },
                    {
                        dataField: 'foreignName',
                    },
                    {
                        dataField: 'phone1',
                    },
                    {
                        dataField: 'phone2',
                    },
                    {
                        dataField: 'fedTaxID'
                    },
                    {
                        dataField: 'contactPerson'
                    },

                ],
            },
            {
                itemType: 'group',
                items: [
                    {
                        dataField: 'paymentGroup',
                    },
                    {
                        dataField: 'parentCode',
                    },
                    {
                        dataField: 'erpCusCode',
                    },
                    {
                        dataField: 'priceListCode',
                    },
                    {
                        dataField: 'taxGroupCode'
                    },
                    {
                        dataField: 'creditLimit'
                    },
                    {
                        dataField: 'active',
                        template: () => {
                            let container = $('<div/>').css({ display: 'flex', justifyContent: 'space-between' })
                            $('<div/>').css({ maxWidth: '119px', width: '100%' }).dxCheckBox({
                                readOnly,
                                value: gridInfo.data.active == "Y"
                            }).appendTo(container)
                            $('<div/>').dxForm({
                                labelMode: "outside",
                                readOnly,
                                items: [
                                    {
                                        label: {
                                            text: 'Valid To' // Localize
                                        },
                                        editorType: 'dxDateBox',
                                        editorOptions: {
                                            value: gridInfo.data.validTo,
                                            format: 'dd/MM/yyyy',
                                        }
                                    }
                                ]
                            }).appendTo(container)

                            return container
                        }
                    },
                ]
            },
            {
                itemType: 'empty',
                colSpan: 2
            },
        ],
    })

}