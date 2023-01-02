$(function () {
    var l = abp.localization.getResource("MdmService");
	var routeService = window.dMSpro.oMS.mdmService.controllers.routes.route;
	
        var lastNpIdId = '';
        var lastNpDisplayNameId = '';

        var _lookupModal = new abp.ModalManager({
            viewUrl: abp.appPath + "Shared/LookupModal",
            scriptUrl: "/Pages/Shared/lookupModal.js",
            modalClass: "navigationPropertyLookup"
        });

        $('.lookupCleanButton').on('click', '', function () {
            $(this).parent().find('input').val('');
        });

        _lookupModal.onClose(function () {
            var modal = $(_lookupModal.getModal());
            $('#' + lastNpIdId).val(modal.find('#CurrentLookupId').val());
            $('#' + lastNpDisplayNameId).val(modal.find('#CurrentLookupDisplayName').val());
        });
	
    var createModal = new abp.ModalManager({
        viewUrl: abp.appPath + "Routes/CreateModal",
        scriptUrl: "/Pages/Routes/createModal.js",
        modalClass: "routeCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "Routes/EditModal",
        scriptUrl: "/Pages/Routes/editModal.js",
        modalClass: "routeEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            checkIn: (function () {
                var value = $("#CheckInFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
            checkOut: (function () {
                var value = $("#CheckOutFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
            gpsLock: (function () {
                var value = $("#GPSLockFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
            outRoute: (function () {
                var value = $("#OutRouteFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
			routeTypeId: $("#RouteTypeIdFilter").val(),			itemGroupId: $("#ItemGroupIdFilter").val(),			salesOrgHierarchyId: $("#SalesOrgHierarchyIdFilter").val()
        };
    };

    var dataTable = $("#RoutesTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(routeService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.Routes.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.route.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.Routes.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    routeService.delete(data.record.route.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{
                data: "route.checkIn",
                render: function (checkIn) {
                    return checkIn ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "route.checkOut",
                render: function (checkOut) {
                    return checkOut ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "route.gpsLock",
                render: function (gpsLock) {
                    return gpsLock ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "route.outRoute",
                render: function (outRoute) {
                    return outRoute ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "systemData.valueCode",
                defaultContent : ""
            },
            {
                data: "itemGroup.code",
                defaultContent : ""
            },
            {
                data: "salesOrgHierarchy.code",
                defaultContent : ""
            }
        ]
    }));

    createModal.onResult(function () {
        dataTable.ajax.reload();
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
    });

    $("#NewRouteButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        routeService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/routes/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'checkIn', value: input.checkIn }, 
                            { name: 'checkOut', value: input.checkOut }, 
                            { name: 'gpsLock', value: input.gpsLock }, 
                            { name: 'outRoute', value: input.outRoute }, 
                            { name: 'routeTypeId', value: input.routeTypeId }
, 
                            { name: 'itemGroupId', value: input.itemGroupId }
, 
                            { name: 'salesOrgHierarchyId', value: input.salesOrgHierarchyId }
                            ]);
                            
                    var downloadWindow = window.open(url, '_blank');
                    downloadWindow.focus();
            }
        )
    });

    $('#AdvancedFilterSectionToggler').on('click', function (e) {
        $('#AdvancedFilterSection').toggle();
    });

    $('#AdvancedFilterSection').on('keypress', function (e) {
        if (e.which === 13) {
            dataTable.ajax.reload();
        }
    });

    $('#AdvancedFilterSection select').change(function() {
        dataTable.ajax.reload();
    });
    
    
});
