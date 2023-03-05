const pageSize = 10;
const pageSizeForLookup = 10;
const allowedPageSizes = [10, 20, 50];
const requestOptions = ["filter", "group", "groupSummary", "parentIds", "requireGroupCount", "requireTotalCount", "searchExpr", "searchOperation", "searchValue", "select", "sort", "skip", "take", "totalSummary", "userData"];

function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
}

function FormatLoadOption(options) {
    if (options.take == undefined) {
        options.take = pageSizeForLookup;
    }

    if (options.skip == undefined) {
        options.skip = 0;
    }

    return options;
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

const popupImportContentTemplate = function (e) {
    var controlName = e.closest('div.popupImport').attr('data-target');
    var l = abp.localization.getResource("MdmService");
    const content = $('<div />');
    content.append(
        $(`<div class="${controlName}" name="sbImportTypes">`).dxSelectBox({
            dataSource: [
                { name: l('Insert from Excel'), value: 'I' },
                { name: l('Update from Excel'), value: 'U' },
            ],
            valueExpr: 'value',
            displayExpr: 'name',
            value: 'I'
        }));
    content.append(
        $(`<div class="${controlName}" name="excelUploader">`).dxFileUploader({
            selectButtonText: l('Select a file'),
            icon: 'import',
            //labelText: '',
            multiple: false,
            uploadMode: 'useForm',
            allowedFileExtensions: ['.xlsx', '.xls'],
        }));
    return content;
};
function initImportPopup(url, templateName, controlName) {
    $(`#${controlName}`).parent().append(`<div class="${controlName} importPanel"></div>`);
    $(`#${controlName}`).parent().append(`<div data-target="${controlName}" class="${controlName} popupImport"></div>`);

    if ($(`div.${controlName}.importPanel`).length > 0) {
        $(`div.${controlName}.importPanel`).dxLoadPanel({
            //shadingColor: 'rgba(0,0,0,0.4)',
            position: { of: `#${controlName} div.dx-datagrid-rowsview.dx-datagrid-nowrap` },
            visible: false,
            showIndicator: true,
            showPane: true,
            //shading: true,
            hideOnOutsideClick: false 
        });
    }
    if ($(`div.${controlName}.popupImport`).length > 0) { 
        var l = abp.localization.getResource("MdmService");
        var popupImport =  $(`div.${controlName}.popupImport`).dxPopup({
            width: 400,
            height: 300,
            //container: '#import-excel',
            showTitle: true,
            title: ('Import Excel'),
            visible: false,
            dragEnabled: true,
            hideOnOutsideClick: true,
            showCloseButton: true,
            position: {
                my: 'top',
                at: 'center',
                of: `#${controlName} div.dx-toolbar-button .import-excel`
            },
            contentTemplate: popupImportContentTemplate,
            toolbarItems: [{
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'before',
                options: {
                    icon: 'download',
                    text: l('Download Template'),
                    onClick() {
                        fetch(`/${url}/get-excel-template`)
                            // Retrieve its body as ReadableStream
                            .then((response) => {
                                console.log(response);
                                const reader = response.body.getReader();
                                console.log(reader);
                                return new ReadableStream({
                                    start(controller) {
                                        return pump();
                                        function pump() {
                                            return reader.read().then(({ done, value }) => {
                                                // When no more data needs to be consumed, close the stream
                                                if (done) {
                                                    controller.close();
                                                    return;
                                                }
                                                // Enqueue the next data chunk into our target stream
                                                controller.enqueue(value);
                                                return pump();
                                            });
                                        }
                                    }
                                })
                            })
                            // Create a new response out of the stream
                            .then((stream) => new Response(stream))
                            // Create an object URL for the response
                            .then((response) => response.blob())
                            .then((blob) => URL.createObjectURL(blob))
                            .then((href) => {
                                const a = document.createElement("a");
                                document.body.appendChild(a);
                                a.style = "display: none";
                                a.href = href;
                                a.download = templateName + '.xlsx';
                                a.click();
                            });
                    },
                },
            }, {
                widget: 'dxButton',
                toolbar: 'bottom',
                location: 'after',
                options: {
                    icon: 'upload',
                    text: l('Import'),
                    onClick(e) {
                        var uploader = $(`div.${controlName}[name=excelUploader]`).data('dxFileUploader');
                        var files = uploader.option('value');
                        if (files.length > 0) {
                            abp.message.confirm(abp.localization.getResource("OMS")('ConfirmationMessage.UploadExcelFile').replace('{0}', `"${files[0].name}"`), ' ').then(function (answer) {
                                if (answer) {
                                    var requestUrl = '';
                                     
                                    var importType = $(`div.${controlName}[name=sbImportTypes]`).data('dxSelectBox').option('value');
                                    if (importType == 'I') {
                                        requestUrl = `${abp.appPath + url}/insert-from-excel`;
                                    } else requestUrl = `${abp.appPath + url}/update-from-excel`;

                                    var formData = new FormData();
                                    formData.append("file", files[0]);
                                    
                                    var panel = $(`div.${controlName}.importPanel`).data('dxLoadPanel');
                                    panel.show();

                                    $.ajax({
                                        type: "POST",
                                        url: requestUrl,
                                        async: true,
                                        data: formData,
                                        cache: false,
                                        contentType: false,
                                        processData: false,
                                        success: function (data) {
                                            uploader.reset(); 
                                            popupImport.hide(); 
                                            panel.hide();

                                            if ($(`#${controlName}`).data('dxDataGrid'))
                                                $(`#${controlName}`).data('dxDataGrid').refresh(); 
                                            else if ($(`#${controlName}`).data('dxTreeList'))
                                                $(`#${controlName}`).data('dxTreeList').refresh();
                                        },
                                        error: function (msg) {
                                            uploader.reset();
                                            panel.hide();
                                            console.log(msg.responseText);
                                        },
                                    });
                                }
                            });
                        } 
                    },
                },
            },
            ],
        }).dxPopup("instance");;
    }
}