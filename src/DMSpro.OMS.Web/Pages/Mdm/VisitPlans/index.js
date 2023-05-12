
$(function () {
    var l = abp.localization.getResource("OMS");
    var visitPlansService = window.dMSpro.oMS.mdmService.controllers.visitPlans.visitPlan;
    var mcpHeaderService = window.dMSpro.oMS.mdmService.controllers.mCPHeaders.mCPHeader;
    var itemGroupService = window.dMSpro.oMS.mdmService.controllers.itemGroups.itemGroup;
    var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
    var mcpDetailsService = window.dMSpro.oMS.mdmService.controllers.mCPDetails.mCPDetail;

    const dayOfWeek = [
        {
            id: 1,
            text: l('EntityFieldValue:MDMService:VisitPlan:DayOfWeek:MONDAY')
        },
        {
            id: 2,
            text: l('EntityFieldValue:MDMService:VisitPlan:DayOfWeek:TUESDAY')
        },
        {
            id: 3,
            text: l('EntityFieldValue:MDMService:VisitPlan:DayOfWeek:WEDNESDAY')
        },
        {
            id: 4,
            text: l('EntityFieldValue:MDMService:VisitPlan:DayOfWeek:THURSDAY')
        },
        {
            id: 5,
            text: l('EntityFieldValue:MDMService:VisitPlan:DayOfWeek:FRIDAY')
        },
        {
            id: 6,
            text: l('EntityFieldValue:MDMService:VisitPlan:DayOfWeek:SATURDAY')
        },
        {
            id: 7,
            text: l('EntityFieldValue:MDMService:VisitPlan:DayOfWeek:SUNDAY')
        }
    ]


    const visitPlansStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            if (loadOptions.filter == null) {
                loadOptions.filter = ['dateVisit', '>', moment().format('YYYY-MM-DD')];
            } else {
                loadOptions.filter = [...loadOptions.filter, "and", ['dateVisit', '>', moment().format('YYYY-MM-DD')]];
            }
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            visitPlansService.getListDevextremes(args)
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
            visitPlansService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        },
        insert(values) {
            return visitPlansService.create(values, { contentType: 'application/json' });
        },
        update(key, values) {
            return visitPlansService.update(key, values, { contentType: 'application/json' });
        },
        remove(key) {
            return visitPlansService.delete(key);
        }
    });

    const getItemGroup = new DevExpress.data.CustomStore({
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

    const getCustomer = new DevExpress.data.CustomStore({
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
            customerService.getListDevextremes(args)
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
            customerService.get(key)
                .done(data => {
                    d.resolve(data);
                })
            return d.promise();
        }
    });

    var dgVisitPlans = $('#dgVisitPlans').dxDataGrid({
        key: 'id',
        dataSource: {
            store: visitPlansStore,
            paginate: true,
            pageSize
        },
        remoteOperations: true,
        showRowLines: true,
        showBorders: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        columnAutoWidth: true,
        selection: {
            mode: 'multiple',
            showCheckBoxesMode: 'always',
        },
        dateSerializationFormat: 'yyyy-MM-dd',
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
            // formats: ['excel','pdf'],
            allowExportSelectedData: true,
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
            storageKey: 'dgVisitPlans',
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
        onRowUpdating: function (e) {
            var objectRequire = ['code', 'name'];
            for (var property in e.oldData) {
                if (!e.newData.hasOwnProperty(property) && objectRequire.includes(property)) {
                    e.newData[property] = e.oldData[property];
                }
            }
        },
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: ` <button disabled id="ChangeVisitPlanButton" style="height: 35px;" type="button" class="btn btn-light btn-sm hvr-icon-pop">
                        <i class="fa fa-random hvr-icon" style="padding-right: 2px"></i>
                        <span class="">Change Visit Plans</span>
                    </button>`
                },
                "columnChooserButton",
                "exportButton",
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
                "searchPanel",
            ],
        },
        columns: [

            {
                dataField: 'isCommando',
                caption: l("EntityFieldName:MDMService:VisitPlan:IsCommando"),
                dataType: 'boolean',
                allowEditing: false,
                width: 110
            },
            {
                dataField: 'route.name',
                caption: l("EntityFieldName:MDMService:VisitPlan:RouteCode"),
                dataType: 'string',

                allowEditing: false,
            },
            {
                dataField: 'customer.name',
                caption: l("EntityFieldName:MDMService:VisitPlan:CustomerCode"),
                validationRules: [
                    {
                        type: 'required',
                        message: ''
                    }
                ],
                editorType: 'dxSelectBox',
                allowEditing: false,
            },
            {
                dataField: 'dateVisit',
                caption: l('EntityFieldName:MDMService:VisitPlan:DateVisit'),
                dataType: 'date',
                format: 'dd/MM/yyyy',
            },
            {
                dataField: 'itemGroupId',
                caption: l('EntityFieldName:MDMService:VisitPlan:ItemGroup'),
                dataType: 'string',
                calculateDisplayValue: (e) => {
                    if (e?.itemGroup)
                        return e.itemGroup.name
                    return
                },
                lookup: {
                    dataSource: {
                        store: getItemGroup,
                        paginate: true,
                        pageSize
                    },
                    valueExpr: 'id',
                    displayExpr: 'name'
                },
                allowEditing: false,
            },
            {
                dataField: 'distance',
                caption: l('EntityFieldName:MDMService:VisitPlan:Distance'),
                dataType: 'number',
                validationRules: [
                    {
                        type: 'required',
                        message: ''
                    }
                ],
                allowEditing: false,
            },
            {
                dataField: 'visitOrder',
                caption: l('EntityFieldName:MDMService:VisitPlan:VisitOrder'),
                dataType: 'number',
                validationRules: [
                    {
                        type: 'required',
                        message: ''
                    }
                ],
            },
            {
                dataField: 'week',
                caption: l('EntityFieldName:MDMService:VisitPlan:Week'),
                dataType: 'number',
                validationRules: [
                    {
                        type: 'required',
                        message: ''
                    }
                ],
                allowEditing: false,
            },
            {
                dataField: 'month',
                caption: l('EntityFieldName:MDMService:VisitPlan:Month'),
                dataType: 'number',
                validationRules: [
                    {
                        type: 'required',
                        message: ''
                    }
                ],
                allowEditing: false,
            },
            {
                dataField: 'year',
                caption: l('EntityFieldName:MDMService:VisitPlan:Year'),
                dataType: 'number',
                validationRules: [
                    {
                        type: 'required',
                        message: ''
                    }
                ],
                allowEditing: false,
            },
            {
                dataField: 'dayOfWeek',
                caption: l('EntityFieldName:MDMService:VisitPlan:DayOfWeek'),
                //editorType: 'dxSelectBox',
                lookup: {
                    dataSource: dayOfWeek,
                    valueExpr: 'id',
                    displayExpr: 'text'
                },
                allowEditing: false,
            },
            {
                dataField: 'mcpDetailId',
                caption: l('MCP Detail'),
                //allowEditing: false,
                visible: false,
            }
        ],
        onSelectionChanged: function (e) {
            var selectedRows = e.component.getSelectedRowsData();
            if (selectedRows.length > 0) {
                $('#ChangeVisitPlanButton').prop('disabled', false);
            }
            else $('#ChangeVisitPlanButton').prop('disabled', true);
        }
    }).dxDataGrid('instance');

    function getNextDate(arg) {
        const today = new Date()
        let feature = new Date()
        feature.setDate(today.getDate() + arg)
        return feature;
    }

    let popupChangeVisitPlan = $('#popupChangeVisitPlan').dxPopup({
        width: 400,
        height: 'fit-content',
        container: '.panel-container',
        showTitle: true,
        title: 'Change visit plan',
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
        contentTemplate: () => {
            let container = $('<div class="d-flex gap-2 flex-column" />')
            $('<div id="NewDate"  />')
                .dxDateBox({
                    type: 'date',
                    showClearButton: true,
                    min: getNextDate(2),
                    displayFormat: 'dd/MM/yyyy',
                })
                .dxValidator({
                    validationRules: [{
                        type: 'required',
                        message: '',
                    }],
                }).appendTo(container)
            $('<div id="isCommando" />')
                .dxCheckBox({
                    text: "Is Commando",
                }).appendTo(container)

            return container
        },
        toolbarItems: [
            {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'before',
                options: {
                    icon: 'fa fa-check hvr-icon',
                    text: 'Submit',
                    onClick() {
                        let newDate = $('#NewDate').data('dxDateBox');
                        let isCommando = $('#isCommando').data('dxCheckBox').option('value')
                        let val = moment(newDate.option('value')).add(12, 'hours');
                        if (!val) {
                            newDate.option('isValid', false);
                            newDate.focus();
                            return;
                        }

                        let ids = [];
                        let grid = $('#dgVisitPlans').data('dxDataGrid');
                        let selected = grid.getSelectedRowsData();
                        selected.forEach(u => {
                            ids.push(u.id)
                        });
                        console.log(val);
                        visitPlansService.updateMultiple(ids, moment(val).format('YYYY-MM-DD HH:mm:ss'), isCommando, { contentType: "application/json" }).done(result => {
                            abp.message.success(l('Congratulations'));
                            popupChangeVisitPlan.hide();
                            grid.refresh();
                        }).fail(() => { });
                    },
                },
            },
            {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    text: 'Cancel',
                    onClick() {
                        popupChangeVisitPlan.hide();
                    },
                },
            }],
    }).dxPopup('instance');

    $('#ChangeVisitPlanButton').click(function () { $('#popupChangeVisitPlan').data('dxPopup').show(); });

    // initImportPopup('api/mdm-service/visit-plans', 'VisitPlans_Template', 'dgVisitPlans');
});
