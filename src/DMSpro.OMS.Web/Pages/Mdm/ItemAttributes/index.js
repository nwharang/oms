let sample = () => {
    createFlat(input, ajaxParams)
    createHierarchy(input, ajaxParams)
    delete (ajaxParams)
    generateExcelTemplates(ajaxParams)
    get(id, ajaxParams)
    getListDevextremes(inputDev, ajaxParams)
    insertFromExcel(file, ajaxParams)
    reset(ajaxParams)
    update(id, input, ajaxParams)
    updateFromExcel(file, ajaxParams)
}
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
            itemAttrService.getListDevextremes(args)
                .done(result => {
                    gridInfo = {
                        ...gridInfo,
                        length: result.data.filter(e => e.active).length,
                        lastLevel: result.data.filter(e => e.active).length,
                        canReset: result.summary[0].canReset === "False" ? false : true
                    }
                    deferred.resolve(result.data, {
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
        insert({ attrName, sendMode }) {
            switch (sendMode) {
                case 0:
                    return itemAttrService.createFlat({ attrName })
                case 1:
                    return itemAttrService.createHierarchy({ attrName })
            }
        },
        update(key, { attrName }) {
            return itemAttrService.update(key, { attrName });
        },
        remove(key) {
            // Delete , return full DataSource 
            return itemAttrService.delete({});
        }
    });
    customStore.load().then(() => {
        const dataGrid = $('#gridProdAttribute').dxDataGrid({
            dataSource: {
                store: customStore,
                filter: ['active', '=', true]
            },
            // remoteOperations: true,
            showRowLines: true,
            showColumnLines: false,
            showBorders: true,
            cacheEnabled: true,
            allowColumnReordering: true,
            rowAlternationEnabled: true,
            allowColumnResizing: true,
            columnResizingMode: 'widget',
            columnAutoWidth: true,
            filterRow: {
                visible: true
            },
            height: '80vh',
            columnMinWidth: 50,
            columnFixing: {
                enabled: true,
            },
            // export: {
            //     enabled: true,
            // },
            // onExporting(e) {
            //     const workbook = new ExcelJS.Workbook();
            //     const worksheet = workbook.addWorksheet('Data');

            //     DevExpress.excelExporter.exportDataGrid({
            //         component: e.component,
            //         worksheet,
            //         autoFilterEnabled: true,
            //     }).then(() => {
            //         workbook.xlsx.writeBuffer().then((buffer) => {
            //             saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ItemAttributes.xlsx');
            //         });
            //     });
            //     e.cancel = true;
            // },
            headerFilter: {
                visible: true,
            },
            // stateStoring: {
            //     enabled: true,
            //     type: 'localStorage',
            //     storageKey: 'gridProdAttribute',
            // },
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
                console.log('1');
                e.data.active = true
                e.data.sendMode = sendMode
            },
            onInitialized: () => {
                console.log(gridInfo);
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
                            onClick(e) {
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
                                console.log("AAAA");
                            }
                        },
                    },
                ],
            },
            columns: [
                {
                    type: 'buttons',
                    alignment: 'left',
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
                    dataField: 'attrNo',
                    width: 100,
                    sortIndex: 0, sortOrder: "asc",
                    caption: l("EntityFieldName:MDMService:ItemAttribute:AttrNo"),
                    allowEditing: false
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
                        console.log(cellInfo);
                        return $('<div>').dxCheckBox({
                            value: false,
                            onValueChanged(e) {
                                console.log('2');
                                if (e.value) {
                                    sendMode = 1
                                } else {
                                    sendMode = 0
                                }
                            },
                        })
                    }
                },
                // {
                //     dataField: 'active',
                //     width: 110,
                //     caption: l("EntityFieldName:MDMService:ItemAttribute:Active"),
                //     alignment: 'center',
                //     dataType: 'boolean',
                //     cellTemplate(container, options) {
                //         $('<div>')
                //             .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                //             .appendTo(container);
                //     }
                // },
                // {
                //     dataField: 'isSellingCategory',
                //     caption: l("EntityFieldName:MDMService:ItemAttribute:IsSellingCategory"),
                //     alignment: 'center',
                //     dataType: 'boolean',
                //     cellTemplate(container, options) {
                //         $('<div>')
                //             .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                //             .appendTo(container);
                //     }
                // }
            ]
        }).dxDataGrid('instance');
    })
})
