$(async function () {
    let l = abp.localization.getResource("OMS");
    let rpcService = {
        itemMasterService: window.dMSpro.oMS.mdmService.controllers.items.item,
        itemAttrValueService: window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue,
        itemAttrService: window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute,
        itemImageService: window.dMSpro.oMS.mdmService.controllers.itemImages.itemImage,
        itemAttachmentService: window.dMSpro.oMS.mdmService.controllers.itemAttachments.itemAttachment,
        itemTypeService: window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData,
        uomService: window.dMSpro.oMS.mdmService.controllers.uOMs.uOM,
        uomGroupService: window.dMSpro.oMS.mdmService.controllers.uOMGroups.uOMGroup,
        uomGroupDetailService: window.dMSpro.oMS.mdmService.controllers.uOMGroupDetails.uOMGroupDetail,
        vatService: window.dMSpro.oMS.mdmService.controllers.vATs.vAT,
    }
    let enumValue = {
        manageItem: [
            {
                id: 0,
                text: l('EntityFieldValue:MDMService:Item:ManageItemBy:NONE')
            },
            {
                id: 1,
                text: l('EntityFieldValue:MDMService:Item:ManageItemBy:LOT')
            },
            {
                id: 2,
                text: l('EntityFieldValue:MDMService:Item:ManageItemBy:SERIAL')
            }
        ],
        expiredType: [
            {
                id: 0,
                text: l('EntityFieldValue:MDMService:Item:ExpiredType:DAY')
            },
            {
                id: 1,
                text: l('EntityFieldValue:MDMService:Item:ExpiredType:WEEK')
            },
            {
                id: 2,
                text: l('EntityFieldValue:MDMService:Item:ExpiredType:MONTH')
            },
            {
                id: 3,
                text: l('EntityFieldValue:MDMService:Item:ExpiredType:YEAR')
            }
        ],
        issueMethod: [
            {
                id: 0,
                text: l('EntityFieldValue:MDMService:Item:IssueMethod:FEFO')
            },
            {
                id: 1,
                text: l('EntityFieldValue:MDMService:Item:IssueMethod:SERIAL')
            }
        ],
        issueMethod1: [
            {
                id: 0,
                text: l('EntityFieldValue:MDMService:Item:IssueMethod:FEFO')
            },
        ],
        itemTypes: [
            {
                id: 0,
                text: l('EntityFieldValue:MDMService:Item:ItemTypes:Item'),
            },
            {
                id: 1,
                text: l('EntityFieldValue:MDMService:Item:ItemTypes:POSM'),
            },
            {
                id: 2,
                text: l('EntityFieldValue:MDMService:Item:ItemTypes:Discount'),
            },
            {
                id: 3,
                text: l('EntityFieldValue:MDMService:Item:ItemTypes:Voucher'),
            }
        ]
    }
    let store = {
        imageStore: new DevExpress.data.CustomStore({
            key: 'id',
            load: (loadOptions) => {
                const args = {};
                requestOptions.forEach((i) => {
                    if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                        args[i] = JSON.stringify(loadOptions[i]);
                    }
                });
                return rpcService.itemImageService.getListDevextremes(args)
                    .then(({ data }) => Promise.all(data.map(async imageInfo => {
                        return {
                            ...imageInfo,
                            url: await fetch("/api/mdm-service/item-images/get-file?id=" + imageInfo.fileId)
                                .then(res => res.blob())
                                .then(data => URL.createObjectURL(data))
                        }
                    })))
                    .then(data => data.sort((a, b) => a.displayOrder - b.displayOrder));
            },
            byKey: (key) => key ? new Promise((resolve, reject) => rpcService.itemImageService.get(key)
                .done(data => resolve(data))
                .fail(err => reject(err))
            ) : null,
            insert: (values) => rpcService.itemImageService.create(values, { contentType: "application/json" }),
            update: (key, values) => rpcService.itemImageService.update(key, values, { contentType: "application/json" }),
            remove: (key) => rpcService.itemImageService.deleteMany(key)
        }),
        attachmentStore: new DevExpress.fileManagement.CustomFileSystemProvider({
            keyExpr: 'id',
            getItems: () => rpcService.itemAttachmentService.getListDevextremes({
                filter: JSON.stringify(['itemId', '=', gridInfo.editingItem]),
            }).then(({ data }) => {
                gridInfo.attachment.fileSource = data?.map(e => {
                    return {
                        id: e.id,
                        fileId: e.fileId,
                        isDirectory: false,
                        ...JSON.parse(e.description)
                    };
                })
                return gridInfo.attachment.fileSource
            }),
            uploadFileChunk: (file, uploadInfo, destinationDirectory) => {
                let form = new FormData();
                form.append('inputFile', file, file.name);
                let description = JSON.stringify({ name: file.name, size: file.size, type: file.type })
                return rpcService.itemAttachmentService.create(gridInfo.editingItem, file, description, true,
                    {
                        contentType: false,
                        processData: false,
                        data: form,
                        async: true,
                    })
            },
            deleteItem: ({ dataItem }) => {
                return rpcService.itemAttachmentService.deleteMany(dataItem.id)
            },
            // Don't change arguments
            downloadItems: ([{ dataItem }]) => {
                return rpcService.itemAttachmentService.getFile(dataItem.fileId, {
                    dataType: 'binary',
                    xhrFields: {
                        'responseType': 'blob'
                    },
                    success: (result) => {
                        console.log(result);
                        let blob = new Blob([result]);
                        let a = document.createElement('a');
                        a.href = window.URL.createObjectURL(blob);
                        a.download = dataItem.name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(a.href);
                    }
                })
            }

        }),
        getVATs: new DevExpress.data.CustomStore({
            key: 'id',
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
                rpcService.vatService.getListDevextremes(args)
                    .done(result => {
                        deferred.resolve(result.data, {
                            totalCount: result.totalCount,
                            summary: result.summary,
                            groupCount: result.groupCount,
                        });
                    });
                return deferred.promise();
            },
        }),
        getUOMs: new DevExpress.data.CustomStore({
            key: 'id',
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
                rpcService.uomService.getListDevextremes(args)
                    .done(result => {
                        deferred.resolve(result.data, {
                            totalCount: result.totalCount,
                            summary: result.summary,
                            groupCount: result.groupCount,
                        });
                    });
                return deferred.promise();
            },
        }),
        getUOMsGroup: new DevExpress.data.CustomStore({
            key: 'id',
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
                rpcService.uomGroupService.getListDevextremes(args)
                    .done(result => {
                        let lastResult = { ...result }
                        // Validate UOM group where UOM group must have asleast 1 row and have base UOM
                        lastResult.data = result.data.filter(e => e.details.filter(detail => detail.baseUOMId === detail.altUOMId).length > 0)
                        deferred.resolve(lastResult.data, {
                            totalCount: lastResult.totalCount,
                            summary: lastResult.summary,
                            groupCount: lastResult.groupCount,
                        });
                    });
                return deferred.promise();
            },
        }),
        getUOMsGroupDetailStore: new DevExpress.data.CustomStore({
            key: 'id',
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
                rpcService.uomGroupDetailService.getListDevextremes(args)
                    .done(result => {
                        deferred.resolve(result.data, {
                            totalCount: result.totalCount,
                            summary: result.summary,
                            groupCount: result.groupCount,
                        });
                    });
                return deferred.promise();
            },
        }),
        itemStore: new DevExpress.data.CustomStore({
            key: 'id',
            useDefaultSearch: true,
            load(loadOptions) {
                const deferred = $.Deferred();
                const args = {};

                requestOptions.forEach((i) => {
                    if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                        args[i] = JSON.stringify(loadOptions[i]);
                    }
                });
                rpcService.itemMasterService.getListDevextremes(args)
                    .done(result => {
                        deferred.resolve(result.data, {
                            totalCount: result.totalCount,
                            summary: result.summary,
                            groupCount: result.groupCount,
                        });
                    });
                return deferred.promise();
            },
            byKey: function (key) {
                if (!key) return null;

                let d = new $.Deferred();
                rpcService.itemMasterService.get(key)
                    .done(data => {
                        d.resolve(data);
                    });
                return d.promise();
            },
            insert(values) {
                return rpcService.itemMasterService.create(values, { contentType: "application/json" });
            },
            update(key, values) {
                return rpcService.itemMasterService.update(key, values, { contentType: "application/json" });
            },
            remove(key) {
                return rpcService.itemMasterService.delete(key);
            }
        }),
        getItemAttrValue: new DevExpress.data.CustomStore({
            key: 'id',
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

                rpcService.itemAttrValueService.getListDevextremes(args)
                    .done(result => {
                        deferred.resolve(result.data, {
                            totalCount: result.totalCount,
                            summary: result.summary,
                            groupCount: result.groupCount,
                        });
                    });
                return deferred.promise();
            },
        })
    }
    let getUOMsGroupDetaiArr, disableColumn = ["inventoryUOMId", "purUOMId", "salesUOMId"], gridInfo = {}

    store.getUOMsGroupDetailStore.load({}).then(data => {
        getUOMsGroupDetaiArr = data
    })
    await rpcService.itemAttrService.getListDevextremes({ filter: JSON.stringify(['active', '=', true]) }).then(({ data }) => {
        gridInfo.itemAttr = {
            hierarchy: data.filter(e => e.hierarchyLevel != null).sort((a, b) => a.attrNo - b.attrNo),
            flat: data.filter(e => e.hierarchyLevel == null).sort((a, b) => a.attrNo - b.attrNo),
            count: data.length
        }
    })

    let gridItemMasters = $('#dataGridItemMasters').dxDataGrid({
        dataSource: store.itemStore,
        editing: {
            mode: 'popup',
            allowAdding: abp.auth.isGranted('MdmService.Items.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.Items.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.Items.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            },
            popup: {
                height: '95%',
                width: '95%',
                hideOnOutsideClick: false,
                dragEnabled: false,
                onHiding: (e) => {
                    gridInfo.editingItem = null;
                    gridInfo.currentData = null;
                    gridInfo.description = null;
                    gridInfo.imageContent = null;
                    gridInfo.attachment = null;
                    gridInfo.generalContent = null;
                    gridInfo.imageDataSource = null;
                },
                onContentReady: (e) => {
                    let toolbarPopup = [...e.component.option('toolbarItems'),
                    {
                        widget: 'dxButton',
                        toolbar: 'bottom',
                        location: 'before',
                        options: {
                            text: 'Genarel Information',
                            disabled: !Boolean(gridInfo.editingItem),
                            onClick: () => {
                                gridInfo.generalContent.show()
                                gridInfo.imageContent.container.hide()
                                gridInfo.attachment.container.hide()
                            },
                        },
                    },
                    {
                        widget: 'dxButton',
                        toolbar: 'bottom',
                        location: 'before',
                        options: {
                            text: 'Item Image',
                            disabled: !Boolean(gridInfo.editingItem),
                            onClick: (e) => {
                                gridInfo.imageContent.container.show()
                                gridInfo.generalContent.hide()
                                gridInfo.attachment.container.hide()
                                if (!gridInfo.imageContent.isRender)
                                    renderImageContent()
                            },
                        },
                    },
                    {
                        widget: 'dxButton',
                        toolbar: 'bottom',
                        location: 'before',
                        options: {
                            text: 'Item Attachment',
                            disabled: !Boolean(gridInfo.editingItem),
                            onClick: (e) => {
                                gridInfo.attachment.container.show()
                                gridInfo.generalContent.hide()
                                gridInfo.imageContent.container.hide()
                                if (!gridInfo.attachment.isRender)
                                    renderAttachmentContent()
                            },
                        },
                    },
                    ]
                    e.component.option('toolbarItems', toolbarPopup)
                    $('#formGridAddItemMaster').parent().addClass('d-flex flex-column')
                    gridInfo.generalContent = $('#formGridAddItemMaster');
                    gridInfo.imageContent = {
                        container: $('<div style="display:flex;" class="flex-grow-1"/>').insertAfter($('#formGridAddItemMaster')),
                        list: $('<div class="d-flex"/>').css({ 'flex': '1 0 65%' }),
                        controller: $('<div class="border-start p-2"/>').css('flex-basis', "35%"),
                    };
                    gridInfo.imageContent.list.appendTo(gridInfo.imageContent.container)
                    gridInfo.imageContent.controller.appendTo(gridInfo.imageContent.container)
                    gridInfo.imageContent.container.hide()
                    gridInfo.attachment = {
                        container: $('<div style="display:flex;" class="flex-grow-1"/>').insertAfter($('#formGridAddItemMaster')),
                    };
                }
            },
            form: {
                labelMode: "static",
                colCount: 3,
                elementAttr: {
                    id: 'formGridAddItemMaster',
                    class: "flex-grow-1 px-3"
                },
                items: [
                    {
                        caption: '',
                        itemType: "group",
                        template: renderItemImage // Fix for future versions
                    },
                    {
                        caption: '',
                        itemType: 'group',
                        items: ['code', 'name', 'shortName', 'itemType', 'barcode', 'erpCode', 'active']
                    },
                    {
                        caption: '',
                        itemType: 'group',
                        items: [
                            {
                                dataField: 'manageItemBy',
                                editorOptions: {
                                    onSelectionChanged: (e) => {
                                        let formInstance = $("#formGridAddItemMaster").dxForm('instance')
                                        let expiredValue = $('#expiredValue').dxNumberBox('instance')
                                        let expiredType = $('#expiredType').dxSelectBox('instance')
                                        let issueMethod = $('#issueMethod').dxSelectBox('instance')
                                        if (formInstance && expiredType && expiredValue && issueMethod) {
                                            switch (e.selectedItem.id) {
                                                case 0:
                                                    expiredType.option('readOnly', true)
                                                    expiredType.option('value', null)
                                                    expiredValue.option('readOnly', true)
                                                    expiredValue.option('value', null)
                                                    issueMethod.option('dataSource', enumValue.issueMethod)
                                                    issueMethod.option('readOnly', false)
                                                    issueMethod.option('value', 0)
                                                    break;
                                                case 1:
                                                    expiredType.option('readOnly', false)
                                                    expiredValue.option('readOnly', false)
                                                    issueMethod.option('dataSource', enumValue.issueMethod1)
                                                    issueMethod.option('readOnly', false)
                                                    issueMethod.option('value', 0)
                                                    break;
                                                case 2:
                                                    expiredType.option('readOnly', true)
                                                    expiredType.option('value', null)
                                                    expiredValue.option('readOnly', true)
                                                    expiredValue.option('value', null)
                                                    issueMethod.option('dataSource', enumValue.issueMethod)
                                                    issueMethod.option('readOnly', true)
                                                    issueMethod.option('value', 1)
                                                    break;
                                                default:
                                                    return;
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                dataField: 'expiredType',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    elementAttr: {
                                        id: 'expiredType'
                                    },
                                    placeholder: "",
                                    readOnly: true,
                                }
                            },
                            {
                                dataField: 'expiredValue',
                                editorType: 'dxNumberBox',
                                editorOptions: {
                                    elementAttr: {
                                        id: 'expiredValue'
                                    },
                                    readOnly: true,
                                    format: '#,##0.##',
                                }
                            },
                            {
                                dataField: 'issueMethod',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    items: enumValue.issueMethod,
                                    elementAttr: {
                                        id: 'issueMethod'
                                    },
                                    showClearButton: true,
                                    searchEnabled: true,
                                    displayExpr: 'text',
                                    valueExpr: 'id',
                                    value: 0
                                }
                            },
                            {
                                itemType: 'empty',
                            },
                            {
                                itemType: 'group',
                                colCountByScreen: {
                                    xs: 3,
                                    sm: 2,
                                    md: 2,
                                    lg: 2,
                                },
                                items: ['isInventoriable', 'isPurchasable', 'isSaleable']
                            }
                        ]

                    },
                    {
                        caption: '',
                        itemType: 'group',
                        items: ['uomGroupId', 'inventoryUOMId', 'purUOMId', 'salesUOMId', 'vatId', 'basePrice',],
                    },
                    {
                        caption: '',
                        itemType: 'group',
                        colCount: 2,
                        colSpan: 2,
                        items: [
                            {
                                itemType: 'group',
                                items: getAttrField('hierarchy'),
                            },
                            {
                                itemType: 'group',
                                items: getAttrField('flat')
                            },
                        ]
                    },
                ],
            },
        },
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,
        repaintChangesOnly: true,
        filterRow: {
            visible: true
        },
        groupPanel: {
            visible: true,
        },
        searchPanel: {
            visible: true
        },
        columnMinWidth: 50,
        columnChooser: {
            enabled: true,
            mode: "select"
        },
        columnFixing: {
            enabled: true,
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'dataGridItemMasters',
        },
        export: {
            enabled: true,
        },
        onExporting: function (e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Companies');
            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `Exports.xlsx`);
                });
            });
            e.cancel = true;
        },
        headerFilter: {
            visible: true,
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

        onInitNewRow: function (e) {
            e.data.active = true;
            e.data.isInventoriable = true;
            e.data.isPurchasable = true;
            e.data.isSaleable = true;
            e.data.manageItemBy = 0
            e.data.itemType = 0
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
        },
        onEditorPreparing: (e) => {
            if (e.row?.rowType != 'data') return
            if (!e.row.data.uomGroupId && disableColumn.indexOf(e.dataField) > -1) {
                disableCell(e, true)
            }
        },
        toolbar: {
            items: [
                "groupPanel",
                'addRowButton',
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "import",
                        elementAttr: {
                            class: "import-excel",
                        },
                        onClick(e) {
                            let gridControl = e.element.closest('div.dx-datagrid').parent();
                            let gridName = gridControl.attr('id');
                            let popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        },
                    }
                },
                "searchPanel"
            ]
        },
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                buttons: [
                    {
                        name: 'edit',
                        onClick: (e) => {
                            gridInfo.editingItem = e.row.data.id;
                            gridItemMasters.editRow(e.row.rowIndex);
                        }
                    },
                    {
                        name: 'delete',
                    }
                ],
                fixed: true,
                fixedPosition: "left",
            },
            {
                dataField: 'id',
                caption: l("Id"),
                dataType: 'string',
                allowEditing: false,
                visible: false,
                formItem: {
                    visible: false
                },
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:Item:Code"),
                dataType: 'string',
                allowEditing: false,
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:Item:Name"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'shortName',
                caption: l("EntityFieldName:MDMService:Item:ShortName"),
                dataType: 'string'
            },
            {
                dataField: 'barcode',
                caption: l("EntityFieldName:MDMService:Item:Barcode"),
                dataType: 'string'
            },
            {
                dataField: 'itemType',
                caption: l("EntityFieldName:MDMService:Item:ItemTypeName"),
                dataType: 'string',
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: enumValue.itemTypes,
                    valueExpr: 'id',
                    displayExpr: 'text'
                }
            },
            {
                dataField: 'erpCode',
                caption: l("EntityFieldName:MDMService:Item:ERPCode"),
                dataType: 'string'
            },
            {
                dataField: 'uomGroupId',
                caption: l('EntityFieldName:MDMService:Item:UOMGroupCode'),
                dataType: 'string',
                visible: false,
                lookup: {
                    dataSource: store.getUOMsGroup,
                    valueExpr: "id",
                    displayExpr: "name"
                },
                validationRules: [{ type: "required" }],
                setCellValue: (newData, value, currentData) => {
                    newData.uomGroupId = value
                    newData.inventoryUOMId = getUOMsGroupDetaiArr.find(e => e.uomGroupId === value && e.altUOMId === e.baseUOMId)?.baseUOMId || null
                    newData.purUOMId = null
                    newData.salesUOMId = null
                }
            },
            {
                dataField: 'isInventoriable',
                caption: l('EntityFieldName:MDMService:Item:IsInventoryItem'),
                editorType: 'dxCheckBox',
                alignment: 'center',
                dataType: 'boolean',
                visible: false
            },
            {
                dataField: 'isPurchasable',
                caption: l('EntityFieldName:MDMService:Item:IsPurchaseItem'),
                editorType: 'dxCheckBox',
                alignment: 'center',
                dataType: 'boolean',
                visible: false
            },
            {
                dataField: 'isSaleable',
                caption: l('EntityFieldName:MDMService:Item:IsSalesItem'),
                editorType: 'dxCheckBox',
                alignment: 'center',
                dataType: 'boolean',
                visible: false
            },
            {
                dataField: 'manageItemBy',
                caption: l('EntityFieldName:MDMService:Item:ManageItemBy'),
                validationRules: [{ type: "required" }],
                dataType: 'string',
                lookup: {
                    dataSource: enumValue.manageItem,
                    valueExpr: "id",
                    displayExpr: "text",
                },
                visible: false,
            },
            {
                dataField: 'expiredType',
                caption: l('EntityFieldName:MDMService:Item:ExpiredType'),
                dataType: 'string',
                lookup: {
                    dataSource: enumValue.expiredType,
                    valueExpr: "id",
                    displayExpr: "text"
                },
                visible: false
            },
            {
                dataField: 'expiredValue',
                caption: l('EntityFieldName:MDMService:Item:ExpiredValue'),
                dataType: 'number',
                visible: false,
            },
            {
                dataField: 'issueMethod',
                caption: l('EntityFieldName:MDMService:Item:IssueMethod'),
                dataType: 'string',
                lookup: {
                    dataSource: enumValue.issueMethod,
                    valueExpr: "id",
                    displayExpr: "text"
                },
                visible: false
            },
            {
                dataField: 'inventoryUOMId',
                caption: l('EntityFieldName:MDMService:Item:InventoryUnitName'),
                validationRules: [{ type: "required" }],
                dataType: 'string',
                visible: false,
                calculateDisplayValue: (e) => e?.inventoryUOM?.name,
                lookup: {
                    dataSource: (options) => {
                        return {
                            store: store.getUOMsGroupDetailStore,
                            filter: options?.data?.uomGroupId ? [["uomGroupId", "=", options.data.uomGroupId || 0], 'and', ['active', '=', true]] : null,
                        }
                    },
                    valueExpr: "altUOMId",
                    displayExpr: "altUOM.name",
                },
            },
            {
                dataField: 'purUOMId',
                caption: l('EntityFieldName:MDMService:Item:PurUnitName'),
                validationRules: [{ type: "required" }],
                dataType: 'string',
                calculateDisplayValue: (e) => e?.purUOM?.name,
                lookup: {
                    dataSource: (options) => {
                        return {
                            store: store.getUOMsGroupDetailStore,
                            filter: options?.data?.uomGroupId ? [["uomGroupId", "=", options.data.uomGroupId || 0], 'and', ['active', '=', true]] : null,
                        }
                    },
                    valueExpr: "altUOMId",
                    displayExpr: "altUOM.name",
                },
            },
            {
                dataField: 'salesUOMId',
                caption: l('EntityFieldName:MDMService:Item:SalesUnitName'),
                validationRules: [{ type: "required" }],
                dataType: 'string',
                visible: false,
                calculateDisplayValue: (e) => e?.salesUOM?.name,
                lookup: {
                    dataSource: (options) => {
                        return {
                            store: store.getUOMsGroupDetailStore,
                            filter: options?.data?.uomGroupId ? [["uomGroupId", "=", options.data.uomGroupId || 0], 'and', ['active', '=', true]] : null,
                        }
                    },
                    valueExpr: "altUOMId",
                    displayExpr: "altUOM.name",
                },

            },
            {
                dataField: 'vatId',
                caption: l('EntityFieldName:MDMService:Item:VATName'),
                calculateDisplayValue: 'vat.name',
                dataType: 'string',
                lookup: {
                    dataSource: {
                        store: store.getVATs,
                    },
                    valueExpr: 'id',
                    displayExpr: 'code'
                },
                validationRules: [{ type: "required" }],
                visible: false,
            },
            {
                dataField: 'basePrice',
                caption: l("EntityFieldName:MDMService:Item:BasePrice"),
                validationRules: [{ type: "required" }],
                dataType: 'number',
                visible: false,
            },
            {
                dataField: 'active',
                caption: l('EntityFieldName:MDMService:Item:Active'),
                alignment: 'center',
                dataType: 'boolean',
            },
            ...getAttrColumn("hierarchy"),
            ...getAttrColumn("flat"),
        ]
    }).dxDataGrid('instance');

    initImportPopup('api/mdm-service/items', 'Items_Template', 'dataGridItemMasters');

    let disableCell = (e, arg) => {
        if (arg) {
            let element = e.editorElement
            e.editorOptions.readOnly = true
        }
    }

    function getAttrField(type) {
        return gridInfo.itemAttr[type].map(({ attrNo, attrName, hierarchyLevel, id }, index) => {
            return {
                dataField: 'attr' + attrNo + 'Id',
            }
        })
    }
    function getAttrColumn(type) {
        return gridInfo.itemAttr[type].map(({ attrNo, attrName, hierarchyLevel, id }, index, arr) => {
            let referenceArrayNo = arr.map(e => e.attrNo)
            referenceArrayNo.shift()
            return {
                dataField: 'attr' + attrNo + 'Id',
                caption: attrName,
                dataType: 'string',
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource: {
                        store: store.getItemAttrValue,
                        filter: ['itemAttributeId', '=', id],
                    }
                },
            }
        })
    }

    function renderAttachmentContent() {
        $('<div class="flex-grow-1"/>').css('height', 'auto')
            .appendTo(gridInfo.attachment.container)
            .dxFileManager({
                rootFolderName: "Item Attachment",
                fileSystemProvider: store.attachmentStore,
                permissions: {
                    delete: true,
                    upload: true,
                    download: true,
                },
                upload: {
                    chunkSize: 5e6,
                    maxFileSize: 5e6,
                },
                selectionMode: "single",
                onFileUploading: (e) => {
                    if (gridInfo.attachment.fileSource.find(v => v.name === e.fileData.name)) {
                        e.errorCode = 1
                        e.cancel = true
                    }
                }
            })
        gridInfo.attachment.isRender = true;
    }

    function renderImageContent() {
        gridInfo.ContextMenu = $('<div/>').dxContextMenu({
            dataSource: [
                {
                    text: "Delete",
                    action: (e) => store.imageStore.remove(e.id).then(() => gridInfo.imageDataSource.reload())
                },
            ],
            target: '.dx-item.dx-tile',
            onItemClick: (e) => e.itemData.action(gridInfo.imageContent.selectedItem)
        }).appendTo('body').dxContextMenu('instance')
        gridInfo.imageContent.list.dxTileView({
            dataSource: gridInfo.imageDataSource,
            direction: 'vertical',
            width: '100%',
            showScrollbar: "always",
            itemTemplate(itemData, itemIndex, itemElement) {
                let image = $('<div>')
                    .addClass('image')
                    .css('background-image', `url(${itemData.url})`);
                $('<span />').addClass('position-absolute badge rounded-pill text-bg-primary').css({ 'top': '0.25rem', 'left': '0.25rem' }).text(itemData.displayOrder).appendTo(image)
                itemElement.append(image);
            },
            onItemContextMenu: (e) => {
                gridInfo.imageContent.selectedItem = e.itemData
            },
            onItemClick(e) {
                console.log(e);
                if (!gridInfo?.imageContent?.popupView) gridInfo.imageContent.popupView = $('<div/>').dxPopup({
                    hideOnOutsideClick: true,
                    onContentReady(e) {
                        const $contentElement = e.component.content();
                        $contentElement.addClass('photo-popup-content');
                    },
                }).appendTo('body').dxPopup('instance');
                gridInfo.imageContent.popupView.option({
                    title: l('EntityFieldName:MDMService:ItemImage:DisplayOrder') + ': ' + e.itemData.displayOrder,
                    maxHeight: '600px',
                    width: 500,
                    contentTemplate: () => {
                        let container = $('<div />').css('height', 'auto')

                        $(`<img src="${e.itemData.url}" class="photo-popup-image" />`).css({ 'height': '400px', 'width': '400px' }).appendTo(container)
                        $($('<div/>').dxTextArea({
                            value: e.itemData.description,
                            readOnly: true,
                            height: '100px',
                            label: l("EntityFieldName:MDMService:ItemImage:Description")
                        })).appendTo(container)
                        return container
                    }
                });
                gridInfo.imageContent.popupView.show()
            }
        }).dxTileView('instance');
        gridInfo.imageContent.controller
        let form = $('<div/>')
            .appendTo(gridInfo.imageContent.controller)

        let description = $('<div class="dx-field-value"/>').dxTextBox({
            name: 'description',
            valueChangeEvent: 'keyup',
            onValueChanged: () => uploadUrl()
        }).dxTextBox('instance')
        $('<div class="dx-field"/>')
            .append($('<div class="dx-field-label"/>').text(l('EntityFieldName:MDMService:ItemImage:Description')))
            .append(description.element())
            .appendTo(form)

        let displayOrder = $('<div class="dx-field-value"/>').dxNumberBox({
            name: 'displayOrder',
            valueChangeEvent: 'keyup',
            format: '#',
            min: 0,
            onValueChanged: () => uploadUrl()
        }).dxNumberBox('instance')
        $('<div class="dx-field"/>')
            .append($('<div class="dx-field-label"/>').text(l('EntityFieldName:MDMService:ItemImage:DisplayOrder')))
            .append(displayOrder.element())
            .appendTo(form)

        let fileUploader = $('<div/>').dxFileUploader({
            accept: 'image/*',
            labelText: "",
            uploadMode: 'useButtons',
            uploadUrl: `/api/mdm-service/item-images?itemId=${gridInfo.editingItem}`,
            selectButtonText: l('Button.New.ItemImage'),
            name: 'inputFile',
            onBeforeSend: (e) => {
                e.request.setRequestHeader('RequestVerificationToken', abp.utils.getCookieValue('XSRF-TOKEN'))
            },
            onUploaded: () => {
                gridInfo.imageDataSource.reload()
            }
        })
            .appendTo(form)
            .dxFileUploader('instance')
        gridInfo.imageContent.isRender = true;


        function uploadUrl() {
            fileUploader.option('uploadUrl', `/api/mdm-service/item-images?itemId=${gridInfo.editingItem}&description=${description.option('value')}&displayOrder=${displayOrder.option('value')}`)
        }
    }


    function renderItemImage(e, itemElement) {
        itemElement.addClass('d-flex justify-content-center align-items-center').css('height', '300px');
        let loadingState = $("<div style='w-100 h-100'/>").dxLoadIndicator({
            height: 75,
            width: 75,
        }).appendTo(itemElement)
        gridInfo.imageDataSource = new DevExpress.data.DataSource({
            store: store.imageStore,
            filter: ['itemId', '=', gridInfo.editingItem],
        })
        gridInfo.imageGallery = $("<div>").hide().dxGallery({
            dataSource: gridInfo.imageDataSource,
            height: 'auto',
            itemTemplate: (item) => {
                let result = $('<div>');
                $('<img>/').attr('src', item.url).css({ 'object-fit': 'contain', 'object-position': 'top', 'height': '300px', 'width': '100%' }).appendTo(result);
                $('<div class="mb-4"/>').dxTextArea({
                    value: item.description,
                    readOnly: true,
                    label: l("EntityFieldName:MDMService:ItemImage:Description")

                }).appendTo(result);
                return result;
            },
            onContentReady: (e) => {
                loadingState.remove()
                itemElement.height('auto')
                e.element.show()
            }
        }).appendTo(itemElement).dxGallery('instance')
    }
});
