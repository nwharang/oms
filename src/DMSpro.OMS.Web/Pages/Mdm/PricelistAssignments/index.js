$(function () {
    var l = abp.localization.getResource("MdmService");
	var pricelistAssignmentService = window.dMSpro.oMS.mdmService.controllers.pricelistAssignments.pricelistAssignment;
	
	
	
    var createModal = new abp.ModalManager({
        viewUrl: abp.appPath + "PricelistAssignments/CreateModal",
        scriptUrl: "/Pages/PricelistAssignments/createModal.js",
        modalClass: "pricelistAssignmentCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "PricelistAssignments/EditModal",
        scriptUrl: "/Pages/PricelistAssignments/editModal.js",
        modalClass: "pricelistAssignmentEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            priceListId: $("#PriceListIdFilter").val()
        };
    };

    var dataTable = $("#PricelistAssignmentsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(pricelistAssignmentService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.PricelistAssignments.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.PricelistAssignments.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    pricelistAssignmentService.delete(data.record.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "priceListId" }
        ]
    }));

    createModal.onResult(function () {
        dataTable.ajax.reload();
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
    });

    $("#NewPricelistAssignmentButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        pricelistAssignmentService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/pricelist-assignments/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'priceListId', value: input.priceListId }
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
