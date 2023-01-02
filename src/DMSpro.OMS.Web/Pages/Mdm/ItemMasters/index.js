$(function () {
    var l = abp.localization.getResource("MdmService");
    var itemMasterService = window.dMSpro.oMS.mdmService.controllers.itemMasters.itemMaster;

    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        loadMode: "raw",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            [
                'skip',
                'take',
                'requireTotalCount',
                'requireGroupCount',
                'sort',
                'filter',
                'totalSummary',
                'group',
                'groupSummary',
            ].forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            const args2 = { "loadOptions": args };
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

    var gridUOMs = $('#dataGridItemMasters').dxDataGrid({
        dataSource: customStore,
        keyExpr: 'id',
        remoteOperations: true,
        showBorders: true,
        autoExpandAll: true,
        focusedRowEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        columnHidingEnabled: true,
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
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            useIcons: true,
            popup: {
                title: l("Page.Title.ItemMasters"),
                showTitle: true,
                width: 700,
                height: 345,
            },
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        //onRowInserting: function (e) {
        //    debugger
        //    if (e.data && e.data.code == null) {
        //        e.data.code = e.data.Code;
        //    }
        //},
        onRowUpdating: function (e) {
            var objectRequire = ['code', 'name', 'itemTypeId', 'barcode', 'purchasble', 'saleable', 'inventoriable', 'vatId', 'uomGroupId', 'inventoryUnitId', 'purUnitId', 'salesUnit', 'basePrice'];
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
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:ItemMaster:Code"),
                dataType: 'string'
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:ItemMaster:Name"),
                dataType: 'string'
            },
            {
                dataField: 'shortName',
                caption: l("EntityFieldName:MDMService:ItemMaster:ShortName"),
                dataType: 'string'
            },
            {
                dataField: 'itemTypeId',
                caption: l("EntityFieldName:MDMService:ItemMaster:ItemTypeName"),
                dataType: 'string'
            },
            {
                dataField: 'barcode',
                caption: l("EntityFieldName:MDMService:ItemMaster:Barcode"),
                dataType: 'string'
            },
            {
                dataField: 'erpCode',
                caption: l("EntityFieldName:MDMService:ItemMaster:ERPCode"),
                dataType: 'string'
            }
        ]
    }).dxDataGrid('instance');


    //        var lastNpIdId = '';
    //        var lastNpDisplayNameId = '';

    //        var _lookupModal = new abp.ModalManager({
    //            viewUrl: abp.appPath + "Shared/LookupModal",
    //            scriptUrl: "/Pages/Shared/lookupModal.js",
    //            modalClass: "navigationPropertyLookup"
    //        });

    //        $('.lookupCleanButton').on('click', '', function () {
    //            $(this).parent().find('input').val('');
    //        });

    //        _lookupModal.onClose(function () {
    //            var modal = $(_lookupModal.getModal());
    //            $('#' + lastNpIdId).val(modal.find('#CurrentLookupId').val());
    //            $('#' + lastNpDisplayNameId).val(modal.find('#CurrentLookupDisplayName').val());
    //        });

    //    var createModal = new abp.ModalManager({
    //        viewUrl: abp.appPath + "ItemMasters/CreateModal",
    //        scriptUrl: "/Pages/ItemMasters/createModal.js",
    //        modalClass: "itemMasterCreate"
    //    });

    //	var editModal = new abp.ModalManager({
    //        viewUrl: abp.appPath + "ItemMasters/EditModal",
    //        scriptUrl: "/Pages/ItemMasters/editModal.js",
    //        modalClass: "itemMasterEdit"
    //    });

    //	var getFilter = function() {
    //        return {
    //            filterText: $("#FilterText").val(),
    //            code: $("#CodeFilter").val(),
    //			name: $("#NameFilter").val(),
    //			shortName: $("#ShortNameFilter").val(),
    //			erpCode: $("#ERPCodeFilter").val(),
    //			barcode: $("#BarcodeFilter").val(),
    //            purchasble: (function () {
    //                var value = $("#PurchasbleFilter").val();
    //                if (value === undefined || value === null || value === '') {
    //                    return '';
    //                }
    //                return value === 'true';
    //            })(),
    //            saleable: (function () {
    //                var value = $("#SaleableFilter").val();
    //                if (value === undefined || value === null || value === '') {
    //                    return '';
    //                }
    //                return value === 'true';
    //            })(),
    //            inventoriable: (function () {
    //                var value = $("#InventoriableFilter").val();
    //                if (value === undefined || value === null || value === '') {
    //                    return '';
    //                }
    //                return value === 'true';
    //            })(),
    //            active: (function () {
    //                var value = $("#ActiveFilter").val();
    //                if (value === undefined || value === null || value === '') {
    //                    return '';
    //                }
    //                return value === 'true';
    //            })(),
    //			manageType: $("#ManageTypeFilter").val(),
    //			expiredType: $("#ExpiredTypeFilter").val(),
    //			expiredValueMin: $("#ExpiredValueFilterMin").val(),
    //			expiredValueMax: $("#ExpiredValueFilterMax").val(),
    //			issueMethod: $("#IssueMethodFilter").val(),
    //            canUpdate: (function () {
    //                var value = $("#CanUpdateFilter").val();
    //                if (value === undefined || value === null || value === '') {
    //                    return '';
    //                }
    //                return value === 'true';
    //            })(),
    //			basePriceMin: $("#BasePriceFilterMin").val(),
    //			basePriceMax: $("#BasePriceFilterMax").val(),
    //			itemTypeId: $("#ItemTypeIdFilter").val(),			vATId: $("#VATIdFilter").val(),			uOMGroupId: $("#UOMGroupIdFilter").val(),			inventoryUnitId: $("#InventoryUnitIdFilter").val(),			purUnitId: $("#PurUnitIdFilter").val(),			salesUnit: $("#SalesUnitFilter").val(),			attr0Id: $("#Attr0IdFilter").val(),			attr1Id: $("#Attr1IdFilter").val(),			attr2Id: $("#Attr2IdFilter").val(),			attr3Id: $("#Attr3IdFilter").val(),			attr4Id: $("#Attr4IdFilter").val(),			attr5Id: $("#Attr5IdFilter").val(),			attr6Id: $("#Attr6IdFilter").val(),			attr7Id: $("#Attr7IdFilter").val(),			attr8Id: $("#Attr8IdFilter").val(),			attr9Id: $("#Attr9IdFilter").val(),			attr10Id: $("#Attr10IdFilter").val(),			attr11Id: $("#Attr11IdFilter").val(),			attr12Id: $("#Attr12IdFilter").val(),			attr13Id: $("#Attr13IdFilter").val(),			attr14Id: $("#Attr14IdFilter").val(),			attr15Id: $("#Attr15IdFilter").val(),			attr16Id: $("#Attr16IdFilter").val(),			attr17Id: $("#Attr17IdFilter").val(),			attr18Id: $("#Attr18IdFilter").val(),			attr19Id: $("#Attr19IdFilter").val()
    //        };
    //    };

    //    var dataTable = $("#ItemMastersTable").DataTable(abp.libs.datatables.normalizeConfiguration({
    //        processing: true,
    //        serverSide: true,
    //        paging: true,
    //        searching: false,
    //        scrollX: true,
    //        autoWidth: true,
    //        scrollCollapse: true,
    //        order: [[1, "asc"]],
    //        ajax: abp.libs.datatables.createAjax(itemMasterService.getList, getFilter),
    //        columnDefs: [
    //            {
    //                rowAction: {
    //                    items:
    //                        [
    //                            {
    //                                text: l("Edit"),
    //                                visible: abp.auth.isGranted('MdmService.ItemMasters.Edit'),
    //                                action: function (data) {
    //                                    editModal.open({
    //                                     id: data.record.itemMaster.id
    //                                     });
    //                                }
    //                            },
    //                            {
    //                                text: l("Delete"),
    //                                visible: abp.auth.isGranted('MdmService.ItemMasters.Delete'),
    //                                confirmMessage: function () {
    //                                    return l("DeleteConfirmationMessage");
    //                                },
    //                                action: function (data) {
    //                                    itemMasterService.delete(data.record.itemMaster.id)
    //                                        .then(function () {
    //                                            abp.notify.info(l("SuccessfullyDeleted"));
    //                                            dataTable.ajax.reload();
    //                                        });
    //                                }
    //                            }
    //                        ]
    //                }
    //            },
    //			{ data: "itemMaster.code" },
    //			{ data: "itemMaster.name" },
    //			{ data: "itemMaster.shortName" },
    //			{ data: "itemMaster.erpCode" },
    //			{ data: "itemMaster.barcode" },
    //            {
    //                data: "itemMaster.purchasble",
    //                render: function (purchasble) {
    //                    return purchasble ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
    //                }
    //            },
    //            {
    //                data: "itemMaster.saleable",
    //                render: function (saleable) {
    //                    return saleable ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
    //                }
    //            },
    //            {
    //                data: "itemMaster.inventoriable",
    //                render: function (inventoriable) {
    //                    return inventoriable ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
    //                }
    //            },
    //            {
    //                data: "itemMaster.active",
    //                render: function (active) {
    //                    return active ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
    //                }
    //            },
    //            {
    //                data: "itemMaster.manageType",
    //                render: function (manageType) {
    //                    if (manageType === undefined ||
    //                        manageType === null) {
    //                        return "";
    //                    }

    //                    var localizationKey = "EntityFieldValue:MDMService:ItemMaster:ManageItemBy:" + manageType;
    //                    var localized = l(localizationKey);

    //                    if (localized === localizationKey) {
    //                        abp.log.warn("No localization found for " + localizationKey);
    //                        return "";
    //                    }

    //                    return localized;
    //                }
    //            },
    //            {
    //                data: "itemMaster.expiredType",
    //                render: function (expiredType) {
    //                    if (expiredType === undefined ||
    //                        expiredType === null) {
    //                        return "";
    //                    }

    //                    var localizationKey = "EntityFieldValue:MDMService:ItemMaster:ExpiredType:" + expiredType;
    //                    var localized = l(localizationKey);

    //                    if (localized === localizationKey) {
    //                        abp.log.warn("No localization found for " + localizationKey);
    //                        return "";
    //                    }

    //                    return localized;
    //                }
    //            },
    //			{ data: "itemMaster.expiredValue" },
    //            {
    //                data: "itemMaster.issueMethod",
    //                render: function (issueMethod) {
    //                    if (issueMethod === undefined ||
    //                        issueMethod === null) {
    //                        return "";
    //                    }

    //                    var localizationKey = "EntityFieldValue:MDMService:ItemMaster:IssueMethod:" + issueMethod;
    //                    var localized = l(localizationKey);

    //                    if (localized === localizationKey) {
    //                        abp.log.warn("No localization found for " + localizationKey);
    //                        return "";
    //                    }

    //                    return localized;
    //                }
    //            },
    //            {
    //                data: "itemMaster.canUpdate",
    //                render: function (canUpdate) {
    //                    return canUpdate ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
    //                }
    //            },
    //			{ data: "itemMaster.basePrice" },
    //            {
    //                data: "systemData.valueCode",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "vat.code",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "uomGroup.code",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "uom.code",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "uoM1.code",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "uoM2.code",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue1.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue2.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue3.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue4.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue5.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue6.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue7.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue8.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue9.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue10.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue11.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue12.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue13.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue14.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue15.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue16.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue17.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue18.attrValName",
    //                defaultContent : ""
    //            },
    //            {
    //                data: "prodAttributeValue19.attrValName",
    //                defaultContent : ""
    //            }
    //        ]
    //    }));

    //    createModal.onResult(function () {
    //        dataTable.ajax.reload();
    //    });

    //    editModal.onResult(function () {
    //        dataTable.ajax.reload();
    //    });

    //    $("#NewItemMasterButton").click(function (e) {
    //        e.preventDefault();
    //        createModal.open();
    //    });

    //	$("#SearchForm").submit(function (e) {
    //        e.preventDefault();
    //        dataTable.ajax.reload();
    //    });

    //    $("#ExportToExcelButton").click(function (e) {
    //        e.preventDefault();

    //        itemMasterService.getDownloadToken().then(
    //            function(result){
    //                    var input = getFilter();
    //                    var url =  abp.appPath + 'api/mdm-service/item-masters/as-excel-file' + 
    //                        abp.utils.buildQueryString([
    //                            { name: 'downloadToken', value: result.token },
    //                            { name: 'filterText', value: input.filterText }, 
    //                            { name: 'code', value: input.code }, 
    //                            { name: 'name', value: input.name }, 
    //                            { name: 'shortName', value: input.shortName }, 
    //                            { name: 'erpCode', value: input.erpCode }, 
    //                            { name: 'barcode', value: input.barcode }, 
    //                            { name: 'purchasble', value: input.purchasble }, 
    //                            { name: 'saleable', value: input.saleable }, 
    //                            { name: 'inventoriable', value: input.inventoriable }, 
    //                            { name: 'active', value: input.active }, 
    //                            { name: 'manageType', value: input.manageType }, 
    //                            { name: 'expiredType', value: input.expiredType },
    //                            { name: 'expiredValueMin', value: input.expiredValueMin },
    //                            { name: 'expiredValueMax', value: input.expiredValueMax }, 
    //                            { name: 'issueMethod', value: input.issueMethod }, 
    //                            { name: 'canUpdate', value: input.canUpdate },
    //                            { name: 'basePriceMin', value: input.basePriceMin },
    //                            { name: 'basePriceMax', value: input.basePriceMax }, 
    //                            { name: 'itemTypeId', value: input.itemTypeId }
    //, 
    //                            { name: 'vATId', value: input.vATId }
    //, 
    //                            { name: 'uOMGroupId', value: input.uOMGroupId }
    //, 
    //                            { name: 'inventoryUnitId', value: input.inventoryUnitId }
    //, 
    //                            { name: 'purUnitId', value: input.purUnitId }
    //, 
    //                            { name: 'salesUnit', value: input.salesUnit }
    //, 
    //                            { name: 'attr0Id', value: input.attr0Id }
    //, 
    //                            { name: 'attr1Id', value: input.attr1Id }
    //, 
    //                            { name: 'attr2Id', value: input.attr2Id }
    //, 
    //                            { name: 'attr3Id', value: input.attr3Id }
    //, 
    //                            { name: 'attr4Id', value: input.attr4Id }
    //, 
    //                            { name: 'attr5Id', value: input.attr5Id }
    //, 
    //                            { name: 'attr6Id', value: input.attr6Id }
    //, 
    //                            { name: 'attr7Id', value: input.attr7Id }
    //, 
    //                            { name: 'attr8Id', value: input.attr8Id }
    //, 
    //                            { name: 'attr9Id', value: input.attr9Id }
    //, 
    //                            { name: 'attr10Id', value: input.attr10Id }
    //, 
    //                            { name: 'attr11Id', value: input.attr11Id }
    //, 
    //                            { name: 'attr12Id', value: input.attr12Id }
    //, 
    //                            { name: 'attr13Id', value: input.attr13Id }
    //, 
    //                            { name: 'attr14Id', value: input.attr14Id }
    //, 
    //                            { name: 'attr15Id', value: input.attr15Id }
    //, 
    //                            { name: 'attr16Id', value: input.attr16Id }
    //, 
    //                            { name: 'attr17Id', value: input.attr17Id }
    //, 
    //                            { name: 'attr18Id', value: input.attr18Id }
    //, 
    //                            { name: 'attr19Id', value: input.attr19Id }
    //                            ]);

    //                    var downloadWindow = window.open(url, '_blank');
    //                    downloadWindow.focus();
    //            }
    //        )
    //    });

    //    $('#AdvancedFilterSectionToggler').on('click', function (e) {
    //        $('#AdvancedFilterSection').toggle();
    //    });

    //    $('#AdvancedFilterSection').on('keypress', function (e) {
    //        if (e.which === 13) {
    //            dataTable.ajax.reload();
    //        }
    //    });

    //    $('#AdvancedFilterSection select').change(function() {
    //        dataTable.ajax.reload();
    //    });


});
