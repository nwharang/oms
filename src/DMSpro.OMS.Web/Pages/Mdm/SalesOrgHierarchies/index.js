$(function () {
    var l = abp.localization.getResource("MdmService");
	
    var salesOrgHierarchyService = window.dMSpro.oMS.mdmService.controllers.salesOrgHierarchies.salesOrgHierarchy;
	
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
        viewUrl: abp.appPath + "SalesOrgHierarchies/CreateModal",
        scriptUrl: "/Pages/SalesOrgHierarchies/createModal.js",
        modalClass: "salesOrgHierarchyCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "SalesOrgHierarchies/EditModal",
        scriptUrl: "/Pages/SalesOrgHierarchies/editModal.js",
        modalClass: "salesOrgHierarchyEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            code: $("#CodeFilter").val(),
			name: $("#NameFilter").val(),
			levelMin: $("#LevelFilterMin").val(),
			levelMax: $("#LevelFilterMax").val(),
            isRoute: (function () {
                var value = $("#IsRouteFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
            isSellingZone: (function () {
                var value = $("#IsSellingZoneFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
			hierarchyCode: $("#HierarchyCodeFilter").val(),
            active: (function () {
                var value = $("#ActiveFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
			salesOrgHeaderId: $("#SalesOrgHeaderIdFilter").val(),			parentId: $("#ParentIdFilter").val()
        };
    };

    var dataTable = $("#SalesOrgHierarchiesTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(salesOrgHierarchyService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.SalesOrgHierarchies.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.salesOrgHierarchy.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.SalesOrgHierarchies.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    salesOrgHierarchyService.delete(data.record.salesOrgHierarchy.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "salesOrgHierarchy.code" },
			{ data: "salesOrgHierarchy.name" },
			{ data: "salesOrgHierarchy.level" },
            {
                data: "salesOrgHierarchy.isRoute",
                render: function (isRoute) {
                    return isRoute ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "salesOrgHierarchy.isSellingZone",
                render: function (isSellingZone) {
                    return isSellingZone ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
			{ data: "salesOrgHierarchy.hierarchyCode" },
            {
                data: "salesOrgHierarchy.active",
                render: function (active) {
                    return active ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "salesOrgHeader.code",
                defaultContent : ""
            },
            {
                data: "salesOrgHierarchy1.code",
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

    $("#NewSalesOrgHierarchyButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        salesOrgHierarchyService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/sales-org-hierarchies/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'code', value: input.code }, 
                            { name: 'name', value: input.name },
                            { name: 'levelMin', value: input.levelMin },
                            { name: 'levelMax', value: input.levelMax }, 
                            { name: 'isRoute', value: input.isRoute }, 
                            { name: 'isSellingZone', value: input.isSellingZone }, 
                            { name: 'hierarchyCode', value: input.hierarchyCode }, 
                            { name: 'active', value: input.active }, 
                            { name: 'salesOrgHeaderId', value: input.salesOrgHeaderId }
, 
                            { name: 'parentId', value: input.parentId }
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
