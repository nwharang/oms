$(function () {
    var l = abp.localization.getResource("MdmService");
    var l1 = abp.localization.getResource("OMSWeb");
    var salesOrgHeaderService = window.dMSpro.oMS.mdmService.controllers.salesOrgHeaders.salesOrgHeader;
    var salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;
    var salesOrgEmpAssignmentService = window.dMSpro.oMS.mdmService.controllers.salesOrgEmpAssignments.salesOrgEmpAssignment;
    var employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];
    const menuItems = [{ id: '1', text: l1('SalesOrgHierarchies.Context.Edit') }, { id: '2', text: l1('SalesOrgHierarchies.Context.AddSub') }, { id: '3', text: l1('SalesOrgHierarchies.Context.AddRoute') }, { id: '4', text: l1('SalesOrgHierarchies.Context.Delete') }];

    //get data from sessionStorage
    var SalesOrgHeaderModel = null;

    var stateMode = "home"; //value: add || edit;
    var salesOrgHeaderIdFilter = null;
    var salesOrgHierarchyIdFilter = null;
    var isRoute = false;

    /****custom store*****/

    var salesOrgHierarchyStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            salesOrgHierarchyService.getListDevextremes({ filter: JSON.stringify([["salesOrgHeaderId", "=", salesOrgHeaderIdFilter], "and", ["isDeleted", "=", false]]) })
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

    var salesOrgEmpAssignmentStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();

            if (loadOptions.filter == null) {
                loadOptions.filter = ["salesOrgHierarchyId", "=", salesOrgHierarchyIdFilter];
            }

            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            salesOrgEmpAssignmentService.getListDevextremes(args)
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
            salesOrgEmpAssignmentService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {
            return salesOrgEmpAssignmentService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return salesOrgEmpAssignmentService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return salesOrgEmpAssignmentService.delete(key);
        }
    });

    var employeeProfileStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            employeeProfileService.getListDevextremes(args)
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
            employeeProfileService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    /****control*****/

    //TextBox - Sales Org Header Code
    var salesOrgHeaderCode = $('#salesOrgHeaderCode').dxTextBox({
        label: l('EntityFieldName:MDMService:SalesOrgHeader:Code'),
        labelMode: "floating"
    }).dxTextBox('instance');

    //TextBox - Sales Org Header Name
    var salesOrgHeaderName = $('#salesOrgHeaderName').dxTextBox({
        label: l('EntityFieldName:MDMService:SalesOrgHeader:Name'),
        labelMode: "floating"
    }).dxTextBox('instance');

    //TreeList - Sales Org Hierarchy
    const dataTreeContainer = $('#dataTreeContainer').dxTreeList({
        dataSource: salesOrgHierarchyStore,
        keyExpr: 'id',
        parentIdExpr: "parentId",
        remoteOperations: true,
        autoExpandAll: true,
        focusedRowEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: false,
        columnAutoWidth: true,
        columnHidingEnabled: true,
        showColumnHeaders: false,
        showRowLines: false,
        showBorders: false,
        errorRowEnabled: false,
        focusedRowEnabled: true,
        focusedRowIndex: 0,
        filterRow: {
            visible: false
        },
        searchPanel: {
            visible: false
        },
        scrolling: {
            mode: 'standard'
        },
        paging: {
            enabled: true,
            pageSize: 20
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100],
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
            // for create first data - if parentId = 0, update parentId = null
            if (e.data && e.data.parentId == 0) {
                e.data.parentId = null;
            }
            e.data.salesOrgHeaderId = salesOrgHeaderIdFilter;
            e.data.isRoute = isRoute;
            e.data.code = '001';
            e.data.hierarchyCode = '001';
        },
        onRowUpdating: function (e) {
            var objectRequire = ['salesOrgHeaderId', 'parentId', 'name'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }

            e.newData['salesOrgHeaderId'] = salesOrgHeaderIdFilter;
            e.newData['code'] = '001';
            e.newData['hierarchyCode'] = '001';
        },
        onFocusedRowChanged: function (e) {
            //load data for Sales Org Employee Assignment
            salesOrgHierarchyIdFilter = dataTreeContainer.option("focusedRowKey");
            dataGridContainer.refresh();
        },
        onSaved(e) {
            e.component.option({ focusedRowKey: null });
            UpdateButton();
        },
        onContentReady() {
            UpdateButton();
        },
        onContextMenuPreparing: onTreeListItemContextMenu,
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
                caption: l("Actions"),
                type: 'buttons',
                width: 120,
                buttons: ['add', 'edit', 'delete'],
                visible: false
            },
            {
                caption: 'Name',
                dataField: "name",
                validationRules: [{ type: "required" }]
            }
        ]
    }).dxTreeList("instance");

    //DataGrid - Sales Org Employee Assignment
    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: salesOrgEmpAssignmentStore,
        remoteOperations: true,
        showBorders: true,
        focusedRowEnabled: true,
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        columnHidingEnabled: true,
        errorRowEnabled: false,
        filterRow: {
            visible: false
        },
        searchPanel: {
            visible: false
        },
        scrolling: {
            mode: 'standard'
        },
        paging: {
            enabled: true,
            pageSize: 20
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100],
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
        onInitNewRow(e) {
            e.data.salesOrgHierarchyId = dataTreeContainer.option("focusedRowKey");
        },
        onRowUpdating: function (e) {
            var objectRequire = ['salesOrgHierarchyId', 'employeeProfileId', 'isBase', 'effectiveDate', 'endDate'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 100,
                buttons: ['edit', 'delete']
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgEmpAssignment:EmployeeFullName'),
                dataField: "employeeProfileId",
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource() {
                        return {
                            store: employeeProfileStore
                        };
                    },
                    displayExpr: 'firstName',
                    valueExpr: 'id',
                }
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgEmpAssignment:IsBase'),
                dataField: "isBase",
                dataType: 'boolean'
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgEmpAssignment:Effective Date'),
                dataField: "effectiveDate",
                dataType: 'date',
                validationRules: [{ type: "required" }],
                editorOptions: {
                    min: new Date()
                }
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgEmpAssignment:EndDate'),
                dataField: "endDate",
                dataType: 'date',
                editorOptions: {
                    min: new Date()
                }
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgEmpAssignment:SalesOrgHierarchy'),
                dataField: "salesOrgHierarchyId",
                validationRules: [{ type: "required" }],
                visible: false,
                allowEditing: false,
                lookup: {
                    dataSource() {
                        return {
                            store: salesOrgHierarchyStore,
                            filter: ["id", "=", dataTreeContainer.option("focusedRowKey")]
                        };
                    },
                    displayExpr: 'name',
                    valueExpr: 'id',
                }
            }
        ]
    }).dxDataGrid("instance");

    //ContextMenu - for TreeList - Sales Org Hierarchy
    const contextMenu = $('#contextMenu').dxContextMenu({
        dataSource: menuItems,
        target: '#dataTreeContainer .dx-row.dx-data-row',
        onItemClick: function (e) {
            var rowKey = dataTreeContainer.option("focusedRowKey");
            var rowIndex = dataTreeContainer.option("focusedRowIndex");
            switch (e.itemData.id) {
                case '1': {
                    dataTreeContainer.editRow(rowIndex);
                    break;
                }
                case '2': {
                    isRoute = false;
                    dataTreeContainer.addRow(rowKey);
                    break;
                }
                case '3': {
                    isRoute = true;
                    dataTreeContainer.addRow(rowKey);
                    break;
                }
                case '4': {
                    dataTreeContainer.deleteRow(rowIndex);
                    break;
                }
                default:
                    break;
            }
        },
    }).dxContextMenu('instance');

    /****button*****/

    $("#SaveButton").click(function (e) {
        e.preventDefault();

        var code = salesOrgHeaderCode.option("value");
        var name = salesOrgHeaderName.option("value");

        if (code == null) {
            salesOrgHeaderCode.option('isValid', false);
            salesOrgHeaderCode.focus();
            return;
        }

        var orgHeaderValue = {
            code: code,
            name: name,
            active: false
        };

        if (stateMode == "add") {
            salesOrgHeaderService.create(orgHeaderValue, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    salesOrgHeaderIdFilter = result.id;
                    sessionStorage.setItem("SalesOrg", JSON.stringify(result));
                    SalesOrgHeaderModel = result;
                    UpdateButton();
                    stateMode = 'edit';
                })
                .fail(() => { });
        } else if (stateMode == "edit" && salesOrgHeaderIdFilter != null) {
            salesOrgHeaderService.update(salesOrgHeaderIdFilter, orgHeaderValue, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    sessionStorage.setItem("SalesOrg", JSON.stringify(result));
                    SalesOrgHeaderModel = result;
                });
        }
    });

    $("#CloseButton").click(function (e) {
        e.preventDefault();
        var currentCode = salesOrgHeaderCode.option("value");
        var currentName = salesOrgHeaderName.option("value");
        var previousCode = SalesOrgHeaderModel != null ? SalesOrgHeaderModel.code : '';
        var previousName = SalesOrgHeaderModel != null ? SalesOrgHeaderModel.name : '';

        if (currentCode != previousCode || currentName != previousName) {
            abp.message.confirm(l1('ConfirmationMessage.UnSavedAndLeave'), l1('ConfirmationMessage.UnSavedAndLeaveTitle')).then(function (confirmed) {
                if (confirmed) {
                    window.close();
                }
            });
        } else {
            window.close();
        }
    });

    $("#NewSalesOrgHierarchyButton").click(function (e) {
        e.preventDefault();
        dataTreeContainer.addRow();
    });

    $("#NewSalesOrgEmpAssignmentButton").click(function (e) {
        e.preventDefault();
        dataGridContainer.addRow();
    });

    $("#btnSalesOrgHeaderActive").click(function (e) {
        e.preventDefault();

        abp.message.confirm().then(function (confirmed) {
            if (confirmed && salesOrgHeaderIdFilter != null) {
                salesOrgHeaderService.get(salesOrgHeaderIdFilter)
                    .done(data => {
                        var orgHeaderValue = {
                            code: data.code,
                            name: data.name,
                            active: !data.active
                        };
                        salesOrgHeaderService.update(salesOrgHeaderIdFilter, orgHeaderValue, { contentType: "application/json" })
                            .done(result => {
                                abp.message.success(l('Congratulations'));
                                sessionStorage.setItem("SalesOrg", JSON.stringify(result));
                                SalesOrgHeaderModel = result;
                                if (result.active) {
                                    $("#btnSalesOrgHeaderActive").html(l('EntityFieldValue:MDMService:SalesOrgHeader:Active:True'));
                                } else {
                                    $("#btnSalesOrgHeaderActive").html(l('EntityFieldValue:MDMService:SalesOrgHeader:Active:False'));
                                }
                            });
                    });
            }
        });
    });

    /****function*****/
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }

    function onTreeListItemContextMenu(e) {
        const isRoute = e.row.data.isRoute;
        const active = SalesOrgHeaderModel.active;

        if (active) {
            //active = true -> show Add Route
            contextMenu.option('items[0].visible', false);
            contextMenu.option('items[1].visible', false);
            contextMenu.option('items[2].visible', true);
            contextMenu.option('items[3].visible', false);

            //active = true & isRoute = true -> hide menu;
            contextMenu.option('disabled', isRoute);

        } else {
            //active = false && isRoute = true -> show Edit & Delete
            if (isRoute) {
                contextMenu.option('items[0].visible', true);
                contextMenu.option('items[1].visible', false);
                contextMenu.option('items[2].visible', false);
                contextMenu.option('items[3].visible', true);
            } else {
                contextMenu.option('items[0].visible', true);
                contextMenu.option('items[1].visible', true);
                contextMenu.option('items[2].visible', true);
                contextMenu.option('items[3].visible', true);
            }
            contextMenu.option('disabled', false);
        }
    }

    function LoadData() {
        SalesOrgHeaderModel = JSON.parse(sessionStorage.getItem("SalesOrg"));
        if (SalesOrgHeaderModel == null) {
            stateMode = 'add';
        } else {
            stateMode = 'edit';
            salesOrgHeaderIdFilter = SalesOrgHeaderModel.id;
            salesOrgHeaderCode.option("value", SalesOrgHeaderModel.code);
            salesOrgHeaderName.option("value", SalesOrgHeaderModel.name);

            if (SalesOrgHeaderModel.active) {
                $("#btnSalesOrgHeaderActive").html(l('EntityFieldValue:MDMService:SalesOrgHeader:Active:True'));
            } else {
                $("#btnSalesOrgHeaderActive").html(l('EntityFieldValue:MDMService:SalesOrgHeader:Active:False'));
            }
        }
    }

    function UpdateButton() {
        if ($('#dataTreeContainer span[class="dx-treelist-nodata"]').length == 0) {
            $("#NewSalesOrgHierarchyButton").prop('disabled', true);
            $("#NewSalesOrgEmpAssignmentButton").prop('disabled', false);
        } else {
            $("#NewSalesOrgHierarchyButton").prop('disabled', false);
            $("#NewSalesOrgEmpAssignmentButton").prop('disabled', true);
        }

        if (salesOrgHeaderIdFilter == null) {
            $("#NewSalesOrgHierarchyButton").prop('disabled', true);
            $("#btnSalesOrgHeaderActive").prop('disabled', true);
        } else {
            $("#btnSalesOrgHeaderActive").prop('disabled', false);
        }
    }

    LoadData();
});