const pageSize = 10;
const pageSizeForLookup = 10;
const allowedPageSizes = [10, 20, 50];
const requestOptions = ["filter", "group", "groupSummary", "parentIds", "requireGroupCount", "requireTotalCount", "searchExpr", "searchOperation", "searchValue", "select", "sort", "skip", "take", "totalSummary", "userData", 'withDetails'];

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
    var l = abp.localization.getResource("OMS");
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
            multiple: false,
            uploadMode: 'useForm',
            allowedFileExtensions: ['.xlsx', '.xls'],
            onBeforeSend: (e) => {

            }
        }));
    return content;
};
function initImportPopup(url, templateName, controlName) {
    if ($(`.${controlName}.importPanel`).length > 0) return;

    $(`#${controlName}`).parent().append(`<div class="${controlName} importPanel"></div>`);
    $(`#${controlName}`).parent().append(`<div data-target="${controlName}" class="${controlName} popupImport"></div>`);

    if ($(`div.${controlName}.importPanel`).length > 0) {
        $(`div.${controlName}.importPanel`).dxLoadPanel({
            position: { of: `#${controlName} div.dx-datagrid-rowsview.dx-datagrid-nowrap` },
            visible: false,
            showIndicator: true,
            showPane: true,
            hideOnOutsideClick: false
        });
    }
    if ($(`div.${controlName}.popupImport`).length > 0) {
        var l = abp.localization.getResource("OMS");
        var popupImport = $(`div.${controlName}.popupImport`).dxPopup({
            width: 400,
            height: 300,
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
                                const reader = response.body.getReader();
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
                            var extension = `.${files[0].name.split('.').pop()}`;
                            if (uploader.option('allowedFileExtensions').indexOf(extension) == -1) return;
                            let wb = new ExcelJS.Workbook();
                            // OMS-6144
                            wb.xlsx.load(files[0]).then(workBook => {
                                var importType = $(`div.${controlName}[name=sbImportTypes]`).data('dxSelectBox').option('value');
                                abp.message.confirm(abp.localization.getResource("OMS")(importType == 'I' ? 'ConfirmationMessage.InsertExcelFile' : 'ConfirmationMessage.UpdateExcelFile').replace('{0}', workBook.getWorksheet('Data').actualRowCount - 1)).then(function (answer) {
                                    if (answer) {
                                        var requestUrl = '';
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
                                                if (msg.responseText) {
                                                    var parsedResult = JSON.parse(msg.responseText);
                                                    if (parsedResult && parsedResult.error) {
                                                        abp.message.error(parsedResult.error.message);
                                                    }
                                                }
                                            },
                                        });
                                    }
                                });
                            })
                        }
                    },
                },
            },
            ],
        }).dxPopup("instance");;
    }
}