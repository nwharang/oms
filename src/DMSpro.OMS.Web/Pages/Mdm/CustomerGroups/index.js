$(function () {
    var l = abp.localization.getResource("MdmService");
    var customerGroupService = window.dMSpro.oMS.mdmService.controllers.customerGroups.customerGroup;

    var GroupModes = [
        {
            id: 0,
            displayName: "By Attribute"
        },
        {
            id: 1,
            displayName: "By List"
        },
        {
            id: 2,
            displayName: "By Geo"
        }
    ];

    const status = [
        {
            id: 0,
            text: l('EntityFieldValue:MDMService:ItemGroup:Status:OPEN')
        },
        {
            id: 1,
            text: l('EntityFieldValue:MDMService:ItemGroup:Status:RELEASED')
        },
        {
            id: 2,
            text: l('EntityFieldValue:MDMService:ItemGroup:Status:CANCELLED')
        }
    ];

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            customerGroupService.getListDevextremes(args)
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
            customerGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return customerGroupService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return customerGroupService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return customerGroupService.delete(key);
        }
    });

    var gridCusGroups = $('#dgCusGroups').dxDataGrid({
        dataSource: customStore,
        keyExpr: "id",
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.CustomerGroups.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.CustomerGroups.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.CustomerGroups.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'CustomerGroups.xlsx');
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
            storageKey: 'dgCustomerGroups',
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
        onEditorPreparing(e) {
            
        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.command === "edit") {
                var $links = e.cellElement.find(".dx-link");
                if (e.row.data.status == 1 || e.row.data.status == 'RELEASED')
                    $links.filter(".dx-link-edit").remove();
            }
        },
        onRowInserting: function (e) {
            e.data.status = 0;
        },
        onRowUpdating: function (e) {
            e.newData = Object.assign({}, e.oldData, e.newData);
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: '<button type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                    onClick() {
                        gridCusGroups.addRow();
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
            ],
        },
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 100,
                buttons: [
                    {
                        text: "View Details",
                        icon: "fieldchooser",
                        hint: "View Details",
                        visible: function (e) {
                            return !e.row.isNewRow;
                        },
                        onClick: function (e) {
                            var w = window.open('/Mdm/CustomerGroups/Details', '_blank');
                            w.sessionStorage.setItem("customerGroup", JSON.stringify(e.row.data));

                        }
                    },
                    'edit', 'delete'],
                fixedPosition: 'left'
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:CustomerGroup:Code"),
                validationRules: [{ type: "required" }],
                dataType: 'string',
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:CustomerGroup:Name"),
                validationRules: [{ type: "required" }],
                dataType: 'string',
            },
            {
                dataField: 'active',
                caption: l("EntityFieldName:MDMService:CustomerGroup:Active"),
                width: 100,
                alignment: 'center',
                dataType: 'boolean',
                cellTemplate(container, options) {
                    $('<div>')
                        .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : '<i class= "fa fa-times" style="color:red"></i>'))
                        .appendTo(container);
                },
            },
            {
                dataField: 'effectiveDate',
                caption: l("EntityFieldName:MDMService:CustomerGroup:EffectiveDate"),
                dataType: 'date',
            },
            {
                dataField: 'groupBy',
                caption: l("EntityFieldName:MDMService:CustomerGroup:GroupBy"),
                lookup: {
                    dataSource: GroupModes,
                    valueExpr: "id",
                    displayExpr: "displayName",
                    paginate: true,
                    pageSize: pageSizeForLookup
                }
            },
            {
                dataField: 'status',
                caption: l('EntityFieldName:MDMService:CustomerGroup:Status'),
                allowEditing: false,
                lookup: {
                    dataSource: status,
                    valueExpr: "id",
                    displayExpr: "text",
                    paginate: true,
                    pageSize: pageSizeForLookup
                }
            }
        ],
    }).dxDataGrid("instance");

    //$("#frmCusGroup").dxForm({
    //    formData: {
    //        code: "CUS001",
    //        description: "KH tạp hoá",
    //        customerType: "Outlet",
    //        status: "Released",
    //        isActive: true,
    //        groupByMode: "List/Group",
    //    },
    //    colCount: 2,
    //    items: [
    //        {
    //            itemType: "group",
    //            items: [
    //                {
    //                    dataField: "code",
    //                    cssClass: "pr-5"
    //                },
    //                {
    //                    dataField: "description",
    //                    cssClass: "pr-5"
    //                },
    //                {
    //                    dataField: "customerType",
    //                    cssClass: "pr-5"
    //                }
    //            ]
    //        },
    //        {
    //            itemType: "group",
    //            items: [
    //                {
    //                    dataField: "status",
    //                    cssClass: "pl-5"
    //                },
    //                {
    //                    dataField: "isActive",
    //                    cssClass: "pl-5"
    //                },
    //                {
    //                    dataField: "groupByMode",
    //                    cssClass: "pl-5"
    //                }
    //            ]
    //        }
    //    ]
    //});

    //$("#tabPanel").dxTabPanel({
    //    items: [{
    //        title: "By Attribute",
    //        template: function (itemData, itemIndex, element) {
    //            const gridDiv = $("<div style='padding:15px'>")
    //            gridDiv.dxDataGrid({
    //                dataSource: cusAttributes,
    //                keyExpr: "attribute00",
    //                showBorders: true,
    //                //filterRow: {
    //                //    visible: true
    //                //},
    //                searchPanel: {
    //                    visible: true
    //                },
    //                scrolling: {
    //                    mode: 'standard'
    //                },
    //                allowColumnReordering: false,
    //                rowAlternationEnabled: true,
    //                //headerFilter: {
    //                //    visible: true,
    //                //},
    //                //paging:
    //                //{
    //                //    pageSize: pageSize,
    //                //},
    //                //pager: {
    //                //    visible: false,
    //                //    allowedPageSizes: [10, 20, 'all'],
    //                //    showPageSizeSelector: false,
    //                //    showInfo: false,
    //                //    showNavigationButtons: false,
    //                //},
    //                columns: ["attribute00", "attribute01", "attribute02", "attribute03", "attribute04", "attribute05", "attribute06", "attribute07", "attribute08", "attribute09"],
    //            });
    //            gridDiv.appendTo(element);
    //        }
    //        //}, {
    //        //    title: "By Attrinute",
    //        //    template: function (itemData, itemIndex, element) {
    //        //        const formDiv = $("<div style='padding:15px'>")
    //        //        formDiv.dxForm({
    //        //            formData: cusAttributes,
    //        //            colCount: 2,
    //        //            items: ["attribute00", "attribute01", "attribute02", "attribute03", "attribute04", "attribute05", "attribute06", "attribute07", "attribute08", "attribute09"]
    //        //        });
    //        //        formDiv.appendTo(element);
    //        //    }
    //    }, {
    //        title: "By List",
    //        template: function (itemData, itemIndex, element) {
    //            const formDiv = $("<div style='padding:15px'>")
    //            formDiv.dxForm({
    //                formData: {
    //                    isActive: true,
    //                    isAvatar: false,
    //                    url: "https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014_960_720.jpg",
    //                    createDate: new Date()
    //                },
    //                colCount: 2,
    //                items: [
    //                    {
    //                        itemType: "group",
    //                        items: [{
    //                            dataField: "url",
    //                            caption: "",
    //                            template: function (data, itemElement) {
    //                                itemElement.append("<img style='width: 300px; height: 250px' src='" + data.editorOptions.value + "'>");
    //                            }
    //                        }]
    //                    },
    //                    {
    //                        itemType: "group",
    //                        items: ["isActive", "isAvatar", "createDate"]
    //                    }]
    //            });
    //            formDiv.appendTo(element);
    //        }
    //    }, {
    //        title: "By GEO",
    //        template: function (itemData, itemIndex, element) {
    //            const formDiv = $("<div style='padding:15px'>")
    //            formDiv.dxForm({
    //                formData: cusContact,
    //                colCount: 2,
    //                items: [
    //                    {
    //                        itemType: "group",
    //                        items: [{
    //                            itemType: "button",
    //                            buttonOptions: {
    //                                text: "Contact 1",
    //                                type: "success",
    //                                onClick: function () {
    //                                    cusContact.firstName = "Tran";
    //                                    cusContact.lastName = "Bo";
    //                                }
    //                            }
    //                        }, {
    //                            itemType: "button",
    //                            buttonOptions: {
    //                                text: "Contact 2",
    //                                type: "success",
    //                                onClick: function () {
    //                                    cusContact.firstName = "Quynh";
    //                                    cusContact.lastName = "Han";
    //                                }
    //                            }
    //                        }]
    //                    },
    //                    {
    //                        itemType: "group",
    //                        items: ["firstName", "lastName", "gender", "dateOfBirth", "email", "phone", "address", "identityNumber", "bankName", "accountName", "accountNumber"]
    //                    }
    //                ]
    //            });
    //            formDiv.appendTo(element);
    //        }
    //    }]
    //});
});

$(window).focus(function () {
    $('#dgCusGroups').data('dxDataGrid').refresh();
});