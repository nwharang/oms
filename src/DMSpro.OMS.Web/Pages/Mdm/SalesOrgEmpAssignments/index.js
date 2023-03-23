$(function () {
    var l = abp.localization.getResource("OMS");
    var salesOrgEmpAssignmentService = window.dMSpro.oMS.mdmService.controllers.salesOrgEmpAssignments.salesOrgEmpAssignment;
	
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
        viewUrl: abp.appPath + "SalesOrgEmpAssignments/CreateModal",
        scriptUrl: "/Pages/SalesOrgEmpAssignments/createModal.js",
        modalClass: "salesOrgEmpAssignmentCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "SalesOrgEmpAssignments/EditModal",
        scriptUrl: "/Pages/SalesOrgEmpAssignments/editModal.js",
        modalClass: "salesOrgEmpAssignmentEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            isBase: (function () {
                var value = $("#IsBaseFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
			effectiveDateMin: $("#EffectiveDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			effectiveDateMax: $("#EffectiveDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			endDateMin: $("#EndDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			endDateMax: $("#EndDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			salesOrgHierarchyId: $("#SalesOrgHierarchyIdFilter").val(),			employeeProfileId: $("#EmployeeProfileIdFilter").val()
        };
    };

    var dataTable = $("#SalesOrgEmpAssignmentsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(salesOrgEmpAssignmentService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.SalesOrgEmpAssignments.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.salesOrgEmpAssignment.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.SalesOrgEmpAssignments.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    salesOrgEmpAssignmentService.delete(data.record.salesOrgEmpAssignment.id)
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
                data: "salesOrgEmpAssignment.isBase",
                render: function (isBase) {
                    return isBase ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "salesOrgEmpAssignment.effectiveDate",
                render: function (effectiveDate) {
                    if (!effectiveDate) {
                        return "";
                    }
                    
					var date = Date.parse(effectiveDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
            {
                data: "salesOrgEmpAssignment.endDate",
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

    $("#NewSalesOrgEmpAssignmentButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        salesOrgEmpAssignmentService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/sales-org-emp-assignments/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'isBase', value: input.isBase },
                            { name: 'effectiveDateMin', value: input.effectiveDateMin },
                            { name: 'effectiveDateMax', value: input.effectiveDateMax },
                            { name: 'endDateMin', value: input.endDateMin },
                            { name: 'endDateMax', value: input.endDateMax }, 
                            { name: 'salesOrgHierarchyId', value: input.salesOrgHierarchyId }
, 
                            { name: 'employeeProfileId', value: input.employeeProfileId }
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
