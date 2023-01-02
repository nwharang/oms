$(function () {
    var l = abp.localization.getResource("MdmService");
	var employeeInZoneService = window.dMSpro.oMS.mdmService.controllers.employeeInZones.employeeInZone;
	
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
        viewUrl: abp.appPath + "EmployeeInZones/CreateModal",
        scriptUrl: "/Pages/EmployeeInZones/createModal.js",
        modalClass: "employeeInZoneCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "EmployeeInZones/EditModal",
        scriptUrl: "/Pages/EmployeeInZones/editModal.js",
        modalClass: "employeeInZoneEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            effectiveDateMin: $("#EffectiveDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			effectiveDateMax: $("#EffectiveDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			endDate: $("#EndDateFilter").val(),
			salesOrgHierarchyId: $("#SalesOrgHierarchyIdFilter").val(),			employeeId: $("#EmployeeIdFilter").val()
        };
    };

    var dataTable = $("#EmployeeInZonesTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(employeeInZoneService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.EmployeeInZones.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.employeeInZone.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.EmployeeInZones.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    employeeInZoneService.delete(data.record.employeeInZone.id)
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
                data: "employeeInZone.effectiveDate",
                render: function (effectiveDate) {
                    if (!effectiveDate) {
                        return "";
                    }
                    
					var date = Date.parse(effectiveDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
			{ data: "employeeInZone.endDate" },
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

    $("#NewEmployeeInZoneButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        employeeInZoneService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/employee-in-zones/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText },
                            { name: 'effectiveDateMin', value: input.effectiveDateMin },
                            { name: 'effectiveDateMax', value: input.effectiveDateMax }, 
                            { name: 'endDate', value: input.endDate }, 
                            { name: 'salesOrgHierarchyId', value: input.salesOrgHierarchyId }
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
