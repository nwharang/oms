$(function () {
    var l = abp.localization.getResource("MdmService");
	var customerGroupByListService = window.dMSpro.oMS.mdmService.controllers.customerGroupByLists.customerGroupByList;
	
	
	
    var createModal = new abp.ModalManager({
        viewUrl: abp.appPath + "CustomerGroupByLists/CreateModal",
        scriptUrl: "/Pages/CustomerGroupByLists/createModal.js",
        modalClass: "customerGroupByListCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "CustomerGroupByLists/EditModal",
        scriptUrl: "/Pages/CustomerGroupByLists/editModal.js",
        modalClass: "customerGroupByListEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            customerGroupId: $("#CustomerGroupIdFilter").val(),
			bPId: $("#BPIdFilter").val(),
            active: (function () {
                var value = $("#ActiveFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
			effDateMin: $("#EffDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			effDateMax: $("#EffDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd')
        };
    };

    var dataTable = $("#CustomerGroupByListsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(customerGroupByListService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.CustomerGroupByLists.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.CustomerGroupByLists.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    customerGroupByListService.delete(data.record.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "customerGroupId" },
			{ data: "bPId" },
            {
                data: "active",
                render: function (active) {
                    return active ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "effDate",
                render: function (effDate) {
                    if (!effDate) {
                        return "";
                    }
                    
					var date = Date.parse(effDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            }
        ]
    }));

    createModal.onResult(function () {
        dataTable.ajax.reload();
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
    });

    $("#NewCustomerGroupByListButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        customerGroupByListService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/customer-group-by-lists/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'customerGroupId', value: input.customerGroupId }, 
                            { name: 'bPId', value: input.bPId }, 
                            { name: 'active', value: input.active },
                            { name: 'effDateMin', value: input.effDateMin },
                            { name: 'effDateMax', value: input.effDateMax }
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
