$(function () {
    var l = abp.localization.getResource("MdmService");
    var l1 = abp.localization.getResource("OMSWeb");
    var salesOrgHeaderService = window.dMSpro.oMS.mdmService.controllers.salesOrgHeaders.salesOrgHeader;
    var salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;
    var salesOrgEmpAssignmentService = window.dMSpro.oMS.mdmService.controllers.salesOrgEmpAssignments.salesOrgEmpAssignment;
    var employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];
    const menuItems = [{ id: '1', text: l1('SalesOrgHierarchies.Context.Edit') }, { id: '2', text: l1('SalesOrgHierarchies.Context.AddSub') }, { id: '3', text: l1('SalesOrgHierarchies.Context.Delete') }];

    var stateMode = "home"; //value: home || add || edit; default: home
    var salesOrgHeaderIdFilter = null;
    var salesOrgHierarchyIdFilter = null;

    /****custom store*****/
    var salesOrgHeaderStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();

            var filterCode = [];
            if (loadOptions.searchValue != undefined && loadOptions.searchValue != "*") {
                filterCode = JSON.stringify(['code', 'contains', loadOptions.searchValue]);
            }

            salesOrgHeaderService.getListDevextremes({ filter: filterCode, skip: loadOptions.skip, take: loadOptions.take })
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
            salesOrgHeaderService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

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

    //Search Sales Org Header
    const salesOrgHeaderCode = $('#salesOrgHeaderCode').dxAutocomplete({
        dataSource: salesOrgHeaderStore,
        valueExpr: "code",
        label: l('EntityFieldName:MDMService:SalesOrgHeader:Code'),
        labelMode: "floating",
        showClearButton: true,
        maxItemCount: 50,
        showDropDownButton: true,
        buttons: [{
            name: 'btnSearch',
            location: 'after',
            options: {
                icon: 'search',
                type: 'normal',
                stylingMode: 'text',
                onClick() {
                    salesOrgHeaderCode.option({ minSearchLength: 0, opened: true });
                },
            },
        }],
        onSelectionChanged(data) {
            if (data.selectedItem != undefined && data.selectedItem.id != null) {
                salesOrgHeaderService.get(data.selectedItem.id)
                    .done(result => {
                        //change state to update
                        CheckState('edit');

                        //load data for Sales Org Hierarchy
                        salesOrgHeaderIdFilter = result.id;
                        dataTreeContainer.refresh().done(() => {
                            //re-focused the first row
                            dataTreeContainer.option({ focusedRowKey: null, focusedRowIndex: 0 });
                        });

                        //clear data for Sales Org Employee Assignment
                        salesOrgHierarchyIdFilter = null;
                        dataGridContainer.refresh();

                        //set textbox value - Name
                        salesOrgHeaderName.option("value", result.name);

                        //set button name - Active
                        if (result.active) {
                            $("#btnSalesOrgHeaderActive").html(l('EntityFieldValue:MDMService:SalesOrgHeader:Active:True'));
                        } else {
                            $("#btnSalesOrgHeaderActive").html(l('EntityFieldValue:MDMService:SalesOrgHeader:Active:False'));
                        }
                    });
            } else {
                //change state to home
                //CheckState('home');
            }
        },
    }).dxAutocomplete("instance");

    //TextBox - Sales Org Header Name
    var salesOrgHeaderName = $('#salesOrgHeaderName').dxTextBox({
        label: l('EntityFieldName:MDMService:SalesOrgHeader:Name'),
        labelMode: "floating"
    }).dxTextBox('instance');

    //Tree Sales Org Hierarchy
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


    //Grid Sales Org Employee Assignment
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
            var objectRequire = ['employeeProfileId', 'name', 'valueCode', 'valueName'];
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


    //Menu context
    $('#contextMenu').dxContextMenu({
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
                    dataTreeContainer.addRow(rowKey);
                    break;
                }
                case '3': {
                    dataTreeContainer.deleteRow(rowIndex);
                    break;
                }
                default:
                    break;
            }
        },
    }).dxContextMenu('instance');

    /****button*****/
    $("#NewSalesOrgButton").click(function (e) {
        e.preventDefault();
        CheckState('add');
    });

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
            active: true
        };

        if (stateMode == "add") {
            salesOrgHeaderService.create(orgHeaderValue, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    salesOrgHeaderIdFilter = result.id;
                    salesOrgHeaderCode.getDataSource().reload();
                    UpdateButton();
                    CheckState('edit');
                })
                .fail(() => { });
        } else if (stateMode == "edit" && salesOrgHeaderIdFilter != null) {
            salesOrgHeaderService.update(salesOrgHeaderIdFilter, orgHeaderValue, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    salesOrgHeaderCode.getDataSource().reload();
                });
        }
    });

    $("#CancelButton").click(function (e) {
        e.preventDefault();
        CheckState('home');
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

    function CheckState(state) {
        stateMode = state;
        switch (stateMode) {
            case 'home': {
                ResetControl();

                $("#NewSalesOrgButton").prop('disabled', false);
                $("#SaveButton, #CancelButton").prop('disabled', true);
                //$("#NewSalesOrgHierarchyButton,#NewSalesOrgEmpAssignmentButton").prop('disabled', false);
                break;
            }
            case 'add': {
                ResetControl();

                $("#NewSalesOrgButton").prop('disabled', true);
                $("#SaveButton, #CancelButton").prop('disabled', false);
                //$("#NewSalesOrgHierarchyButton,#NewSalesOrgEmpAssignmentButton").prop('disabled', true);
                break;
            }
            case 'edit': {
                salesOrgHeaderCode.getButton("btnSearch").option("visible", true);
                $("#NewSalesOrgButton, #SaveButton, #CancelButton").prop('disabled', false);
                break;
            }
            default:
                break;
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

    function ResetControl() {
        //clear data for Sales Org Hierarchy
        salesOrgHeaderIdFilter = null;
        dataTreeContainer.refresh();

        //clear data for Sales Org Employee Assignment
        salesOrgHierarchyIdFilter = null;
        dataGridContainer.refresh();

        //clear textbox value - Name
        salesOrgHeaderName.reset();

        salesOrgHeaderCode.reset();
        salesOrgHeaderCode.getButton("btnSearch").option("visible", true);
        salesOrgHeaderCode.option('isValid', true);
        salesOrgHeaderName.reset();

        //reset active button
        $("#btnSalesOrgHeaderActive").html(l('EntityFieldValue:MDMService:SalesOrgHeader:Active:True')).prop('disabled', true);
    }
});