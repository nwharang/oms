function renderMassInputCus(headerId) {
    preLoadData.done(storeArrayData => {
        gridInstance.getDataSource().items().forEach((e) => {
            console.log(e.priceListDetailId);
            let i = storeArrayData.data.findIndex(v => v.id === e.priceListDetailId)
            if (i) {
                storeArrayData.data.splice(i, 1)
            }
        })

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
                        store: {
                            type: 'array',
                            key: 'id',
                            data: storeArrayData.data
                        },
                        paginate: true,
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
                            dataField: "itemId",
                            lookup: {
                                dataSource: store.getItems,
                                valueExpr: 'id',
                                displayExpr: (e) => {
                                    if (e)
                                        return `${e.code} - ${e.name}`
                                    return 'name'
                                },
                            },
                            allowEditing: false
                        },
                        {
                            caption: l('EntityFieldName:MDMService:PriceUpdateDetail:UOM'),
                            dataField: "uomId",
                            lookup: {
                                dataSource: store.getUOMs,
                                valueExpr: 'id',
                                displayExpr: 'name',
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
                    ]
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
                            console.log(massInputGridInstance.getSelectedRowsData());
                            let data = massInputGridInstance.getSelectedRowsData().map(({ newPrice, id }) => {
                                return {
                                    newPrice,
                                    priceUpdateId: headerId,
                                    priceListDetailId: id,
                                }
                            })

                            await data.forEach(e => {
                                gridInstance.getDataSource().store().insert(e)
                            })
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
    })
}