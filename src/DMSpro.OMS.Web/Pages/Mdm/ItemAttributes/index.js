﻿var itemAttrService = window.dMSpro.oMS.mdmService.controllers.itemAttributes.itemAttribute;
$(function () {
    var l = abp.localization.getResource("MdmService");
    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];
    
    var customStore = new DevExpress.data.CustomStore({
        key: "id",
        loadMode: 'processed',
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
                        groupCount: result.groupCount
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
                })
            return d.promise();
        },
        insert(values) {
            return itemAttrService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return itemAttrService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return itemAttrService.delete(key);
        }
    });

    const dataGrid = $('#gridProdAttribute').dxDataGrid({
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
            storageKey: 'dgSystemDatas',
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
            mode: "row",
            /*allowAdding: abp.auth.isGranted('MdmService.ItemAttributes.Create'),*/
            allowUpdating: abp.auth.isGranted('MdmService.ItemAttributes.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.ItemAttributes.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        onRowUpdating: function (e) {
            var objectRequire = ['attrNo', 'attrName', 'hierarchyLevel', 'active', 'isProductCategory'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        toolbar: {
            items: [
                "groupPanel",
                //{
                //    location: 'after',
                //    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                //    onClick() {
                //        dataGrid.addRow();
                //    },
                //},
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
            ],
        },
        columns: [
            {
                type: 'buttons',
                buttons: ['edit'],
                caption: l('Actions'),
                width: 110,
                fixedPosition: 'left'
            },
            {
                dataField: 'attrNo',
                caption: l("EntityFieldName:MDMService:ItemAttribute:AttrNo"),
                allowEditing: false
            },
            {
                dataField: 'attrName',
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
            },
            {
                dataField: 'active',
                caption: l("EntityFieldName:MDMService:ItemAttribute:Active"),
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                }
            },
            {
                dataField: 'isSellingCategory',
                caption: l("EntityFieldName:MDMService:ItemAttribute:IsSellingCategory"),
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                }
            }
        ]
    }).dxDataGrid('instance');

    //$("#NewProductAttributeButton").click(function () {
    //    dataGrid.addRow();
    //});

    //$("input#Search").on("input", function () {
    //    dataGrid.searchByText($(this).val());
    //});

    //$("#ExportToExcelButton").click(function (e) {
    //    e.preventDefault();

    //    itemAttrService.getDownloadToken().then(
    //        function (result) {
    //            var url = abp.appPath + 'api/mdm-service/item-attributes/as-excel-file' + abp.utils.buildQueryString([
    //                { name: 'downloadToken', value: result.token }
    //            ]);

    //            var downloadWindow = window.open(url, '_blank');
    //            downloadWindow.focus();
    //        }
    //    )
    //});

    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }
});
