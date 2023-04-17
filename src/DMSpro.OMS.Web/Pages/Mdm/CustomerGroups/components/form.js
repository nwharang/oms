function renderForm(e, headerData) {
    if (!form) form = $('<div id="form">')
    form.dxForm({
        labelMode: "floatting",
        colCount: 7,
        formData: headerData,
        items: [
            {
                dataField: 'groupBy',
                editorType: 'dxSelectBox',
                colSpan: 2,
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
                colSpan: 2,
                validationRules: [{ type: "required" }],
                editorOptions: {
                    readOnly: headerData.status >= 0
                }
            },
            {
                dataField: 'name',
                editorType: 'dxTextBox',
                colSpan: 2,
                validationRules: [{ type: "required" }],
                editorOptions: {
                    readOnly: headerData.status >= 0
                }
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
                        switch (headerData.status) {
                            default:
                                customerGroupService.create({ ...headerData }, { contentType: "application/json" }).done(e => {
                                    headerData = e
                                    formInstance.option('formData', e)
                                    popupInstance.option('title', `Customer Groups - #${store.cusStatus.find(v => v.id == e.status)?.text()}`)
                                    event.component.option('text', 'Release')
                                    if (headerData.status >= 0) {
                                        formInstance.getEditor('groupBy').option('readOnly', true);
                                        formInstance.getEditor('code').option('readOnly', true);
                                        formInstance.getEditor('name').option('readOnly', true);
                                    }
                                    else {
                                        formInstance.getEditor('groupBy').option('readOnly', false);
                                        formInstance.getEditor('code').option('readOnly', true);
                                        formInstance.getEditor('name').option('readOnly', true);
                                    }
                                })
                                break;
                            case 0:
                                customerGroupService.release(headerData.id, { contentType: "application/json" }).done(e => {
                                    popupInstance.option('title', `${l('Page.Title.CustomerGroups')} - #${store.cusStatus.find(v => v.id == e.status)?.text()}`)
                                    event.component.option('disabled', true)
                                    gridInstance.option('editing', {
                                        allowAdding: false,
                                        allowUpdating: false,
                                        allowDeleting: false,
                                    })
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
                colSpan: 7,
            },
        ],
        onContentReady: (e) => {
            if (headerData.status >= 0)
                e.component.getEditor('groupBy').option('readOnly', true);
            else
                e.component.getEditor('groupBy').option('readOnly', false);
        },
        onFieldDataChanged: (e) => {
            if (e.dataField === 'groupBy' && headerData.id) {
                switch (e.value) {
                    case 0:
                        renderCusGrAtt(headerData.id, headerData.status)
                        break;
                    case 1:
                        renderCusGrList(headerData.id, headerData.status)
                        break;
                    case 2:
                        renderCusGrGeo(headerData.id, headerData.status)
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