$(function () {
    var l = abp.localization.getResource("MdmService");
	var itemImageService = window.dMSpro.oMS.mdmService.controllers.itemImages.itemImage;
	
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
        viewUrl: abp.appPath + "ItemImages/CreateModal",
        scriptUrl: "/Pages/ItemImages/createModal.js",
        modalClass: "itemImageCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "ItemImages/EditModal",
        scriptUrl: "/Pages/ItemImages/editModal.js",
        modalClass: "itemImageEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            description: $("#DescriptionFilter").val(),
            active: (function () {
                var value = $("#ActiveFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
			uRL: $("#URLFilter").val(),
			displayOrderMin: $("#DisplayOrderFilterMin").val(),
			displayOrderMax: $("#DisplayOrderFilterMax").val(),
			itemId: $("#ItemIdFilter").val()
        };
    };

    var dataTable = $("#ItemImagesTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(itemImageService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.ItemImages.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.itemImage.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.ItemImages.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    itemImageService.delete(data.record.itemImage.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "itemImage.description" },
            {
                data: "itemImage.active",
                render: function (active) {
                    return active ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
			{ data: "itemImage.url" },
			{ data: "itemImage.displayOrder" },
            {
                data: "itemMaster.name",
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

    $("#NewItemImageButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        itemImageService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/item-images/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'description', value: input.description }, 
                            { name: 'active', value: input.active }, 
                            { name: 'uRL', value: input.uRL },
                            { name: 'displayOrderMin', value: input.displayOrderMin },
                            { name: 'displayOrderMax', value: input.displayOrderMax }, 
                            { name: 'itemId', value: input.itemId }
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
