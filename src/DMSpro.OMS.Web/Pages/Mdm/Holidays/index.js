$(function () {
    var l = abp.localization.getResource("MdmService");
	var holidayService = window.dMSpro.oMS.mdmService.controllers.holidays.holiday;
	
	
    
    var createModal = new abp.ModalManager({
        viewUrl: abp.appPath + "Holidays/CreateModal",
        scriptUrl: "/Pages/Holidays/createModal.js",
        modalClass: "holidayCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "Holidays/EditModal",
        scriptUrl: "/Pages/Holidays/editModal.js",
        modalClass: "holidayEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            yearMin: $("#YearFilterMin").val(),
			yearMax: $("#YearFilterMax").val(),
			description: $("#DescriptionFilter").val()
        };
    };

    var dataTable = $("#HolidaysTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(holidayService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.Holidays.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.Holidays.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    holidayService.delete(data.record.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "year" },
			{ data: "description" }
        ]
    }));

    createModal.onResult(function () {
        dataTable.ajax.reload();
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
    });

    $("#NewHolidayButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        holidayService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/holidays/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText },
                            { name: 'yearMin', value: input.yearMin },
                            { name: 'yearMax', value: input.yearMax }, 
                            { name: 'description', value: input.description }
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
