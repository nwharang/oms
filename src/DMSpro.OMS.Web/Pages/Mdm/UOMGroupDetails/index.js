$(function () {
    var l = abp.localization.getResource("MdmService");
	
    var uOMGroupDetailService = window.dMSpro.oMS.mdmService.controllers.uOMGroupDetails.uOMGroupDetail;
	
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
        viewUrl: abp.appPath + "UOMGroupDetails/CreateModal",
        scriptUrl: "/Pages/UOMGroupDetails/createModal.js",
        modalClass: "uOMGroupDetailCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "UOMGroupDetails/EditModal",
        scriptUrl: "/Pages/UOMGroupDetails/editModal.js",
        modalClass: "uOMGroupDetailEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            altQtyMin: $("#AltQtyFilterMin").val(),
			altQtyMax: $("#AltQtyFilterMax").val(),
			baseQtyMin: $("#BaseQtyFilterMin").val(),
			baseQtyMax: $("#BaseQtyFilterMax").val(),
            active: (function () {
                var value = $("#ActiveFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
			uOMGroupId: $("#UOMGroupIdFilter").val(),			altUOMId: $("#AltUOMIdFilter").val(),			baseUOMId: $("#BaseUOMIdFilter").val()
        };
    };

    var dataTable = $("#UOMGroupDetailsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(uOMGroupDetailService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.UOMGroupDetails.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.uomGroupDetail.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.UOMGroupDetails.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    uOMGroupDetailService.delete(data.record.uomGroupDetail.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "uomGroupDetail.altQty" },
			{ data: "uomGroupDetail.baseQty" },
            {
                data: "uomGroupDetail.active",
                render: function (active) {
                    return active ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "uomGroup.code",
                defaultContent : ""
            },
            {
                data: "altUOM.code",
                defaultContent : ""
            },
            {
                data: "baseUOM.code",
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

    $("#NewUOMGroupDetailButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        uOMGroupDetailService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/u-oMGroup-details/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText },
                            { name: 'altQtyMin', value: input.altQtyMin },
                            { name: 'altQtyMax', value: input.altQtyMax },
                            { name: 'baseQtyMin', value: input.baseQtyMin },
                            { name: 'baseQtyMax', value: input.baseQtyMax }, 
                            { name: 'active', value: input.active }, 
                            { name: 'uOMGroupId', value: input.uOMGroupId }
, 
                            { name: 'altUOMId', value: input.altUOMId }
, 
                            { name: 'baseUOMId', value: input.baseUOMId }
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
