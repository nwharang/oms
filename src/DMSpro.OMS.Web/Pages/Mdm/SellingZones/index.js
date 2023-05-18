$(function () {
    let l = abp.localization.getResource("OMS");
    let salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;
    let companyInZoneService = window.dMSpro.oMS.mdmService.controllers.companyInZones.companyInZone;
    let customerInZoneService = window.dMSpro.oMS.mdmService.controllers.customerInZones.customerInZone;
    let companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    let customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
    let itemGroupService = window.dMSpro.oMS.mdmService.controllers.itemGroups.itemGroup;
    let geoMasterService = window.dMSpro.oMS.mdmService.controllers.geoMasters.geoMaster;

    let salesOrgHierarchyId = null;
    let popup, popupInstance, grid, gridInstance
    /****custom store*****/

    var geoMasterStore = new DevExpress.data.CustomStore({
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

            geoMasterService.getListDevextremes(args)
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
            geoMasterService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });
    var itemGroupStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            itemGroupService.getListDevextremes({})
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
            itemGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
    });
    var salesOrgHierarchyStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            var filter = [["isSellingZone", "=", true], 'and', ['salesOrgHeader.status', "=", 1]];
            if (loadOptions.searchValue != null && loadOptions.searchValue != '') {
                filter = [
                    ["isSellingZone", "=", true],
                    "and",
                    ["salesOrgHeader.status", "=", 1],
                    "and",
                    [
                        ["name", loadOptions.searchOperation, loadOptions.searchValue],
                        'or',
                        ["code", loadOptions.searchOperation, loadOptions.searchValue]
                    ],
                ];
            }

            const deferred = $.Deferred();
            salesOrgHierarchyService.getListDevextremes({ filter: JSON.stringify(filter) })
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
            salesOrgHierarchyService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return salesOrgHierarchyService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return salesOrgHierarchyService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return salesOrgHierarchyService.delete(key);
        }
    });

    var companyInZoneStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            if (loadOptions.filter == null) {
                loadOptions.filter = ["salesOrgHierarchyId", "=", salesOrgHierarchyId];
            } else {
                loadOptions.filter = [...loadOptions.filter, "and", ["salesOrgHierarchyId", "=", salesOrgHierarchyId]];
            }

            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            const deferred = $.Deferred();
            if (salesOrgHierarchyId)
                companyInZoneService.getListDevextremes(args)
                    .done(result => {
                        deferred.resolve(result.data, {
                            totalCount: result.totalCount,
                            summary: result.summary,
                            groupCount: result.groupCount,
                        });
                    });
            else
                deferred.resolve({
                    data: [],
                    totalCount: 0,
                    summary: 0,
                    groupCount: 0,
                })

            return deferred.promise();
        },
        byKey: function (key) {
            if (key == 0) return null;

            var d = new $.Deferred();
            companyInZoneService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return companyInZoneService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return companyInZoneService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return companyInZoneService.delete(key);
        }
    });

    var customerInZoneStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            if (loadOptions.filter == null) {
                loadOptions.filter = ["salesOrgHierarchyId", "=", salesOrgHierarchyId];
            } else {
                loadOptions.filter = [loadOptions.filter, "and", ["salesOrgHierarchyId", "=", salesOrgHierarchyId]];
            }

            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            const deferred = $.Deferred();
            customerInZoneService.getListDevextremes(args)
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
            customerInZoneService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert({ customerId, effectiveDate, endDate, salesOrgHierarchyId }) {
            return new Promise((resolve, reject) => {
                customerId.forEach((e, index, arr) => {
                    customerInZoneService.create({ customerId: e, effectiveDate, endDate, salesOrgHierarchyId }, { contentType: "application/json" }).then(() => {
                        if (index == arr.length - 1) resolve();
                    })
                })
            })
        },
        update(key, values) {
            return customerInZoneService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return customerInZoneService.delete(key);
        }
    });

    var companyStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            const deferred = $.Deferred();
            companyService.getListDevextremes(args)
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
            companyService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    var customerStore = new DevExpress.data.CustomStore({
        key: 'id',
        useDefaultSearch: true,
        load(loadOptions) {
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            const deferred = $.Deferred();
            customerService.getListDevextremes(args)
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
            customerService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    /****control*****/
    const salesOrgHierarchy = $('#salesOrgHierarchy').css({ 'max-width': "20em", 'width': "20em" }).dxSelectBox({
        dataSource: salesOrgHierarchyStore,
        valueExpr: 'id',
        displayExpr(e) {
            if (e)
                return `${e.code} - ${e.name}`
            return ''

        },
        label: l("Menu:MdmService:SellingZones"),
        labelMode: "floating",
        searchEnabled: true,
        showClearButton: true,
        onSelectionChanged(data) {
            const checkStatus = data.selectedItem != undefined && data.selectedItem.id != null;
            //set salesOrgHierarchyId value
            salesOrgHierarchyId = checkStatus ? data.selectedItem.id : null;
            companyAssginContainer.option('dataSource', companyInZoneStore);
            customerAssginContainer.option('dataSource', customerInZoneStore);
            //update button status
            companyAssginContainer.option("editing.allowAdding", checkStatus);
            customerAssginContainer.option("editing.allowAdding", checkStatus);
            $("#massInputButton").dxButton('instance').option('visible', salesOrgHierarchyId != null && abp.auth.isGranted('MdmService.CustomerInZones.Create'));
        }
    }).dxSelectBox("instance");

    //DataGrid - Company Assgin
    var companyAssginContainer = $('#companyAssgin').dxDataGrid({
        dataSource: {
            store: companyInZoneStore,
            filter: [["endDate", '>', moment().format('YYYY-MM-DD')], 'or', ['endDate', '=', null]],
        },
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,
        allowColumnDragging: false,
        columnMinWidth: 50,
        dateSerializationFormat: "yyyy-MM-dd",
        paging: {
            enabled: true,
            pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes,
            showInfo: true,
            showNavigationButtons: true
        },
        editing: {
            mode: 'row',
            allowAdding: salesOrgHierarchyId != null && abp.auth.isGranted('MdmService.CompanyInZones.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.CompanyInZones.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.CompanyInZones.Delete'),
            useIcons: true,
        },
        onRowInserting: function (e) {
            e.data.salesOrgHierarchyId = salesOrgHierarchyId;
        },
        onRowUpdating: function (e) {
            var objectRequire = ['companyId', 'effectiveDate', 'endDate', 'isBase'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
            e.newData["salesOrgHierarchyId"] = salesOrgHierarchyId;
        },
        toolbar: {
            items: [
                //"groupPanel",
                "addRowButton",
                // "columnChooserButton",
                // "exportButton",
                // {
                //     location: 'after',
                //     widget: 'dxButton',
                //     options: {
                //         icon: "import",
                //         elementAttr: {
                //             //id: "import-excel",
                //             class: "import-excel",
                //         },
                //         onClick(e) {
                //             var gridControl = e.element.closest('div.dx-datagrid').parent();
                //             var gridName = gridControl.attr('id');
                //             var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                //             if (popup) popup.show();
                //         },
                //     },
                // },
                //"searchPanel",
            ],
        },
        // onContentReady: function (e) {

        //     if (salesOrgHierarchyId) { 
        //         initImportPopup('api/mdm-service/customer-group-by-atts', 'CustomerGroupByAtts_Template', 'dgCustomerAttribute');
        //         e.component.option('toolbar.items[4].visible', true);
        //     }
        //     else {
        //         e.component.option('toolbar.items[4].visible', false);
        //     }
        // },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: ['edit', 'delete'],
            },
            {
                caption: l("CompanyInZone.Company"),
                dataField: "companyId",
                allowSearch: false,
                calculateDisplayValue: (rowData) => {
                    if (rowData?.company)
                        return rowData.company.name;
                    return
                },
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: {
                        store: companyStore,
                        filter: [['active', '=', true], 'and', [["endDate", '>', moment().format('YYYY-MM-DD')], 'or', ['endDate', '=', null]]],
                        paginate: true,
                        pageSize
                    },
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            },
            {
                caption: l("EntityFieldName:MDMService:CompanyInZone:EffectiveDate"),
                dataField: "effectiveDate",
                dataType: "date",
                validationRules: [{ type: "required" }],
                editorOptions: {
                    format: 'dd/MM/yyyy',
                },
                format: 'dd/MM/yyyy',
            },
            {
                caption: l("EntityFieldName:MDMService:CompanyInZone:EndDate"),
                dataField: "endDate",
                dataType: "date",
                editorOptions: {
                    format: 'dd/MM/yyyy',
                },
                format: 'dd/MM/yyyy',
            },
            {
                caption: l("Page.Title.ItemGroups"),
                dataField: "itemGroupId",
                lookup: {
                    dataSource: itemGroupStore,
                    valueExpr: "id",
                    displayExpr: "name",
                },
                editorOptions: {
                    showClearButton: true,
                }
            }
        ]
    }).dxDataGrid("instance");

    //DataGrid - Customer Assgin
    var customerAssginContainer = $('#customerAssgin').dxDataGrid({
        dataSource: customerInZoneStore,
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        cacheEnabled: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,
        dateSerializationFormat: "yyyy-MM-dd",
        allowColumnDragging: false,
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
        // columnFixing: {
        //     enabled: true,
        // },
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
            allowAdding: salesOrgHierarchyId != null && abp.auth.isGranted('MdmService.CustomerInZones.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.CustomerInZones.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.CustomerInZones.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            },
            popup: {
                showTitle: false,
                width: 400,
                height: 280
            },
        },
        onRowInserting: function (e) {
            e.data.salesOrgHierarchyId = salesOrgHierarchyId;
        },
        onRowUpdating: function (e) {
            var objectRequire = ['customerId', 'effectiveDate', 'endDate'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }

            e.newData["salesOrgHierarchyId"] = salesOrgHierarchyId;
        },
        toolbar: {
            items: [
                // "addRowButton",
                {
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        icon: "add",
                        elementAttr: {
                            id: 'massInputButton'
                        },
                        onClick(e) {
                            renderMassInputCus()
                        },
                        visible: salesOrgHierarchyId != null && abp.auth.isGranted('MdmService.CustomerInZones.Create')
                    },
                },
            ],
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: ['edit', 'delete'],
                // fixedPosition: 'left'
            },
            {
                caption: l("EntityFieldName:MDMService:CustomerInZone:Customer"),
                dataField: "customerId",
                allowSearch: false,
                calculateDisplayValue(rowData) {
                    if (rowData.customer) return rowData.customer.name;
                    return "";
                },
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource(options) {
                        return {
                            store: customerStore,
                            filter: options.data ? ["!", ["id", "=", options.data.customerId]] : null,
                            paginate: true,
                            pageSize: pageSizeForLookup
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id'
                }
            },
            {
                caption: l("EntityFieldName:MDMService:CustomerInZone:EffectiveDate"),
                dataField: "effectiveDate",
                dataType: "date",
                format: 'dd/MM/yyyy',
                validationRules: [{ type: "required" }],
            },
            {
                caption: l("EntityFieldName:MDMService:CustomerInZone:EndDate"),
                dataField: "endDate",
                format: 'dd/MM/yyyy',
                dataType: "date",
            },
            //{
            //    caption: l("Active"),
            //    dataField: "active",
            //    dataType: "boolean"
            //}
        ]
    }).dxDataGrid("instance");

    /****button*****/

    $("#tab1").click(function () {
        setTimeout(() => { companyAssginContainer.refresh(); }, 100);
    });

    $("#tab2").click(function () {
        setTimeout(() => {
            customerAssginContainer.refresh();
            console.log($("#massInputButton").dxButton('instance').option('visible'));
            $("#massInputButton").dxButton('instance').option('visible', salesOrgHierarchyId != null && abp.auth.isGranted('MdmService.CustomerInZones.Create'));
        }, 100);
    });

    function renderMassInputCus() {
        popup = $("<div id='popup'>").dxPopup({
            title: l('EntityFieldName:MDMService:CustomerInZone:MassInput'),
            height: '75vh',
            width: '80vw',
            dragEnabled: false,
            allowColumnReordering: false,
            allowColumnDragging: false,
            contentTemplate: (e) => {
                let store = new DevExpress.data.CustomStore({
                    key: 'id',
                    load(loadOptions) {
                        const deferred = $.Deferred();
                        const args = {};
                        requestOptions.forEach((i) => {
                            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                                args[i] = JSON.stringify(loadOptions[i]);
                            }
                        });

                        customerService.getListDevextremes(args)
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
                        customerService.get(key)
                            .done(data => {
                                d.resolve(data);
                            });
                        return d.promise();
                    }
                });
                grid = $("<div id='grid'>").dxDataGrid({
                    dataSource: {
                        store,
                        filter: ["active", "=", "true"],
                        paginate: true,
                        pageSize
                    },
                    height: '100%',
                    width: '100%',
                    filterRow: {
                        visible: true,
                    },
                    headerFilter: {
                        visible: true,
                    },
                    selection: {
                        mode: 'multiple',
                        showCheckBoxesMode: 'always',
                        selectAllMode: 'page'
                    },
                    remoteOperations: true,
                    showBorders: true,
                    allowColumnDragging: false,
                    columnAutoWidth: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    dateSerializationFormat: "yyyy-MM-dd",
                    showColumnLines: true,
                    columnChooser: {
                        enabled: true,
                        mode: "select"
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
                    toolbar: {

                        items: [
                            {
                                widget: "dxDateBox",
                                location: 'before',
                                options: {
                                    width: '20rem',
                                    label: 'effectiveDate',
                                    labelMode: 'floating',
                                    displayFormat: "dd/MM/yyyy",
                                    type: 'date',
                                    value: new Date(),
                                    elementAttr: {
                                        id: 'cusBatchInputEffectiveDate'
                                    }
                                }
                            },
                            {
                                widget: "dxDateBox",
                                location: 'before',
                                options: {
                                    width: '20rem',
                                    label: 'endDate',
                                    labelMode: 'floating',
                                    displayFormat: "dd/MM/yyyy",
                                    type: 'date',
                                    value: null,
                                    elementAttr: {
                                        id: 'cusBatchInputEndDate'
                                    }
                                }
                            },
                            'columnChooserButton'
                        ]
                    }
                    ,
                    columns: [
                        {
                            // Custom column
                            dataField: 'code',
                            calculateDisplayValue(e) {
                                if (e)
                                    return `${e.code} - ${e.name}`
                                return "None"
                            },
                            lookup: {
                                dataSource: customerStore,
                                valueExpr: 'code',
                                displayExpr: 'code'
                            },
                        },
                        {
                            caption: l("EntityFieldName:MDMService:GeoMaster:Level3"),
                            dataField: "geoMaster3.id",
                            calculateDisplayValue: "geoMaster3.name",
                            width: 110,
                            lookup: {
                                dataSource(options) {
                                    return {
                                        store: geoMasterStore,
                                        filter: options.data ? [['level', '=', 3], 'and', ['parentId', '=', options.data.geoMaster2Id]] : ['level', '=', 3],
                                        paginate: true,
                                        pageSize: pageSizeForLookup
                                    };
                                },
                                valueExpr: 'id',
                                displayExpr: 'name',
                            },
                        },
                        {
                            caption: l("EntityFieldName:MDMService:GeoMaster:Level2"),
                            dataField: "geoMaster2.id",
                            calculateDisplayValue: "geoMaster2.name",
                            width: 110,
                            lookup: {
                                dataSource(options) {
                                    return {
                                        store: geoMasterStore,
                                        filter: options.data ? [['level', '=', 2], 'and', ['parentId', '=', options.data.geoMaster1Id]] : ['level', '=', 2],
                                        paginate: true,
                                        pageSize: pageSizeForLookup
                                    };
                                },
                                valueExpr: 'id',
                                displayExpr: 'name',
                            },
                        },
                        {
                            caption: l("EntityFieldName:MDMService:GeoMaster:Level1"),
                            dataField: "geoMaster1.id",
                            calculateDisplayValue: "geoMaster1.name",
                            width: 110,
                            lookup: {
                                dataSource(options) {
                                    return {
                                        store: geoMasterStore,
                                        filter: options.data ? [['level', '=', 1], 'and', ['parentId', '=', options.data.geoMaster0Id]] : ['level', '=', 1],
                                        paginate: true,
                                        pageSize: pageSizeForLookup
                                    };
                                },
                                lookup: {
                                    dataSource(options) {
                                        return {
                                            store: geoMasterStore,
                                            filter: options.data ? [['level', '=', 3], 'and', ['parentId', '=', options.data.geoMaster2Id]] : ['level', '=', 3],
                                            paginate: true,
                                            pageSize: pageSizeForLookup
                                        };
                                    },
                                    valueExpr: 'id',
                                    displayExpr: 'name',
                                },
                                valueExpr: 'id',
                                displayExpr: 'name',
                            },
                        },
                        {
                            caption: l("EntityFieldName:MDMService:GeoMaster:Level0"),
                            dataField: "geoMaster0.id",
                            calculateDisplayValue: "geoMaster0.name",
                            width: 110,
                            lookup: {
                                dataSource(options) {
                                    return {
                                        store: geoMasterStore,
                                        filter: ['level', '=', 0],
                                        paginate: true,
                                        pageSize: pageSizeForLookup
                                    };
                                },
                                valueExpr: "id",
                                displayExpr: "name"
                            },
                        },
                        {
                            caption: l("EntityFieldName:MDMService:CustomerContact:Address"),
                            dataField: "fullAddress",
                        },
                    ]
                })
                gridInstance = grid.dxDataGrid('instance')
                grid.appendTo(e)
            },

            toolbarItems: [{
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    icon: 'fa fa-check hvr-icon',
                    text: 'Submit',
                    onClick(e) {
                        data = {
                            salesOrgHierarchyId,
                            customerId: gridInstance.getSelectedRowsData().map(e => e.id),
                            effectiveDate: $("#cusBatchInputEffectiveDate").dxDateBox('instance').option('value'),
                            endDate: $("#cusBatchInputEndDate").dxDateBox('instance').option('value'),
                        }
                        customerAssginContainer.getDataSource().store().insert(data).then(() => {
                            popupInstance.beginUpdate()
                            customerAssginContainer.refresh().then(() => {
                                popupInstance.endUpdate()
                                popupInstance.hide();
                            })
                        })
                    },
                },
            }, {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    text: 'Cancel',
                    onClick() {
                        popupInstance.hide();
                    },
                },
            }],
        })
        popupInstance = popup.dxPopup('instance')
        popup.appendTo('body')
        popupInstance.show()
    }

    /****function*****/
    initImportPopup('api/mdm-service/customer-in-zones', 'CustomerInZones_Template', 'customerAssgin');
    initImportPopup('api/mdm-service/company-in-zones', 'CompanyInZones_Template', 'companyAssgin');
});
