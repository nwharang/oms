$(function () {
    var l = abp.localization.getResource("MdmService");
	var mCPDetailService = window.dMSpro.oMS.mdmService.controllers.mCPDetails.mCPDetail;
	
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
        viewUrl: abp.appPath + "MCPDetails/CreateModal",
        scriptUrl: "/Pages/MCPDetails/createModal.js",
        modalClass: "mCPDetailCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "MCPDetails/EditModal",
        scriptUrl: "/Pages/MCPDetails/editModal.js",
        modalClass: "mCPDetailEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            code: $("#CodeFilter").val(),
			effectiveDateMin: $("#EffectiveDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			effectiveDateMax: $("#EffectiveDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			endDateMin: $("#EndDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			endDateMax: $("#EndDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			distanceMin: $("#DistanceFilterMin").val(),
			distanceMax: $("#DistanceFilterMax").val(),
			visitOrderMin: $("#VisitOrderFilterMin").val(),
			visitOrderMax: $("#VisitOrderFilterMax").val(),
            monday: (function () {
                var value = $("#MondayFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
            tuesday: (function () {
                var value = $("#TuesdayFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
            wednesday: (function () {
                var value = $("#WednesdayFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
            thursday: (function () {
                var value = $("#ThursdayFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
            friday: (function () {
                var value = $("#FridayFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
            saturday: (function () {
                var value = $("#SaturdayFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
            sunday: (function () {
                var value = $("#SundayFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
            week1: (function () {
                var value = $("#Week1Filter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
            week2: (function () {
                var value = $("#Week2Filter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
            week3: (function () {
                var value = $("#Week3Filter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
            week4: (function () {
                var value = $("#Week4Filter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
			customerId: $("#CustomerIdFilter").val(),			mCPHeaderId: $("#MCPHeaderIdFilter").val()
        };
    };

    var dataTable = $("#MCPDetailsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(mCPDetailService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.MCPDetails.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.mcpDetail.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.MCPDetails.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    mCPDetailService.delete(data.record.mcpDetail.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "mcpDetail.code" },
            {
                data: "mcpDetail.effectiveDate",
                render: function (effectiveDate) {
                    if (!effectiveDate) {
                        return "";
                    }
                    
					var date = Date.parse(effectiveDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
            {
                data: "mcpDetail.endDate",
                render: function (endDate) {
                    if (!endDate) {
                        return "";
                    }
                    
					var date = Date.parse(endDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
			{ data: "mcpDetail.distance" },
			{ data: "mcpDetail.visitOrder" },
            {
                data: "mcpDetail.monday",
                render: function (monday) {
                    return monday ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "mcpDetail.tuesday",
                render: function (tuesday) {
                    return tuesday ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "mcpDetail.wednesday",
                render: function (wednesday) {
                    return wednesday ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "mcpDetail.thursday",
                render: function (thursday) {
                    return thursday ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "mcpDetail.friday",
                render: function (friday) {
                    return friday ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "mcpDetail.saturday",
                render: function (saturday) {
                    return saturday ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "mcpDetail.sunday",
                render: function (sunday) {
                    return sunday ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "mcpDetail.week1",
                render: function (week1) {
                    return week1 ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "mcpDetail.week2",
                render: function (week2) {
                    return week2 ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "mcpDetail.week3",
                render: function (week3) {
                    return week3 ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "mcpDetail.week4",
                render: function (week4) {
                    return week4 ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "customer.code",
                defaultContent : ""
            },
            {
                data: "mcpHeader.code",
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

    $("#NewMCPDetailButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        mCPDetailService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/m-cPDetails/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'code', value: input.code },
                            { name: 'effectiveDateMin', value: input.effectiveDateMin },
                            { name: 'effectiveDateMax', value: input.effectiveDateMax },
                            { name: 'endDateMin', value: input.endDateMin },
                            { name: 'endDateMax', value: input.endDateMax },
                            { name: 'distanceMin', value: input.distanceMin },
                            { name: 'distanceMax', value: input.distanceMax },
                            { name: 'visitOrderMin', value: input.visitOrderMin },
                            { name: 'visitOrderMax', value: input.visitOrderMax }, 
                            { name: 'monday', value: input.monday }, 
                            { name: 'tuesday', value: input.tuesday }, 
                            { name: 'wednesday', value: input.wednesday }, 
                            { name: 'thursday', value: input.thursday }, 
                            { name: 'friday', value: input.friday }, 
                            { name: 'saturday', value: input.saturday }, 
                            { name: 'sunday', value: input.sunday }, 
                            { name: 'week1', value: input.week1 }, 
                            { name: 'week2', value: input.week2 }, 
                            { name: 'week3', value: input.week3 }, 
                            { name: 'week4', value: input.week4 }, 
                            { name: 'customerId', value: input.customerId }
, 
                            { name: 'mCPHeaderId', value: input.mCPHeaderId }
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
