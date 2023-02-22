var l = abp.localization.getResource("MdmService");
var MCPHeaderModel;
var mcpDetailData = [];
$(function () {

    DevExpress.config({
        editorStylingMode: 'underlined',
    });

    var salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;
    var itemGroupService = window.dMSpro.oMS.mdmService.controllers.itemGroups.itemGroup;
    var companyInZoneService = window.dMSpro.oMS.mdmService.controllers.companyInZones.companyInZone;
    var employeeProfileService = window.dMSpro.oMS.mdmService.controllers.employeeProfiles.employeeProfile;
    var mCPHeaderService = window.dMSpro.oMS.mdmService.controllers.mCPHeaders.mCPHeader;
    var companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    var mCPDetailsService = window.dMSpro.oMS.mdmService.controllers.mCPDetails.mCPDetail;
    var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
    var visitPlanService = window.dMSpro.oMS.mdmService.controllers.visitPlans.visitPlan;

    var customerStore = new DevExpress.data.CustomStore({
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

    var companyInZoneStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            const deferred = $.Deferred();
            companyInZoneService.getListDevextremes(args)
                .done(result => {
                    const d = $.Deferred();
                    result.data.forEach(u => {
                        companyService.get(u.companyId)
                            .done(data => {
                                u.companyName = data.name;
                                d.resolve(data);
                            });
                    })
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
            companyInZoneService.get(key)
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
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            salesOrgHierarchyService.getListDevextremes(args)
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
        }
    });

    var itemGroupStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            itemGroupService.getListDevextremes(args)
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
            itemGroupService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    });


    var mCPDetailsStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            if (!MCPHeaderModel)
                return deferred.resolve([], {
                    totalCount: -1,
                    groupCount: -1,
                    summary: null,
                }).promise();

            if (loadOptions.filter == null) {
                loadOptions.filter = ["mcpHeaderId", "=", MCPHeaderModel.id];
            } else {
                loadOptions.filter = [loadOptions.filter, "and", ["mcpHeaderId", "=", MCPHeaderModel.id]];
            }
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            mCPDetailsService.getListDevextremes(args)
                .done(result => {
                    result.data.forEach(x => {
                        x.address = "";
                        x.customerIdExtra = x.customerId;
                    });
                    mcpDetailData = result.data;

                    //deferred.resolve(result.data, {
                    //    totalCount: result.totalCount,
                    //    summary: result.summary,
                    //    groupCount: result.groupCount,
                    //});
                });

            return deferred.promise();
        },
        //byKey: function (key) {
        //    if (key == 0) return null;

        //    var d = new $.Deferred();
        //    mCPDetailsService.get(key)
        //        .done(data => {
        //            d.resolve(data);
        //        });
        //    return d.promise();
        //},
        insert(values) {
            values.mcpHeaderId = MCPHeaderModel ? MCPHeaderModel.id : null;
            values.code = "1";//fake value, check api
            mcpDetailData.push(values);

            //return mCPDetailsService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            values.mcpHeaderId = MCPHeaderModel.id; MCPHeaderModel ? MCPHeaderModel.id : null;
            values.code = "1";//fake value, check api
            return mCPDetailsService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return mCPDetailsService.delete(key);
        }
    });

    $("#top-section").dxForm({
        labelMode: 'floating',
        colCount: 4,
        items: [
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'Route',
                        editorType: 'dxSelectBox',
                        validationRules: [{
                            type: 'required',
                            message: 'Route is required',
                        }],
                        editorOptions: {
                            dataSource: new DevExpress.data.DataSource({
                                store: salesOrgHierarchyStore,
                                filter: ["isRoute", "=", true],
                                paginate: true,
                                pageSize: pageSizeForLookup
                            }),
                            showClearButton: true,
                            placeholder: '',
                            valueExpr: "id",
                            displayExpr: "name"
                        }
                    },
                    {
                        dataField: 'Company',
                        editorType: 'dxSelectBox',
                        validationRules: [{
                            type: 'required',
                            message: 'Company is required',
                        }],
                        editorOptions: {
                            readOnly: true,
                            //dataSource: new DevExpress.data.DataSource({
                            //    store: companyInZoneStore,
                            //    filter: ["salesOrgHierarchyId", "=", -1],
                            //    paginate: true,
                            //    pageSize: pageSize
                            //}),
                            showClearButton: true,
                            placeholder: '',
                            valueExpr: "companyId",
                            displayExpr: "company.name",
                        }
                    },
                    {
                        dataField: 'ItemGroup',
                        editorType: 'dxSelectBox',
                        editorOptions: {
                            dataSource: new DevExpress.data.DataSource({
                                store: itemGroupStore,
                                paginate: true,
                                pageSize: pageSizeForLookup
                            }),
                            showClearButton: true,
                            placeholder: '',
                            valueExpr: "id",
                            displayExpr: "name",
                        }
                    }
                ]
            },
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'Code',
                        validationRules: [{
                            type: 'required',
                            message: 'Code is required',
                        }],
                    },
                    {
                        dataField: 'Name',
                        validationRules: [{
                            type: 'required',
                            message: 'Name is required',
                        }],
                    }
                    //, {
                    //    dataField: 'IsGPSLocked',
                    //    editorType: 'dxCheckBox'
                    //}
                ]
            },
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'EffectiveDate',
                        editorType: 'dxDateBox',
                        validationRules: [{
                            type: 'required',
                            message: 'EffectiveDate is required',
                        }],
                        editorOptions: {
                            min: new Date(),
                            displayFormat: 'dd/MM/yyyy',
                            showClearButton: true
                        }
                    }, {
                        dataField: 'EndDate',
                        editorType: 'dxDateBox',
                        editorOptions: {
                            min: new Date(),
                            displayFormat: 'dd/MM/yyyy',
                            showClearButton: true
                        }
                    }]
            }
        ]
    });
    $('#GenerateButton').dxButton({
        stylingMode: 'contained',
        type: 'normal',
        disabled: true
    });
    $('#EnddateButton').dxButton({
        stylingMode: 'contained',
        type: 'normal',
        disabled: true
    });
    $('#SaveButton').dxButton({
        stylingMode: 'contained',
        type: 'normal'
    });
    $('#resizable').dxResizable({
        minHeight: 120,
        handles: "bottom"
    }).dxResizable('instance');

    var dgMCPDetails = $('#dgMCPDetails')
        .dxDataGrid({
            dataSource: mcpDetailData,
            onEditingStart: function (e) {
                $('#SaveButton').data('dxButton').option('disabled', true);
            },
            onSaved: function (e) {
                $('#SaveButton').data('dxButton').option('disabled', false);
            },
            onEditCanceled: function (e) {
                $('#SaveButton').data('dxButton').option('disabled', false);
            },
            editing: {
                mode: "row",
                allowAdding: abp.auth.isGranted('MdmService.MCPHeaders.Create'),
                allowUpdating: true,
                allowDeleting: true,
                useIcons: true,
                texts: {
                    editRow: l("Edit"),
                    deleteRow: l("Delete"),
                    confirmDeleteMessage: l("DeleteConfirmationMessage")
                }
            },
            remoteOperations: true,
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
            showRowLines: true,
            showBorders: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            columnResizingMode: 'widget',
            columnMinWidth: 50,
            columnAutoWidth: true,
            columnChooser: {
                enabled: true,
                mode: "select"
            },
            columnFixing: {
                enabled: true,
            },
            filterRow: {
                visible: true,
            },
            groupPanel: {
                visible: true,
            },
            headerFilter: {
                visible: true,
            },
            rowAlternationEnabled: true,
            searchPanel: {
                visible: true
            },
            stateStoring: { //save state in localStorage
                enabled: true,
                type: 'localStorage',
                storageKey: 'dgMCPDetails',
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
                    "groupPanel",
                    {
                        location: 'after',
                        template: '<button  id="AddNewButton" type="button" class="btn btn-sm btn-outline-default waves-effect waves-themed" style="height: 36px;"> <i class="fa fa-plus"></i> </button>',
                        onClick() {
                            dgMCPDetails.addRow();
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
            onEditorPreparing: function (e) {
                var component = e.component,
                    rowIndex = e.row && e.row.rowIndex;
                if (e.dataField === "customerId") {
                    e.editorOptions.placeholder = '';
                    var onValueChanged = e.editorOptions.onValueChanged;
                    e.editorOptions.onValueChanged = function (e) {
                        onValueChanged.call(this, e);
                        component.cellValue(rowIndex, "customerIdExtra", e.component.option('selectedItem').id);
                    }
                } else if (e.dataField == "effectiveDate" || e.dataField == "endDate") {
                    e.editorOptions.displayFormat = "dd/MM/yyyy";
                    e.editorOptions.min = new Date();
                }
            },
            onRowUpdating: function (e) {
                var objectRequire = ['customerId',
                    'effectiveDate',
                    'endDate',
                    'distance',
                    'visitOrder',
                    'monday',
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                    "week1",
                    "week2",
                    "week3",
                    "week4"];
                for (var property in e.oldData) {
                    if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                        e.newData[property] = e.oldData[property];
                    }
                }
            },
            onInitNewRow: function (e) {
                $('#SaveButton').data('dxButton').option('disabled', true);
                e.data.code = "1";
                e.data.effectiveDate = null;
                e.data.endDate = null;
                e.data.distance = 0;
                e.data.visitOrder = 0;
                e.data.monday = false;
                e.data.tuesday = false;
                e.data.wednesday = false;
                e.data.thursday = false;
                e.data.friday = false;
                e.data.saturday = false;
                e.data.sunday = false;
                e.data.week1 = false;
                e.data.week2 = false;
                e.data.week3 = false;
                e.data.week4 = false,
                    e.data.customerId = null;
                //e.data.mcpHeaderId = MCPHeaderModel ? MCPHeaderModel.id : null;
            },
            columns: [
                {
                    type: 'buttons',
                    caption: l("Actions"),
                    width: 110,
                    buttons: ['edit', 'delete'],
                    fixedPosition: "left",
                },
                {
                    caption: "Customer",
                    dataField: "customerId",
                    validationRules: [{ type: "required", message: '' }],
                    lookup: {
                        dataSource() {
                            return {
                                store: customerStore,
                                /*  filter: ["employeeTypeId", "=", "4623cb59-c099-1615-149f-3a0861252b0d"],//salesman*/
                                paginate: true,
                                pageSize: pageSizeForLookup
                            };
                        },
                        displayExpr: 'name',
                        valueExpr: 'id',
                        searchEnabled: true,
                        searchMode: 'contains'
                    }
                },
                {
                    caption: "Address",
                    dataField: "customerIdExtra",
                    allowEditing: false,
                    lookup: {
                        dataSource() {
                            return {
                                store: customerStore,
                                /*  filter: ["employeeTypeId", "=", "4623cb59-c099-1615-149f-3a0861252b0d"],//salesman*/
                                paginate: true,
                                pageSize: pageSizeForLookup
                            };
                        },
                        displayExpr: 'address',
                        valueExpr: 'id',
                        searchEnabled: true,
                        searchMode: 'contains'
                    }
                },
                {
                    caption: "Effective Date",
                    dataField: "effectiveDate",
                    dataType: "date",
                    format: 'dd/MM/yyyy',
                    validationRules: [{ type: "required", message: '' }],
                }, {
                    caption: "EndDate",
                    dataField: "endDate",
                    dataType: "date",
                    format: 'dd/MM/yyyy',
                    validationRules: [{ type: "required", message: '' }],
                }, {

                    caption: "Distance",
                    dataField: "distance",
                    dataType: "number",
                }, {

                    caption: "Visit Order",
                    dataField: "visitOrder",
                    dataType: "number",
                }, {

                    caption: "Monday",
                    dataField: "monday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: "Tuesday",
                    dataField: "tuesday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: "Wednesday",
                    dataField: "wednesday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: "Thursday",
                    dataField: "thursday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: "Friday",
                    dataField: "friday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: "Saturday",
                    dataField: "saturday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: "Sunday",
                    dataField: "sunday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: "Week1",
                    dataField: "week1",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: "Week2",
                    dataField: "week2",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: "Week3",
                    dataField: "week3",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: "Week4",
                    dataField: "week4",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }
            ],
        }).dxDataGrid("instance");

    $('#SaveButton').click(function (e) {
        e.preventDefault();
        var form = $("#top-section").data('dxForm');
        var routeId = form.getEditor('Route').option('value');
        var companyId = form.getEditor('Company').option('value');
        var itemGroupId = form.getEditor('ItemGroup').option('value');
        var code = form.getEditor('Code').option('value');
        var name = form.getEditor('Name').option('value');
        //var isGPSLocked = form.getEditor('IsGPSLocked').option('value');
        var effectiveDate = form.getEditor('EffectiveDate').option('value');
        var endDate = form.getEditor('EndDate').option('value');

        if (routeId == null) {
            form.getEditor('Route').option('isValid', false);
            form.getEditor('Route').focus();
            return;
        }
        if (companyId == null) {
            form.getEditor('Company').option('isValid', false);
            form.getEditor('Company').focus();
            return;
        }
        if (code == null) {
            form.getEditor('Code').option('isValid', false);
            form.getEditor('Code').focus();
            return;
        }
        if (name == null) {
            form.getEditor('Name').option('isValid', false);
            form.getEditor('Name').focus();
            return;
        }
        if (effectiveDate == null) {
            form.getEditor('EffectiveDate').option('isValid', false);
            form.getEditor('EffectiveDate').focus();
            return;
        }

        var mcpHeaderDto = {
            routeId,
            companyId,
            itemGroupId,
            code,
            name,
            effectiveDate,
            endDate
        };
        var mcpDetails = [];

        dgMCPDetails.getDataSource().items().forEach(u => {
            mcpDetails.push(u);
        });
        var params = {
            mcpHeaderDto: mcpHeaderDto,
            mcpDetails: mcpDetails,
        }


        if (!MCPHeaderModel)
            mCPHeaderService.createMCP(params, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    MCPHeaderModel = {
                        id: result.mcpHeaderDto.id
                    };
                    sessionStorage.setItem("MCPHeaderModel", JSON.stringify(result));

                    $('#GenerateButton').data('dxButton').option('disabled', false);
                    $('#EnddateButton').data('dxButton').option('disabled', false);
                }).fail(() => { });
        //else
        //    mCPHeaderService.update(MCPHeaderModel.id, params, { contentType: "application/json" })
        //        .done(result => {
        //            abp.message.success(l('Congratulations'));
        //            MCPHeaderModel = result;
        //            sessionStorage.setItem("MCPHeaderModel", JSON.stringify(result));
        //        });
    })

    $("#CloseButton").click(function (e) {
        e.preventDefault();

        var form = $("#top-section").data('dxForm');

        var currentRouteId = form.getEditor('Route').option('value');
        var currentCompanyId = form.getEditor('Company').option('value');
        var currentItemGroupId = form.getEditor('ItemGroup').option('value');
        var currentCode = form.getEditor('Code').option('value');
        var currentName = form.getEditor('Name').option('value');
        // var currentIsGPSLocked = form.getEditor('IsGPSLocked').option('value');
        var currentEffectiveDate = form.getEditor('EffectiveDate').option('value');
        var currentEndDate = form.getEditor('EndDate').option('value');


        var previousRouteId = MCPHeaderModel.routeId;
        var previousCompanyId = MCPHeaderModel.companyId;
        var previousItemGroupId = MCPHeaderModel.itemGroupId;
        var previousCode = MCPHeaderModel.code;
        var previousName = MCPHeaderModel.name;
        // var previousIsGPSLocked = MCPHeaderModel.isGPSLocked;
        var previousEffectiveDate = MCPHeaderModel.effectiveDate;
        var previousEndDate = MCPHeaderModel.endDate;

        if (currentRouteId != previousRouteId
            || currentCompanyId != previousCompanyId
            || currentItemGroupId != previousItemGroupId
            || currentCode != previousCode
            || currentName != previousName
            // || currentIsGPSLocked != previousIsGPSLocked
            || currentEffectiveDate != previousEffectiveDate
            || currentEndDate != previousEndDate
        ) {
            abp.message.confirm(l1('ConfirmationMessage.UnSavedAndLeave'), l1('ConfirmationMessage.UnSavedAndLeaveTitle')).then(function (confirmed) {
                if (confirmed) {
                    window.close();
                }
            });
        } else {
            window.close();
        }
    });
    $("#GenerateButton").click(function (e) {
        e.preventDefault();
        $('#popupGenMCP').data('dxPopup').show();
    });
    $("#EnddateButton").click(function (e) {
        e.preventDefault();
        if (MCPHeaderModel)
            popupEnddateMCP.show();
    });

    function LoadData() {
        var jsonData = sessionStorage.getItem("MCPHeaderModel");
        if (jsonData) {
            MCPHeaderModel = JSON.parse(jsonData);
            var form = $("#top-section").data('dxForm');
            form.getEditor('Route').option('value', MCPHeaderModel.routeId);
            form.getEditor('Company').option('value', MCPHeaderModel.companyId);
            form.getEditor('ItemGroup').option('value', MCPHeaderModel.itemGroupId);
            form.getEditor('Code').option('value', MCPHeaderModel.code);
            form.getEditor('Name').option('value', MCPHeaderModel.name);

            form.getEditor('EffectiveDate').option('value', MCPHeaderModel.effectiveDate);
            form.getEditor('EndDate').option('value', MCPHeaderModel.endDate);

            $('#GenerateButton').data('dxButton').option('disabled', false);
            $('#EnddateButton').data('dxButton').option('disabled', false);
        }
    }
    LoadData();

    function routeChangedHandler(data) {
        if (data.value !== null) {
            const selectedItem = data.component.option('selectedItem');

            var dxCompany = $('input[name=Company]').closest('.dx-selectbox').data('dxSelectBox');
            dxCompany.option('readOnly', false);
            dxCompany.option('dataSource', new DevExpress.data.DataSource({
                store: companyInZoneStore,
                filter: ["salesOrgHierarchyId", "=", selectedItem.parentId],
                paginate: true,
                pageSize: pageSize
            }));

        } else {
            var dxCompany = $('input[name=Company]').closest('.dx-selectbox').data('dxSelectBox');
            dxCompany.editorOptions.readOnly = true;
            dxCompany.editorOptions.dataSource = null;
        }
    }
    $("#top-section").data('dxForm').getEditor('Route').on("valueChanged", routeChangedHandler)
    function getNextDate(arg) {
        const today = new Date()
        let feature = new Date()
        feature.setDate(today.getDate() + arg)
        return feature;
    }
    $('#StartDate').dxDateBox({
        type: 'date',
        showClearButton: true,
        min: getNextDate(1),
        displayFormat: 'dd/MM/yyyy',
    });
    $('#EndDate').dxDateBox({
        type: 'date',
        showClearButton: true,
        min: getNextDate(2),
        displayFormat: 'dd/MM/yyyy',
    });
    $('#EndDateMCP').dxDateBox({
        type: 'date',
        showClearButton: true,
        min: getNextDate(1),
        displayFormat: 'dd/MM/yyyy',
    });
    const popupGenMCP = $('#popupGenMCP').dxPopup({
        width: 400,
        height: 280,
        container: '.panel-container',
        showTitle: true,
        title: 'Generate visit plan',
        visible: false,
        dragEnabled: true,
        hideOnOutsideClick: false,
        showCloseButton: true,
        resizeEnabled: true,
        position: {
            at: 'center',
            my: 'center',
            collision: 'fit',
        },
        toolbarItems: [{
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'before',
            options: {
                icon: 'fa fa-check hvr-icon',
                text: 'Generate',
                onClick() {
                    var dxStartDate = $('#StartDate').data('dxDateBox');
                    var dxEndDate = $('#EndDate').data('dxDateBox');
                    const dateStart = dxStartDate.option('value');
                    const dateEnd = dxEndDate.option('value');
                    //if (!dateStart)
                    //    dxStartDate.
                    var params = {
                        mcpHeaderId: MCPHeaderModel.id,
                        dateStart: dateStart,
                        dateEnd: dateEnd
                    };

                    visitPlanService.generateWithPermission(params, { contentType: "application/json" }).done(result => {
                        abp.message.success(l('Congratulations'));
                        popupGenMCP.hide();
                    }).fail(() => { });
                },
            },
        }, {
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                text: 'Cancel',
                onClick() {
                    popupGenMCP.hide();
                },
            },
        }],
    }).dxPopup('instance');

    const popupEnddateMCP = $('#popupEnddateMCP').dxPopup({
        width: 400,
        height: 280,
        container: '.panel-container',
        showTitle: true,
        title: 'Enddate MCP',
        visible: false,
        dragEnabled: true,
        hideOnOutsideClick: false,
        showCloseButton: true,
        resizeEnabled: true,
        position: {
            at: 'center',
            my: 'center',
            collision: 'fit',
        },
        toolbarItems: [{
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'before',
            options: {
                icon: 'fa fa-check hvr-icon',
                text: 'Submit',
                onClick() {
                    var dxEndDate = $('#EndDateMCP').data('dxDateBox');
                    const endDate = dxEndDate.option('value');
                    //if (!dateStart)
                    //    dxStartDate.
                    var params = {
                        id: MCPHeaderModel.id,
                        endDate: endDate
                    };

                    mCPHeaderService.setEndDate(params.id, params.endDate, { contentType: "application/json" }).done(result => {
                        abp.message.success(l('Congratulations'));
                        popupEnddateMCP.hide();
                    }).fail(() => { });
                },
            },
        }, {
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'after',
            options: {
                text: 'Cancel',
                onClick() {
                    popupEnddateMCP.hide();
                },
            },
        }],
    }).dxPopup('instance');
});
