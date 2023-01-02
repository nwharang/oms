(function () {
    var l = abp.localization.getResource('Saas');
    var _editionAppService = volo.saas.host.edition;

    var _editModal = new abp.ModalManager(abp.appPath + 'Saas/Host/Editions/EditModal');
    var _createModal = new abp.ModalManager(abp.appPath + 'Saas/Host/Editions/CreateModal');
    var _featuresModal = new abp.ModalManager(abp.appPath + 'FeatureManagement/FeatureManagementModal');

    //Custom store
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        load() {
            var d = new $.Deferred();
            _editionAppService.getList({ maxResultCount: 1000 })
                .done(data => {
                    d.resolve(data.items);
                });
            return d.promise();
        }
    });

    const dataGridContainer = $('#dataGridContainer').dxDataGrid({
        dataSource: customStore,
        showBorders: true,
        focusedRowEnabled: false,
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        filterRow: {
            visible: false
        },
        searchPanel: {
            visible: true
        },
        scrolling: {
            mode: 'standard'
        },
        paging: {
            enabled: true,
            pageSize: 10
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: [10, 20, 50, 100],
            showInfo: true,
            showNavigationButtons: true
        },
        columns: [
            {
                caption: l("Action"),
                width: 115,
                allowSorting: false,
                cellTemplate(container, options) {
                    container.dxDropDownButton({
                        text: l("Action"),
                        icon: 'preferences',
                        displayExpr: 'text',
                        dropDownOptions: {
                            width: "200px"
                        },
                        items: [
                            {
                                stylingMode: 'contained',
                                text: l('Edit'),
                                type: 'text',
                                width: 120,
                                visible: abp.auth.isGranted('Saas.Editions.Update'),
                                onClick() {
                                    _editModal.open({
                                        id: options.data.id
                                    });
                                },
                            },
                            {
                                stylingMode: 'contained',
                                text: l('Features'),
                                type: 'text',
                                width: 120,
                                visible: abp.auth.isGranted('Saas.Editions.ManageFeatures'),
                                onClick() {
                                    _featuresModal.open({
                                        providerName: 'E',
                                        providerKey: options.data.id
                                    });
                                },
                            },
                            {
                                stylingMode: 'contained',
                                text: l('ChangeHistory'),
                                type: 'text',
                                width: 120,
                                visible: abp.auditLogging && abp.auth.isGranted('AuditLogging.ViewChangeHistory:Volo.Saas.Edition'),
                                onClick() {
                                    abp.auditLogging.openEntityHistoryModal(
                                        "Volo.Saas.Edition",
                                        options.data.id
                                    );
                                },
                            },
                            {
                                stylingMode: 'contained',
                                text: l('Delete'),
                                type: 'text',
                                width: 120,
                                visible: abp.auth.isGranted('Saas.Editions.Delete'),
                                onClick() {
                                    abp.message.confirm(l('EditionDeletionConfirmationMessage', options.data.displayName)).then(function (confirmed) {
                                        if (confirmed) {
                                            _editionAppService
                                                .delete(options.data.id)
                                                .then(function () {
                                                    dataGridContainer.refresh();
                                                    abp.message.success(l('SuccessfullyDeleted'));
                                                });
                                        }
                                    });
                                },
                            }
                        ]
                    });
                }
            },
            {
                caption: l("EditionName"),
                dataField: "displayName",
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("PlanName"),
                dataField: "planName"
            }
        ]
    }).dxDataGrid("instance");

    _createModal.onResult(function () {
        dataGridContainer.refresh();
    });

    _editModal.onResult(function () {
        dataGridContainer.refresh();
    });

    $("#CreateEdition").click(function (e) {
        e.preventDefault();
        _createModal.open();
    });

    $("input#Search").on("input", function () {
        dataGridContainer.searchByText($(this).val());
    });

})();