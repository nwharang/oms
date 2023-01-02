$(function () {
    var l = abp.localization.getResource("MdmService");
	var priceUpdateService = window.dMSpro.oMS.mdmService.controllers.priceUpdates.priceUpdate;
	
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
        viewUrl: abp.appPath + "PriceUpdates/CreateModal",
        scriptUrl: "/Pages/PriceUpdates/createModal.js",
        modalClass: "priceUpdateCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "PriceUpdates/EditModal",
        scriptUrl: "/Pages/PriceUpdates/editModal.js",
        modalClass: "priceUpdateEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            code: $("#CodeFilter").val(),
			description: $("#DescriptionFilter").val(),
			effectiveDateMin: $("#EffectiveDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			effectiveDateMax: $("#EffectiveDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			status: $("#StatusFilter").val(),
			updateStatusDateMin: $("#UpdateStatusDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			updateStatusDateMax: $("#UpdateStatusDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			priceListId: $("#PriceListIdFilter").val()
        };
    };

    var dataTable = $("#PriceUpdatesTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(priceUpdateService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.PriceUpdates.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.priceUpdate.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.PriceUpdates.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    priceUpdateService.delete(data.record.priceUpdate.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "priceUpdate.code" },
			{ data: "priceUpdate.description" },
            {
                data: "priceUpdate.effectiveDate",
                render: function (effectiveDate) {
                    if (!effectiveDate) {
                        return "";
                    }
                    
					var date = Date.parse(effectiveDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
            {
                data: "priceUpdate.status",
                render: function (status) {
                    if (status === undefined ||
                        status === null) {
                        return "";
                    }

                    var localizationKey = "Enum:PriceUpdateStatus." + status;
                    var localized = l(localizationKey);

                    if (localized === localizationKey) {
                        abp.log.warn("No localization found for " + localizationKey);
                        return "";
                    }

                    return localized;
                }
            },
            {
                data: "priceUpdate.updateStatusDate",
                render: function (updateStatusDate) {
                    if (!updateStatusDate) {
                        return "";
                    }
                    
					var date = Date.parse(updateStatusDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
            {
                data: "priceList.code",
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

    $("#NewPriceUpdateButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        priceUpdateService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/price-updates/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'code', value: input.code }, 
                            { name: 'description', value: input.description },
                            { name: 'effectiveDateMin', value: input.effectiveDateMin },
                            { name: 'effectiveDateMax', value: input.effectiveDateMax }, 
                            { name: 'status', value: input.status },
                            { name: 'updateStatusDateMin', value: input.updateStatusDateMin },
                            { name: 'updateStatusDateMax', value: input.updateStatusDateMax }, 
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
