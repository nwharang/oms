$(async function () {
    let l = abp.localization.getResource("OMS");
    let l1 = abp.localization.getResource("MdmService");
    let rpcService = {
        itemMasterService: window.dMSpro.oMS.mdmService.controllers.items.item,
        itemAttrValueService: window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue,
        itemAttrService: window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute,
        itemTypeService: window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData,
        uomService: window.dMSpro.oMS.mdmService.controllers.uOMs.uOM,
        uomGroupService: window.dMSpro.oMS.mdmService.controllers.uOMGroups.uOMGroup,
        uomGroupDetailService: window.dMSpro.oMS.mdmService.controllers.uOMGroupDetails.uOMGroupDetail,
        vatService: window.dMSpro.oMS.mdmService.controllers.vATs.vAT,
        itemImageService: window.dMSpro.oMS.mdmService.controllers.itemImages.itemImage,
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
        itemTypes: [
            {
                id: 0,
                text: l1('EntityFieldValue:MDMService:Item:ItemTypes:Item'),
            },
            {
                id: 1,
                text: l1('EntityFieldValue:MDMService:Item:ItemTypes:POSM'),
            },
            {
                id: 2,
                text: l1('EntityFieldValue:MDMService:Item:ItemTypes:Discount'),
            },
            {
                id: 3,
                text: l1('EntityFieldValue:MDMService:Item:ItemTypes:Voucher'),
            }
        ]
    }
    let store = {
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
                        getUOMsGroupDetaiArr = result.data
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
                if (key == 0) return null;

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
    /****custom store*****/
    let defaultItemType, getUOMsGroupDetaiArr;
    let disableColumn = ["inventoryUOMId", "purUOMId", "salesUOMId"], gridInfo = {}


    // get item attribute value
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
                title: 'Item Info',
                showTitle: true,
                height: '99%',
                width: '99%',
                hideOnOutsideClick: false,
                dragEnabled: false,
            },
            form: {
                labelMode: "outside",
                colCount: 6,
                elementAttr: {
                    id: 'formGridAddItemMaster',
                    class: "p-3 mx-auto"
                },
                items: [
                    // Image Placeholder
                    {
                        itemType: "group",
                        caption: 'IMAGE',
                        colSpan: 1,
                        template: renderItemImage // Fix for future versions
                    },
                    // Genaral Info
                    {
                        itemType: 'group',
                        caption: "GENERAL",
                        colSpan: 2,
                        items: [
                            {
                                dataField: 'code',
                                dataType: 'string',
                                validationRules: [{ type: 'required' }]
                            },
                            {
                                dataField: 'name',
                                dataType: 'string',
                                validationRules: [{ type: 'required' }]
                            },
                            {
                                dataField: 'shortName',
                                dataType: 'string'
                            },
                            {
                                dataField: 'itemType',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    dataSource: {
                                        store: enumValue.itemTypes,
                                    },
                                    valueExpr: 'id',
                                    displayExpr: 'text'
                                }
                            },
                            {
                                dataField: 'barcode',
                                dataType: 'string'
                            },
                            {
                                dataField: 'erpCode',
                                dataType: 'string'
                            },
                            {
                                dataField: 'active',
                                dataType: 'boolean',
                                editorType: 'dxCheckBox'
                            }
                        ]
                    },
                    // System properties
                    {
                        caption: "MANAGEMENT",
                        itemType: 'group',
                        colSpan: 2,
                        items: [
                            {
                                dataField: 'manageItemBy',
                                validationRules: [{ type: 'required' }],
                                editorType: 'dxSelectBox',
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
                                                    expiredValue.option('readOnly', true)
                                                    break;
                                                case 1:
                                                    expiredType.option('readOnly', false)
                                                    expiredValue.option('readOnly', false)
                                                    issueMethod.option('value', 0)
                                                    break;
                                                case 2:
                                                    expiredType.option('readOnly', true)
                                                    expiredValue.option('readOnly', true)
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
                                    readOnly: true,
                                }
                            },
                            {
                                name: 'expiredValue',
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
                                name: 'issueMethod',
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
                        ]

                    },
                    // Options
                    {
                        itemType: 'group',
                        caption: 'OPTIONS',
                        colSpan: 1,
                        items: [
                            {
                                dataField: 'isInventoriable',
                                dataType: 'boolean',
                                editorType: 'dxCheckBox'
                            },
                            {
                                dataField: 'isPurchasable',
                                dataType: 'boolean',
                                editorType: 'dxCheckBox'
                            },
                            {
                                dataField: 'isSaleable',
                                dataType: 'boolean',
                                editorType: 'dxCheckBox'
                            },
                        ]

                    },
                    // Sys settings
                    {
                        caption: 'SYSTEM SETTINGS',
                        itemType: 'group',
                        colSpan: 2,
                        items: [
                            {
                                dataField: 'uomGroupId',
                                editorType: 'dxSelectBox',
                            },
                            {
                                dataField: 'inventoryUOMId',
                                validationRules: [{ type: 'required' }],
                                editorType: 'dxSelectBox',
                            },
                            {
                                dataField: 'purUOMId',
                                validationRules: [{ type: 'required' }],
                                editorType: 'dxSelectBox',
                            },
                            {
                                dataField: 'salesUOMId',
                                validationRules: [{ type: 'required' }],
                                editorType: 'dxSelectBox',
                            },
                            {
                                dataField: 'vatId',
                                validationRules: [{ type: 'required' }],
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    dataSource: {
                                        store: store.getVATs,
                                        paginate: true,
                                    },
                                    valueExpr: 'id',
                                    displayExpr: 'code'
                                }
                            },
                            {
                                dataField: 'basePrice',
                                dataType: 'number',
                                editorOptions: {
                                    format: '#,##0',
                                    min: 0
                                },
                                validationRules: [{ type: 'required' }]
                            },
                        ],
                    },
                    // ATTRIBUTE
                    {
                        caption: 'ATTRIBUTE',
                        itemType: 'group',
                        colCount: 2,
                        colSpan: 4,
                        items: [
                            {
                                itemType: 'group',
                                items: getAttrField('hierarchy')
                            },
                            {
                                itemType: 'group',
                                items: getAttrField('flat')
                            },
                        ]
                    },
                ],
                onContentReady: (e) => {
                }
            },
        },
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        // cacheEnabled: true,
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
        ...genaralConfig('Items'),
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
                buttons: ['edit'],
                fixed: true,
                fixedPosition: "left",
            },
            {
                dataField: 'id',
                caption: l("Id"),
                dataType: 'string',
                allowEditing: false,
                visible: false,
                fixed: true,
                fixedPosition: "left",
                formItem: {
                    visible: false
                },
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:Item:Code"),
                dataType: 'string',
                validationRules: [
                    {
                        type: "required"
                    },
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]{1,20}$',
                        message: l('ValidateingCodeField')
                    }
                ]
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
                editorType: 'dxSelectBox',
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
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                },
                visible: false
            },
            {
                dataField: 'isPurchasable',
                caption: l('EntityFieldName:MDMService:Item:IsPurchaseItem'),
                editorType: 'dxCheckBox',
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                },
                visible: false
            },
            {
                dataField: 'isSaleable',
                caption: l('EntityFieldName:MDMService:Item:IsSalesItem'),
                editorType: 'dxCheckBox',
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                },
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
                editorOptions: {
                    // disabled: true
                }
            },
            {
                dataField: 'issueMethod',
                caption: l('EntityFieldName:MDMService:Item:IssueMethod'),
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
                visible: false,
                editorOptions: {
                    readOnly: true
                },
                lookup: {
                    dataSource(options) {
                        if (options?.data)
                            return {
                                store: store.getUOMsGroupDetailStore,
                                filter: ["uomGroupId", "=", options.data.uomGroupId || 0],
                            }
                        return store.getUOMsGroupDetailStore
                    },
                    valueExpr: "altUOMId",
                    displayExpr: "altUOM.name",
                },
            },
            {
                dataField: 'purUOMId',
                caption: l('EntityFieldName:MDMService:Item:PurUnitName'),
                validationRules: [{ type: "required" }],
                // visible: false,
                lookup: {
                    dataSource(options) {
                        if (options?.data?.uomGroupId) {
                            return {
                                store: store.getUOMsGroupDetailStore,
                                filter: ["uomGroupId", "=", options.data.uomGroupId]
                            }
                        }
                        return store.getUOMsGroupDetailStore
                    },
                    valueExpr: "altUOMId",
                    displayExpr: "altUOM.name",
                },
            },
            {
                dataField: 'salesUOMId',
                caption: l('EntityFieldName:MDMService:Item:SalesUnitName'),
                validationRules: [{ type: "required" }],
                visible: false,
                lookup: {
                    dataSource(options) {
                        if (options?.data)
                            return {
                                store: store.getUOMsGroupDetailStore,
                                filter: ["uomGroupId", "=", options.data.uomGroupId || 0],
                                paginate: true,
                            }
                        return store.getUOMsGroupDetailStore
                    },
                    valueExpr: "altUOMId",
                    displayExpr: "altUOM.name",
                },

            },
            {
                dataField: 'vatId',
                caption: l('EntityFieldName:MDMService:Item:VATName'),
                calculateDisplayValue: 'vat.name',
                editorOptions: {
                    searchEnabled: true
                },
                lookup: {
                    dataSource: {
                        store: store.getVATs,
                        paginate: true,
                    },
                    valueExpr: 'id',
                    displayExpr: 'code'
                },
                validationRules: [{ type: "required" }],
                visible: false,
            },
            {
                dataField: 'basePrice',
                caption: 'Base Price',
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'active',
                caption: l('EntityFieldName:MDMService:Item:Active'),
                editorType: 'dxCheckBox',
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                }
            },
            ...getAttrColumn("hierarchy"),
            ...getAttrColumn("flat"),
        ]
    }).dxDataGrid('instance');

    /****function*****/
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
                label: { text: l(`${attrName}`) },
                editorOptions: {
                    valueExpr: "id",
                    // readOnly: type === "hierarchy" && hierarchyLevel != 0,
                    displayExpr: "attrValName",
                    dataSource: {
                        store: store.getItemAttrValue,
                        filter: ['itemAttributeId', '=', id],
                    },
                    onContentReady: (e) => {
                        let selectboxInstance = e.component
                        if (selectboxInstance.option('value')) {
                            selectboxInstance.option('readOnly', false);
                        }
                    },
                    setCellValue: (newData, value, currentRowData) => {
                        newData[`attr${attrNo}Id`] = value;
                        referenceArrayNo.forEach(value => {
                            newData['attr' + value + 'Id'] = null
                        })
                    }
                },
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

    function renderItemImage(data, itemElement) {
        // change in future versions
        function getImage(id) {
            // Sample id : 8998d7c8-bbb6-97c0-bc54-3a09f05f64f5
            let d = new $.Deferred();
            /// Get item src attribute value here 
            Promise.resolve(d.resolve(null))
            // rpcService.itemImageService.getList('')
            return d.promise();
        }

        getImage("Customer Id Go Here").done(dataUrl => {
            itemElement.addClass("d-flex flex-column justify-content-center align-items-center");
            itemElement.append($("<img>").attr({
                // https://source.unsplash.com/random/ for testing image size
                // /images/default-avatar-image.jpg for default image size
                src: dataUrl || "https://source.unsplash.com/random/",
                style: "object-fit:cover;object-position:center center;max-height:150px;max-width:150px;cursor:pointer;border-radius:1rem;",
            }))
            itemElement.append($("<div/>").addClass('mt-3').dxFileUploader({
                accept: 'image/*',
                labelText: "",
                uploadMode: 'instantly',
                uploadUrl: 'API_URL_POST', // Upload Image Endpoint Go Here
                selectButtonText: "Choose Image",
                onValueChanged(e) {
                    const files = e.value;
                    if (files.length > 0) {
                        $('#selected-files .selected-item').remove();
                        $.each(files, (i, file) => {
                            const $selectedItem = $('<div class="selected-item" />')
                            $selectedItem.append(
                                $('<span />').html(`Name: ${file.name}<br/>`),
                            );
                            $selectedItem.appendTo($('#selected-files'));
                        });
                        $('#selected-files').show();
                    } else {
                        $('#selected-files').hide();
                    }
                },
            }))
        })
    }
});
