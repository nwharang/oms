$(async function () {
    let l = abp.localization.getResource("OMS");
    (() => {
        DevExpress.ui.forceIsoDateParsing = false;
        DevExpress.ui.dxDataGrid.defaultOptions({
            options: {
                dateSerializationFormat: 'yyyy-MM-dd',
                customizeColumns: (e) => {
                    e.filter(v => v.dataType === 'number').forEach(e => {
                        e.validationRules?.push({ type: 'range', min: 0, })
                    })
                    e.forEach(column => column.headerFilter = {
                        dataSource(options) {
                            options.dataSource.postProcess = (result) => result.filter(x => x.value !== '')
                        }
                    })
                },
            }
        })
        DevExpress.ui.dxDateBox.defaultOptions({
            options: {
                dateSerializationFormat: 'yyyy-MM-dd'
            }
        })
        DevExpress.ui.dxTreeList.defaultOptions({
            options: {
                dateSerializationFormat: 'yyyy-MM-dd'
            }
        })
        DevExpress.ui.dxSelectBox.defaultOptions({
            options: {
                placeholder: l('DefaultOption:SelectBox:PlaceHolder'),
            }
        })
    })()
    if (!abp.currentTenant?.id) {
        return
    }
    $('.wraper-select-company').css('display', 'block')
    let companyIdentityUserAssignment = window.dMSpro.oMS.mdmService.controllers.companyIdentityUserAssignments.companyIdentityUserAssignment
    $('button[data-id=action-add-grid]').click(function () {
        var controlName = $(this).attr('data-effect-grid');
        var controlType = $(this).attr('data-effect-type');
        controlType = controlType ? controlType : 'dxDataGrid';
        if ($(`#${controlName}`).length > 0) {
            $(`#${controlName}`).data(`${controlType}`).addRow();
            $(`#${controlName}`).data(`${controlType}`).deselectAll();
        }
    });

    // function changeSelectedCompany(arg) {
    //     $('#selected-company').text($(arg).find('td:nth-child(3)').text());
    // }

    if (!$.isEmptyObject(abp.auth.grantedPolicies)) {
        //if (abp.auth.isAnyGranted()) { };
        // return;
        $('#selected-company').text((await Common.getCurrentCompany()).name);

        //companyIdentityUserAssignment.getCurrentlySelectedCompany().done(({ name }) => $('#selected-company').text(name))
        companyIdentityUserAssignment.getListCompanyByCurrentUser({})
            .done(({ data }) => {
                data.forEach(({ company }, index) => {
                    $('table.companies > tbody').append(`<tr data-id=${company.id}><td>${index + 1}</td><td>${company.code}</td><td>${company.name}</td></tr>`);
                });
                $('table.companies > tbody > tr').click(function () {
                    companyIdentityUserAssignment.setCurrentlySelectedCompany($(this).data('id')).then((result) => {
                        let keyString = `${abp.currentTenant.name}|currentlySelectedCompany|${abp.currentUser.id}`;
                        localStorage.removeItem(keyString);
                        Common.saveToStorage(keyString, result);
                        window.location.reload()
                    })
                });
            });

        //$('#selected-company').dxSelectBox({
        //    labelMode: 'hidden',
        //    stylingMode: 'underlined',
        //    dataSource: new DevExpress.data.ArrayStore({
        //        data: arr_companies,
        //        key: 'company.id',
        //    }),
        //    displayExpr: 'company.name',
        //    valueExpr: 'company.id',
        //    value: arr_companies[0].company.id,
        //    fieldTemplate(data, container) {
        //        const result = $(`<div class='custom-item'<i class="fa fa-sitemap"></i><div class='product-name'></div></div>`);
        //        result
        //            .find('.product-name')
        //            .dxTextBox({
        //                value: data.company.name,
        //                readOnly: true,
        //            });
        //        container.append(result);
        //        console.log(result);
        //    },
        //});


    } else {
        //window.location = '/account/logout';
    }
    //DevExpress.config({
    //    //rtlEnabled: true,
    //    //forceIsoDateParsing: false,
    //    //editorStylingMode: 'underlined',
    //    //editorStylingMode: 'floating',
    //    // ...
    //});
    // ===== or when using modules =====
    //import config from "devextreme/core/config";

    //config({
    //    rtlEnabled: true,
    //    forceIsoDateParsing: false,
    //    // ...
    //});
});