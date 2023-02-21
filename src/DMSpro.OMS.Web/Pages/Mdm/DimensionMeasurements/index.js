$(function () {
    var l = abp.localization.getResource("MdmService");
    var dimensionMeasurementService = window.dMSpro.oMS.mdmService.controllers.dimensionMeasurements.dimensionMeasurement;
    var isNotEmpty = function (value) {
        return value !== undefined && value !== null && value !== '';
    }

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            [
                'skip',
                'take',
                'requireTotalCount',
                'requireGroupCount',
                'sort',
                'filter',
                'totalSummary',
                'group',
                'groupSummary',
            ].forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            dimensionMeasurementService.getListDevextremes(args)
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
            return key == 0 ? dimensionMeasurementService.get(key) : null;
        },
        insert(values) {
            return dimensionMeasurementService.create(values, { contentType: "application/json" });
        },
        update(key, values) {
            return dimensionMeasurementService.update(key, values, { contentType: "application/json" });
        },
        remove(key) {
            return dimensionMeasurementService.delete(key);
        }
    });
	
    var dataMeasurement = [
        {
            code: 'mm',
            name: 'Milimeter',
            value: 1
        },
        {
            code: 'cm',
            name: 'Centimeter',
            value: 10
        },
        {
            code: 'dm',
            name: 'Decimeter',
            value: 100
        },
        {
            code: 'm',
            name: 'Meter',
            value: 1000
        },
    ]
    var gridMeasurements = $('#dgMeasurements').dxDataGrid({
        dataSource: dataMeasurement,
        keyExpr: "code",
        editing: {
            mode: "row",
            allowAdding: abp.auth.isGranted('MdmService.DimensionMeasurements.Create'),
            allowUpdating: abp.auth.isGranted('MdmService.DimensionMeasurements.Edit'),
            allowDeleting: abp.auth.isGranted('MdmService.DimensionMeasurements.Delete'),
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
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
            visible: true
        },
        scrolling: {
            mode: 'standard'
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
        columns: [
            {
                type: 'buttons',
                caption: l("Actions"),
                width: 110,
                buttons: ['edit', 'delete'],
            },
            {
                dataField: 'code',
                caption: l("EntityFieldName:MDMService:DimensionMeasurement:Code"),
                dataType: 'string',
            },
            {
                dataField: 'name',
                caption: l("EntityFieldName:MDMService:DimensionMeasurement:Name"),
                dataType: 'string',
            },
            {
                dataField: 'value',
                caption: l("EntityFieldName:MDMService:DimensionMeasurement:Value") + " (mm)",
                width: 280,
                dataType: 'string',
            }
        ],
    }).dxDataGrid("instance");

    $("input#Search").on("input", function () {
        gridMeasurements.searchByText($(this).val());
    });

    $("#NewDimensionMeasurementButton").click(function (e) {
        gridMeasurements.addRow();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        dimensionMeasurementService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/dimension-measurements/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'name', value: input.name },
                            { name: 'valueMin', value: input.valueMin },
                            { name: 'valueMax', value: input.valueMax }
                            ]);
                            
                    var downloadWindow = window.open(url, '_blank');
                    downloadWindow.focus();
            }
        )
    });

});
