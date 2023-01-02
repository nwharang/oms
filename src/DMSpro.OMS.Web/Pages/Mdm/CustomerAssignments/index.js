$(function () {
    var l = abp.localization.getResource("MdmService");
	var customerAssignmentService = window.dMSpro.oMS.mdmService.controllers.customerAssignments.customerAssignment;
	

    var dataCusAssginments = [
        {
            code: "111",
            name: "Abc",
            outletID: "001",
            outletName: "7791",
            effectiveDate: "12/1/2022",
            endDate: "12/5/2024"
        },
        {
            code: "222",
            name: "Trung Bo",
            outletID: "002",
            outletName: "ABc de",
            effectiveDate: "11/20/2022",
            endDate: "12/2/2023"
        },
        {
            code: "103",
            name: "Siro Kem",
            outletID: "003",
            outletName: "Zy zz",
            effectiveDate: "11/10/2022",
            endDate: "1/4/2023"
        },
        {
            code: "104",
            name: "Tyre Kin",
            outletID: "004",
            outletName: "ABc def",
            effectiveDate: "11/20/2022",
            endDate: "12/2/2023"
        },
        {
            code: "205",
            name: "Duong Qua",
            outletID: "005",
            outleName: "Nguyen A",
            effectiveDate: "11/20/2022",
            endDate: "12/2/2023"
        },
        {
            code: "206",
            name: "Tieu Long Nu",
            outletID: "006",
            outletName: "Tran Be",
            effectiveDate: "11/20/2022",
            endDate: "12/2/2023"
        }
    ]

    var gridCusAssignment = $('#dgCusAssignment').dxDataGrid({
        dataSource: dataCusAssginments,
        keyExpr: "code",
        editing: {
            mode: "row",
            allowUpdating: true,
            allowDeleting: true,
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        showBorders: true,
        //filterRow: {
        //    visible: true
        //},
        searchPanel: {
            visible: true
        },
        scrolling: {
            mode: 'standard'
        },
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        //headerFilter: {
        //    visible: true,
        //},
        paging:
        {
            pageSize: 10,
        },
        pager: {
            visible: true,
            allowedPageSizes: [10, 20, 'all'],
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true,
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
                caption: l("Company"),
                width: 150,
                dataType: 'string',
            },
            {
                dataField: 'name',
                caption: l("Company Name"),
                width: 250,
                dataType: 'string',
            },
            {
                dataField: 'outletID',
                caption: l("OutletID"),
                width: 150,
                dataType: 'string',
            },
            {
                dataField: 'outletName',
                caption: l("Outlet Name"),
                width: 250,
                dataType: 'string',
            },
            {
                dataField: 'effectiveDate',
                caption: l("EntityFieldName:MDMService:CompanyProfile:EffectiveDate"),
                width: 130,
                dataType: 'date',
            },
            {
                dataField: 'endDate',
                caption: l("EntityFieldName:MDMService:CompanyProfile:EndDate"),
                width: 130,
                dataType: 'date',
            },
        ],
    }).dxDataGrid("instance");

    
});
