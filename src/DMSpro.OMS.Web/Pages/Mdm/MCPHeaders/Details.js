var l = abp.localization.getResource("MdmService");
var l1 = abp.localization.getResource("OMS");
var MCPModel;
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
    var mCPDetailsStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            if (!MCPModel || !MCPModel.id) {
                deferred.resolve([], {
                    totalCount: -1,
                    summary: null,
                    groupCount: -1,
                });
                return deferred.promise();
            }
            if (loadOptions.filter == null) {
                loadOptions.filter = ['mcpHeaderId', '=', MCPModel.id];
            } else {
                loadOptions.filter = [loadOptions.filter, "and", ['mcpHeaderId', '=', MCPModel.id]];
            }

            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            mCPDetailsService.getListDevextremes(args)
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
            mCPDetailsService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
        insert(values) {

        },
        update(key, values) {

        },
        remove(key) {

        },
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
                    var data = [];
                    result.data.forEach(x => {
                        data.push({
                            id: x.company.id,
                            name: x.company.name
                        })
                    })
                    deferred.resolve(data, {
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

    $("#top-section").dxForm({
        labelMode: 'floating',
        colCount: 4,
        items: [
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'Code',
                        validationRules: [{
                            type: 'required',
                            message: '',
                        }],
                    },
                    {
                        dataField: 'Name',
                        validationRules: [{
                            type: 'required',
                            message: '',
                        }],
                    }
                ]
            },
            {
                itemType: "group",
                items: [
                    {
                        dataField: 'Route',
                        editorType: 'dxSelectBox',
                        validationRules: [{
                            type: 'required',
                            message: '',
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
                            message: '',
                        }],
                        editorOptions: {
                            readOnly: true,
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
                        dataField: 'EffectiveDate',
                        editorType: 'dxDateBox',
                        validationRules: [{
                            type: 'required',
                            message: '',
                        }],
                        editorOptions: {
                            //min: new Date(),
                            displayFormat: 'dd/MM/yyyy',
                            showClearButton: true
                        }
                    }, {
                        dataField: 'EndDate',
                        editorType: 'dxDateBox',
                        editorOptions: {
                            //min: new Date(),
                            displayFormat: 'dd/MM/yyyy',
                            showClearButton: true
                        }
                    }]
            },
            {
                itemType: "group",
                items: [
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
        type: 'normal', 
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
                allowAdding: abp.auth.isGranted('MdmService.MCPs.Create'),
                allowUpdating: abp.auth.isGranted('MdmService.MCPs.Edit'),
                allowDeleting: abp.auth.isGranted('MdmService.MCPs.Delete'),
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
                const worksheet = workbook.addWorksheet('MCPDetails');

                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet,
                    autoFilterEnabled: true,
                }).then(() => {
                    workbook.xlsx.writeBuffer().then((buffer) => {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'MCPDetails.xlsx');
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
                    "addRowButton",
                    "columnChooserButton",
                    "exportButton",
                    {
                        location: 'after',
                        widget: 'dxButton',
                        options: {
                            icon: "import",
                            elementAttr: {
                                id: "import-excel",
                                class: "import-excel",
                            },
                            onClick() {
                                var popup = $('#popupImport').data('dxPopup');
                                if (popup) popup.show();
                            },
                        },
                    },
                    "searchPanel",
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
                //e.data.mcpHeaderId = MCPModel ? MCPModel.id : null;
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
                    caption: l1("EntityFieldName:MDMService:MCPDetail:Customer"),  
                    dataField: "customerId",
                    calculateDisplayValue: "customer.name",
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
                    caption: l("EntityFieldName:MDMService:MCPDetail:EffectiveDate"),  
                    dataField: "effectiveDate",
                    dataType: "date",
                    format: 'dd/MM/yyyy',
                    validationRules: [{ type: "required", message: '' }],
                }, {
                    caption: l("EntityFieldName:MDMService:MCPDetail:EndDate"),  
                    dataField: "endDate",
                    dataType: "date",
                    format: 'dd/MM/yyyy',
                    validationRules: [{ type: "required", message: '' }],
                }, {

                    caption: l1("EntityFieldName:MDMService:MCPDetail:Distance"),  
                    dataField: "distance",
                    dataType: "number",
                }, {

                    caption: l("EntityFieldName:MDMService:MCPDetail:VisitOrder"),  
                    dataField: "visitOrder",
                    dataType: "number",
                }, {

                    caption: l("EntityFieldName:MDMService:MCPDetail:Monday"),  
                    dataField: "monday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: l("EntityFieldName:MDMService:MCPDetail:Tuesday"),  
                    dataField: "tuesday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: l("EntityFieldName:MDMService:MCPDetail:Wednesday"),  
                    dataField: "wednesday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: l("EntityFieldName:MDMService:MCPDetail:Thursday"),  
                    dataField: "thursday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: l("EntityFieldName:MDMService:MCPDetail:Friday"),  
                    dataField: "friday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: l("EntityFieldName:MDMService:MCPDetail:Saturday"),  
                    dataField: "saturday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: l("EntityFieldName:MDMService:MCPDetail:Sunday"),  
                    dataField: "sunday",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: l("EntityFieldName:MDMService:MCPDetail:Week1"),  
                    dataField: "week1",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: l("EntityFieldName:MDMService:MCPDetail:Week2"),  
                    dataField: "week2",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: l("EntityFieldName:MDMService:MCPDetail:Week3"),  
                    dataField: "week3",
                    dataType: "boolean",
                    cellTemplate(container, options) {
                        $('<div>')
                            .append($(options.value ? '<i class="fa fa-check" style="color:#34b233"></i>' : ''))
                            .appendTo(container);
                    },
                }, {
                    caption: l("EntityFieldName:MDMService:MCPDetail:Week4"),  
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

   
    function getNormalDate(currentDate) {
        if (!currentDate || (typeof currentDate == "string")) return currentDate;

        var date = currentDate.getFullYear() + "-" + pad(currentDate.getMonth() + 1, 2) + "-" + pad(currentDate.getDate(), 2) + "T00:00:00";
        return date;
    }

    $("#CloseButton").click(function (e) {
        e.preventDefault();
        window.close();
        //var currentCode = salesOrgHeaderCode.option("value");
        //var currentName = salesOrgHeaderName.option("value");
        //var previousCode = SalesOrgHeaderModel != null ? SalesOrgHeaderModel.code : '';
        //var previousName = SalesOrgHeaderModel != null ? SalesOrgHeaderModel.name : '';

        //if (currentCode != previousCode || currentName != previousName) {
        //    abp.message.confirm(l1('ConfirmationMessage.UnSavedAndLeave'), l1('ConfirmationMessage.UnSavedAndLeaveTitle')).then(function (confirmed) {
        //        if (confirmed) {
        //            window.close();
        //        }
        //    });
        //} else {
        //    window.close();
        //}
    });

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

        if (!code || code.trim() == "") {
            form.getEditor('Code').option('isValid', false);
            form.getEditor('Code').focus();
            return;
        }
        if (!name || name.trim() == "") {
            form.getEditor('Name').option('isValid', false);
            form.getEditor('Name').focus();
            return;
        }
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
        params.mcpHeaderDto.effectiveDate = getNormalDate(params.mcpHeaderDto.effectiveDate);
        params.mcpHeaderDto.endDate = getNormalDate(params.mcpHeaderDto.endDate);

        params.mcpDetails.forEach(u => {
            u.effectiveDate = getNormalDate(u.effectiveDate);
            u.endDate = getNormalDate(u.endDate);
        })

        if (!MCPModel)
            mCPHeaderService.createMCP(params, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    MCPModel = result.mcpHeaderDto;
                    sessionStorage.setItem("MCPModel", JSON.stringify(result.mcpHeaderDto));

                    $('#GenerateButton').data('dxButton').option('disabled', false);
                    $('#EnddateButton').data('dxButton').option('disabled', false);
                }).fail(() => { });
        else
            mCPHeaderService.updateMCP(MCPModel.id, params, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    MCPModel = result.mcpHeaderDto;
                    sessionStorage.setItem("MCPModel", JSON.stringify(result.mcpHeaderDto));

                    abp.message.confirm(l1('ConfirmationMessage.GenerateVisitPlan'), l('Congratulations')).then(function (answer) {
                        if (answer) {
                            $('#GenerateButton').click();
                        }
                    });
                });
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


        var previousRouteId = MCPModel.routeId;
        var previousCompanyId = MCPModel.companyId;
        var previousItemGroupId = MCPModel.itemGroupId;
        var previousCode = MCPModel.code;
        var previousName = MCPModel.name;
        // var previousIsGPSLocked = MCPModel.isGPSLocked;
        var previousEffectiveDate = MCPModel.effectiveDate;
        var previousEndDate = MCPModel.endDate;

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
        if (MCPModel)
            popupEnddateMCP.show();
    });

    function LoadData() {
        var jsonData = sessionStorage.getItem("MCPModel");
        if (jsonData) {
            MCPModel = JSON.parse(jsonData);
            var form = $("#top-section").data('dxForm');
            form.getEditor('Route').option('value', MCPModel.routeId);
            form.getEditor('Company').option('value', MCPModel.companyId);
            form.getEditor('ItemGroup').option('value', MCPModel.itemGroupId);
            form.getEditor('Code').option('value', MCPModel.code);
            form.getEditor('Name').option('value', MCPModel.name);

            form.getEditor('EffectiveDate').option('value', MCPModel.effectiveDate);
            form.getEditor('EndDate').option('value', MCPModel.endDate);

            $('#GenerateButton').data('dxButton').option('disabled', false);
            $('#EnddateButton').data('dxButton').option('disabled', false);

            salesOrgHierarchyService.get(MCPModel.routeId).done(u => {
                var dxCompany = $('input[name=Company]').closest('.dx-selectbox').data('dxSelectBox');
                dxCompany.option('readOnly', false);
                dxCompany.option('dataSource', new DevExpress.data.DataSource({
                    store: companyInZoneStore,
                    filter: ["salesOrgHierarchyId", "=", u.parentId],
                    paginate: true,
                    pageSize: pageSize
                }));
                dxCompany.option('value', MCPModel.companyId);
            });

            LoadDataGrid();
        }
    }
    function LoadDataGrid() {

        var loadOptions = {
            filter: ['mcpHeaderId', '=', MCPModel.id]
        };
        const args = {};

        requestOptions.forEach((i) => {
            if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                args[i] = JSON.stringify(loadOptions[i]);
            }
        });

        mCPDetailsService.getListDevextremes(args)
            .done(result => {
                
                var data = result.data;
                mcpDetailData = data;
                mcpDetailData.forEach(x => x.customerIdExtra = x.customerId);

                dgMCPDetails.option('dataSource', mcpDetailData);
            });

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
            if (!dxCompany.editorOptions)
                dxCompany.editorOptions = [];
            dxCompany.editorOptions.readOnly = true;
            dxCompany.editorOptions.dataSource = null;
            dxCompany.option('value', null);
        }
    }
    $("#top-section").data('dxForm').getEditor('Route').on("valueChanged", routeChangedHandler);

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
                        mcpHeaderId: MCPModel.id,
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
                        id: MCPModel.id,
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

    initImportPopup('api/mdm-service/m-cPDetails', 'MCPDetails_Template', 'dgMCPDetails');
});

//$(window).on("beforeunload", function () {
//    sessionStorage.removeItem('MCPModel');
//});