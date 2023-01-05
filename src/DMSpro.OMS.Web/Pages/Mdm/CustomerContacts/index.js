$(function () {
    var l = abp.localization.getResource("MdmService");
	
    var customerContactService = window.dMSpro.oMS.mdmService.controllers.customerContacts.customerContact;
	
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
        viewUrl: abp.appPath + "CustomerContacts/CreateModal",
        scriptUrl: "/Pages/CustomerContacts/createModal.js",
        modalClass: "customerContactCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "CustomerContacts/EditModal",
        scriptUrl: "/Pages/CustomerContacts/editModal.js",
        modalClass: "customerContactEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            title: $("#TitleFilter").val(),
			firstName: $("#FirstNameFilter").val(),
			lastName: $("#LastNameFilter").val(),
			gender: $("#GenderFilter").val(),
			dateOfBirthMin: $("#DateOfBirthFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			dateOfBirthMax: $("#DateOfBirthFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			phone: $("#PhoneFilter").val(),
			email: $("#EmailFilter").val(),
			address: $("#AddressFilter").val(),
			identityNumber: $("#IdentityNumberFilter").val(),
			bankName: $("#BankNameFilter").val(),
			bankAccName: $("#BankAccNameFilter").val(),
			bankAccNumber: $("#BankAccNumberFilter").val(),
			customerId: $("#CustomerIdFilter").val()
        };
    };

    var dataTable = $("#CustomerContactsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(customerContactService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.CustomerContacts.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.customerContact.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.CustomerContacts.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    customerContactService.delete(data.record.customerContact.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{
                data: "customerContact.title",
                render: function (title) {
                    if (title === undefined ||
                        title === null) {
                        return "";
                    }

                    var localizationKey = "EntityFieldValue:MDMService:CustomerContact:Title:" + title;
                    var localized = l(localizationKey);

                    if (localized === localizationKey) {
                        abp.log.warn("No localization found for " + localizationKey);
                        return "";
                    }

                    return localized;
                }
            },
			{ data: "customerContact.firstName" },
			{ data: "customerContact.lastName" },
            {
                data: "customerContact.gender",
                render: function (gender) {
                    if (gender === undefined ||
                        gender === null) {
                        return "";
                    }

                    var localizationKey = "EntityFieldValue:MDMService:CustomerContact:Gender:" + gender;
                    var localized = l(localizationKey);

                    if (localized === localizationKey) {
                        abp.log.warn("No localization found for " + localizationKey);
                        return "";
                    }

                    return localized;
                }
            },
            {
                data: "customerContact.dateOfBirth",
                render: function (dateOfBirth) {
                    if (!dateOfBirth) {
                        return "";
                    }
                    
					var date = Date.parse(dateOfBirth);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
			{ data: "customerContact.phone" },
			{ data: "customerContact.email" },
			{ data: "customerContact.address" },
			{ data: "customerContact.identityNumber" },
			{ data: "customerContact.bankName" },
			{ data: "customerContact.bankAccName" },
			{ data: "customerContact.bankAccNumber" },
            {
                data: "customerProfile.code",
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

    $("#NewCustomerContactButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        customerContactService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/customer-contacts/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'title', value: input.title }, 
                            { name: 'firstName', value: input.firstName }, 
                            { name: 'lastName', value: input.lastName }, 
                            { name: 'gender', value: input.gender },
                            { name: 'dateOfBirthMin', value: input.dateOfBirthMin },
                            { name: 'dateOfBirthMax', value: input.dateOfBirthMax }, 
                            { name: 'phone', value: input.phone }, 
                            { name: 'email', value: input.email }, 
                            { name: 'address', value: input.address }, 
                            { name: 'identityNumber', value: input.identityNumber }, 
                            { name: 'bankName', value: input.bankName }, 
                            { name: 'bankAccName', value: input.bankAccName }, 
                            { name: 'bankAccNumber', value: input.bankAccNumber }, 
                            { name: 'customerId', value: input.customerId }
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
