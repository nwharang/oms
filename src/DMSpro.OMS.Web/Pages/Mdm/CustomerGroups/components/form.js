function renderForm(e, headerData) {
    if (!form) form = $('<div id="form">')
    form.dxForm({
        labelMode: "floatting",
        colCount: 5,
        formData: headerData,
        items: [
            {
                dataField: 'groupBy',
                editorType: 'dxSelectBox',
                editorOptions: {
                    dataSource: store.GroupModes,
                    valueExpr: 'id',
                    displayExpr: 'text',
                },
                validationRules: [{ type: "required" }],
            },
            {
                dataField: 'code',
                editorType: 'dxTextBox',
                validationRules: [{ type: "required" }],
                editorOptions: {
                    readOnly: headerData.active
                }
            },
            {
                dataField: 'name',
                editorType: 'dxTextBox',
                validationRules: [{ type: "required" }],
            },
            {
                dataField: 'effectiveDate',
                editorType: 'dxDateBox',
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
                                customerGroupService.create({ ...headerData, active: true }, { contentType: "application/json" }).done(e => {
                                    headerData = e
                                    formInstance.option('formData', e)
                                    popupInstance.option('title', `Customer Groups - #${store.cusStatus.find(e => e.id == e.status)?.text()}`)
                                    event.component.option('text', 'Release')
                                })
                                break;
                            case 0:
                                customerGroupService.update(headerData.id, { ...headerData, active: true, status: 1 }, { contentType: "application/json" }).done(e => {
                                    headerData = e
                                    formInstance.option('formData', e)
                                    popupInstance.option('title', `Customer Groups - #${store.cusStatus.find(e => e.id == e.status)?.text()}`)
                                    event.component.option('disabled', true)
                                })
                                break;
                        }
                        popupInstance.endUpdate()
                    }
                }
            },
        ],
        onFieldDataChanged: (e) => {
            if (e.dataField === 'groupBy' && headerData.id) {
                switch (e.value) {
                    case 0:
                        renderCusGrAtt(headerData.id)
                        break;
                    case 1:
                        renderCusGrList(headerData.id)
                        break;
                    case 2:
                        renderCusGrGeo(headerData.id)
                        break;
                    default:
                        return;
                }
            }
        }
    })
    form.appendTo(e)
    formInstance = form.dxForm('instance')
}