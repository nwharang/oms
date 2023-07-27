$(function () {
    var l = abp.localization.getResource("OMS");
    var itemGroupListService = window.dMSpro.oMS.mdmService.controllers.itemGroupLists.itemGroupList;
	
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
        viewUrl: abp.appPath + "ItemGroupLists/CreateModal",
        scriptUrl: "/Pages/ItemGroupLists/createModal.js",
        modalClass: "itemGroupListCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "ItemGroupLists/EditModal",
        scriptUrl: "/Pages/ItemGroupLists/editModal.js",
        modalClass: "itemGroupListEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            rateMin: $("#RateFilterMin").val(),
			rateMax: $("#RateFilterMax").val(),
			itemGroupId: $("#ItemGroupIdFilter").val(),			itemId: $("#ItemIdFilter").val(),			uOMId: $("#UOMIdFilter").val()
        };
    };

    var dataTable = $("#ItemGroupListsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(itemGroupListService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.ItemGroupLists.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.itemGroupList.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.ItemGroupLists.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    itemGroupListService.delete(data.record.itemGroupList.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "itemGroupList.rate" },
            {
                data: "itemGroup.code",
                defaultContent : ""
            },
            {
                data: "itemMaster.code",
                defaultContent : ""
            },
            {
                data: "uom.code",
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

    $("#NewItemGroupListButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        itemGroupListService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/item-group-lists/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText },
                            { name: 'rateMin', value: input.rateMin },
                            { name: 'rateMax', value: input.rateMax }, 
                            { name: 'itemGroupId', value: input.itemGroupId }
, 
                            { name: 'itemId', value: input.itemId }
, 
                            { name: 'uOMId', value: input.uOMId }
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
