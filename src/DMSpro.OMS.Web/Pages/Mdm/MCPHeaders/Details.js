$(async () => {
    let l = abp.localization.getResource("OMS");
    let MCPModel = JSON.parse(sessionStorage.getItem("MCPModel")), mcpDetailData = [], sellingZoneId = null;
    let rendingLoadingPopup = () => {
        let loadingPopup = $('<div />')
        loadingPopup.dxPopup({
            height: 100,
            width: 100,
            showTitle: false,
            contentTemplate: (e) => {
                return e.dxLoadIndicator({
                    height: 60,
                    width: 60,
                })
            }
        })
        loadingPopup.appendTo('body')
        return loadingPopup.dxPopup('instance')
    }
    let loadingPopup = rendingLoadingPopup()
    DevExpress.config({
        editorStylingMode: 'underlined',
    });
    let salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;
    let itemGroupService = window.dMSpro.oMS.mdmService.controllers.itemGroups.itemGroup;
    let companyInZoneService = window.dMSpro.oMS.mdmService.controllers.companyInZones.companyInZone;
    let customerInZoneService = window.dMSpro.oMS.mdmService.controllers.customerInZones.customerInZone;
    let customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
    let mCPHeaderService = window.dMSpro.oMS.mdmService.controllers.mCPHeaders.mCPHeader;
    let companyService = window.dMSpro.oMS.mdmService.controllers.companies.company;
    let mCPDetailsService = window.dMSpro.oMS.mdmService.controllers.mCPDetails.mCPDetail;
    let visitPlanService = window.dMSpro.oMS.mdmService.controllers.visitPlans.visitPlan;

    let customerStore = new DevExpress.data.CustomStore({
        key: 'customerId',
        load(loadOptions) {
            const deferred = $.Deferred();
            loadOptions.filter = [...(loadOptions.filter && loadOptions.filter.length > 0 ? [loadOptions.filter, "and"] : []), [["endDate", ">=", moment().format('YYYY-MM-DD')], 'or', ['endDate', '=', null]], 'and', ["salesOrgHierarchyId", "=", sellingZoneId]]
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
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
            let d = new $.Deferred();
            customerService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        },
    });
    let companyInZoneStore = new DevExpress.data.CustomStore({
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
                    let data = [];
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

            let d = new $.Deferred();
            companyService.get(key)
                .done(data => {
                    d.resolve(data);
                });
            return d.promise();
        }
    });

    let salesOrgHierarchyStore = new DevExpress.data.CustomStore({
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
            if (key == undefined) return null;
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
        formData: await MCPModel,
        colCount: 4,
        items: [
            {
                dataField: 'Code',
                editorType: 'dxTextBox',
                validationRules: [
                    {
                        type: "required"
                    },
                    {
                        type: 'pattern',
                        pattern: '^[a-zA-Z0-9]{1,20}$',
                        message: l('ValidateError:Code')
                    }
                ]
            },
            {
                dataField: 'Name',
                validationRules: [{
                    type: 'required',
                }],
            },
            {
                dataField: 'Route',
                editorType: 'dxSelectBox',
                validationRules: [{
                    type: 'required',
                    message: '',
                }],
                editorOptions: {
                    dataSource: {
                        store: salesOrgHierarchyStore,
                        filter: [["isRoute", "=", true], 'and', ['salesOrgHeader.status', '=', 1]],
                        paginate: true,
                        pageSize
                    },
                    showClearButton: true,
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
                    valueExpr: "id",
                    displayExpr: "name",
                }
            },
            {
                dataField: 'EffectiveDate',
                editorType: 'dxDateBox',
                editorOptions: {
                    displayFormat: 'dd/MM/yyyy',
                    showClearButton: true,
                    min: MCPModel?.creationTime ? new Date(MCPModel.creationTime) : new Date(),
                    onValueChanged: (e) => {
                        try {
                            $("#top-section").data('dxForm').getEditor('EndDate').option('min', e.value ? moment(e.value).add(1, 'days') : moment().add(1, 'days'))
                        } catch (err) { }
                    },
                },
                validationRules: [{ type: 'required', message: '' }],
            },
            {
                dataField: 'EndDate',
                editorType: 'dxDateBox',
                editorOptions: {
                    displayFormat: 'dd/MM/yyyy',
                    showClearButton: true,
                    onValueChanged: (e) => {
                        try {
                            $("#top-section").data('dxForm').getEditor('EffectiveDate').option('max', moment(e.value).subtract(1, 'days'))
                        } catch (err) { }
                    }
                }
            },
            {
                dataField: 'ItemGroup',
                editorType: 'dxSelectBox',
                editorOptions: {
                    dataSource: {
                        store: itemGroupStore,
                        filter: [],
                        paginate: true,
                        pageSize
                    },
                    showClearButton: true,
                    valueExpr: "id",
                    displayExpr: "name",
                }
            },
            {
                dataField: 'gpsLock',
                editorType: 'dxCheckBox',
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

    var dgMCPDetails = $('#dgMCPDetails').dxDataGrid({
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
            allowAdding: abp.auth.isGranted('MdmService.MCPs.Create') && Boolean(MCPModel?.id),
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
        onExporting: function (e) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Companies');
            DevExpress.excelExporter.exportDataGrid({
                component: e.component,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${name || "Exports"}.xlsx`);
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
            pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes,
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
                            class: "import-excel",
                        },
                        onClick: (e) => {
                            var gridControl = e.element.closest('div.dx-datagrid').parent();
                            var gridName = gridControl.attr('id');
                            var popup = $(`div.${gridName}.popupImport`).data('dxPopup');
                            if (popup) popup.show();
                        },
                    },
                },
                "searchPanel",
            ],
        },
        onEditorPreparing: (e) => {
            if (e.parentType === "dataRow" && e.dataField === "customerId") {
                e.editorOptions.onValueChanged = function (ev) {
                    let selectedItem = ev.component.option('selectedItem');
                    e.setValue(selectedItem);
                }
            }
        },
        onRowUpdating: (e) => {
            e.newData = Object.assign({}, e.oldData, e.newData);
        },
        onInitNewRow: (e) => {
            $('#SaveButton').data('dxButton').option('disabled', true);
            e.data.code = "1";
            e.data.effectiveDate = new Date();
            e.data.distance = 0;
            e.data.visitOrder = 0;
            e.data.monday = false;
            e.data.tuesday = false;
            e.data.wednesday = false;
            e.data.thursday = false;
            e.data.friday = false;
            e.data.saturday = false;
            e.data.sunday = false;
            e.data.week1 = true;
            e.data.week2 = true;
            e.data.week3 = true;
            e.data.week4 = true;
        },
        dateSerializationFormat: "yyyy-MM-dd",
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 110,
                buttons: ['edit', 'delete'],
                fixedPosition: "left",
            },
            {
                dataField: 'id',
                caption: l("Id"),
                dataType: 'string',
                allowEditing: false,
                visible: false,
                formItem: {
                    visible: false
                },
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:Customer"),
                dataField: "customerId",
                calculateDisplayValue: (rowData) => rowData?.customer?.name,
                editorOptions: {
                    dropDownOptions: {
                        width: 500,
                    },
                },
                setCellValue: (rowData, value) => {
                    rowData.customerId = value.customerId;
                    rowData.customer = value.customer;
                },
                validationRules: [{ type: "required" }],
                lookup: {
                    dataSource: {
                        store: customerStore,
                        paginate: true,
                        pageSize
                    },
                    displayExpr: (e) => e.customer?.name || e?.name,
                    valueExpr: (e) => e?.customer?.id || e?.id
                },
            },
            {
                caption: "Address",
                dataField: "fullAddress",
                dataType: 'string',
                calculateDisplayValue: (rowData) => rowData?.customer?.fullAddress,
                width: 150,
                allowEditing: false,
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:EffectiveDate"),
                dataField: "effectiveDate",
                dataType: "date",
                format: 'dd/MM/yyyy',
                editorOptions: {
                    min: MCPModel?.effectiveDate || new Date(),
                },
                validationRules: [
                    {
                        type: "required"
                    },
                    {
                        type: 'async',
                        validationCallback: (e) => {
                            let effDate = new Date(e.data.effectiveDate)
                            let endDate = e?.data?.endDate ? new Date(e?.data?.endDate) : null
                            return new Promise((resolve, reject) => {
                                if (!endDate || (endDate && effDate < endDate))
                                    resolve(effDate)
                                reject(l('ValidateError:EffectiveDate'))
                            })
                        }
                    }
                ],
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:EndDate"),
                dataField: "endDate",
                dataType: "date",
                editorOptions: {
                    showClearButton: true,
                    min: MCPModel?.effectiveDate || new Date(),
                    max: MCPModel?.endDate || null
                },
                validationRules: [
                    {
                        type: 'async',
                        validationCallback: (e) => {
                            let customerEnddate = e.data?.customer?.endDate ? new Date(e.data.customer.endDate) : null
                            let endDate = e?.data?.endDate ? new Date(e?.data?.endDate) : null

                            return new Promise((resolve, reject) => {
                                if (!endDate || endDate <= customerEnddate)
                                    resolve(endDate)
                                reject(l('ValidateError:MCPDetails:EffectiveDate'))
                            })
                        }
                    }
                ],
                format: 'dd/MM/yyyy',
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:Distance"),
                dataField: "distance",
                dataType: "number",
                editorOptions: {
                    min: 0,
                }
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:VisitOrder"),
                dataField: "visitOrder",
                dataType: "number",
                editorOptions: {
                    format: '#',
                    min: 0
                }
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:Monday"),
                dataField: "monday",
                dataType: "boolean",
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:Tuesday"),
                dataField: "tuesday",
                dataType: "boolean",
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:Wednesday"),
                dataField: "wednesday",
                dataType: "boolean",
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:Thursday"),
                dataField: "thursday",
                dataType: "boolean",
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:Friday"),
                dataField: "friday",
                dataType: "boolean",
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:Saturday"),
                dataField: "saturday",
                dataType: "boolean",
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:Sunday"),
                dataField: "sunday",
                dataType: "boolean",
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:Week1"),
                dataField: "week1",
                dataType: "boolean",

            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:Week2"),
                dataField: "week2",
                dataType: "boolean",
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:Week3"),
                dataField: "week3",
                dataType: "boolean",
            },
            {
                caption: l("EntityFieldName:MDMService:MCPDetail:Week4"),
                dataField: "week4",
                dataType: "boolean",
            }
        ],
    }).dxDataGrid("instance");


    $("#CloseButton").click(function (e) {
        e.preventDefault();
        window.close();
    });

    $('#SaveButton').click(function (e) {
        $('#SaveButton').dxButton('instance').option('disabled', true)
        loadingPopup.show()
        e.preventDefault();
        var form = $("#top-section").data('dxForm');
        var valid = form.validate();
        if (!valid.isValid) {
            $('#SaveButton').dxButton('instance').option('disabled', false)
            loadingPopup.hide();
            return
        }

        var routeId = form.getEditor('Route').option('value');
        var companyId = form.getEditor('Company').option('value');
        var itemGroupId = form.getEditor('ItemGroup').option('value');
        var code = form.getEditor('Code').option('value');
        var name = form.getEditor('Name').option('value');
        var gpsLock = form.getEditor('gpsLock').option('value');
        var effectiveDate = form.getEditor('EffectiveDate').option('value');
        var endDate = form.getEditor('EndDate').option('value');

        var mcpHeaderDto = {
            code,
            name,
            effectiveDate: effectiveDate ? moment(effectiveDate).format('YYYY-MM-DD[T12:00:00Z]') : null,
            endDate: endDate ? moment(endDate).format('YYYY-MM-DD[T12:00:00Z]') : null,
            routeId,
            companyId,
            itemGroupId,
            gpsLock
        };
        if (endDate)
            console.log(endDate);
        var mcpDetails = [];

        dgMCPDetails.getDataSource().items().forEach(u => {
            mcpDetails.push({
                code: u.code,
                effectiveDate: u.effectiveDate ? moment(u.effectiveDate).format('YYYY-MM-DD[T12:00:00Z]') : null,
                endDate: u.endDate ? moment(u.endDate).format('YYYY-MM-DD[T12:00:00Z]') : null,
                distance: u.distance,
                visitOrder: u.visitOrder,
                monday: u.monday,
                tuesday: u.tuesday,
                wednesday: u.wednesday,
                thursday: u.thursday,
                friday: u.friday,
                saturday: u.saturday,
                sunday: u.sunday,
                week1: u.week1,
                week2: u.week2,
                week3: u.week3,
                week4: u.week4,
                customerId: u.customerId,
                mcpHeaderId: u.mcpHeaderId,
                concurrencyStamp: u.concurrencyStamp,
                id: u.id
            });
        });
        var params = {
            mcpHeaderDto: mcpHeaderDto,
            mcpDetails: mcpDetails,
        }

        if (!MCPModel)
            mCPHeaderService.createMCP(params, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    MCPModel = result.mcpHeaderDto;
                    sessionStorage.setItem("MCPModel", JSON.stringify(result.mcpHeaderDto));

                    $('#GenerateButton').data('dxButton').option('disabled', false);
                    $('#EnddateButton').data('dxButton').option('disabled', false);
                    $('#SaveButton').dxButton('instance').option('disabled', false)
                    dgMCPDetails.option('editing.allowAdding', abp.auth.isGranted('MdmService.MCPs.Create') && Boolean(MCPModel?.id))
                    salesOrgHierarchyService.get(MCPModel.routeId).done(u => {
                        sellingZoneId = u.parentId;
                    })
                    loadingPopup.hide()
                })
                .fail(() => {
                    $('#SaveButton').dxButton('instance').option('disabled', false)
                    dgMCPDetails.refresh().then(() => {
                        loadingPopup.hide()
                    })
                });
        else
            mCPHeaderService.updateMCP(MCPModel.id, params, { contentType: "application/json" })
                .done(result => {
                    abp.message.success(l('Congratulations'));
                    MCPModel = result.mcpHeaderDto;
                    sessionStorage.setItem("MCPModel", JSON.stringify(result.mcpHeaderDto));

                    abp.message.confirm(l('ConfirmationMessage.GenerateVisitPlan'), l('Congratulations')).then((answer) => {
                        if (answer) {
                            $('#GenerateButton').click();
                        }
                    });
                    $('#SaveButton').dxButton('instance').option('disabled', false)
                    salesOrgHierarchyService.get(MCPModel.routeId).done(u => {
                        sellingZoneId = u.parentId;
                    })
                    loadingPopup.hide()
                })
                .fail(() => {
                    $('#SaveButton').dxButton('instance').option('disabled', false)
                    dgMCPDetails.refresh().then(() => {
                        loadingPopup.hide()
                    })
                });
    })

    $("#CloseButton").click(function (e) {
        e.preventDefault();

        let form = $("#top-section").data('dxForm');

        let currentRouteId = form.getEditor('Route').option('value');
        let currentCompanyId = form.getEditor('Company').option('value');
        let currentItemGroupId = form.getEditor('ItemGroup').option('value');
        let currentCode = form.getEditor('Code').option('value');
        let currentName = form.getEditor('Name').option('value');
        let currentEffectiveDate = form.getEditor('EffectiveDate').option('value');
        let currentEndDate = form.getEditor('EndDate').option('value');


        let previousRouteId = MCPModel.routeId;
        let previousCompanyId = MCPModel.companyId;
        let previousItemGroupId = MCPModel.itemGroupId;
        let previousCode = MCPModel.code;
        let previousName = MCPModel.name;
        let previousEffectiveDate = MCPModel.effectiveDate;
        let previousEndDate = MCPModel.endDate;

        if (currentRouteId != previousRouteId
            || currentCompanyId != previousCompanyId
            || currentItemGroupId != previousItemGroupId
            || currentCode != previousCode
            || currentName != previousName
            || currentEffectiveDate != previousEffectiveDate
            || currentEndDate != previousEndDate
        ) {
            abp.message.confirm(l('ConfirmationMessage.UnSavedAndLeave'), l('ConfirmationMessage.UnSavedAndLeaveTitle')).then(function (confirmed) {
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

    // Load first data session data
    if (MCPModel) {
        let form = $("#top-section").data('dxForm');
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
            sellingZoneId = u.parentId;

            let dxCompany = $('input[name=Company]').closest('.dx-selectbox').data('dxSelectBox');
            dxCompany.option('readOnly', false);
            dxCompany.option('dataSource', new DevExpress.data.DataSource({
                store: companyInZoneStore,
                filter: [["salesOrgHierarchyId", "=", u.parentId], 'and', ['company.active', '=', true], 'and', [['company.endDate', '>', moment().format('YYYY-MM-DD')], 'or', ['company.endDate', '=', null]]],
                paginate: true,
                pageSize: pageSize
            }));
            dxCompany.option('value', MCPModel.companyId);
        });
        let loadOptions = {
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
                let data = result.data;
                mcpDetailData = data;
                mcpDetailData.forEach(x => x.customerIdExtra = x.customerId);

                dgMCPDetails.option('dataSource', mcpDetailData);
            });
    }

    function routeChangedHandler(data) {
        console.log('a');
        if (data.value !== null) {
            const selectedItem = data.component.option('selectedItem');

            var dxCompany = $('input[name=Company]').closest('.dx-selectbox').data('dxSelectBox');
            dxCompany.option('readOnly', false);
            dxCompany.option('dataSource', {
                store: companyInZoneStore,
                filter: [["salesOrgHierarchyId", "=", selectedItem.parentId], 'and', ['company.active', '=', true], 'and', [['company.endDate', '>', moment().format('YYYY-MM-DD')], 'or', ['company.endDate', '=', null]]],
                paginate: true,
                pageSize
            });

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

    $('#StartDate').dxDateBox({
        type: 'date',
        showClearButton: true,
        min: new Date($("#top-section")
            .dxForm('instance')
            .getEditor('EffectiveDate')
            .option('value')) > new Date() ?
            new Date($("#top-section").dxForm('instance').getEditor('EffectiveDate').option('value'))
            : moment().add(1, 'days')._d,
        max: $("#top-section").dxForm('instance').getEditor('EndDate').option('value') ? new Date($("#top-section").dxForm('instance').getEditor('EndDate').option('value')) : undefined,
        displayFormat: 'dd/MM/yyyy',
        onValueChanged: (e) => {
            $('#EndDate').dxDateBox('instance').option('min', e.value);
        }
    });
    $('#EndDate').dxDateBox({
        type: 'date',
        showClearButton: true,
        min: new Date($("#top-section").dxForm('instance').getEditor('EffectiveDate').option('value')) > new Date() ? new Date($("#top-section").dxForm('instance').getEditor('EffectiveDate').option('value')) : moment().add(2, 'days')._d,
        max: $("#top-section").dxForm('instance').getEditor('EndDate').option('value') ? new Date($("#top-section").dxForm('instance').getEditor('EndDate').option('value')) : undefined,
        displayFormat: 'dd/MM/yyyy',
        onValueChanged: (e) => {
            $('#StartDate').dxDateBox('instance').option('max', e.value);
        }
    });
    $('#EndDateMCP').dxDateBox({
        type: 'date',
        showClearButton: true,
        min: new Date($("#top-section").dxForm('instance').getEditor('EffectiveDate').option('value')) > new Date() ? new Date($("#top-section").dxForm('instance').getEditor('EffectiveDate').option('value')) : new Date(),
        displayFormat: 'dd/MM/yyyy',
    });
    let popupGenMCP = $('#popupGenMCP').dxPopup({
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
                    let dateStart = $('#StartDate').data('dxDateBox').option('value');
                    let dateEnd = $('#EndDate').data('dxDateBox').option('value');
                    let params = {
                        mcpHeaderId: MCPModel.id,
                        dateStart: moment(dateStart).format('YYYY-MM-DD'),
                        dateEnd: moment(dateEnd).format('YYYY-MM-DD')
                    };
                    visitPlanService.generateWithPermission(params, { contentType: "application/json" }).done(() => {
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

    let popupEnddateMCP = $('#popupEnddateMCP').dxPopup({
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
                    let dxEndDate = $('#EndDateMCP').data('dxDateBox');
                    let endDate = dxEndDate.option('value');
                    mCPHeaderService.setEndDate(MCPModel.id, moment(endDate).format('YYYY-MM-DD[T12:00:00Z]'), { contentType: "application/json" })
                        .done(result => {
                            abp.message.success(l('Congratulations'));
                            popupEnddateMCP.hide();
                            $("#top-section").dxForm('instance').getEditor('EndDate').option('value', moment(endDate).format('YYYY-MM-DD'))
                            sessionStorage.setItem('MCPModel', JSON.stringify({ ...MCPModel, endDate: moment(endDate).format('YYYY-MM-DD') }))
                        })
                        .fail(() => { });
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