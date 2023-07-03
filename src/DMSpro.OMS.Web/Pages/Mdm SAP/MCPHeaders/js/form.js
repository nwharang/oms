let renderForm = async () => {
    gridInfo.instance.form = gridInfo.element.form.dxForm({
        labelMode: "outside",
        colCount: 2,
        formData: {
            ...gridInfo.data,
            routeMaster: gridInfo.data.salesOrgHierarchy.name
        },
        readOnly,
        onFieldDataChanged: (e) => console.log(e),
        items: [
            {
                label: {
                    text: "Code",  // Localize
                },
                dataField: "code"
            },
            {
                label: {
                    text: "Route Master", // Localize
                },
                dataField: "routeMaster"
            },
            {
                label: {
                    text: "Name",  // Localize
                },
                dataField: "name"
            },
            {
                label: {
                    text: "Effective Date",  // Localize
                },
                dataField: "effectiveDate",
                editorType: 'dxDateBox'
            },
            {
                label: {
                    text: "Sales Person",  // Localize
                },
                dataField: "salesPerson"
            },
            {
                label: {
                    text: "End Date",  // Localize
                },
                dataField: "endDate",
                editorType: 'dxDateBox'
            },
            {
                label: {
                    text: "Manager By",  // Localize
                },
                dataField: "managerBy"
            },
        ],
    })

}