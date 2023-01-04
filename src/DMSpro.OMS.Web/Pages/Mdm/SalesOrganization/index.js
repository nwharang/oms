$(function () {
    var l = abp.localization.getResource("MdmService");
    var salesOrgHeaderService = window.dMSpro.oMS.mdmService.controllers.salesOrgHeaders.salesOrgHeader;
    var salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;
    var salesOrgEmpAssignmentService = window.dMSpro.oMS.mdmService.controllers.salesOrgEmpAssignments.salesOrgEmpAssignment;
    var employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];
    const menuItems = [
        { id: '1', text: 'Edit' },
        { id: '2', text: 'Add sub Org Hierarchy' },
        { id: '3', text: 'Delete' }
    ];

    var stateMode = "home"; //value: home || add || edit; default: home
    var salesOrgHeaderIdFilter = null;
    var salesOrgHierarchyIdFilter = null;

    /****custom store*****/
    var salesOrgHeaderStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();

            var filterCode = [];
            if (loadOptions.searchValue != undefined) {
                filterCode = JSON.stringify(['code', 'contains', loadOptions.searchValue]);
            }

            salesOrgHeaderService.getListDevextremes({ filter: filterCode })
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
    const searchBox = $('#searchCode').dxSelectBox({
        dataSource: salesOrgHeaderStore,
        displayExpr: 'code',
        valueExpr: 'id',
        searchEnabled: true,
        showClearButton: true,
        noDataText: l('NoData'),
        width: "250px",
        onValueChanged(data) {
            if (data.value != null) {
                salesOrgHeaderService.get(data.value)
                    .done(result => {
                        //change state to update
                        CheckState('edit');

                        //load data for Sales Org Hierarchy
                        salesOrgHeaderIdFilter = result.id;
                        dataTreeContainer.refresh();
                        dataTreeContainer.option({ focusedRowIndex: 0 })

                        //clear data for Sales Org Employee Assignment
                        salesOrgHierarchyIdFilter = null;
                        dataGridContainer.refresh();

                        //set textbox value - Name
                        $("#salesOrgHeaderName").val(result.name);

                        //set button name - Active
                        if (result.active) {
                            $("#btnActive").html(l('EntityFieldValue:MDMService:SalesOrgHeader:Active:False'));
                        } else {
                            $("#btnActive").html(l('EntityFieldValue:MDMService:SalesOrgHeader:Active:True'));
                        }
                    });
            } else {
                //change state to home
                CheckState('home');

                //clear data for Sales Org Hierarchy
                salesOrgHeaderIdFilter = null;
                dataTreeContainer.refresh();

                //clear data for Sales Org Employee Assignment
                salesOrgHierarchyIdFilter = null;
                dataGridContainer.refresh();

                //clear textbox value - Name
                $("#salesOrgHeaderName").val('');
            }

        }
    }).dxSelectBox('instance');

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
        onSaved() {
            UpdateDetailButton();
        },
        onContentReady() {
            UpdateDetailButton();
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
        UpdateDetailButton();
    });

    $("#SaveButton").click(function (e) {
        e.preventDefault();

        var orgHeaderValue = {
            code: $("#salesOrgHeaderCode").val(),
            name: $("#salesOrgHeaderName").val(),
            active: true
        };

        if (stateMode == "add") {
            salesOrgHeaderService.create(orgHeaderValue, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    CheckState('home');
                })
                .fail(() => { LoadingButton("SaveButton", false); });
        } else if (stateMode == "edit") {
            console.log('edit');
        }
    });

    $("#CloseButton").click(function (e) {
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

    /****function*****/
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }

    function CheckState(state) {
        stateMode = state;
        switch (stateMode) {
            case 'home': {
                searchBox.reset();
                $("#NewSalesOrgButton,#searchCode").show();
                $("#SaveButton,#CloseButton,#salesOrgHeaderCode,.elHide").hide();
                $("#NewSalesOrgHierarchyButton,#NewSalesOrgEmpAssignmentButton").prop('disabled', false);
                break;
            }
            case 'add': {
                $("#NewSalesOrgButton,#searchCode").hide();
                $("#SaveButton,#CloseButton,#salesOrgHeaderCode,.elHide").show();
                $("#NewSalesOrgHierarchyButton,#NewSalesOrgEmpAssignmentButton").prop('disabled', true);
                break;
            }
            case 'edit': {
                $("#NewSalesOrgButton").hide();
                $("#SaveButton,#CloseButton,.elHide").show();
                break;
            }
            default:
                break;
        }
    }

    function UpdateDetailButton() {
        //disable NewSalesOrgHierarchyButton if Sales Org Header have data
        //disable NewSalesOrgEmpAssignmentButton if Sales Org Hierarchy have't data
        if ($('#dataTreeContainer span[class="dx-treelist-nodata"]').length == 0) {
            $("#NewSalesOrgHierarchyButton").prop('disabled', true);
            $("#NewSalesOrgEmpAssignmentButton").prop('disabled', false);
        } else {
            $("#NewSalesOrgHierarchyButton").prop('disabled', false);
            $("#NewSalesOrgEmpAssignmentButton").prop('disabled', true);
        }
    }
});