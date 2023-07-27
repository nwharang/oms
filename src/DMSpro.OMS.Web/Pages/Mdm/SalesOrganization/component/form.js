let renderForm = (e, headerData) => {
    if (!form) form = $('<div id="form" class="border-bottom pb-1">')
    let buttonTitle = headerData.status < 0 ? "Save" : headerData.status == 0 ? "Release" : headerData.status > 1 ? "Inactive" : "Inactived"
    form.dxForm({
        labelMode: "floatting",
        colCount: 9,
        formData: {
            ...headerData
        },
        items: [
            {
                label: {
                    text: l('EntityFieldName:MDMService:SalesOrgHeader:Code'),
                },
                colSpan: 4,
                dataField: 'code',
                name: 'salesOrgHeaderCode',
                editorType: 'dxTextBox',
                editorOptions: {
                    maxLength: 20,
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
                ]
            },
            {
                label: {
                    text: l('EntityFieldName:MDMService:SalesOrgHeader:Name'),
                },
                colSpan: 4,
                name: 'salesOrgHeaderName',
                dataField: 'name',
                editorType: 'dxTextBox',
                validationRules: [
                    {
                        type: "required"
                    },
                ]
            },
            {
                label: {
                    text: l('EntityFieldName:MDMService:SalesOrgHeader:Code'),
                },
                colSpan: 1,
                itemType: 'button',
                name: 'SaveButton',
                cssClass: "h-100 d-flex align-items-end",
                buttonOptions: {
                    text: buttonTitle,
                    disabled: headerData.status == 2,
                    width: '100%',
                    onClick: function (e) {
                        if (formInstance.validate().status == 'invalid') return
                        e.component.option('text', 'Loading...')
                        e.component.option('disabled', true)
                        let code = formInstance.getEditor('salesOrgHeaderCode').option('value')
                        let name = formInstance.getEditor('salesOrgHeaderName').option('value')
                        let orgHeaderValue = { code, name, status: headerData.status + 1 }
                        switch (headerData.status) {
                            case -1:
                                salesOrgHeaderService.create(orgHeaderValue, { contentType: "application/json" })
                                    .done(result => {
                                        notify({ message: "Create Sale Organization Successfully" })
                                        treeInstance.option('dataSource', store.salesOrgHierarchyStore(headerData.id))
                                        headerData = result;
                                        reloadPopupBodyComponent(result)
                                        $('#NewRootButton').dxButton('instance').option('disabled', false)
                                        e.component.option('disabled', false)
                                        e.component.option('text', 'Release')
                                    })
                                    .fail(() => {
                                        notify({ type: "error", message: "Create Sale Organization Error" })
                                        e.component.option('disabled', false)
                                        e.component.option('text', 'Save')
                                    });
                                break;
                            case 0:
                                dialog({ body: "After releasing, you still can create routes, but won't be able to create sub ", header: "Releasing Sale Organization" },
                                    () => {
                                        salesOrgHeaderService.release(headerData.id, { contentType: "application/json" })
                                            .done(result => {
                                                notify({ message: "Release Sale Organization Successfully" })
                                                headerData = result;
                                                reloadPopupBodyComponent(result)
                                                $('#NewRootButton').dxButton('instance').option('disabled', true)
                                                e.component.option('disabled', false)
                                                e.component.option('text', 'Inactive')
                                            })
                                            .fail(() => {
                                                notify({ type: "error", message: "Release Sale Organization Error" })
                                                e.component.option('disabled', false)
                                                e.component.option('text', 'Release')
                                            });
                                    },
                                    () => {
                                        e.component.option('text', 'Release')
                                    })
                                break;
                            case 1:
                                dialog({ header: "Inactivate Sale Organization ", body: "After inactivate, you WON'T be able to create or edit this" },
                                    () => {
                                        salesOrgHeaderService.inactive(headerData.id, { contentType: "application/json" })
                                            .done(result => {
                                                notify({ message: "Inactived Sale Organization Successfully" })
                                                headerData = result;
                                                reloadPopupBodyComponent(result)
                                                $('#NewRootButton').dxButton('instance').option('disabled', true)
                                                e.component.option('text', 'Inactived')
                                                e.component.option('disabled', true)
                                            })
                                            .fail(() => {
                                                notify({ type: "error", message: "Inactived Sale Organization Error" })
                                                e.component.option('disabled', false)
                                                e.component.option('text', 'Inactive')
                                            });
                                    },
                                    () => {
                                        e.component.option('disabled', false)
                                        e.component.option('text', 'Inactive')
                                    })
                                break;
                            default:
                                break;
                        }
                    }

                }
            },

        ],
        onContentReady: (e) => {
            if (headerData.status > -1) {
                e.component.getEditor('salesOrgHeaderCode').option('readOnly', true)
                e.component.getEditor('salesOrgHeaderName').option('readOnly', true)
            }
        },
    })
    form.appendTo(e)
    formInstance = form.dxForm('instance')
}