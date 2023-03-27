$(function () {
    var l = abp.localization.getResource("OMS");
    var itemMasterService = window.dMSpro.oMS.mdmService.controllers.items.item;
    var itemAttrValueService = window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue;
    var itemAttrService = window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute;
    var itemTypeService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;

    var uomService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;
    var uomGroupService = window.dMSpro.oMS.mdmService.controllers.uOMGroups.uOMGroup;
    var uomGroupDetailService = window.dMSpro.oMS.mdmService.controllers.uOMGroupDetails.uOMGroupDetail;
    var vatService = window.dMSpro.oMS.mdmService.controllers.vATs.vAT;
    let disableColumn = ["inventoryUOMId", "purUOMId", "salesUOMId"]
    /****custom store*****/
    let getUOMsGroupDetaiArr
    var getVATs = new DevExpress.data.CustomStore({
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
            vatService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });
            return deferred.promise();
        },
    });
    var getItemTypes = new DevExpress.data.CustomStore({
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

            itemTypeService.getListDevextremes(args)
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

            var d = new $.Deferred();
            itemTypeService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });
    var getUOMs = new DevExpress.data.CustomStore({
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
            uomService.getListDevextremes(args)
                .done(result => {
                    deferred.resolve(result.data, {
                        totalCount: result.totalCount,
                        summary: result.summary,
                        groupCount: result.groupCount,
                    });
                });
            return deferred.promise();
        },
    });
    var getUOMsGroup = new DevExpress.data.CustomStore({
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
            uomGroupService.getListDevextremes(args)
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
    });
    var getUOMsGroupDetailStore = new DevExpress.data.CustomStore({
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
            uomGroupDetailService.getListDevextremes(args)
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
    });
    // get Item Master
    var itemStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            itemMasterService.getListDevextremes(args)
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

            var d = new $.Deferred();
            itemMasterService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return itemMasterService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return itemMasterService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return itemMasterService.delete(key);
        }
    });

    // get item attribute value
    var getItemAttrValue = new DevExpress.data.CustomStore({
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

            itemAttrValueService.getListDevextremes(args)
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
            var d = new $.Deferred();
            itemAttrValueService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
    });

    var getItemAttr = new DevExpress.data.CustomStore({
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
            itemAttrService.getListDevextremes(args)
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
            var d = new $.Deferred();
            itemAttrService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
    });

    const manageItem = [
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
    ];

    const expiredType = [
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
    ];

    const issueMethod = [
        {
            id: 0,
            text: l('EntityFieldValue:MDMService:Item:IssueMethod:FEFO')
        },
        {
            id: 1,
            text: l('EntityFieldValue:MDMService:Item:IssueMethod:SERIAL')
        }
    ];

    /****control*****/

    var gridItemMasters = $('#dataGridItemMasters').dxDataGrid({
        dataSource: itemStore,
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
                height: '95%',
                width: '95%',
                hideOnOutsideClick: true,
                dragEnabled: false,
            },
            form: {
                labelMode: "outside",
                colCount: 3,
                elementAttr: {
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
                                dataField: 'itemTypeId',
                                // label: l('ItemTypeName'),
                                editorType: 'dxSelectBox',
                            },
                            {
                                dataField: 'barcode',
                                // label: l('Barcode'),
                                dataType: 'string'
                            },
                            {
                                dataField: 'erpCode',
                                // label: l('ERPCode'),
                                dataType: 'string'
                            },
                        ]
                    },
                    // System properties
                    {
                        itemType: 'group',
                        colSpan: 2,
                        items: [
                            {
                                dataField: 'manageItemBy',
                                validationRules: [{ type: 'required' }],
                                editorType: 'dxSelectBox',
                            },
                            {
                                dataField: 'expiredType',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    items: expiredType,
                                    searchEnabled: true,
                                    displayExpr: 'text',
                                    valueExpr: 'id',
                                    disabled: true
                                }
                            },
                            {
                                dataField: 'expiredValue',
                                dataType: 'number',
                                editorOptions: {
                                    disabled: true
                                }
                            },
                            {
                                dataField: 'issueMethod',
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    items: issueMethod,
                                    searchEnabled: true,
                                    displayExpr: 'text',
                                    valueExpr: 'id',
                                    disabled: true
                                }
                            },
                        ]

                    },
                    {
                        itemType: 'group',
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
                    // Tabs Groups
                    {
                        itemType: 'tabbed',
                        colCount: 2,
                        colSpan: 3,
                        tabs: [
                            {
                                title: 'UOM',
                                colCount: 2,
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
                                                store: getVATs,
                                                paginate: true,
                                            },
                                            valueExpr: 'id',
                                            displayExpr: 'code'
                                        }
                                    },
                                    {
                                        dataField: 'basePrice',
                                        validationRules: [{ type: 'required' }]
                                    },
                                    {
                                        dataField: 'active',
                                        dataType: 'boolean',
                                        editorType: 'dxCheckBox'
                                    }
                                ]
                            },
                            // DMS Attributes
                            {
                                title: 'ATTRIBUTE',
                                colCount: 2,
                                items: getAttrOptions()
                            }
                        ],

                    },


                ]
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
        export: {
            enabled: true,
        },
        onExporting(e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Export.xlsx');
                });
            });
            e.cancel = true;
        },
        headerFilter: {
            visible: true,
        },
        stateStoring: {
            enabled: true,
            type: 'localStorage',
            storageKey: 'dataGridItemMasters',
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
            e.data.itemType = 'I';
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
                            var gridControl = e.element.closest('div.dx-datagrid').parent();
                            var gridName = gridControl.attr('id');
                            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
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
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:Item:Code"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
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
                dataField: 'itemTypeId',
                caption: l("EntityFieldName:MDMService:Item:ItemTypeName"),
                editorType: 'dxSelectBox',
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: {
                        store: getItemTypes,
                        filter: ['code', '=', 'MD02'],
                    },
                    valueExpr: 'id',
                    displayExpr: 'valueName'
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
                    dataSource: getUOMsGroup,
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
                    dataSource: manageItem,
                    valueExpr: "id",
                    displayExpr: "text"
                },
                visible: false,
            },
            {
                name: 'ExpiredType',
                dataField: 'expiredType',
                caption: l('EntityFieldName:MDMService:Item:ExpiredType'),
                dataType: 'string',
                lookup: {
                    dataSource: expiredType,
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
                    disabled: true
                }
            },
            {
                dataField: 'issueMethod',
                caption: l('EntityFieldName:MDMService:Item:IssueMethod'),
                lookup: {
                    dataSource: issueMethod,
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
                    disabled: true
                },
                lookup: {
                    dataSource(options) {
                        if (options?.data)
                            return {
                                store: getUOMsGroupDetailStore,
                                filter: ["uomGroupId", "=", options.data.uomGroupId || 0],
                            }
                        return getUOMsGroupDetailStore
                    },
                    valueExpr: "altUOMId",
                    displayExpr: "altUOM.name",
                },
            },
            {
                dataField: 'purUOMId',
                caption: l('EntityFieldName:MDMService:Item:PurUnitName'),
                calculateDisplayValue: "purUOM.name",
                validationRules: [{ type: "required" }],
                visible: false,
                lookup: {
                    dataSource(options) {
                        if (options?.data)
                            return {
                                store: getUOMsGroupDetailStore,
                                filter: ["uomGroupId", "=", options.data.uomGroupId || 0]
                            }
                        return getUOMsGroupDetailStore
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
                                store: getUOMsGroupDetailStore,
                                filter: ["uomGroupId", "=", options.data.uomGroupId || 0]
                            }
                        return getUOMsGroupDetailStore
                    },
                    valueExpr: "altUOMId",
                    displayExpr: "altUOM.name",
                },
            },
            {
                dataField: 'vatId',
                caption: l('EntityFieldName:MDMService:Item:VATName'),
                calculateDisplayValue: 'vat.name',
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
            {
                dataField: 'attr0Id',
                caption: l('EntityFieldName:MDMService:Item:Attr0Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(0)
                    },
                },
            },
            {
                dataField: 'attr1Id',
                caption: l('EntityFieldName:MDMService:Item:Attr1Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(1)
                    },
                },
            },
            {
                dataField: 'attr2Id',
                caption: l('EntityFieldName:MDMService:Item:Attr2Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(2)
                    },
                },
            },
            {
                dataField: 'attr3Id',
                caption: l('EntityFieldName:MDMService:Item:Attr3Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(3)
                    },
                },
            },
            {
                dataField: 'attr4Id',
                caption: l('EntityFieldName:MDMService:Item:Attr4Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(4)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr5Id',
                caption: l('EntityFieldName:MDMService:Item:Attr5Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(5)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr6Id',
                caption: l('EntityFieldName:MDMService:Item:Attr6Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(6)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr7Id',
                caption: l('EntityFieldName:MDMService:Item:Attr7Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(7)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr8Id',
                caption: l('EntityFieldName:MDMService:Item:Attr8Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(8)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr9Id',
                caption: l('EntityFieldName:MDMService:Item:Attr9Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(9)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr10Id',
                caption: l('EntityFieldName:MDMService:Item:Attr10Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(10)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr11Id',
                caption: l('EntityFieldName:MDMService:Item:Attr11Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(11)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr12Id',
                caption: l('EntityFieldName:MDMService:Item:Attr12Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(12)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr13Id',
                caption: l('EntityFieldName:MDMService:Item:Attr13Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(13)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr14Id',
                caption: l('EntityFieldName:MDMService:Item:Attr14Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(14)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr15Id',
                caption: l('EntityFieldName:MDMService:Item:Attr15Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(15)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr16Id',
                caption: l('EntityFieldName:MDMService:Item:Attr16Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(16)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr17Id',
                caption: l('EntityFieldName:MDMService:Item:Attr17Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(17)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr18Id',
                caption: l('EntityFieldName:MDMService:Item:Attr18Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(18)
                    },
                },
                visible: false,
            },
            {
                dataField: 'attr19Id',
                caption: l('EntityFieldName:MDMService:Item:Attr19Name'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "attrValName",
                    dataSource(options) {
                        return dsAttrValue(19)
                    },
                },
                visible: false,
            }
        ]
    }).dxDataGrid('instance');

    /****function*****/
    initImportPopup('api/mdm-service/items', 'Items_Template', 'dataGridItemMasters');

    const dsAttrValue = function (n) {
        return {
            store: getItemAttrValue,
            filter: ['itemAttribute.attrNo', '=', n],
        };
    }

    let disableCell = (e, arg) => {
        if (arg) {
            let element = e.editorElement
            e.editorOptions.disabled = true
            element.parent().css('backgroundColor', "#e2e8f0")
        }
    }

    /**
     * Fetch Attribute Item API
     * @returns {Array} Array Item's dataFields
     */
    function getAttrOptions() {
        let obj = []
        let deferred = $.Deferred();
        itemAttrService
            .getListDevextremes({})
            .done(result => {
                deferred.resolve(result.data);
            })
        deferred.promise().then(data => {
            data.filter(e => e.active).forEach(e => obj.push(generateAttrOptions(e)))
        })
        return obj
    }
    /**
     * Get Attribute Item's dataField
     * @param {Number} attrNo - Attribute Id
     * @returns {object}
     */
    function generateAttrOptions({ attrNo, attrName }) {
        return {
            dataField: 'attr' + attrNo + 'Id',
            label: { text: l(`${attrName}`) },
            editorOptions: {
                valueExpr: "id",
                displayExpr: "attrValName",
                dataSource: dsAttrValue(attrNo)
            },
        }
    }


    function renderItemImage(data, itemElement) {
        // change in future versions
        function getuserImage(userId) {
            var d = new $.Deferred();
            /// Get item src attribute value here 
            Promise.resolve(d.resolve(null))
            return d.promise();
        }

        getuserImage("Customer Id Go Here").done(dataUrl => {
            itemElement.addClass("d-flex flex-column justify-content-center align-items-center");
            itemElement.append($("<img>").attr({
                // https://source.unsplash.com/random/ for testing image size
                // /images/default-avatar-image.jpg for default image size
                src: dataUrl || "/images/default-avatar-image.jpg",
                style: "object-fit:contain;object-position:center center;max-height:200px;max-width:200px;cursor:pointer;border-radius:50%",
            }))
            itemElement.append($("<div>").addClass('mt-3 w-75').attr("id", "file-uploader").dxFileUploader({
                accept: 'image/*',
                uploadMode: 'instantly',
                uploadUrl: 'API_URL_POST', // Upload Image Endpoint Go Here
                selectButtonText: "Choose Image",
                onValueChanged(e) {
                    const files = e.value;
                    if (files.length > 0) {
                        $('#selected-files .selected-item').remove();
                        $.each(files, (i, file) => {
                            const $selectedItem = $('<div />').addClass('selected-item');
                            $selectedItem.append(
                                $('<span />').html(`Name: ${file.name}<br/>`),
                                $('<span />').html(`Size ${file.size} bytes<br/>`),
                                $('<span />').html(`Type ${file.type}<br/>`),
                                $('<span />').html(`Last Modified Date: ${file.lastModifiedDate}`),
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
