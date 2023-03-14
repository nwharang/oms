$(function () {
    var l = abp.localization.getResource("OMS");
    var itemMasterService = window.dMSpro.oMS.mdmService.controllers.items.item;
    var itemAttrValueService = window.dMSpro.oMS.mdmService.controllers.itemAttributeValues.itemAttributeValue;

    var itemMaster = {};

    /****custom store*****/

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

    /****control*****/

    var gridItemMasters = $('#dataGridItemMasters').dxDataGrid({
        dataSource: itemStore,
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
            if (e.format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Data');

                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet,
                    autoFilterEnabled: true,
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Items.xlsx');
                    });
                });
                e.cancel = true;
            } else if (e.format === 'pdf') {
                const doc = new jsPDF();
                DevExpress.pdfExporter.exportDataGrid({
                    jsPDFDocument: doc,
                    component: e.component,
                }).then(() => {
                    doc.save('Items.pdf');
                });
            }
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
            //mode: 'popup',
            allowAdding: abp.auth.isGranted('MdmService.Items.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.Items.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.Items.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            },
        },
        onInitNewRow: function (e) {
            e.data.active = true;
            e.data.isInventoriable = true;
            e.data.isPurchasable = true;
            e.data.isSaleable = true;
            e.data.itemType = 'I';
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
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        var w = window.open('/Mdm/ItemMasters/Details', '_blank');
                        w.sessionStorage.setItem('item', null);
                    },
                },
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
                caption: l('Actions'),
                buttons: [
                    {
                        text: "Edit",
                        icon: "edit",
                        hint: "Edit",
                        visible: function (e) {
                            return !e.row.isNewRow;
                        },
                        onClick: function (e) {
                            var w = window.open('/Mdm/ItemMasters/Details', '_blank');
                            w.sessionStorage.setItem("item", JSON.stringify(e.row.data));
                        }
                    }],
                fixedPosition: 'left'
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
                calculateDisplayValue: "itemType.valueName"
            },
            {
                dataField: 'erpCode',
                caption: l("EntityFieldName:MDMService:Item:ERPCode"),
                dataType: 'string'
            },
            {
                dataField: 'uomGroupId',
                caption: l('EntityFieldName:MDMService:Item:UOMGroupCode'),
                calculateDisplayValue: "uomGroup.code",
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
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: manageItem,
                    valueExpr: "id",
                    displayExpr: "text"
                },
                visible: false
            },
            {
                name: 'ExpiredType',
                dataField: 'expiredType',
                caption: l('EntityFieldName:MDMService:Item:ExpiredType'),
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
                calculateDisplayValue: "inventoryUOM.name",
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'purUOMId',
                caption: l('EntityFieldName:MDMService:Item:PurUnitName'),
                calculateDisplayValue: "purUOM.name",
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'salesUOMId',
                caption: l('EntityFieldName:MDMService:Item:SalesUnitName'),
                calculateDisplayValue: "salesUOM.name",
                validationRules: [{ type: "required" }],
                visible: false
            },
            {
                dataField: 'vatId',
                caption: l('EntityFieldName:MDMService:Item:VATName'),
                calculateDisplayValue: 'vat.name',
                validationRules: [{ type: "required" }],
                visible: false
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

    const dsAttrValue = function (n) {
        return {
            store: getItemAttrValue,
            filter: ['itemAttribute.attrNo', '=', n],
            paginate: true,
            pageSize: pageSizeForLookup
        };
    }

    initImportPopup('api/mdm-service/items', 'Items_Template', 'dataGridItemMasters');
});