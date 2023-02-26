$(function () {
    var l = abp.localization.getResource("OMS");
    var itemMasterService = window.dMSpro.oMS.mdmService.controllers.items.item;
    var itemTypeService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;
    var uOMGroupDetailService = window.dMSpro.oMS.mdmService.controllers.uOMGroupDetails.uOMGroupDetail;
    var uOMGroupService = window.dMSpro.oMS.mdmService.controllers.uOMGroups.uOMGroup;
    var vATService = window.dMSpro.oMS.mdmService.controllers.vATs.vAT;
    var itemAttrValueService = window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue;
    var itemAttrService = window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute;
    var priceListService = window.dMSpro.oMS.mdmService.controllers.priceLists.priceList;
    var uomService = window.dMSpro.oMS.mdmService.controllers.uOMs.uOM;
    var itemImageService = window.dMSpro.oMS.mdmService.controllers.itemImages.itemImage;
    var itemAttachmentService = window.dMSpro.oMS.mdmService.controllers.itemAttachments.itemAttachment;

    // get item type list
    var getItemTypes = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            itemTypeService.getListDevextremes({ filter: JSON.stringify(['code', '=', 'MD02']) })
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

    // get item attribute value
    var getItemAttrValue = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            itemAttrValueService.getListDevextremes({})
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
        }
    });
    // get UOM group lookup
    var getUOMGroups = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            uOMGroupService.getListDevextremes({})
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
            uOMGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    // get UOMs detail lookup
    var getUOMGroupDetails = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            uOMGroupDetailService.getListDevextremes({})
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
            uOMGroupDetailService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    // get UOMs
    var getUOMs = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            uomService.getListDevextremes({})
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
            uomService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    // get VATs
    var getVATs = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            vATService.getListDevextremes({})
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
            vATService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    // get price list
    var getPriceList = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            priceListService.getListDevextremes({})
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
            priceListService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
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

    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            itemMasterService.getListDevextremes({})
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
            debugger
            return itemMasterService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return itemMasterService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return itemMasterService.delete(key);
        }
    });

    var itemMaster = {};

    var gridItemMasters = $('#dataGridItemMasters').dxDataGrid({
        dataSource: customStore,
        remoteOperations: true,
        showRowLines: true,
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
                title: l('Menu:MdmService:GroupMenu:ItemMaster'),
                showTitle: true,
                width: '95%',
                height: '90%',
            },
            form: {
                elementAttr: {
                    id: 'formEditing',
                    class: 'formEditing'
                },
                labelMode: 'floating',
                colCount: 10,
                items: [
                    {
                        itemType: 'group',
                        cssClass: 'first-group',
                        colCount: 2,
                        colSpan: 8,
                        items: [
                            {
                                itemType: 'group',
                                caption: 'General',
                                colSpan: 4,
                                items: [
                                    {
                                        dataField: 'code'
                                    },
                                    {
                                        dataField: 'name'
                                    },
                                    {
                                        dataField: 'shortName'
                                    },
                                    {
                                        dataField: 'itemTypeId'
                                    },
                                    {
                                        dataField: 'barcode'
                                    },
                                    {
                                        dataField: 'erpCode',
                                        colSpan: 2
                                    }
                                ]
                            },
                            {
                                itemType: 'group',
                                caption: 'System Information',
                                colSpan: 4,
                                colCount: 2,
                                items: [
                                    {
                                        dataField: 'uomGroupId',
                                        cssClass: 'uomGroup',
                                        colSpan: 2
                                    },
                                    {
                                        itemType: 'group',
                                        items: [
                                            {
                                                dataField: 'isInventoriable'
                                            },
                                            {
                                                dataField: 'isPurchasable'
                                            },
                                            {
                                                dataField: 'isSaleable'
                                            },
                                            {
                                                dataField: 'manageItemBy',
                                                cssClass: 'fieldManageItemBy',
                                            },
                                            {
                                                dataField: 'expiredType',
                                                cssClass: 'fieldExpiredType'
                                            },
                                            {
                                                dataField: 'expiredValue',
                                                cssClass: 'fieldExpiredValue'
                                            },
                                            {
                                                dataField: 'issueMethod',
                                                cssClass: 'fieldIssueMethod'
                                            }
                                        ]
                                    },
                                    {
                                        itemType: 'group',
                                        items: [
                                            {
                                                dataField: 'inventoryUOMId',
                                                cssClass: 'fieldInventoryUOMId'
                                            },
                                            {
                                                dataField: 'purUOMId',
                                                cssClass: 'fieldPurUOMId'
                                            },
                                            {
                                                dataField: 'salesUOMId',
                                                cssClass: 'fieldSalesUOMId'
                                            },
                                            {
                                                dataField: 'vatId'
                                            },
                                            {
                                                dataField: 'basePrice'
                                            },
                                            {
                                                dataField: 'active'
                                            }
                                        ]
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        itemType: 'group',
                        cssClass: 'second-group',
                        caption: 'DMS Attribute',
                        colSpan: 2,
                        items: getAttrOptions()
                    },
                    //{
                    //    itemType: 'group',
                    //    colSpan: 8,
                    //    colCount: 1,
                    //    items: [{
                    //        itemType: 'tabbed',
                    //        tabPanelOptions: {
                    //            deferRendering: false,
                    //        },
                    //        tabs: [
                    //            {
                    //                title: l('Menu:MdmService:ItemImages'),
                    //                icon: "image",
                    //                template: initItemImagesTab()
                    //                //title: 'Images',
                    //                //icon: "isnotblank",
                    //                //badge: "new",
                    //                //template: function (itemData, itemIndex, element) {
                    //                //    const galleryDiv = $("<div style='padding:10px'>")
                    //                //    galleryDiv.dxGallery({
                    //                //        dataSource: items.Images,
                    //                //        height: 'auto',
                    //                //        selectedItem: items.Images[1],
                    //                //        slideshowDelay: 1500,
                    //                //        loop: true
                    //                //    });
                    //                //    galleryDiv.appendTo(element);
                    //                //}
                    //            },
                    //            {
                    //                title: l('Menu:MdmService:ItemAttachments'),
                    //                icon: "attach",
                    //                template: initItemAttachmentTab()
                    //            }
                    //        ]
                    //    }]
                    //}
                ]
            }
        },
        onInitNewRow: function (e) {
            e.data.active = true;
            e.data.isInventoriable = true;
            e.data.isPurchasable = true;
            e.data.isSaleable = true;
        },
        onEditingStart(e) {
            itemMaster = e.data;
        },
        onRowInserting: function (e) {
            if (e.data && e.data.id == 0) {
                e.data.id = null;
            }
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
            //var objectRequire = ['code', 'name', 'shortName', 'barcode', 'erpCode', 'isInventoriable', 'isPurchasable', 'isSaleable', 'manageItemBy', 'inventoryUOMId', 'purUOMId', 'salesUOMId', 'vatId', 'active', 'itemTypeId', 'expiredType', 'expiredValue', 'issueMethod', 'itemTypeId', 'uomGroupId'];
            //for (var property in e.oldData) {
            //    if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
            //        e.newData[property] = e.oldData[property];
            //    }
            //}
        },
        onEditorPreparing: function (e) {
            if (e.dataField == "manageItemBy" && e.parentType == "dataRow") {
                e.editorOptions.onValueChanged = function (arg) {
                    e.setValue(arg.value);
                    if (arg.value == 1) {
                        $('div.fieldExpiredType > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', false);
                        $('div.fieldExpiredValue > div > div.dx-show-invalid-badge').removeClass('dx-state-disabled');
                        $('div.fieldExpiredValue > div > div.dx-show-invalid-badge > div.dx-texteditor-container > div.dx-texteditor-input-container > input').removeAttr('disabled');
                        $('div.fieldIssueMethod > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', false);
                    }
                    else if (arg.value == 0) {
                        $('div.fieldExpiredType > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', true);
                        $('div.fieldExpiredValue > div > div.dx-show-invalid-badge').addClass('dx-state-disabled');
                        $('div.fieldIssueMethod > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', true);
                    }
                    else {
                        $('div.fieldExpiredType > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', true);
                        $('div.fieldExpiredValue > div > div.dx-show-invalid-badge').addClass('dx-state-disabled');
                        $('div.fieldIssueMethod > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', false);
                    }
                }
            }

            if (e.dataField == 'expiredType' && e.parentType == 'dataRow') {
                if (e.row.data.manageItemBy == 1)
                    e.editorOptions.disabled = false
            }

            if (e.dataField == 'expiredValue' && e.parentType == 'dataRow') {
                if (e.row.data.manageItemBy == 1)
                    e.editorOptions.disabled = false
            }

            if (e.dataField == 'issueMethod' && e.parentType == 'dataRow') {
                if (e.row.data.manageItemBy == 1 || e.row.data.manageItemBy == 2)
                    e.editorOptions.disabled = false
            }

            //if (e.dataField == 'uomGroupId' && e.parentType == 'dataRow') {
            //    e.editorOptions.onValueChanged = function (arg) {
            //        e.setValue(arg.value);
            //        // filter inventory dataSource by uomGroupId
            //        var fieldInventoryUOMIdCb = $('div.fieldInventoryUOMId > div > div.dx-selectbox').data('dxSelectBox');
            //        fieldInventoryUOMIdCb.option('disabled', false);
            //        fieldInventoryUOMIdCb.getDataSource().filter(['uomGroupId', '=', arg.value]);
            //        fieldInventoryUOMIdCb.getDataSource().load();

            //        // filter PurUnit dataSource by uomGroupId
            //        var fieldPurUOMIdCb = $('div.fieldPurUOMId > div > div.dx-selectbox').data('dxSelectBox');
            //        fieldPurUOMIdCb.option('disabled', false);
            //        fieldPurUOMIdCb.getDataSource().filter(['uomGroupId', '=', arg.value]);
            //        fieldPurUOMIdCb.getDataSource().load();

            //        // filter SaleUnit dataSource by uomGroupId
            //        var fieldSalesUOMIdCb = $('div.fieldSalesUOMId > div > div.dx-selectbox').data('dxSelectBox');
            //        fieldSalesUOMIdCb.option('disabled', false);
            //        fieldSalesUOMIdCb.getDataSource().filter(['uomGroupId', '=', arg.value]);
            //        fieldSalesUOMIdCb.getDataSource().load();
            //    }
            //}
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        gridItemMasters.addRow();
                    },
                },
                'columnChooserButton',
                "exportButton",
                {
                    location: 'after',
                    template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
                    onClick() {
                        //todo
                    },
                },
                "searchPanel"
            ]
        },
        columns: [
            {
                type: 'buttons',
                caption: l('Actions'),
                buttons: ['edit'],
                fixedPosition: 'left'
            },
            {
                dataField: 'id',
                visible: false
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
                lookup: {
                    dataSource: getItemTypes,
                    valueExpr: 'id',
                    displayExpr: 'valueName'
                }
            },
            {
                dataField: 'barcode',
                caption: l("EntityFieldName:MDMService:Item:Barcode"),
                dataType: 'string',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: 'erpCode',
                caption: l("EntityFieldName:MDMService:Item:ERPCode"),
                dataType: 'string'
            },
            {
                dataField: 'uomGroupId',
                caption: l('EntityFieldName:MDMService:Item:UOMGroupCode'),
                editorType: 'dxSelectBox',
                editorOptions: {
                    dataSource: getUOMGroups,
                    valueExpr: 'id',
                    displayExpr: 'code'
                },
                visible: false
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
                editorType: 'dxSelectBox',
                editorOptions: {
                    items: manageItem,
                    searchEnabled: true,
                    displayExpr: 'text',
                    valueExpr: 'id'
                },
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                name: 'ExpiredType',
                dataField: 'expiredType',
                caption: l('EntityFieldName:MDMService:Item:ExpiredType'),
                editorType: 'dxSelectBox',
                editorOptions: {
                    items: expiredType,
                    searchEnabled: true,
                    displayExpr: 'text',
                    valueExpr: 'id',
                    disabled: true
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
                editorType: 'dxSelectBox',
                editorOptions: {
                    items: issueMethod,
                    searchEnabled: true,
                    displayExpr: 'text',
                    valueExpr: 'id',
                    disabled: true
                },
                visible: false
            },
            {
                dataField: 'inventoryUOMId',
                caption: l('EntityFieldName:MDMService:Item:InventoryUnitName'),
                editorType: 'dxSelectBox',
                editorOptions: {
                    dataSource: getUOMs,
                    valueExpr: 'id',
                    displayExpr: 'code',
                    //disabled: true
                },
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'purUOMId',
                caption: l('EntityFieldName:MDMService:Item:PurUnitName'),
                editorType: 'dxSelectBox',
                editorOptions: {
                    dataSource: getUOMs,
                    valueExpr: 'id',
                    displayExpr: 'code',
                    //disabled: true
                },
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'salesUOMId',
                caption: l('EntityFieldName:MDMService:Item:SalesUnitName'),
                editorType: 'dxSelectBox',
                editorOptions: {
                    dataSource: getUOMs,
                    valueExpr: 'id',
                    displayExpr: 'code',
                    //disabled: true
                },
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'vatId',
                caption: l('EntityFieldName:MDMService:Item:VATName'),
                editorType: 'dxSelectBox',
                editorOptions: {
                    dataSource: getVATs,
                    valueExpr: 'id',
                    displayExpr: 'code'
                },
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'basePrice',
                caption: 'Base Price',
                //editorType: 'dxSelectBox',
                //editorOptions: {
                //    dataSource: getPriceList,
                //    valueExpr: 'id',
                //    displayExpr: 'code'
                //},
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
                //visible: false
            },
            {
                dataField: 'attr0Id',
                caption: l('EntityFieldName:MDMService:Item:Attr0Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr1Id',
                caption: l('EntityFieldName:MDMService:Item:Attr1Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr2Id',
                caption: l('EntityFieldName:MDMService:Item:Attr2Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr3Id',
                caption: l('EntityFieldName:MDMService:Item:Attr3Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr4Id',
                caption: l('EntityFieldName:MDMService:Item:Attr4Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr5Id',
                caption: l('EntityFieldName:MDMService:Item:Attr5Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr6Id',
                caption: l('EntityFieldName:MDMService:Item:Attr6Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr7Id',
                caption: l('EntityFieldName:MDMService:Item:Attr7Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr8Id',
                caption: l('EntityFieldName:MDMService:Item:Attr8Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr9Id',
                caption: l('EntityFieldName:MDMService:Item:Attr9Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr10Id',
                caption: l('EntityFieldName:MDMService:Item:Attr10Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr11Id',
                caption: l('EntityFieldName:MDMService:Item:Attr11Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr12Id',
                caption: l('EntityFieldName:MDMService:Item:Attr12Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr13Id',
                caption: l('EntityFieldName:MDMService:Item:Attr13Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr14Id',
                caption: l('EntityFieldName:MDMService:Item:Attr14Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr15Id',
                caption: l('EntityFieldName:MDMService:Item:Attr15Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr16Id',
                caption: l('EntityFieldName:MDMService:Item:Attr16Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr17Id',
                caption: l('EntityFieldName:MDMService:Item:Attr17Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr18Id',
                caption: l('EntityFieldName:MDMService:Item:Attr18Name'),
                editorType: 'dxSelectBox',
                visible: false
            },
            {
                dataField: 'attr19Id',
                caption: l('EntityFieldName:MDMService:Item:Attr19Name'),
                editorType: 'dxSelectBox',
                visible: false
            }
        ]
    }).dxDataGrid('instance');

    //$("#NewItemMasterButton").click(function (e) {
    //    gridItemMasters.addRow();
    //    //var w = window.open('/Mdm/ItemMasters/Details');
    //    //w.sessionStorage.setItem('itemMasters', null);
    //});

    //$("input#Search").on("input", function () {
    //    gridItemMasters.searchByText($(this).val());
    //});

    //$("#ExportToExcelButton").click(function (e) {
    //    e.preventDefault();

    //    itemMasterService.getDownloadToken().then(
    //        function (result) {
    //            var url = abp.appPath + 'api/mdm-service/items/as-excel-file' +
    //                abp.utils.buildQueryString([
    //                    { name: 'downloadToken', value: result.token }
    //                ]);

    //            var downloadWindow = window.open(url, '_blank');
    //            downloadWindow.focus();
    //        }
    //    )
    //});

    var listAttrValue = [];

    function getAttrOptions() {
        const options = [];

        const def = $.Deferred();
        itemAttrValueService.getListDevextremes({})
            .done(r => {
                def.resolve(r.data, {
                    totalCount: r.totalCount,
                    summary: r.summary,
                    groupCount: r.groupCount
                })
            })
        def.promise().then(attrVal => {
            listAttrValue = attrVal;
        })

        const deferred = $.Deferred();
        itemAttrService.getListDevextremes({})
            .done(result => {
                deferred.resolve(result.data, {
                    totalCount: result.totalCount,
                    summary: result.summary,
                    groupCount: result.groupCount,
                });
            });
        deferred.promise().then(u => {
            var listAttrActive = u.filter(x => x.active == true);
            for (let i = 0; i < listAttrActive.length; i++) {
                options.push(generateAttrOptions(listAttrActive[i]))
            }
        });
        return options;
    }

    function generateAttrOptions(attr) {
        return {
            dataField: 'attr' + attr.attrNo + 'Id',
            label: {
                text: attr.attrName
            },
            editorOptions: {
                dataSource: listAttrValue.filter(x => x.itemAttributeId == attr.id),
                valueExpr: 'id',
                displayExpr: 'attrValName'
            }
        }
    }

    function initItemImagesTab() {
        return function () {
            return $('<div id="gridItemImages">')
                .dxDataGrid({
                    dataSource: getDataSourceImagesGrid(itemMaster.id),
                    remoteOperations: true,
                    showBorders: true,
                    focusedRowEnabled: true,
                    allowColumnReordering: false,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
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
                        storageKey: 'gridItemImages',
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
                        mode: 'row',
                        allowAdding: true,
                        allowUpdating: true,
                        allowDeleting: true,
                        useIcons: true,
                        texts: {
                            editRow: l("Edit"),
                            deleteRow: l("Delete"),
                            confirmDeleteMessage: l("DeleteConfirmationMessage")
                        }
                    },
                    onRowInserting: function (e) {
                        e.data.itemId = itemMaster.id;
                    },
                    onRowUpdating: function (e) {
                        e.newData = Object.assign({}, e.oldData, e.newData);
                    },
                    toolbar: {
                        items: [
                            {
                                location: 'after',
                                template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                                onClick() {
                                    $('#gridItemImages').data('dxDataGrid').addRow();
                                },
                            },
                            'columnChooserButton',
                            "exportButton",
                            {
                                location: 'after',
                                template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
                                onClick() {
                                    //todo
                                },
                            },
                            'searchPanel'
                        ]
                    },
                    columns: [
                        {
                            type: 'buttons',
                            caption: l("Actions"),
                            width: 90,
                            buttons: ['edit', 'delete'],
                            fixedPosition: 'left'
                        },
                        {
                            dataField: 'url',
                            caption: l('EntityFieldName:MDMService:ItemImage:URL'),
                            dataType: 'string',
                            validationRules: [{ type: "required" }]
                        },
                        {
                            dataField: 'description',
                            caption: l('EntityFieldName:MDMService:ItemImage:Description'),
                            dataType: 'string'
                        },
                        {
                            dataField: 'displayOrder',
                            caption: l('EntityFieldName:MDMService:ItemImage:DisplayOrder'),
                            dataType: 'number',
                            validationRules: [{ type: "required" }]
                        },
                        {
                            dataField: 'active',
                            caption: l('EntityFieldName:MDMService:ItemImage:Active'),
                            width: 110,
                            alignment: 'center',
                            dataType: 'boolean',
                            cellTemplate(container, options) {
                                $('<div>')
                                    .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                                    .appendTo(container);
                            }
                        }
                    ]
                })
        }
    }

    function initItemAttachmentTab() {
        return function () {
            return $('<div id="gridItemAttachment">')
                .dxDataGrid({
                    dataSource: getDataSourceAttachmentGrid(itemMaster.id),
                    remoteOperations: true,
                    showBorders: true,
                    focusedRowEnabled: true,
                    allowColumnReordering: false,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
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
                        storageKey: 'gridItemAttachment',
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
                        mode: 'row',
                        allowAdding: true,
                        allowUpdating: true,
                        allowDeleting: true,
                        useIcons: true,
                        texts: {
                            editRow: l("Edit"),
                            deleteRow: l("Delete"),
                            confirmDeleteMessage: l("DeleteConfirmationMessage")
                        }
                    },
                    onRowInserting: function (e) {
                        e.data.itemId = itemMaster.id;
                    },
                    onRowUpdating: function (e) {
                        e.newData = Object.assign({}, e.oldData, e.newData);
                    },
                    toolbar: {
                        items: [
                            {
                                location: 'after',
                                template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                                onClick() {
                                    $('#gridItemAttachment').data('dxDataGrid').addRow();
                                },
                            },
                            'columnChooserButton',
                            "exportButton",
                            {
                                location: 'after',
                                template: `<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" title="${l("ImportFromExcel")}" style="height: 36px;"> <i class="fa fa-upload"></i> <span></span> </button>`,
                                onClick() {
                                    //todo
                                },
                            },
                            'searchPanel'
                        ]
                    },
                    columns: [
                        {
                            type: 'buttons',
                            caption: l("Actions"),
                            width: 90,
                            buttons: ['edit', 'delete'],
                            fixedPosition: 'left'
                        },
                        {
                            dataField: 'url',
                            caption: l('EntityFieldName:MDMService:ItemAttachment:URL'),
                            dataType: 'string',
                            validationRules: [{ type: "required" }]
                        },
                        {
                            dataField: 'description',
                            caption: l('EntityFieldName:MDMService:ItemAttachment:Description'),
                            dataType: 'string'
                        },
                        {
                            dataField: 'active',
                            caption: l('EntityFieldName:MDMService:ItemAttachment:Active'),
                            width: 110,
                            alignment: 'center',
                            dataType: 'boolean',
                            cellTemplate(container, options) {
                                $('<div>')
                                    .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                                    .appendTo(container);
                            }
                        }
                    ]
                })
        }
    }

    function getDataSourceImagesGrid(itemId) {
        return new DevExpress.data.CustomStore({
            key: "id",
            load(loadOptions) {
                const deferred = $.Deferred();
                itemImageService.getListDevextremes({ filter: JSON.stringify(['itemId', '=', itemId]) })
                    .done(result => {
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

                var d = new $.Deferred();
                itemImageService.get(key)
                    .done(data => {
                        d.resolve(data);
                    })
                return d.promise();
            },
            insert(values) {
                return itemImageService.create(values, { contentType: 'application/json' });
            },
            update(key, values) {
                return itemImageService.update(key, values, { contentType: 'application/json' });
            },
            remove(key) {
                return itemImageService.delete(key);
            }
        });
    }

    function getDataSourceAttachmentGrid(itemId) {
        return new DevExpress.data.CustomStore({
            key: "id",
            load(loadOptions) {
                const deferred = $.Deferred();
                itemAttachmentService.getListDevextremes({ filter: JSON.stringify(['itemId', '=', itemId]) })
                    .done(result => {
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

                var d = new $.Deferred();
                itemAttachmentService.get(key)
                    .done(data => {
                        d.resolve(data);
                    })
                return d.promise();
            },
            insert(values) {
                return itemAttachmentService.create(values, { contentType: 'application/json' });
            },
            update(key, values) {
                return itemAttachmentService.update(key, values, { contentType: 'application/json' });
            },
            remove(key) {
                return itemAttachmentService.delete(key);
            }
        });
    }
});