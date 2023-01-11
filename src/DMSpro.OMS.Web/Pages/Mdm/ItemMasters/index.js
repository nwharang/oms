$(function () {
    var l = abp.localization.getResource("MdmService");
    var itemMasterService = window.dMSpro.oMS.mdmService.controllers.items.item;
    var itemTypeService = window.dMSpro.oMS.mdmService.controllers.systemDatas.systemData;

    // get item type list
    var itemTypeList = [];
    var urlItemTypeLookup = abp.appPath + 'api/mdm-service/items/system-data-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    $.ajax({
        url: `${urlItemTypeLookup}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            itemTypeList = data.items;
        }
    });
    var getItemTypes = function () {
        return itemTypeList;
    }

    // get UOM group lookup
    var UOMGroups = [];
    var urlUOMGroupLookup = abp.appPath + 'api/mdm-service/items/u-oMGroup-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    $.ajax({
        url: `${urlUOMGroupLookup}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            UOMGroups = data.items;
        }
    });
    var getUOMGroups = function () {
        return UOMGroups;
    }

    // get UOMs lookup
    var UOMs = [];
    var urlUOMsLookup = abp.appPath + 'api/mdm-service/items/u-oM-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    $.ajax({
        url: `${urlUOMsLookup}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            UOMs = data.items;
        }
    });
    var getUOMs = function () {
        return UOMs;
    }

    // get VATs
    var VATs = [];
    var urlVATsLookup = abp.appPath + 'api/mdm-service/items/v-aT-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    $.ajax({
        url: `${urlVATsLookup}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            VATs = data.items;
        }
    });
    var getVATs = function () {
        return VATs;
    }

    // get Product Attribute
    var ProductAttrs = [];
    var urlProductAttrsLookup = abp.appPath + 'api/mdm-service/items/item-attribute-value-lookup' +
        abp.utils.buildQueryString([
            { name: 'maxResultCount', value: 1000 }
        ]);
    $.ajax({
        url: `${urlProductAttrsLookup}`,
        dataType: 'json',
        async: false,
        success: function (data) {
            ProductAttrs = data.items;
        }
    });
    var getProductAttr = function () {
        return ProductAttrs;
    }

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

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
    //    SalesUnit: 'CHAI',
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

    const manageItem = ['NONE', 'LOT', 'SERIAL'];
    const expiredType = ['Day', 'Week', 'Month', 'Year'];
    const issueMethod = ['FEFO', 'Serial'];

    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
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

    var customItemType = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
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
            itemMasterService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
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
        //columnHidingEnabled: true,
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
                //formData: items,
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
                                        colSpan: 2,
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
                                        colSpan: 2
                                    },
                                    {
                                        itemType: 'group',
                                        items: [
                                            {
                                                dataField: 'inventoriable'
                                            },
                                            {
                                                dataField: 'purchasble'
                                            },
                                            {
                                                dataField: 'saleable'
                                            },
                                            {
                                                dataField: 'manageType'
                                            },
                                            {
                                                dataField: 'expiredType'
                                            },
                                            {
                                                dataField: 'expiredValue'
                                            },
                                            {
                                                dataField: 'issueMethod'
                                            }
                                        ]
                                    },
                                    {
                                        itemType: 'group',
                                        items: [
                                            {
                                                dataField: 'inventoryUnitId'
                                            },
                                            {
                                                dataField: 'purUnitId'
                                            },
                                            {
                                                dataField: 'salesUnit'
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
                        items: [
                            {
                                dataField: 'attr0Id'
                            },
                            {
                                dataField: 'attr1Id'
                            },
                            {
                                dataField: 'attr2Id'
                            },
                            {
                                dataField: 'attr3Id'
                            },
                            {
                                dataField: 'attr4Id'
                            },
                            {
                                dataField: 'attr5Id'
                            },
                            {
                                dataField: 'attr6Id'
                            },
                            {
                                dataField: 'attr7Id'
                            },
                            {
                                dataField: 'attr8Id'
                            },
                            {
                                dataField: 'attr9Id'
                            }
                        ]
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
            var objectRequire = ['code', 'name', 'barcode', 'inventoriable', 'purchasble', 'saleable', 'manageType', 'inventoryUnitId', 'purUnitId', 'salesUnit', 'vatId', 'active'];
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
                    dataSource: customItemType,
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
                lookup: {
                    dataSource: getUOMGroups,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
                visible: false
            },
            {
                dataField: 'inventoriable',
                caption: l('EntityFieldName:MDMService:Item:IsInventoryItem'),
                editorType: 'dxCheckBox',
                //validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'purchasble',
                caption: l('EntityFieldName:MDMService:Item:IsPurchaseItem'),
                editorType: 'dxCheckBox',
                //validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'saleable',
                caption: l('EntityFieldName:MDMService:Item:IsSalesItem'),
                editorType: 'dxCheckBox',
                //validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'manageType',
                caption: l('EntityFieldName:MDMService:Item:ManageItemBy'),
                editorType: 'dxSelectBox',
                editorOptions: {
                    items: manageItem,
                    searchEnabled: true
                },
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'expiredType',
                caption: l('EntityFieldName:MDMService:Item:ExpiredType'),
                editorType: 'dxSelectBox',
                editorOptions: {
                    items: expiredType,
                    searchEnabled: true
                },
                visible: false
            },
            {
                dataField: 'expiredValue',
                caption: l('EntityFieldName:MDMService:Item:ExpiredValue'),
                dataType: 'number',
                visible: false
            },
            {
                dataField: 'issueMethod',
                caption: l('EntityFieldName:MDMService:Item:IssueMethod'),
                editorType: 'dxSelectBox',
                editorOptions: {
                    items: issueMethod,
                    searchEnabled: true
                },
                visible: false
            },
            {
                dataField: 'inventoryUnitId',
                caption: l('EntityFieldName:MDMService:Item:InventoryUnitName'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getUOMs,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'purUnitId',
                caption: l('EntityFieldName:MDMService:Item:PurUnitName'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getUOMs,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'salesUnit',
                caption: l('EntityFieldName:MDMService:Item:SalesUnitName'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getUOMs,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'vatId',
                caption: l('EntityFieldName:MDMService:Item:VATName'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getVATs,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'active',
                caption: l('EntityFieldName:MDMService:Item:Active'),
                editorType: 'dxCheckBox',
                //validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'attr0Id',
                caption: l('EntityFieldName:MDMService:Item:Attr0Name'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getProductAttr,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
                visible: false
            },
            {
                dataField: 'attr1Id',
                caption: l('EntityFieldName:MDMService:Item:Attr1Name'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getProductAttr,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
                visible: false
            },
            {
                dataField: 'attr2Id',
                caption: l('EntityFieldName:MDMService:Item:Attr2Name'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getProductAttr,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
                visible: false
            },
            {
                dataField: 'attr3Id',
                caption: l('EntityFieldName:MDMService:Item:Attr3Name'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getProductAttr,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
                visible: false
            },
            {
                dataField: 'attr4Id',
                caption: l('EntityFieldName:MDMService:Item:Attr4Name'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getProductAttr,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
                visible: false
            },
            {
                dataField: 'attr5Id',
                caption: l('EntityFieldName:MDMService:Item:Attr5Name'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getProductAttr,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
                visible: false
            },
            {
                dataField: 'attr6Id',
                caption: l('EntityFieldName:MDMService:Item:Attr6Name'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getProductAttr,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
                visible: false
            },
            {
                dataField: 'attr7Id',
                caption: l('EntityFieldName:MDMService:Item:Attr7Name'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getProductAttr,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
                visible: false
            },
            {
                dataField: 'attr8Id',
                caption: l('EntityFieldName:MDMService:Item:Attr8Name'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getProductAttr,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
                visible: false
            },
            {
                dataField: 'attr9Id',
                caption: l('EntityFieldName:MDMService:Item:Attr9Name'),
                editorType: 'dxSelectBox',
                lookup: {
                    dataSource: getProductAttr,
                    valueExpr: 'id',
                    displayExpr: 'displayName'
                },
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
                var url = abp.appPath + 'api/mdm-service/item-masters/as-excel-file' +
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
});
