const pageSize = 20;
const pageSizeForLookup = 20;
const allowedPageSizes = [10, 20, 50, 100];
const requestOptions = ["filter", "group", "groupSummary", "parentIds", "requireGroupCount", "requireTotalCount", "searchExpr", "searchOperation", "searchValue", "select", "sort", "skip", "take", "totalSummary", "userData"];

function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
}

const popupImportContentTemplate = function () {
    var l = abp.localization.getResource("MdmService");
    const content = $('<div />');
    content.append(
        $('<div name="sbImportTypes">').dxSelectBox({
            dataSource: [
                { name: l('Insert from Excel'), value: 'I' },
                { name: l('Update from Excel'), value: 'U' },
            ],
            valueExpr: 'value',
            displayExpr: 'name',
            value: 'I'
        }));
    content.append(
        $('<div name="excelUploader">').dxFileUploader({
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
    if ($('#importPanel').length > 0) {
        $('#importPanel').dxLoadPanel({
            //shadingColor: 'rgba(0,0,0,0.4)',
            position: { of: `#${controlName}  div.dx-datagrid-rowsview.dx-datagrid-nowrap` },
            visible: false,
            showIndicator: true,
            showPane: true,
            //shading: true,
            hideOnOutsideClick: false 
        });
    }
    if ($('#popupImport').length > 0) {

        var l = abp.localization.getResource("MdmService");
        $('#popupImport').dxPopup({
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
                of: '#import-excel'
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
                        var uploader = $('div[name=excelUploader]').data('dxFileUploader');
                        var files = uploader.option('value');
                        if (files.length > 0) {
                            abp.message.confirm(abp.localization.getResource("OMS")('ConfirmationMessage.UploadExcelFile').replace('{0}', `"${files[0].name}"`), ' ').then(function (answer) {
                                if (answer) {
                                    var requestUrl = '';
                                    var importType = $('div[name=sbImportTypes]').data('dxSelectBox').option('value');
                                    if (importType == 'I') {
                                        requestUrl = `${abp.appPath + url}/insert-from-excel`;
                                    } else requestUrl = `${abp.appPath + url}/update-from-excel`;
                                    var formData = new FormData();
                                    formData.append("file", files[0]);
                                    $('#importPanel').data('dxLoadPanel').show();
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
                                            $('#popupImport').data('dxPopup').hide(); 
                                            $('#importPanel').data('dxLoadPanel').hide();
                                            if ($(`#${controlName}`).data('dxDataGrid'))
                                                $(`#${controlName}`).data('dxDataGrid').refresh(); 
                                            else if ($(`#${controlName}`).data('dxTreeList'))
                                                $(`#${controlName}`).data('dxTreeList').refresh();
                                        },
                                        error: function (msg) {
                                            uploader.reset();
                                            $('#importPanel').data('dxLoadPanel').hide();
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
        });
    }
}