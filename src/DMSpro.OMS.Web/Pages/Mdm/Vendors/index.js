$(function () {
    var l = abp.localization.getResource("MdmService");
	
	var vendorService = window.dMSpro.oMS.mdmService.controllers.vendors.vendor;
	
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
        viewUrl: abp.appPath + "Vendors/CreateModal",
        scriptUrl: "/Pages/Vendors/createModal.js",
        modalClass: "vendorCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "Vendors/EditModal",
        scriptUrl: "/Pages/Vendors/editModal.js",
        modalClass: "vendorEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            code: $("#CodeFilter").val(),
			name: $("#NameFilter").val(),
			shortName: $("#ShortNameFilter").val(),
			phone1: $("#Phone1Filter").val(),
			phone2: $("#Phone2Filter").val(),
			erpCode: $("#ERPCodeFilter").val(),
            active: (function () {
                var value = $("#ActiveFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
			endDateMin: $("#EndDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			endDateMax: $("#EndDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			warehouseId: $("#WarehouseIdFilter").val(),
			street: $("#StreetFilter").val(),
			address: $("#AddressFilter").val(),
			latitude: $("#LatitudeFilter").val(),
			longitude: $("#LongitudeFilter").val(),
			linkedCompanyId: $("#LinkedCompanyIdFilter").val(),			priceListId: $("#PriceListIdFilter").val(),			geoMaster0Id: $("#GeoMaster0IdFilter").val(),			geoMaster1Id: $("#GeoMaster1IdFilter").val(),			geoMaster2Id: $("#GeoMaster2IdFilter").val(),			geoMaster3Id: $("#GeoMaster3IdFilter").val(),			geoMaster4Id: $("#GeoMaster4IdFilter").val()
        };
    };

    var dataTable = $("#VendorsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(vendorService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.Vendors.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.vendor.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.Vendors.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    vendorService.delete(data.record.vendor.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "vendor.code" },
			{ data: "vendor.name" },
			{ data: "vendor.shortName" },
			{ data: "vendor.phone1" },
			{ data: "vendor.phone2" },
			{ data: "vendor.erpCode" },
            {
                data: "vendor.active",
                render: function (active) {
                    return active ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "vendor.endDate",
                render: function (endDate) {
                    if (!endDate) {
                        return "";
                    }
                    
					var date = Date.parse(endDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
			{ data: "vendor.warehouseId" },
			{ data: "vendor.street" },
			{ data: "vendor.address" },
			{ data: "vendor.latitude" },
			{ data: "vendor.longitude" },
            {
                data: "company.code",
                defaultContent : ""
            },
            {
                data: "priceList.code",
                defaultContent : ""
            },
            {
                data: "geoMaster.code",
                defaultContent : ""
            },
            {
                data: "geoMaster1.code",
                defaultContent : ""
            },
            {
                data: "geoMaster2.code",
                defaultContent : ""
            },
            {
                data: "geoMaster3.code",
                defaultContent : ""
            },
            {
                data: "geoMaster4.code",
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

    $("#NewVendorButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        vendorService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/vendors/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'code', value: input.code }, 
                            { name: 'name', value: input.name }, 
                            { name: 'shortName', value: input.shortName }, 
                            { name: 'phone1', value: input.phone1 }, 
                            { name: 'phone2', value: input.phone2 }, 
                            { name: 'erpCode', value: input.erpCode }, 
                            { name: 'active', value: input.active },
                            { name: 'endDateMin', value: input.endDateMin },
                            { name: 'endDateMax', value: input.endDateMax }, 
                            { name: 'warehouseId', value: input.warehouseId }, 
                            { name: 'street', value: input.street }, 
                            { name: 'address', value: input.address }, 
                            { name: 'latitude', value: input.latitude }, 
                            { name: 'longitude', value: input.longitude }, 
                            { name: 'linkedCompanyId', value: input.linkedCompanyId }
, 
                            { name: 'priceListId', value: input.priceListId }
, 
                            { name: 'geoMaster0Id', value: input.geoMaster0Id }
, 
                            { name: 'geoMaster1Id', value: input.geoMaster1Id }
, 
                            { name: 'geoMaster2Id', value: input.geoMaster2Id }
, 
                            { name: 'geoMaster3Id', value: input.geoMaster3Id }
, 
                            { name: 'geoMaster4Id', value: input.geoMaster4Id }
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
