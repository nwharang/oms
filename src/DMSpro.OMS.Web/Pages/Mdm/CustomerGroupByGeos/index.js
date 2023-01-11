$(function () {
    var l = abp.localization.getResource("MdmService");
	var customerGroupByGeoService = window.dMSpro.oMS.mdmService.controllers.customerGroupByGeos.customerGroupByGeo;
	
	
	
    var createModal = new abp.ModalManager({
        viewUrl: abp.appPath + "CustomerGroupByGeos/CreateModal",
        scriptUrl: "/Pages/CustomerGroupByGeos/createModal.js",
        modalClass: "customerGroupByGeoCreate"
    });

	var editModal = new abp.ModalManager({
        viewUrl: abp.appPath + "CustomerGroupByGeos/EditModal",
        scriptUrl: "/Pages/CustomerGroupByGeos/editModal.js",
        modalClass: "customerGroupByGeoEdit"
    });

	var getFilter = function() {
        return {
            filterText: $("#FilterText").val(),
            customerGroupId: $("#CustomerGroupIdFilter").val(),
			geoTypeMin: $("#GeoTypeFilterMin").val(),
			geoTypeMax: $("#GeoTypeFilterMax").val(),
			value: $("#ValueFilter").val(),
            active: (function () {
                var value = $("#ActiveFilter").val();
                if (value === undefined || value === null || value === '') {
                    return '';
                }
                return value === 'true';
            })(),
			effDateMin: $("#EffDateFilterMin").data().datepicker.getFormattedDate('yyyy-mm-dd'),
			effDateMax: $("#EffDateFilterMax").data().datepicker.getFormattedDate('yyyy-mm-dd')
        };
    };

    var dataTable = $("#CustomerGroupByGeosTable").DataTable(abp.libs.datatables.normalizeConfiguration({
        processing: true,
        serverSide: true,
        paging: true,
        searching: false,
        scrollX: true,
        autoWidth: true,
        scrollCollapse: true,
        order: [[1, "asc"]],
        ajax: abp.libs.datatables.createAjax(customerGroupByGeoService.getList, getFilter),
        columnDefs: [
            {
                rowAction: {
                    items:
                        [
                            {
                                text: l("Edit"),
                                visible: abp.auth.isGranted('MdmService.CustomerGroupByGeos.Edit'),
                                action: function (data) {
                                    editModal.open({
                                     id: data.record.id
                                     });
                                }
                            },
                            {
                                text: l("Delete"),
                                visible: abp.auth.isGranted('MdmService.CustomerGroupByGeos.Delete'),
                                confirmMessage: function () {
                                    return l("DeleteConfirmationMessage");
                                },
                                action: function (data) {
                                    customerGroupByGeoService.delete(data.record.id)
                                        .then(function () {
                                            abp.notify.info(l("SuccessfullyDeleted"));
                                            dataTable.ajax.reload();
                                        });
                                }
                            }
                        ]
                }
            },
			{ data: "customerGroupId" },
			{ data: "geoType" },
			{ data: "value" },
            {
                data: "active",
                render: function (active) {
                    return active ? '<i class="fa fa-check"></i>' : '<i class="fa fa-times"></i>';
                }
            },
            {
                data: "effDate",
                render: function (effDate) {
                    if (!effDate) {
                        return "";
                    }
                    
					var date = Date.parse(effDate);
                    return (new Date(date)).toLocaleDateString(abp.localization.currentCulture.name);
                }
            }
        ]
    }));

    createModal.onResult(function () {
        dataTable.ajax.reload();
    });

    editModal.onResult(function () {
        dataTable.ajax.reload();
    });

    $("#NewCustomerGroupByGeoButton").click(function (e) {
        e.preventDefault();
        createModal.open();
    });

	$("#SearchForm").submit(function (e) {
        e.preventDefault();
        dataTable.ajax.reload();
    });

    $("#ExportToExcelButton").click(function (e) {
        e.preventDefault();

        customerGroupByGeoService.getDownloadToken().then(
            function(result){
                    var input = getFilter();
                    var url =  abp.appPath + 'api/mdm-service/customer-group-by-geos/as-excel-file' + 
                        abp.utils.buildQueryString([
                            { name: 'downloadToken', value: result.token },
                            { name: 'filterText', value: input.filterText }, 
                            { name: 'customerGroupId', value: input.customerGroupId },
                            { name: 'geoTypeMin', value: input.geoTypeMin },
                            { name: 'geoTypeMax', value: input.geoTypeMax }, 
                            { name: 'value', value: input.value }, 
                            { name: 'active', value: input.active },
                            { name: 'effDateMin', value: input.effDateMin },
                            { name: 'effDateMax', value: input.effDateMax }
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
