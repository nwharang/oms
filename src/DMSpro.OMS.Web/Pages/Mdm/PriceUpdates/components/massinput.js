function renderMassInputCus(headerId, priceListId) {
    massInputPopup = $("<div id='popup'>").dxPopup({
        title: l('EntityFieldName:MDMService:CustomerInZone:MassInput'),
        height: '75vh',
        width: '80vw',
        dragEnabled: false,
        allowColumnReordering: false,
        allowColumnDragging: false,
        contentTemplate: (e) => {
            massInputGrid = $("<div id='grid'>").dxDataGrid({
                dataSource: {
                    store: store.priceListDetailStore,
                    filter: [
                        ['priceListId', "=", priceListId],
                        ...gridInstance.getDataSource().items().map(e => ['and', ['id', "<>", e.priceListDetailId]]).flat(1)
                    ],
                    paginate: true,
                    map: (data) => {
                        return {
                            ...data,
                            newPrice: null
                        }
                    }
                },
                height: '100%',
                width: '100%',
                filterRow: {
                    visible: true,
                },
                headerFilter: {
                    visible: true,
                },
                selection: {
                    mode: 'multiple',
                    showCheckBoxesMode: 'always',
                    selectAllMode: 'page'
                },
                remoteOperations: true,

                showBorders: true,
                allowColumnDragging: false,
                columnAutoWidth: true,
                showRowLines: true,
                rowAlternationEnabled: true,
                dateSerializationFormat: "yyyy-MM-dd",
                showColumnLines: true,
                columnChooser: {
                    enabled: true,
                    mode: "select"
                },
                paging: {
                    enabled: true,
                    pageSize: pageSize
                },
                pager: {
                    visible: true,
                    showPageSizeSelector: true,
                    allowedPageSizes: allowedPageSizes,
                    showInfo: true,
                    showNavigationButtons: true
                },
                editing: {
                    mode: 'batch',
                    allowUpdating: true,
                    useIcons: true,
                    texts: {
                        editRow: l("Edit"),
                        deleteRow: l("Delete"),
                        confirmDeleteMessage: l("DeleteConfirmationMessage")
                    }
                },
                toolbar: {
                    items: []
                },
                columns: [
                    {
                        caption: l("EntityFieldName:MDMService:PriceUpdateDetail:Item"),
                        dataField: "item.name",
                        calculateDisplayValue(e) {
                            if (e)
                                return `${e.item.code} - ${e.item.name}`
                        },
                        allowEditing: false
                    },
                    {
                        caption: l('EntityFieldName:MDMService:PriceUpdateDetail:UOM'),
                        dataField: "uom.name",
                        calculateDisplayValue(e) {
                            if (e)
                                return `${e.uom.code} - ${e.uom.name}`
                        },
                        width: 200,
                        allowEditing: false
                    },
                    {
                        caption: l("EntityFieldName:MDMService:PriceUpdateDetail:PriceBeforeUpdate"),
                        dataField: "price",
                        format: '#,##0',
                        allowEditing: false,
                        width: 200,
                    },
                    {
                        caption: l("EntityFieldName:MDMService:PriceUpdateDetail:NewPrice"),
                        dataField: 'newPrice',
                        dataType: 'number',
                        format: '#,##0',
                        width: 200,
                        editorOptions: {
                            format: '#,##0',
                        },
                        setCellValue: (newData, value, currentRowData) => {
                            newData.newPrice = value
                            massInputGridInstance.selectRows([currentRowData.id], true)
                        }
                    }
                ],
                onSaving: async (e) => {
                    e.cancel = true
                    let data = e.changes.map(obj => {
                        return {
                            newPrice: obj.data.newPrice,
                            priceUpdateId: headerId,
                            priceListDetailId: obj.key,
                        }
                    })
                    await data.forEach(e => {
                        gridInstance.getDataSource().store().insert(e)
                    })
                }
            })
            massInputGridInstance = massInputGrid.dxDataGrid('instance')
            massInputGrid.appendTo(e)
        },

        toolbarItems: [
            {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    icon: 'fa fa-check hvr-icon',
                    text: 'Submit',
                    async onClick(e) {
                        massInputGridInstance.beginUpdate()
                        await massInputGridInstance.saveEditData()
                        await gridInstance.refresh()
                        massInputGridInstance.endUpdate()
                        massInputPopupInstance.hide();
                    },
                },
            },
            {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    text: 'Cancel',
                    onClick() {
                        massInputPopupInstance.hide()
                    },
                },
            }],
    })
    massInputPopupInstance = massInputPopup.dxPopup('instance')
    massInputPopup.appendTo('body')
    massInputPopupInstance.show()
}