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
                editorOptions: {
                    maxLength: 20,
                    valueChangeEvent: 'keyup',
                },
                validationRules: [
                    {
                        type: "required"
                    },
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]{1,20}$',
                        message: l('ValidateError:Code')
                    }
                ],
                colSpan: 2,
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
                        console.log(headerData.status);
                        switch (headerData.status) {
                            default:
                                itemGroupService.create({ ...headerData, selectable: true }, { contentType: "application/json" }).done(e => {
                                    headerData = e
                                    formInstance.option('formData', e)
                                    popupInstance.option('title', `${l("Page.Title.ItemGroups")}} - #${store.status.find(v => v.id == e.status)?.text()}`)
                                    event.component.option('text', 'Release')
                                    if (headerData.status >= 0) {
                                        formInstance.getEditor('type').option('readOnly', true);
                                        formInstance.getEditor('code').option('readOnly', true);
                                        formInstance.getEditor('name').option('readOnly', true);
                                    }
                                    else {
                                        formInstance.getEditor('type').option('readOnly', false);
                                        formInstance.getEditor('code').option('readOnly', true);
                                        formInstance.getEditor('name').option('readOnly', true);
                                    }
                                })
                                break;
                            case 0:
                                itemGroupService.release(headerData.id, { contentType: "application/json" }).done(e => {
                                    popupInstance.option('title', `${l("Page.Title.ItemGroups")}} - #${store.status.find(v => v.id == e.status)?.text()}`)
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
            // {
            //     dataField: 'description',
            //     editorType: 'dxTextBox',
            //     colSpan: 7,
            // },
        ],
        onContentReady: (e) => {
            if (headerData.status >= 0)
                e.component.getEditor('type').option('readOnly', true);
            else
                e.component.getEditor('type').option('readOnly', false);
        },
        onFieldDataChanged: (e) => {
            if (e.dataField === 'type' && headerData.id) {
                switch (e.value) {
                    case 0:
                        return renderItemAttr(headerData.id, headerData.status)
                    case 1:
                        return renderItemList(headerData.id, headerData.status)
                    default:
                        return;

                }
            }
        }
    })
    form.appendTo(e)
    formInstance = form.dxForm('instance')
}