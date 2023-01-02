$(function () {
    var l = abp.localization.getResource("MdmService");
	var holidayDetailService = window.dMSpro.oMS.mdmService.controllers.holidayDetails.holidayDetail;
	
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
        viewUrl: abp.appPath + "HolidayDetails/CreateModal",
        scriptUrl: "/Pages/HolidayDetails/createModal.js",
        modalClass: "holidayDetailCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "HolidayDetails/EditModal",
        scriptUrl: "/Pages/HolidayDetails/editModal.js",
        modalClass: "holidayDetailEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            startDateMin: $("#StartDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			startDateMax: $("#StartDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			endDateMin: $("#EndDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			endDateMax: $("#EndDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			description: $("#DescriptionFilter").val(),
			holidayId: $("#HolidayIdFilter").val()
        };
    };

    var dataTable = $("#HolidayDetailsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(holidayDetailService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.HolidayDetails.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.holidayDetail.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.HolidayDetails.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    holidayDetailService.delete(data.record.holidayDetail.id)
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
                data: "holidayDetail.startDate",
                render: function (startDate) {
                    if (!startDate) {
                        return "";
                    }
                    
					var date = Date.parse(startDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
            {
                data: "holidayDetail.endDate",
                render: function (endDate) {
                    if (!endDate) {
                        return "";
                    }
                    
					var date = Date.parse(endDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
			{ data: "holidayDetail.description" },
            {
                data: "holiday.description",
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

    $("#NewHolidayDetailButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        holidayDetailService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/holiday-details/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText },
                            { name: 'startDateMin', value: input.startDateMin },
                            { name: 'startDateMax', value: input.startDateMax },
                            { name: 'endDateMin', value: input.endDateMin },
                            { name: 'endDateMax', value: input.endDateMax }, 
                            { name: 'description', value: input.description }, 
                            { name: 'holidayId', value: input.holidayId }
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
