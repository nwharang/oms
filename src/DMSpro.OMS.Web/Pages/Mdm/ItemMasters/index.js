$(function () {
    var l = abp.localization.getResource("MdmService");
    var itemMasterService = window.dMSpro.oMS.mdmService.controllers.items.item;
    var itemTypeService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;
    var uOMGroupDetailService = window.dMSpro.oMS.mdmService.controllers.uOMGroupDetails.uOMGroupDetail;
    var uOMGroupService = window.dMSpro.oMS.mdmService.controllers.uOMGroups.uOMGroup;
    var vATService = window.dMSpro.oMS.mdmService.controllers.vATs.vAT;
    var itemAttrValueService = window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue;
    var itemAttrService = window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    // get item type list
    var getItemTypes = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "processed",
        load(loadOptions) {
            if (loadOptions.filter == undefined)
                loadOptions.filter = ['code', '=', 'MD02']
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

    // get item attribute value
    var getItemAttrValue = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "processed",
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
        }
    });
    // get UOM group lookup
    var getUOMGroups = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "processed",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            uOMGroupService.getListDevextremes(args)
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
        loadMode: "processed",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            uOMGroupDetailService.getListDevextremes(args)
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

    // get VATs
    var getVATs = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "processed",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            vATService.getListDevextremes(args)
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

    //itemAttrService.getListDevextremes({})
    //    .done(result => {
    //        var data = result.data;
    //    });


    // get item Attribute


    //const items = {
    //    ID: 1,
    //    Code: 'IT0001',
    //    Name: 'Trà Thảo Mộc Dr Thanh',
    //    ShortName: 'Dr Thanh',
    //    ERPCode: 'ERP0001',
    //    ItemType: 'Items',
    //    UOMGroup: 'Items',
    //    Barcode: '452SDAF2121DF',
    //    IsPurchaseItem: true,
    //    IsSalesItem: true,
    //    IsInventoryItem: true,
    //    ManageItemBy: 'LOT',
    //    ExpiredType: 'Day',
    //    ExpiredValue: '30',
    //    IssueMethod: 'FIFO',
    //    ManageItemBy: 'None',
    //    VAT: '5%',
    //    IsActive: true,
    //    InventoryUnit: 'CHAI',
    //    PurUnit: 'THUNG',
    //    salesUOMId: 'CHAI',
    //    Attr0: 'Attr0',
    //    Attr1: 'Attr1',
    //    Attr2: 'Attr2',
    //    Attr3: 'Attr3',
    //    Attr4: 'Attr4',
    //    Attr5: 'Attr5',
    //    Attr6: 'Attr6',
    //    Attr7: 'Attr7',
    //    Attr8: 'Attr8',
    //    Attr9: 'Attr9',
    //    Inactive: false,
    //    Images: [
    //        {
    //            imageAlt: "Maria",
    //            imageSrc: "https://cf.shopee.vn/file/d20fd2da8ca9a0b0d6bf6d1740f09462"
    //        },
    //        {
    //            imageAlt: "Maria",
    //            imageSrc: "https://cf.shopee.vn/file/d20fd2da8ca9a0b0d6bf6d1740f09462"
    //        }
    //    ],
    //    Attachments: ['Attachment 1', 'Attachment 2'],
    //};

    const manageItem = [
        {
            id: 'NONE',
            text: l('EntityFieldValue:MDMService:Item:ManageItemBy:NONE')
        },
        {
            id: 'LOT',
            text: l('EntityFieldValue:MDMService:Item:ManageItemBy:LOT')
        },
        {
            id: 'SERIAL',
            text: l('EntityFieldValue:MDMService:Item:ManageItemBy:SERIAL')
        }
    ];
    const expiredType = [
        {
            id: 'DAY',
            text: l('EntityFieldValue:MDMService:Item:ExpiredType:DAY')
        },
        {
            id: 'WEEK',
            text: l('EntityFieldValue:MDMService:Item:ExpiredType:WEEK')
        },
        {
            id: 'MONTH',
            text: l('EntityFieldValue:MDMService:Item:ExpiredType:MONTH')
        },
        {
            id: 'YEAR',
            text: l('EntityFieldValue:MDMService:Item:ExpiredType:YEAR')
        }
    ];
    const issueMethod = [
        {
            id: 'FEFO',
            text: l('EntityFieldValue:MDMService:Item:IssueMethod:FEFO')
        },
        {
            id: 'SERIAL',
            text: l('EntityFieldValue:MDMService:Item:IssueMethod:SERIAL')
        }
    ];

    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "processed",
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

    var gridItemMasters = $('#dataGridItemMasters').dxDataGrid({
        dataSource: customStore,
        keyExpr: 'id',
        remoteOperations: true,
        showBorders: true,
        autoExpandAll: true,
        focusedRowEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        errorRowEnabled: false,
        filterRow: {
            visible: true
        },
        searchPanel: {
            visible: true
        },
        scrolling: {
            mode: 'standard'
        },
        paging: {
            enabled: true,
            pageSize: 10
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100],
            showInfo: true,
            showNavigationButtons: true
        },
        editing: {
            mode: 'popup',
            allowAdding: abp.auth.isGranted('MdmService.Items.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.Items.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.Items.Delete'),
            useIcons: true,
            popup: {
                title: l("Page.Title.Items"),
                showTitle: true,
                width: '95%',
                height: '100%'
            },
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
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
                                        colSpan: 2,
                                        editorOptions: {
                                            onValueChanged: function (e) {
                                                // filter inventory dataSource by uomGroupId
                                                var fieldInventoryUOMIdCb = $('div.fieldInventoryUOMId > div > div.dx-selectbox').data('dxSelectBox');
                                                fieldInventoryUOMIdCb.option('disabled', false);
                                                fieldInventoryUOMIdCb.getDataSource().filter(['uomGroupId', '=', e.value]);
                                                fieldInventoryUOMIdCb.getDataSource().load();

                                                // filter PurUnit dataSource by uomGroupId
                                                var fieldPurUOMIdCb = $('div.fieldPurUOMId > div > div.dx-selectbox').data('dxSelectBox');
                                                fieldPurUOMIdCb.option('disabled', false);
                                                fieldPurUOMIdCb.getDataSource().filter(['uomGroupId', '=', e.value]);
                                                fieldPurUOMIdCb.getDataSource().load();

                                                // filter SaleUnit dataSource by uomGroupId
                                                var fieldSalesUOMIdCb = $('div.fieldSalesUOMId > div > div.dx-selectbox').data('dxSelectBox');
                                                fieldSalesUOMIdCb.option('disabled', false);
                                                fieldSalesUOMIdCb.getDataSource().filter(['uomGroupId', '=', e.value]);
                                                fieldSalesUOMIdCb.getDataSource().load();
                                            }
                                        }
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
                                                editorOptions: {
                                                    onValueChanged: function (e) {
                                                        if (e.value == 'LOT') {
                                                            $('div.fieldExpiredType > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', false);
                                                            $('div.fieldExpiredValue > div > div.dx-show-invalid-badge').removeClass('dx-state-disabled');
                                                            $('div.fieldExpiredValue > div > div.dx-show-invalid-badge > div.dx-texteditor-container > div.dx-texteditor-input-container > input').removeAttr('disabled');
                                                            $('div.fieldIssueMethod > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', false);
                                                        }
                                                        else if (e.value == 'NONE') {
                                                            $('div.fieldExpiredType > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', true);
                                                            $('div.fieldExpiredValue > div > div.dx-show-invalid-badge').addClass('dx-state-disabled');
                                                            $('div.fieldIssueMethod > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', true);
                                                        }
                                                        else {
                                                            $('div.fieldExpiredType > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', true);
                                                            $('div.fieldExpiredValue > div > div.dx-show-invalid-badge').addClass('dx-state-disabled');
                                                            $('div.fieldIssueMethod > div > div.dx-show-invalid-badge').data('dxSelectBox').option('disabled', false);
                                                        }
                                                        return e.value;
                                                    }
                                                }
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
                        //items: [
                        //{
                        //    //itemAttrActiveData.forEach(function (item) {
                        //    //    debugger
                        //    //})
                        //    dataField: 'attr0Id'
                        //},
                        //{
                        //    dataField: 'attr1Id'
                        //},
                        //{
                        //    dataField: 'attr2Id'
                        //},
                        //{
                        //    dataField: 'attr3Id'
                        //},
                        //{
                        //    dataField: 'attr4Id'
                        //},
                        //{
                        //    dataField: 'attr5Id'
                        //},
                        //{
                        //    dataField: 'attr6Id'
                        //},
                        //{
                        //    dataField: 'attr7Id'
                        //},
                        //{
                        //    dataField: 'attr8Id'
                        //},
                        //{
                        //    dataField: 'attr9Id'
                        //}
                        //]
                    }
                    //{
                    //    itemType: 'group',
                    //    colSpan: 8,
                    //    items: [{
                    //        itemType: 'tabbed',
                    //        tabPanelOptions: {
                    //            deferRendering: false,
                    //        },
                    //        tabs: [
                    //            {
                    //                title: 'Images',
                    //                icon: "isnotblank",
                    //                badge: "new",
                    //                template: function (itemData, itemIndex, element) {
                    //                    const galleryDiv = $("<div style='padding:10px'>")
                    //                    galleryDiv.dxGallery({
                    //                        dataSource: items.Images,
                    //                        height: 'auto',
                    //                        selectedItem: items.Images[1],
                    //                        slideshowDelay: 1500,
                    //                        loop: true
                    //                    });
                    //                    galleryDiv.appendTo(element);
                    //                }
                    //            },
                    //            {
                    //                title: 'Attachments',
                    //                items: ['Attachments']
                    //            }
                    //        ]
                    //    }]
                    //    }
                ]
            }
        },
        onRowInserting: function (e) {
            if (e.data && e.data.id == 0) {
                e.data.id = null;
            }
        },
        onRowUpdating: function (e) {
            var objectRequire = ['code', 'name', 'shortName', 'barcode', 'erpCode', 'isInventoriable', 'isPurchasable', 'isSaleable', 'manageItemBy', 'inventoryUOMId', 'purUOMId', 'salesUOMId', 'vatId', 'active', 'itemTypeId', 'expiredType', 'expiredValue', 'issueMethod', 'itemTypeId', 'uomGroupId'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        toolbar: {
            items: [
                {
                    name: "searchPanel",
                    location: 'after'
                }
            ]
        },
        columns: [
            {
                type: 'buttons',
                caption: l('Actions'),
                buttons: ['edit', 'delete'],
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
                visible: false
            },
            {
                dataField: 'isPurchasable',
                caption: l('EntityFieldName:MDMService:Item:IsPurchaseItem'),
                editorType: 'dxCheckBox',
                visible: false
            },
            {
                dataField: 'isSaleable',
                caption: l('EntityFieldName:MDMService:Item:IsSalesItem'),
                editorType: 'dxCheckBox',
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
                    dataSource: getUOMGroupDetails,
                    valueExpr: 'altUOMId',
                    displayExpr: 'altUOMId',
                    disabled: true
                },
                onContentReady: function (e) {
                    debugger
                },
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'purUOMId',
                caption: l('EntityFieldName:MDMService:Item:PurUnitName'),
                editorType: 'dxSelectBox',
                editorOptions: {
                    dataSource: getUOMGroupDetails,
                    valueExpr: 'altUOMId',
                    displayExpr: 'altUOMId',
                    disabled: true
                },
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'salesUOMId',
                caption: l('EntityFieldName:MDMService:Item:SalesUnitName'),
                editorType: 'dxSelectBox',
                editorOptions: {
                    dataSource: getUOMGroupDetails,
                    valueExpr: 'altUOMId',
                    displayExpr: 'altUOMId',
                    disabled: true
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
                dataField: 'active',
                caption: l('EntityFieldName:MDMService:Item:Active'),
                editorType: 'dxCheckBox',
                visible: false
            },
            {
                dataField: 'attr0Id',
                caption: l('EntityFieldName:MDMService:Item:Attr0Name'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: [
                        {
                            attrValName: "Nước ngọt",
                            id: "eb4c4b72-a241-f928-b3c2-3a08db7a3a8d"
                        },
                        {
                            attrValName: "Sữa",
                            id: "eb4c4b72-a241-f928-b3c2-3a08db7a3a8d"
                        }
                    ],
                    displayExpr: "attrValName",
                    valueExpr: "id"
                },
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr1Id',
                caption: l('EntityFieldName:MDMService:Item:Attr1Name'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: [
                        {
                            attrValName: "Nước ngọt có gas",
                            id: "eb4c4b72-a241-f928-b3c2-3a08db7a3a8d"
                        },
                        {
                            attrValName: "Sữa tươi",
                            id: "eb4c4b72-a241-f928-b3c2-3a08db7a3a8d"
                        }
                    ],
                    displayExpr: "attrValName",
                    valueExpr: "id"
                },
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr2Id',
                caption: l('EntityFieldName:MDMService:Item:Attr2Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr3Id',
                caption: l('EntityFieldName:MDMService:Item:Attr3Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr4Id',
                caption: l('EntityFieldName:MDMService:Item:Attr4Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr5Id',
                caption: l('EntityFieldName:MDMService:Item:Attr5Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr6Id',
                caption: l('EntityFieldName:MDMService:Item:Attr6Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr7Id',
                caption: l('EntityFieldName:MDMService:Item:Attr7Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr8Id',
                caption: l('EntityFieldName:MDMService:Item:Attr8Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr9Id',
                caption: l('EntityFieldName:MDMService:Item:Attr9Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr10Id',
                caption: l('EntityFieldName:MDMService:Item:Attr10Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr11Id',
                caption: l('EntityFieldName:MDMService:Item:Attr11Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr12Id',
                caption: l('EntityFieldName:MDMService:Item:Attr12Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr13Id',
                caption: l('EntityFieldName:MDMService:Item:Attr13Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr14Id',
                caption: l('EntityFieldName:MDMService:Item:Attr14Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr15Id',
                caption: l('EntityFieldName:MDMService:Item:Attr15Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr16Id',
                caption: l('EntityFieldName:MDMService:Item:Attr16Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr17Id',
                caption: l('EntityFieldName:MDMService:Item:Attr17Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr18Id',
                caption: l('EntityFieldName:MDMService:Item:Attr18Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            },
            {
                dataField: 'attr19Id',
                caption: l('EntityFieldName:MDMService:Item:Attr19Name'),
                editorType: 'dxSelectBox',
                //lookup: {
                //    dataSource: getItemAttrValue,
                //    valueExpr: 'id',
                //    displayExpr: 'attrValName'
                //},
                visible: false
            }
        ]
    }).dxDataGrid('instance');

    $("#NewItemMasterButton").click(function (e) {
        gridItemMasters.addRow();
    });

    $("input#Search").on("input", function () {
        gridItemMasters.searchByText($(this).val());
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        itemMasterService.getDownloadToken().then(
            function (result) {
                var url = abp.appPath + 'api/mdm-service/items/as-excel-file' +
                    abp.utils.buildQueryString([
                        { name: 'downloadToken', value: result.token }
                    ]);

                var downloadWindow = window.open(url, '_blank');
                downloadWindow.focus();
            }
        )
    });

    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }

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
});