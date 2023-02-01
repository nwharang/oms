$(function () {
    var l = abp.localization.getResource("MdmService");
    var l1 = abp.localization.getResource("OMSWeb");
    var salesOrgHeaderService = window.dMSpro.oMS.mdmService.controllers.salesOrgHeaders.salesOrgHeader;

    const requestOptions = ['skip', 'take', 'requireTotalCount', 'requireGroupCount', 'sort', 'filter', 'totalSummary', 'group', 'groupSummary'];

    /****custom store*****/
    var salesOrgHeaderStore = new DevExpress.data.CustomStore({
        key: 'id',
        load(loadOptions) {
            const deferred = $.Deferred();
            const args = {};
            requestOptions.forEach((i) => {
                if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                    args[i] = JSON.stringify(loadOptions[i]);
                }
            });

            salesOrgHeaderService.getListDevextremes(args)
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

    /****control*****/

    //DataGrid - Sales Org
    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: salesOrgHeaderStore,
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
        columns: [
            {
                caption: l("Actions"),
                type: 'buttons',
                width: 80,
                buttons: [{
                    text: l1('Button.ViewDetail'),
                    icon: "fieldchooser",
                    onClick: function (e) {
                        var newtab = window.open('/Mdm/SalesOrganization/Details', '_blank');
                        newtab.sessionStorage.setItem("SalesOrg", JSON.stringify(e.row.data));
                    }
                }]
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgHeader:Code'),
                dataField: "code"
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgHeader:Name'),
                dataField: "name"
            },
            {
                caption: l('EntityFieldName:MDMService:SalesOrgHeader:Active'),
                dataField: 'active'
            }
        ]
    }).dxDataGrid("instance");

    /****button*****/
    $("#NewSalesOrgButton").click(function (e) {
        e.preventDefault();
        var newtab = window.open('/Mdm/SalesOrganization/Details', '_blank');
        newtab.sessionStorage.setItem("SalesOrg", null);
    });

    /****function*****/
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== '';
    }
});