let createAttribute = () => {
    return {
        title: "Attribute", // Localize
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
                        colCount: 2,
                        colSpan: 2,
                        items: getAttrField('flat')
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
