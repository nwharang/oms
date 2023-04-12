function renderForm(e, headerData) {
    if (!form) form = $('<div id="form">')
    form.dxForm({
        labelMode: "floatting",
        colCount: 7,
        formData: headerData,
        items: [
            {
                dataField: 'type',
                editorType: 'dxSelectBox',
                colSpan: 2,
                editorOptions: {
                    dataSource: store.type,
                    valueExpr: 'id',
                    displayExpr: 'text',
                },
                validationRules: [{ type: "required" }],
            },
            {
                dataField: 'code',
                editorType: 'dxTextBox',
                validationRules: [{ type: "required" }],
                colSpan: 2,
                editorOptions: {
                    readOnly: headerData.active
                }
            },
            {
                dataField: 'name',
                editorType: 'dxTextBox',
                colSpan: 2,
                validationRules: [{ type: "required" }],
            },
            {
                label: {
                    text: l('EntityFieldName:MDMService:SalesOrgHeader:Code'),
                },
                itemType: 'button',
                name: 'Button',
                cssClass: "h-100 d-flex align-items-end",
                buttonOptions: {
                    text: headerData.status >= 0 ? "Release" : "Create",
                    disabled: headerData.status == 1,
                    width: '100%',
                    onClick(event) {
                        popupInstance.beginUpdate()
                        console.log(headerData.status);
                        switch (headerData.status) {
                            default:
                                itemGroupService.create({ ...headerData, selectable: true }, { contentType: "application/json" }).done(e => {
                                    headerData = e
                                    formInstance.option('formData', e)
                                    popupInstance.option('title', `${l("Page.Title.ItemGroups")}} - #${store.status.find(e => e.id == e.status)?.text()}`)
                                    event.component.option('text', 'Release')
                                })
                                break;
                            case 0:
                                itemGroupService.release(headerData.id, { contentType: "application/json" }).done(e => {
                                    headerData = e
                                    formInstance.option('formData', e)
                                    popupInstance.option('title', `${l("Page.Title.ItemGroups")}} - #${store.status.find(e => e.id == e.status)?.text()}`)
                                    event.component.option('disabled', true)
                                })
                                break;
                        }
                        popupInstance.endUpdate()
                    }
                }
            },
            {
                dataField: 'description',
                editorType: 'dxTextBox',
                colSpan: 6,
            },
            {
                label: {
                    text: l('EntityFieldName:MDMService:SalesOrgHeader:Code'),
                },
                itemType: 'button',
                name: 'Button',
                cssClass: "h-100 d-flex align-items-end",
                buttonOptions: {
                    text: "Edit",
                    disabled: headerData.status != 0,
                    width: '100%',
                    onClick(event) {
                        popupInstance.beginUpdate()
                        console.log("Hello World!");
                        popupInstance.endUpdate()
                    }
                }
            },
        ],
        onFieldDataChanged: (e) => {
            if (e.dataField === 'type' && headerData.id) {
                switch (e.value) {
                    case 0:
                        return renderItemAttr(headerData.id)
                    case 1:
                        return renderItemList(headerData.id)
                    default:
                        return;

                }
            }
        }
    })
    form.appendTo(e)
    formInstance = form.dxForm('instance')
}