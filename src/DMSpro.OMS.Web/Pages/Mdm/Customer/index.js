$(function () {
    var l = abp.localization.getResource("OMS");
	
	var customerService = window.dMSpro.oMS.mdmService.controllers.customers.customer;
	
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
        viewUrl: abp.appPath + "Customers/CreateModal",
        scriptUrl: "/Pages/Customers/createModal.js",
        modalClass: "customerCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "Customers/EditModal",
        scriptUrl: "/Pages/Customers/editModal.js",
        modalClass: "customerEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            code: $("#CodeFilter").val(),
			name: $("#NameFilter").val(),
			phone1: $("#Phone1Filter").val(),
			phone2: $("#Phone2Filter").val(),
			erpCode: $("#erpCodeFilter").val(),
			license: $("#LicenseFilter").val(),
			taxCode: $("#TaxCodeFilter").val(),
			vatName: $("#vatNameFilter").val(),
			vatAddress: $("#vatAddressFilter").val(),
            active: (function () {
                var value = $("#ActiveFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
			effectiveDateMin: $("#EffectiveDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			effectiveDateMax: $("#EffectiveDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			endDateMin: $("#EndDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			endDateMax: $("#EndDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			creditLimitMin: $("#CreditLimitFilterMin").val(),
			creditLimitMax: $("#CreditLimitFilterMax").val(),
            isCompany: (function () {
                var value = $("#IsCompanyFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
			warehouseId: $("#WarehouseIdFilter").val(),
			street: $("#StreetFilter").val(),
			address: $("#AddressFilter").val(),
			latitude: $("#LatitudeFilter").val(),
			longitude: $("#LongitudeFilter").val(),
			sfaCustomerCode: $("#SFACustomerCodeFilter").val(),
			lastOrderDateMin: $("#LastOrderDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			lastOrderDateMax: $("#LastOrderDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			paymentTermId: $("#PaymentTermIdFilter").val(),			linkedCompanyId: $("#LinkedCompanyIdFilter").val(),			priceListId: $("#PriceListIdFilter").val(),			geoMaster0Id: $("#GeoMaster0IdFilter").val(),			geoMaster1Id: $("#GeoMaster1IdFilter").val(),			geoMaster2Id: $("#GeoMaster2IdFilter").val(),			geoMaster3Id: $("#GeoMaster3IdFilter").val(),			geoMaster4Id: $("#GeoMaster4IdFilter").val(),			attribute0Id: $("#Attribute0IdFilter").val(),			attribute1Id: $("#Attribute1IdFilter").val(),			attribute2Id: $("#Attribute2IdFilter").val(),			attribute3Id: $("#Attribute3IdFilter").val(),			attribute4Id: $("#Attribute4IdFilter").val(),			attribute5Id: $("#Attribute5IdFilter").val(),			attribute6Id: $("#Attribute6IdFilter").val(),			attribute7Id: $("#Attribute7IdFilter").val(),			attribute8Id: $("#Attribute8IdFilter").val(),			attribute9Id: $("#Attribute9IdFilter").val(),			attribute10Id: $("#Attribute10IdFilter").val(),			attribute11Id: $("#Attribute11IdFilter").val(),			attribute12Id: $("#Attribute12IdFilter").val(),			attribute13Id: $("#Attribute13IdFilter").val(),			attribute14Id: $("#Attribute14IdFilter").val(),			attribute15Id: $("#Attribute15IdFilter").val(),			attribute16Id: $("#Attribute16IdFilter").val(),			attribute1I7d: $("#Attribute1I7dFilter").val(),			attribute18Id: $("#Attribute18IdFilter").val(),			attribute19Id: $("#Attribute19IdFilter").val(),			paymentId: $("#PaymentIdFilter").val()
        };
    };

    var dataTable = $("#CustomersTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(customerService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.Customers.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.customer.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.Customers.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    customerService.delete(data.record.customer.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "customer.code" },
			{ data: "customer.name" },
			{ data: "customer.phone1" },
			{ data: "customer.phone2" },
			{ data: "customer.erpCode" },
			{ data: "customer.license" },
			{ data: "customer.taxCode" },
			{ data: "customer.vatName" },
			{ data: "customer.vatAddress" },
            {
                data: "customer.active",
                render: function (active) {
                    return active ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "customer.effectiveDate",
                render: function (effectiveDate) {
                    if (!effectiveDate) {
                        return "";
                    }
                    
					var date = Date.parse(effectiveDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
            {
                data: "customer.endDate",
                render: function (endDate) {
                    if (!endDate) {
                        return "";
                    }
                    
					var date = Date.parse(endDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
			{ data: "customer.creditLimit" },
            {
                data: "customer.isCompany",
                render: function (isCompany) {
                    return isCompany ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
			{ data: "customer.warehouseId" },
			{ data: "customer.street" },
			{ data: "customer.address" },
			{ data: "customer.latitude" },
			{ data: "customer.longitude" },
			{ data: "customer.sfaCustomerCode" },
            {
                data: "customer.lastOrderDate",
                render: function (lastOrderDate) {
                    if (!lastOrderDate) {
                        return "";
                    }
                    
					var date = Date.parse(lastOrderDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
            {
                data: "systemData.valueCode",
                defaultContent : ""
            },
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
            },
            {
                data: "cusAttributeValue.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue1.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue2.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue3.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue4.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue5.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue6.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue7.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue8.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue9.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue10.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue11.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue12.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue13.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue14.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue15.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue16.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue17.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue18.attrValName",
                defaultContent : ""
            },
            {
                data: "cusAttributeValue19.attrValName",
                defaultContent : ""
            },
            {
                data: "customer1.code",
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

    $("#NewCustomerButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        customerService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/customers/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'code', value: input.code }, 
                            { name: 'name', value: input.name }, 
                            { name: 'phone1', value: input.phone1 }, 
                            { name: 'phone2', value: input.phone2 }, 
                            { name: 'erpCode', value: input.erpCode }, 
                            { name: 'license', value: input.license }, 
                            { name: 'taxCode', value: input.taxCode }, 
                            { name: 'vatName', value: input.vatName }, 
                            { name: 'vatAddress', value: input.vatAddress }, 
                            { name: 'active', value: input.active },
                            { name: 'effectiveDateMin', value: input.effectiveDateMin },
                            { name: 'effectiveDateMax', value: input.effectiveDateMax },
                            { name: 'endDateMin', value: input.endDateMin },
                            { name: 'endDateMax', value: input.endDateMax },
                            { name: 'creditLimitMin', value: input.creditLimitMin },
                            { name: 'creditLimitMax', value: input.creditLimitMax }, 
                            { name: 'isCompany', value: input.isCompany }, 
                            { name: 'warehouseId', value: input.warehouseId }, 
                            { name: 'street', value: input.street }, 
                            { name: 'address', value: input.address }, 
                            { name: 'latitude', value: input.latitude }, 
                            { name: 'longitude', value: input.longitude }, 
                            { name: 'sfaCustomerCode', value: input.sfaCustomerCode },
                            { name: 'lastOrderDateMin', value: input.lastOrderDateMin },
                            { name: 'lastOrderDateMax', value: input.lastOrderDateMax }, 
                            { name: 'paymentTermId', value: input.paymentTermId }
, 
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
, 
                            { name: 'attribute0Id', value: input.attribute0Id }
, 
                            { name: 'attribute1Id', value: input.attribute1Id }
, 
                            { name: 'attribute2Id', value: input.attribute2Id }
, 
                            { name: 'attribute3Id', value: input.attribute3Id }
, 
                            { name: 'attribute4Id', value: input.attribute4Id }
, 
                            { name: 'attribute5Id', value: input.attribute5Id }
, 
                            { name: 'attribute6Id', value: input.attribute6Id }
, 
                            { name: 'attribute7Id', value: input.attribute7Id }
, 
                            { name: 'attribute8Id', value: input.attribute8Id }
, 
                            { name: 'attribute9Id', value: input.attribute9Id }
, 
                            { name: 'attribute10Id', value: input.attribute10Id }
, 
                            { name: 'attribute11Id', value: input.attribute11Id }
, 
                            { name: 'attribute12Id', value: input.attribute12Id }
, 
                            { name: 'attribute13Id', value: input.attribute13Id }
, 
                            { name: 'attribute14Id', value: input.attribute14Id }
, 
                            { name: 'attribute15Id', value: input.attribute15Id }
, 
                            { name: 'attribute16Id', value: input.attribute16Id }
, 
                            { name: 'attribute1I7d', value: input.attribute1I7d }
, 
                            { name: 'attribute18Id', value: input.attribute18Id }
, 
                            { name: 'attribute19Id', value: input.attribute19Id }
, 
                            { name: 'paymentId', value: input.paymentId }
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
