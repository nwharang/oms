$(function () {
	var l = abp.localization.getResource("MdmService");
    
    const data = [
        {
            ID: 1,
            Pricelist: 'PL01',
            Item: 'SKU0001 - Bánh Gấu Koala vị Kem 250g',
            UOM: 'GOI',
            BasePricelist: 'PL01',
            BasePrice: '50,000 VND',
            Factor: '1',
            Price: '50,000 VND',
        },
        { 
            ID: 2,
            Pricelist: 'PL01',
            Item: 'SKU0002 - Bánh Gấu Koala vị Dâu 250g',
            UOM: 'GOI',
            BasePricelist: 'PL01',
            BasePrice: '55,000 VND',
            Factor: '1',
            Price: '55,000 VND',
        },
        {
            ID: 3,
            Pricelist: 'PL01',
            Item: 'SKU0003 - Bánh Gấu Koala vị Dừa 250g',
            UOM: 'GOI',
            BasePricelist: 'PL01',
            BasePrice: '52,000 VND',
            Factor: '1',
            Price: '52,000 VND',
        },
        {
            ID: 4,
            Pricelist: 'PL01',
            Item: 'SKU0004 - Kẹo Socola hình con mèo 300g',
            UOM: 'GOI',
            BasePricelist: 'PL01',
            BasePrice: '50,000 VND',
            Factor: '1.1',
            Price: '55,000 VND',
        },
        {
            ID: 5,
            Pricelist: 'PL01',
            Item: 'SKU0005 - Kẹo Socola hình con thỏ 300g',
            UOM: 'GOI',
            BasePricelist: 'PL01',
            BasePrice: '50,000 VND',
            Factor: '1.2',
            Price: '60,000 VND',
        },
    ];

    const dataGrid = $('#gridPriceListDetails').dxDataGrid({
        dataSource: data,
        keyExpr: 'ID',
        showBorders: true,
        focusedRowEnabled: true,
        filterRow: {
            visible: true
        },
        searchPanel: {
            visible: true
        },
        allowColumnReordering: false,
        scrolling: {
            mode: 'standard',
        },
        paging: {
            enabled: true,
            pageSize: pageSize
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: allowedPageSizes,
            showInfo: true,
        },
        rowAlternationEnabled: true,
        editing: {
            mode: 'popup',
            //allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            useIcons: true,
            texts: {
                editRow: l("Edit"),
                deleteRow: l("Delete"),
                confirmDeleteMessage: l("DeleteConfirmationMessage")
            }
        },
        form: {
            
        },
        columns:
            [
                {
                    type: 'buttons',
                    buttons: ['edit', 'delete'],
                    caption: l("Actions")
                },
                {
                    dataField: 'Pricelist',
                    caption: 'Pricelist',
                },
                {
                    dataField: 'Item',
                    caption: 'Item',
                },
                {
                    dataField: 'UOM',
                    caption: 'UOM',
                },
                {
                    dataField: 'BasePricelist',
                    caption: 'Base Pricelist',
                },
                {
                    dataField: 'BasePrice',
                    caption: 'Base Price',
                },
                {
                    dataField: 'Factor',
                    caption: 'Factor',
                },
                {
                    dataField: 'Price',
                    caption: 'Price',
                },

            ],
    }).dxDataGrid('instance');



	//var priceListDetailService = window.dMSpro.oMS.mdmService.controllers.priceListDetails.priceListDetail;
	
	
	
 //   var createModal = new abp.ModalManager({
 //       viewUrl: abp.appPath + "PriceListDetails/CreateModal",
 //       scriptUrl: "/Pages/PriceListDetails/createModal.js",
 //       modalClass: "priceListDetailCreate"
 //   });

	//var editModal = new abp.ModalManager({
 //       viewUrl: abp.appPath + "PriceListDetails/EditModal",
 //       scriptUrl: "/Pages/PriceListDetails/editModal.js",
 //       modalClass: "priceListDetailEdit"
 //   });

	//var getFilter = function() {
 //       return {
 //           filterText: $("#FilterText").val(),
 //           priceListId: $("#PriceListIdFilter").val(),
	//		itemId: $("#ItemIdFilter").val(),
	//		uOMId: $("#UOMIdFilter").val(),
	//		basePriceListId: $("#BasePriceListIdFilter").val(),
	//		priceMin: $("#PriceFilterMin").val(),
	//		priceMax: $("#PriceFilterMax").val()
 //       };
 //   };

 //   var dataTable = $("#PriceListDetailsTable").DataTable(abp.libs.datatables.normalizeConfiguration({
 //       processing: true,
 //       serverSide: true,
 //       paging: true,
 //       searching: false,
 //       scrollX: true,
 //       autoWidth: true,
 //       scrollCollapse: true,
 //       order: [[1, "asc"]],
 //       ajax: abp.libs.datatables.createAjax(priceListDetailService.getList, getFilter),
 //       columnDefs: [
 //           {
 //               rowAction: {
 //                   items:
 //                       [
 //                           {
 //                               text: l("Edit"),
 //                               visible: abp.auth.isGranted('MdmService.PriceListDetails.Edit'),
 //                               action: function (data) {
 //                                   editModal.open({
 //                                    id: data.record.id
 //                                    });
 //                               }
 //                           },
 //                           {
 //                               text: l("Delete"),
 //                               visible: abp.auth.isGranted('MdmService.PriceListDetails.Delete'),
 //                               confirmMessage: function () {
 //                                   return l("DeleteConfirmationMessage");
 //                               },
 //                               action: function (data) {
 //                                   priceListDetailService.delete(data.record.id)
 //                                       .then(function () {
 //                                           abp.notify.info(l("SuccessfullyDeleted"));
 //                                           dataTable.ajax.reload();
 //                                       });
 //                               }
 //                           }
 //                       ]
 //               }
 //           },
	//		{ data: "priceListId" },
	//		{ data: "itemId" },
	//		{ data: "uOMId" },
	//		{ data: "basePriceListId" },
	//		{ data: "price" }
 //       ]
 //   }));

 //   createModal.onResult(function () {
 //       dataTable.ajax.reload();
 //   });

 //   editModal.onResult(function () {
 //       dataTable.ajax.reload();
 //   });

 //   $("#NewPriceListDetailButton").click(function (e) {
 //       e.preventDefault();
 //       createModal.open();
 //   });

	//$("#SearchForm").submit(function (e) {
 //       e.preventDefault();
 //       dataTable.ajax.reload();
 //   });

 //   $("#ExportToExcelButton").click(function (e) {
 //       e.preventDefault();

 //       priceListDetailService.getDownloadToken().then(
 //           function(result){
 //                   var input = getFilter();
 //                   var url =  abp.appPath + 'api/mdm-service/price-list-details/as-excel-file' + 
 //                       abp.utils.buildQueryString([
 //                           { name: 'downloadToken', value: result.token },
 //                           { name: 'filterText', value: input.filterText }, 
 //                           { name: 'priceListId', value: input.priceListId }, 
 //                           { name: 'itemId', value: input.itemId }, 
 //                           { name: 'uOMId', value: input.uOMId }, 
 //                           { name: 'basePriceListId', value: input.basePriceListId },
 //                           { name: 'priceMin', value: input.priceMin },
 //                           { name: 'priceMax', value: input.priceMax }
 //                           ]);
                            
 //                   var downloadWindow = window.open(url, '_blank');
 //                   downloadWindow.focus();
 //           }
 //       )
 //   });

 //   $('#AdvancedFilterSectionToggler').on('click', function (e) {
 //       $('#AdvancedFilterSection').toggle();
 //   });

 //   $('#AdvancedFilterSection').on('keypress', function (e) {
 //       if (e.which === 13) {
 //           dataTable.ajax.reload();
 //       }
 //   });

 //   $('#AdvancedFilterSection select').change(function() {
 //       dataTable.ajax.reload();
 //   });
    
    
});
