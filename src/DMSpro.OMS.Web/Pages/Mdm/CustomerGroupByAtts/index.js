$(function () {
    var l = abp.localization.getResource("MdmService");
	var customerGroupByAttService = window.dMSpro.oMS.mdmService.controllers.customerGroupByAtts.customerGroupByAtt;
	
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
        viewUrl: abp.appPath + "CustomerGroupByAtts/CreateModal",
        scriptUrl: "/Pages/CustomerGroupByAtts/createModal.js",
        modalClass: "customerGroupByAttCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "CustomerGroupByAtts/EditModal",
        scriptUrl: "/Pages/CustomerGroupByAtts/editModal.js",
        modalClass: "customerGroupByAttEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            valueCode: $("#ValueCodeFilter").val(),
			valueName: $("#ValueNameFilter").val(),
			customerGroupId: $("#CustomerGroupIdFilter").val(),			cusAttributeValueId: $("#CusAttributeValueIdFilter").val()
        };
    };

    var dataTable = $("#CustomerGroupByAttsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(customerGroupByAttService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.CustomerGroupByAtts.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.customerGroupByAtt.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.CustomerGroupByAtts.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    customerGroupByAttService.delete(data.record.customerGroupByAtt.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "customerGroupByAtt.valueCode" },
			{ data: "customerGroupByAtt.valueName" },
            {
                data: "customerGroup.code",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue.attrValName",
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

    $("#NewCustomerGroupByAttButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        customerGroupByAttService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/customer-group-by-atts/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'valueCode', value: input.valueCode }, 
                            { name: 'valueName', value: input.valueName }, 
                            { name: 'customerGroupId', value: input.customerGroupId }
, 
                            { name: 'cusAttributeValueId', value: input.cusAttributeValueId }
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
