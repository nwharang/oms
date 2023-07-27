(function () {
    var l = abp.localization.getResource('Saas');
    var _tenantAppService = volo.saas.host.tenant;

    var _editModal = new abp.ModalManager({
        viewUrl: abp.appPath + 'Saas/Host/Tenants/EditModal',
        modalClass: 'SaaSTenantEdit'
    });
    var _createModal = new abp.ModalManager({
        viewUrl: abp.appPath + 'Saas/Host/Tenants/CreateModal',
        modalClass: 'SaaSTenantCreate'
    });
    var _featuresModal = new abp.ModalManager(abp.appPath + 'FeatureManagement/FeatureManagementModal');
    var _connectionStringsModal = new abp.ModalManager({
        viewUrl: abp.appPath + 'Saas/Host/Tenants/ConnectionStringsModal',
        modalClass: 'TenantConnectionStringManagement'
    });

    //Custom store - for load, update, delete
    var customStore = new DevExpress.data.CustomStore({
        key: 'id',
        load() {
            var d = new $.Deferred();
            _tenantAppService.getList({ maxResultCount: 1000 })
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
            pageSize: pageSize
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            allowedPageSizes: allowedPageSizes,
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
                                visible: abp.auth.isGranted('Saas.Tenants.Update'),
                                onClick() {
                                    _editModal.open({
                                        id: options.data.id
                                    });
                                },
                            },
                            {
                                stylingMode: 'contained',
                                text: l('ConnectionStrings'),
                                type: 'text',
                                width: 120,
                                visible: abp.auth.isGranted('Saas.Tenants.ManageConnectionStrings'),
                                onClick() {
                                    _connectionStringsModal.open({
                                        id: options.data.id
                                    });
                                },
                            },
                            {
                                stylingMode: 'contained',
                                text: l('ApplyDatabaseMigrations'),
                                type: 'text',
                                width: 120,
                                visible: options.data.hasDefaultConnectionString && abp.auth.isGranted('Saas.Tenants.ManageConnectionStrings'),
                                onClick() {
                                    _tenantAppService
                                        .applyDatabaseMigrations(options.data.id)
                                        .then(function () {
                                            abp.notify.info(l('DatabaseMigrationQueuedAndWillBeApplied'));
                                        });
                                },
                            },
                            {
                                stylingMode: 'contained',
                                text: l('Features'),
                                type: 'text',
                                width: 120,
                                visible: abp.auth.isGranted('Saas.Tenants.ManageFeatures'),
                                onClick() {
                                    _featuresModal.open({
                                        providerName: 'T',
                                        providerKey: options.data.id
                                    });
                                },
                            },
                            {
                                stylingMode: 'contained',
                                text: l('ChangeHistory'),
                                type: 'text',
                                width: 120,
                                visible: abp.auditLogging && abp.auth.isGranted('AuditLogging.ViewChangeHistory:Volo.Saas.Tenant'),
                                onClick() {
                                    abp.auditLogging.openEntityHistoryModal(
                                        "Volo.Saas.Tenants.Tenant",
                                        options.data.id
                                    );
                                },
                            },
                            {
                                stylingMode: 'contained',
                                text: l('Delete'),
                                type: 'text',
                                width: 120,
                                visible: abp.auth.isGranted('Saas.Tenants.Delete'),
                                onClick() {
                                    abp.message.confirm(l('TenantDeletionConfirmationMessage', options.data.name)).then(function (confirmed) {
                                        if (confirmed) {
                                            _tenantAppService
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
                caption: l("TenantName"),
                dataField: "name",
                validationRules: [{ type: "required" }]
            },
            {
                caption: l("Edition"),
                dataField: "editionName"
            },
            {
                caption: l("EditionEndDateUtc"),
                dataField: "editionEndDateUtc"
            },
            {
                caption: l("ActivationState"),
                dataField: "activationState",
                calculateCellValue: function (rowData) {
                    var stateStr = "";
                    switch (rowData.activationState) {
                        case 0:
                            stateStr = l("Enum:TenantActivationState.Active");
                            break;
                        case 1:
                            stateStr = `${l("Enum:TenantActivationState.ActiveWithLimitedTime")} (${(new Date(Date.parse(rowData.activationEndDate))).toLocaleString(abp.localization.currentCulture.name)})`;
                            break;
                        case 2:
                            stateStr = l("Enum:TenantActivationState.Passive");
                            break;
                        default:
                            break;
                    }

                    return stateStr;
                }
            },
            {
                dataField: "hasDefaultConnectionString",
                visible: false
            }
        ]
    }).dxDataGrid("instance");

    _createModal.onResult(function () {
        dataGridContainer.refresh();
    });

    _editModal.onResult(function () {
        dataGridContainer.refresh();
    });

    $("#CreateTenant").click(function (e) {
        e.preventDefault();
        _createModal.open();
    });

    $('#ManageHostFeatures').click(function (e) {
        e.preventDefault();
        _featuresModal.open({
            providerName: 'T'
        });
    });

    $("input#Search").on("input", function () {
        dataGridContainer.searchByText($(this).val());
    });

})();