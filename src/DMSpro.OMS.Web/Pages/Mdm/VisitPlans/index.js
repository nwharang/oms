
$(function () {
    let l = abp.localization.getResource("OMS");
    let visitPlansService = window.dMSpro.oMS.mdmService.controllers.visitPlans.visitPlan;
    let itemGroupService = window.dMSpro.oMS.mdmService.controllers.itemGroups.itemGroup;


    let dayOfWeek = [
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
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });
            visitPlansService.getListDevextremes(args)
                .done(async (result) => {
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

    var dgVisitPlans = $('#dgVisitPlans').dxDataGrid({
        key: 'id',
        dataSource: {
            store: visitPlansStore,
            filter: ['dateVisit', '>', new Date],
        },
        editing: {
            mode: "row",
            allowUpdating: abp.auth.isGranted('MdmService.VisitPlans.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.VisitPlans.Delete'),
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
            pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            // Do not change this
            allowedPageSizes,
            showInfo: true,
            showNavigationButtons: true
        },
        onRowUpdating: function (e) {
            let { dateVisit, distance, visitOrder, mcpDetailId, customerId, routeId, itemGroupId } = Object.assign({}, e.oldData, e.newData);
            e.newData = { dateVisit, distance, visitOrder, mcpDetailId, customerId, routeId, itemGroupId }
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
                "addRowButton",
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
                type: 'buttons',
                caption: l('Actions'),
                buttons: ['edit', 'delete'],
                width: 110,
                fixedPosition: 'left'
            },
            {
                dataField: 'isCommando',
                caption: l("EntityFieldName:MDMService:VisitPlan:IsCommando"),
                dataType: 'boolean',
                width: 110,
                allowEditing: false,
            },
            {
                dataField: 'dateVisit',
                caption: l('EntityFieldName:MDMService:VisitPlan:DateVisit'),
                dataType: 'date',
                format: 'dd/MM/yyyy',
            },
            {
                dataField: 'zoneCode',
                caption: l("EntityFieldName:MDMService:VisitPlan:ZoneCode"),
                dataType: 'string',
                calculateDisplayValue: (e) => {
                    if (e?.zoneCode && e?.zoneName) return `${e.zoneCode} - ${e.zoneName}`
                },
                allowEditing: false,
            },
            {
                dataField: 'routeCode',
                caption: l("EntityFieldName:MDMService:VisitPlan:RouteCode"),
                dataType: 'string',
                calculateDisplayValue: (e) => {
                    if (e?.routeCode && e?.routeName) return `${e.routeCode} - ${e.routeName}`
                },
                allowEditing: false,
            },
            {
                dataField: 'customerCode',
                caption: l("EntityFieldName:MDMService:VisitPlan:CustomerCode"),
                validationRules: [{ type: 'required' }],
                allowEditing: false,
                calculateDisplayValue: (e) => {
                    if (e?.customerCode && e.customerName) return `${e.customerCode} - ${e.customerName}`
                },
            },
            {
                dataField: 'companyCode',
                caption: l("EntityFieldName:MDMService:VisitPlan:CompanyCode"),
                allowEditing: false,
                calculateDisplayValue: (e) => {
                    if (e?.companyCode && e?.companyName) return `${e.companyCode} - ${e.companyName}`
                }
            },
            {
                dataField: 'empCode',
                caption: l("EntityFieldName:MDMService:VisitPlan:EmployeeCode"),
                calculateDisplayValue: e => {
                    if (e?.empCode && e?.empName) return `${e.empCode} - ${e.empName}`
                },
                allowEditing: false,
            },
            {
                dataField: 'distance',
                caption: l('EntityFieldName:MDMService:VisitPlan:Distance'),
                dataType: 'number',
                validationRules: [{ type: 'required' }],
            },
            {
                dataField: 'visitOrder',
                caption: l('EntityFieldName:MDMService:VisitPlan:VisitOrder'),
                dataType: 'number',
                editorOptions: {
                    format: '#'
                },
                validationRules: [{ type: 'required' }],
            },
            {
                dataField: 'geo0Name',
                caption: l("EntityFieldName:MDMService:GeoMaster:GeoMaster0Name"),
                dataType: 'string',
                allowEditing: false,
            },
            {
                dataField: 'geo1Name',
                caption: l("EntityFieldName:MDMService:GeoMaster:GeoMaster1Name"),
                dataType: 'string',
                allowEditing: false,
            },
            {
                dataField: 'geo2Name',
                caption: l("EntityFieldName:MDMService:GeoMaster:GeoMaster2Name"),
                dataType: 'string',
                allowEditing: false,
            },
            {
                dataField: 'geo3Name',
                caption: l("EntityFieldName:MDMService:GeoMaster:GeoMaster3Name"),
                dataType: 'string',
                allowEditing: false,
            },
            {
                dataField: 'geo4Name',
                caption: l("EntityFieldName:MDMService:GeoMaster:GeoMaster4Name"),
                dataType: 'string',
                allowEditing: false,
            },


            {
                dataField: 'itemGroupId',
                caption: l('EntityFieldName:MDMService:VisitPlan:ItemGroup'),
                dataType: 'string',
                calculateDisplayValue: (e) => e?.itemGroup?.name,
                allowEditing: false,
                lookup: {
                    dataSource: {
                        store: getItemGroup,
                        paginate: true,
                        pageSize
                    },
                    valueExpr: 'id',
                    displayExpr: 'name',
                }
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
                allowEditing: false,
                calculateDisplayValue: (e) => e?.mcpDetail?.code,
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
});
