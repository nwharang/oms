let itemServices = window.dMSpro.oMS.mdmService.controllers.items.item

var l = abp.localization.getResource("OMS");
let loadingPanel = $('<div class"fixed"/>').dxPopup({
    height: 100,
    width: 100,
    showTitle: false,
    animation: null,
    contentTemplate: (e) => $('<div/>').dxLoadIndicator({
        height: 60,
        width: 60,
    })
})
    .appendTo('body')
    .dxPopup('instance')
loadingPanel.registerKeyHandler('escape', () => loadingPanel.hide())


const itemStore = new DevExpress.data.CustomStore({
    key: 'id',
    load(loadOptions) {
        const deferred = $.Deferred();
        const args = {};
        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });
        itemServices.getListDevextremes(args)
            .done(result => {
                deferred.resolve(result.data, {
                    totalCount: result.totalCount,
                    summary: result.summary,
                    groupCount: result.groupCount,
                });
            });

        return deferred.promise();
    }
})


function renderMassInput() {
    let grid
    let popup = $("<div id='popupItems'>").dxPopup({
        height: '75vh',
        width: '80vw',
        title: l('Popup:Title:Chooseitems'),
        showCloseButton: false,
        dragEnabled: false,
        allowColumnReordering: false,
        allowColumnDragging: false,
        contentTemplate: (e) => {
            e.css('padding-bottom', '0 !impotant')
            grid = $("<div id='grid'>").dxDataGrid({
                dataSource: {
                    store: itemStore,
                    filter: ['active', '=', true],
                    map: e => {
                        e.qty = 1;
                        e.isFree = false
                        return e
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
                    pageSize: 10
                },
                pager: {
                    visible: true,
                    showPageSizeSelector: true,
                    allowedPageSizes: [10, 20],
                    showInfo: true,
                    showNavigationButtons: true
                },
                stateStoring: {
                    enabled: true,
                    type: 'localStorage',
                    storageKey: `dgSOInputDetails`,
                },
                editing: {
                    mode: 'batch',
                    allowUpdating: true,
                },
                toolbar: {
                    items: ['columnChooserButton']
                },
                columns: [
                    {
                        caption: l('EntityFieldName:OrderService:SalesRequestDetails:Qty'),
                        dataField: 'qty',
                        dataType: 'number',
                        width: 100,
                        setCellValue: (newData, value, currentRowData) => {
                            newData.qty = value
                            grid.selectRows([currentRowData.id], true)
                        },
                        editorOptions: {
                            format: "#"
                        },
                        allowFiltering: false,
                        allowSorting: false,
                    },
                    {
                        dataField: 'code',
                        caption: l("EntityFieldName:MDMService:Item:Code"),
                        dataType: 'string',
                        allowEditing: false
                    },
                    {
                        dataField: 'name',
                        caption: l("EntityFieldName:MDMService:Item:Name"),
                        dataType: 'string',
                        allowEditing: false,
                    },
                    {
                        dataField: 'isFree',
                        caption: l('EntityFieldName:OrderService:SalesRequestDetails:IsFree'),
                        dataType: 'boolean',
                        width: 100,
                        allowFiltering: false,
                        allowSorting: false,
                    },
                ],
                onSaving: async (e) => {
                    e.cancel = true
                    let selectedItem = e.component.getSelectedRowsData().map(obj => {
                        return {
                            ...obj,
                            qty: e.changes.find(v => v.key === obj.id)?.data.qty || 1,
                            isFree: e.changes.find(v => v.key === obj.id)?.data.isFree || false
                        }
                    }).filter(e => e.qty > 0)
                    if (selectedItem.length > 0)
                        await appendSelectedItems(selectedItem)
                }
            }).appendTo(e).dxDataGrid('instance')
        },
        onShowing: () => {
            grid.cancelEditData()
            grid.clearSelection()
        },
        onHiding: () => {
            grid.cancelEditData()
            grid.clearSelection()
            loadingPanel.hide()
        },
        onFocusedRowChanging: (e) => {
            // e.newRowIndex
        },

        toolbarItems: [
            {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    icon: 'fa fa-check hvr-icon',
                    text: 'Submit',
                    onClick: async e => {
                        grid.beginUpdate()
                        await grid.saveEditData()
                        grid.endUpdate()
                        popup.hide();
                    },
                },
            },
            {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    text: 'Cancel',
                    onClick: () => {
                        popup.hide();
                    },
                },
            }],
    }).appendTo('body').dxPopup('instance')
    return { popup, grid }
}

let getInfoSO = async () => {
    let companyIdentityUserAssignment = window.dMSpro.oMS.mdmService.controllers.companyIdentityUserAssignments.companyIdentityUserAssignment
    let companyId = await Common.getCurrentCompany().then((e) => e.id);
    await companyIdentityUserAssignment.setCurrentlySelectedCompany(companyId)
    return await salesOrderService.getInfoSO({ companyId }, new Date()).then(async result => {
        let data = await Common.parseJSON(result).then((data) => data.soInfo);
        return {
            companyId,
            mainStore: {
                uomGroupWithDetailsDictionary: Object.keys(data.uomGroupWithDetailsDictionary).map((key) => {
                    return {
                        id: key,
                        data: [
                            {
                                altQty: 1,
                                baseQty: 1,
                                altUOMId: data.uomGroupWithDetailsDictionary[key].baseUOMId,
                                baseUOMId: data.uomGroupWithDetailsDictionary[key].baseUOMId,
                            },
                            ...Object.keys(data.uomGroupWithDetailsDictionary[key].detailsDictionary).map(key1 => {
                                return {
                                    ...data.uomGroupWithDetailsDictionary[key].detailsDictionary[key1],
                                    baseUOMId: data.uomGroupWithDetailsDictionary[key].baseUOMId,
                                }
                            })
                        ]
                    }
                }),
                uOMList: Object.keys(data.uom).map((key) => {
                    // if (validUOM.find(e => e.uomId === key))
                    return data.uom[key];
                }),
                vatList: Object.keys(data.vat).map(key => data.vat[key]),
                customerList: Object.keys(data.customerDictionary).map(key => data.customerDictionary[key]),
                specialCustomer: Object.keys(data.customerIdsWithoutRoute).map(key => data.customerIdsWithoutRoute[key])
            },
        }
    })
}

let notify = (option) => {
    obj = { type: "success", position: "bottom right", message: "Message Placeholder", ...option };
    DevExpress.ui.notify({
        message: obj.message,
        height: 45,
        width: 250,
        minWidth: 250,
        type: obj.type,
        displayTime: 5000,
        animation: {
            show: {
                type: 'fade', duration: 400, from: 0, to: 1,
            },
            hide: { type: 'fade', duration: 40, to: 0 },
        },
    }, {
        position: obj.position,
    })
    return obj
}