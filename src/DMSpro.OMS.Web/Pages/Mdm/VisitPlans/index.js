
$(function () {
    var l = abp.localization.getResource("OMS");
    var visitPlansService = window.dMSpro.oMS.mdmService.controllers.visitPlans.visitPlan;

    const visitPlansStore = new DevExpress.data.CustomStore({
        key: "id",
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            if (loadOptions.filter == null) {
                loadOptions.filter = ['dateVisit', '>=', getCurrentDateFormat()];
            } else {
                loadOptions.filter = [loadOptions.filter, "and", ['dateVisit', '>=', getCurrentDateFormat()]];
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
    $('#dgVisitPlans').dxDataGrid({
        dataSource: visitPlansStore,
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
        },
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
        //columnFixing: {
        //    enabled: true,
        //},
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
        toolbar: {
            items: [
                "groupPanel",
                {
                    location: 'after',
                    template: ` <button disabled id="ChangeVisitPlanButton" style="display:none;height: 36px;" type="button" class="btn btn-light btn-sm hvr-icon-pop">
                        <i class="fa fa-random hvr-icon" style="padding-right: 2px"></i>
                        <span class="">Change Visit Plans</span>
                    </button>`,
                    onClick() {
                        //todo
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
                dataField: 'route.name',
                caption: l("EntityFieldName:MDMService:VisitPlan:RouteName"),
                dataType: 'string'
            },
            {
                dataField: 'customer.name',
                caption: l("EntityFieldName:MDMService:VisitPlan:CustomerName"),

            }, {
                dataField: 'customer.address',
                caption: l("EntityFieldName:MDMService:VisitPlan:CustomerAddress"),
            },
            {
                dataField: 'dateVisit',
                caption: l('EntityFieldName:MDMService:VisitPlan:DateVisit'),
                dataType: 'date',
                format: 'dd/MM/yyyy'
            },
            {
                dataField: 'company.name',
                caption: l("EntityFieldName:MDMService:VisitPlan:CompanyName"),

            },
            {
                dataField: 'itemGroup.description',
                caption: l('EntityFieldName:MDMService:VisitPlan:ItemGroup'),

            },
            {
                dataField: 'distance',
                caption: l('EntityFieldName:MDMService:VisitPlan:Distance'),
                dataType: 'number',
            },
            {
                dataField: 'visitOrder',
                caption: l('EntityFieldName:MDMService:VisitPlan:VisitOrder'),
                dataType: 'number',
            },
            {
                dataField: 'week',
                caption: l('EntityFieldName:MDMService:VisitPlan:Week'),
                dataType: 'number',

            },
            {
                dataField: 'month',
                caption: l('EntityFieldName:MDMService:VisitPlan:Month'),
                dataType: 'number',

            },
            {
                dataField: 'year',
                caption: l('EntityFieldName:MDMService:VisitPlan:Year'),
                dataType: 'number',
            }
        ],
        onSelectionChanged: function (e) {
            var selectedRowsData = e.component.getSelectedRowsData();
            if (selectedRowsData.length > 0) {
                $('#ChangeVisitPlanButton').removeAttr('disabled');
            } else {
                $('#ChangeVisitPlanButton').prop('disabled', true);
            }
        }
    }).dxDataGrid('instance');

    function getCurrentDateFormat() {
        var currentDate = new Date();
        return currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate() + "T00:00:00";
    }
    function getNextDate(arg) {
        const today = new Date()
        let feature = new Date()
        feature.setDate(today.getDate() + arg)
        return feature;
    }

    $('#date').dxDateBox({
        type: 'date',
        showClearButton: true,
        min: getNextDate(1),
        displayFormat: 'dd/MM/yyyy',
    });

    const popupChangeVisitPlan = $('#popupChangeVisitPlan').dxPopup({
        width: 400,
        height: 280,
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
        toolbarItems: [{
            widget: 'dxButton',
            toolbar: 'bottom',
            location: 'before',
            options: {
                icon: 'fa fa-check hvr-icon',
                text: 'Submit',
                onClick() {
                    var dxEndDate = $('#date').data('dxDateBox');
                    var params = {
                        //id: MCPModel.mcpHeaderDto.id,
                        //endDate: endDate
                    };
                    abp.message.success(l('Congratulations'));
                    popupChangeVisitPlan.hide();
                    //mCPHeaderService.setEndDate(params.id, params.endDate, { contentType: "application/json" }).done(result => {
                    //    abp.message.success(l('Congratulations'));
                    //    popupEnddateMCP.hide();
                    //}).fail(() => { });
                },
            },
        }, {
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
