$(function () {
    var l = abp.localization.getResource("MdmService");
	var priceUpdateDetailService = window.dMSpro.oMS.mdmService.controllers.priceUpdateDetails.priceUpdateDetail;
	
	
	
    var createModal = new abp.ModalManager({
        viewUrl: abp.appPath + "PriceUpdateDetails/CreateModal",
        scriptUrl: "/Pages/PriceUpdateDetails/createModal.js",
        modalClass: "priceUpdateDetailCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "PriceUpdateDetails/EditModal",
        scriptUrl: "/Pages/PriceUpdateDetails/editModal.js",
        modalClass: "priceUpdateDetailEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            priceListDetailId: $("#PriceListDetailIdFilter").val(),
			newPriceMin: $("#NewPriceFilterMin").val(),
			newPriceMax: $("#NewPriceFilterMax").val()
        };
    };

    var dataTable = $("#PriceUpdateDetailsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(priceUpdateDetailService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.PriceUpdateDetails.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.PriceUpdateDetails.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    priceUpdateDetailService.delete(data.record.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "priceListDetailId" },
			{ data: "newPrice" }
        ]
    }));

    createModal.onResult(function () {
        dataTable.ajax.reload();
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
    });

    $("#NewPriceUpdateDetailButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        priceUpdateDetailService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/price-update-details/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'priceListDetailId', value: input.priceListDetailId },
                            { name: 'newPriceMin', value: input.newPriceMin },
                            { name: 'newPriceMax', value: input.newPriceMax }
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
