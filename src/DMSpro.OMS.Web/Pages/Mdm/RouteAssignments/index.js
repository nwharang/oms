$(function () {
    var l = abp.localization.getResource("OMS");
	var routeAssignmentService = window.dMSpro.oMS.mdmService.controllers.routeAssignments.routeAssignment;
	
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
        viewUrl: abp.appPath + "RouteAssignments/CreateModal",
        scriptUrl: "/Pages/RouteAssignments/createModal.js",
        modalClass: "routeAssignmentCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "RouteAssignments/EditModal",
        scriptUrl: "/Pages/RouteAssignments/editModal.js",
        modalClass: "routeAssignmentEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            effectiveDateMin: $("#EffectiveDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			effectiveDateMax: $("#EffectiveDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			endDateMin: $("#EndDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			endDateMax: $("#EndDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			routeId: $("#RouteIdFilter").val(),			employeeId: $("#EmployeeIdFilter").val()
        };
    };

    var dataTable = $("#RouteAssignmentsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(routeAssignmentService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.RouteAssignments.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.routeAssignment.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.RouteAssignments.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    routeAssignmentService.delete(data.record.routeAssignment.id)
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
                data: "routeAssignment.effectiveDate",
                render: function (effectiveDate) {
                    if (!effectiveDate) {
                        return "";
                    }
                    
					var date = Date.parse(effectiveDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
            {
                data: "routeAssignment.endDate",
                render: function (endDate) {
                    if (!endDate) {
                        return "";
                    }
                    
					var date = Date.parse(endDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
            {
                data: "salesOrgHierarchy.code",
                defaultContent : ""
            },
            {
                data: "employeeProfile.code",
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

    $("#NewRouteAssignmentButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        routeAssignmentService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/route-assignments/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText },
                            { name: 'effectiveDateMin', value: input.effectiveDateMin },
                            { name: 'effectiveDateMax', value: input.effectiveDateMax },
                            { name: 'endDateMin', value: input.endDateMin },
                            { name: 'endDateMax', value: input.endDateMax }, 
                            { name: 'routeId', value: input.routeId }
, 
                            { name: 'employeeId', value: input.employeeId }
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
