$(function () {
    let gridInfo = {}, sendMode = 0
    let itemAttrService = window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute;
    let l = abp.localization.getResource("OMS");
    let dialog = ({ header, body }, callBackIfTrue, callBackIfFalse) => {
        DevExpress.ui.dialog.confirm(`<i>${body}</i>`, header)
            .done((e) => {
                if (e) {
                    callBackIfTrue()
                }
                else {
                    callBackIfFalse()
                }
            })
    }
    let customStore = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'raw',
        cacheRawData: true,
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            itemAttrService.getListDevextremes(
                JSON.stringify({
                    sort: {
                        selector: "attrNo",
                        desc: false
                    }
                }),
            )
                .done(result => {
                    gridInfo = {
                        ...gridInfo,
                        length: result.data.filter(e => e.active).length,
                        lastLevel: result.data.filter(e => e.active).length,
                        canReset: result.summary[0].canReset === "False" ? false : true
                    }
                    deferred.resolve(result.data.sort((a, b) => a.attrNo - b.attrNo), {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount
                    });
                });
            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            let d = new $.Deferred();
            itemAttrService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert({ attrName }) {
            console.log(sendMode)
            switch (sendMode) {
                case 0:
                    return itemAttrService.createFlat({ attrName })
                case 1:
                    sendMode = 0
                    return itemAttrService.createHierarchy({ attrName })
            }
        },
        update(key, { attrName }) {
            return itemAttrService.update(key, { attrName });
        },
        remove(key) {
            return itemAttrService.delete({});
        }
    });
    customStore.load().then(() => {
        const dataGrid = $('#gridProdAttribute').css('max-width', "1000px").dxDataGrid({
            dataSource: {
                store: customStore,
                filter: ['active', '=', true]
            },
            showRowLines: true,
            showBorders: true,
            cacheEnabled: true,
            allowColumnReordering: true,
            rowAlternationEnabled: true,
            allowColumnResizing: true,
            columnResizingMode: 'widget',
            columnAutoWidth: true,
            columnMinWidth: 50,
            columnFixing: {
                enabled: true,
            },
            editing: {
                mode: "row",
                allowAdding: abp.auth.isGranted('MdmService.ItemAttributes.Create') && gridInfo.length < 20,
                allowUpdating: abp.auth.isGranted('MdmService.ItemAttributes.Edit'),
                allowDeleting: abp.auth.isGranted('MdmService.ItemAttributes.Delete'),
                useIcons: true,
                newRowPosition: 'last',
                texts: {
                    editRow: l("Edit"),
                    deleteRow: l("Delete"),
                    confirmDeleteMessage: l("DeleteConfirmationMessage")
                }
            },
            onRowUpdating: function (e) {
                e.newData = Object.assign({}, e.oldData, e.newData);
            },
            onRowInserting: (e) => {
                e.data.active = true
            },
            toolbar: {
                items: [
                    'addRowButton',
                    {
                        location: 'after',
                        widget: "dxButton",
                        options: {
                            icon: "refresh",
                            disabled: !gridInfo.canReset || !abp.auth.isGranted('MdmService.ItemAttributes.Delete'),
                            onClick() {
                                dialog(
                                    {
                                        header: l('EntityFieldName:MDMService:ItemAttribute:Reset:ConfirmationHeader'),
                                        body: l('EntityFieldName:MDMService:ItemAttribute:Reset:ConfirmationBody')
                                    },
                                    () => {
                                        itemAttrService.reset({}).then(({ data }) => {
                                            dataGrid.refresh()
                                        })
                                    },
                                )
                            }
                        },
                    },
                ],
            },
            columns: [
                {
                    type: 'buttons',
                    alignment: 'left',
                    width: 70,
                    buttons: ["edit", {
                        name: 'delete',
                        visible: (e) => {
                            if (e.row.rowType === 'data' && abp.auth.isGranted('MdmService.ItemAttributes.Delete'))
                                return e.row.data.attrNo === gridInfo.lastLevel - 1
                        }
                    }],
                    caption: l('Actions'),
                    fixedPosition: 'left',

                },
                {
                    dataField: 'attrName',
                    width: '100%',
                    caption: l("EntityFieldName:MDMService:ItemAttribute:AttrName"),
                    validationRules: [
                        {
                            type: "required",
                            message: 'Attribute name is required'
                        }
                    ]
                },
                {
                    dataField: 'hierarchyLevel',
                    caption: l("EntityFieldName:MDMService:ItemAttribute:HierarchyLevel"),
                    alignment: 'center',
                    editCellTemplate: (cellElement, cellInfo) => {
                        console.log(cellInfo.row.isNewRow);
                        if (cellInfo.row.isNewRow)
                            return $('<div>').dxCheckBox({
                                value: false,
                                onValueChanged(e) {
                                    if (e.value) {
                                        sendMode = 1
                                    } else {
                                        sendMode = 0
                                    }
                                },
                            })
                        return cellElement.css('background-color', "#5c95c5")
                    },
                },
            ]
        }).dxDataGrid('instance');
    })
})
