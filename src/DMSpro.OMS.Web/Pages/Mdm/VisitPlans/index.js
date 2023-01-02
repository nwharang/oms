$(function () {
    var l = abp.localization.getResource("MdmService");
	var visitPlanService = window.dMSpro.oMS.mdmService.controllers.visitPlans.visitPlan;
	
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
        viewUrl: abp.appPath + "VisitPlans/CreateModal",
        scriptUrl: "/Pages/VisitPlans/createModal.js",
        modalClass: "visitPlanCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "VisitPlans/EditModal",
        scriptUrl: "/Pages/VisitPlans/editModal.js",
        modalClass: "visitPlanEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            dateVisitMin: $("#DateVisitFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			dateVisitMax: $("#DateVisitFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			distanceMin: $("#DistanceFilterMin").val(),
			distanceMax: $("#DistanceFilterMax").val(),
			visitOrderMin: $("#VisitOrderFilterMin").val(),
			visitOrderMax: $("#VisitOrderFilterMax").val(),
			dayOfWeek: $("#DayOfWeekFilter").val(),
			weekMin: $("#WeekFilterMin").val(),
			weekMax: $("#WeekFilterMax").val(),
			monthMin: $("#MonthFilterMin").val(),
			monthMax: $("#MonthFilterMax").val(),
			yearMin: $("#YearFilterMin").val(),
			yearMax: $("#YearFilterMax").val(),
			mCPDetailId: $("#MCPDetailIdFilter").val()
        };
    };

    var dataTable = $("#VisitPlansTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(visitPlanService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.VisitPlans.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.visitPlan.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.VisitPlans.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    visitPlanService.delete(data.record.visitPlan.id)
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
                data: "visitPlan.dateVisit",
                render: function (dateVisit) {
                    if (!dateVisit) {
                        return "";
                    }
                    
					var date = Date.parse(dateVisit);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            },
			{ data: "visitPlan.distance" },
			{ data: "visitPlan.visitOrder" },
            {
                data: "visitPlan.dayOfWeek",
                render: function (dayOfWeek) {
                    if (dayOfWeek === undefined ||
                        dayOfWeek === null) {
                        return "";
                    }

                    var localizationKey = "EntityFieldValue:MDMService:VisitPlan:DayOfWeek:" + dayOfWeek;
                    var localized = l(localizationKey);

                    if (localized === localizationKey) {
                        abp.log.warn("No localization found for " + localizationKey);
                        return "";
                    }

                    return localized;
                }
            },
			{ data: "visitPlan.week" },
			{ data: "visitPlan.month" },
			{ data: "visitPlan.year" },
            {
                data: "mcpDetail.code",
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

    $("#NewVisitPlanButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        visitPlanService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/visit-plans/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText },
                            { name: 'dateVisitMin', value: input.dateVisitMin },
                            { name: 'dateVisitMax', value: input.dateVisitMax },
                            { name: 'distanceMin', value: input.distanceMin },
                            { name: 'distanceMax', value: input.distanceMax },
                            { name: 'visitOrderMin', value: input.visitOrderMin },
                            { name: 'visitOrderMax', value: input.visitOrderMax }, 
                            { name: 'dayOfWeek', value: input.dayOfWeek },
                            { name: 'weekMin', value: input.weekMin },
                            { name: 'weekMax', value: input.weekMax },
                            { name: 'monthMin', value: input.monthMin },
                            { name: 'monthMax', value: input.monthMax },
                            { name: 'yearMin', value: input.yearMin },
                            { name: 'yearMax', value: input.yearMax }, 
                            { name: 'mCPDetailId', value: input.mCPDetailId }
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
