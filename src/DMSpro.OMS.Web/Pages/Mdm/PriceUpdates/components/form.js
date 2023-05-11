function renderForm(e, headerData) {
    if (!form) form = $('<div id="form">')
    form.dxForm({
        labelMode: "floatting",
        colCount: 9,
        formData: headerData,
        items: [
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
                editorOptions: {
                    readOnly: headerData.status >= 0
                }
            },
            {
                label: l("EntityFieldName:MDMService:PriceUpdate:PriceList"),
                dataField: 'priceListId',
                editorType: 'dxSelectBox',
                colSpan: 2,
                editorOptions: {
                    dataSource: store.priceListStore,
                    displayExpr(e) {
                        if (e) {
                            return `${e.code} - ${e.name}`;
                        }
                        return "";
                    },
                    valueExpr: "id",
                    readOnly: headerData.status >= 0
                }
            },
            {
                label: l('EntityFieldName:MDMService:PriceUpdate:Description'),
                dataField: 'description',
                editorType: 'dxTextBox',
                colSpan: 4,
                editorOptions: {
                    readOnly: headerData.status >= 0
                }
            },
            {
                label: {
                    text: l('EntityFieldName:MDMService:PriceUpdate:Code'),
                },
                itemType: 'button',
                name: 'action',
                cssClass: "h-100 d-flex align-items-end",
                buttonOptions: {
                    text: headerData.status >= 0 ? "Release" : "Create",
                    disabled: headerData.status >= 1,
                    width: '100%',
                    onClick(event) {
                        popupInstance.beginUpdate()
                        switch (headerData.status) {
                            default:
                                dataSend = {
                                    code: headerData.code,
                                    description: headerData.description || "",
                                    priceListId: headerData.priceListId || ""
                                };
                                priceUpdateService.create(dataSend, { contentType: "application/json" }).done(e => {
                                    headerData = e
                                    formInstance.option('formData', e)
                                    popupInstance.option('title', `${l("Page.Title.PriceUpdates")} - #${store.status.find(v => v.id == e.status)?.text()}`)
                                    formInstance.getButton('cancel').option('disabled', false);
                                    event.component.option('text', 'Release')
                                    renderGrid(popupBody, headerData)
                                })
                                break;
                            case 0:
                                priceUpdateService.release(headerData.id, { contentType: "application/json" }).done(e => {
                                    popupInstance.option('title', `${l("Page.Title.PriceUpdates")} - #${store.status.find(v => v.id == e.status)?.text()}`)
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
                label: {
                    text: l('EntityFieldName:MDMService:PriceUpdate:Code'),
                },
                itemType: 'button',
                name: 'cancel',
                cssClass: "h-100 d-flex align-items-end",
                buttonOptions: {
                    text: "Cancel",
                    disabled: headerData.status != 0,
                    width: '100%',
                    onClick(event) {
                        popupInstance.beginUpdate()
                        priceUpdateService.cancel(headerData.id).done(e => {
                            formInstance.getButton('action').option('disabled', true);
                            popupInstance.option('title', `${l("Page.Title.PriceUpdates")} - #${store.status.find(v => v.id == e.status)?.text()}`)
                            event.component.option('disabled', true)
                            gridInstance.option('editing', {
                                allowAdding: false,
                                allowUpdating: false,
                                allowDeleting: false,
                            })
                        })
                        popupInstance.endUpdate()
                    }
                }
            },

        ],
        // onContentReady: (e) => {
        //     if (headerData.status >= 0)
        //         e.component.getEditor('type').option('readOnly', true);
        //     else
        //         e.component.getEditor('type').option('readOnly', false);
        // },
        // onFieldDataChanged: (e) => {
        //     if (e.dataField === 'type' && headerData.id) {
        //         switch (e.value) {
        //             case 0:
        //                 return renderItemAttr(headerData.id, headerData.status)
        //             case 1:
        //                 return renderItemList(headerData.id, headerData.status)
        //             default:
        //                 return;

        //         }
        //     }
        // }
    })
    form.appendTo(e)
    formInstance = form.dxForm('instance')
}