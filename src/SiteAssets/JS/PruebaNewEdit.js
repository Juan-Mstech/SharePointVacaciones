var itemId;
var source;

$(document).ready(function () {
    JSRequest.EnsureSetup();
    itemId = JSRequest.QueryString["ID"];
    source = JSRequest.QueryString["Source"];
    if (source == undefined)
        source = "/";

    swal({
        title: 'Cargando...',
        onOpen: function () {
            swal.showLoading();
        }
    });

    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', Iniciar);
});

function Iniciar() {
    CargarDetalle();
}

function CargarDetalle() {
    var url = location.origin + "/_api/web/currentUser";
    $.ajax({
        method: "GET",
        url: url,
        headers: { "Accept": "application/json;odata=verbose" }
    }).then(function (data) {
        if (data.d != null) {
            var option = $('<option>').val(data.d.Title).text(data.d.Title);

            $('#ddlDetalle').append($(option));

            swal.close();
        }
        else {
            swal('Error', 'Se produjo un error al recuperar el detalle', 'error');
        }
    },
        function (error) {
            swal('Error', 'Se produjo un error al recuperar el detalle', 'error');
        });
}

function Guardar() {
    $('#divBotonera').hide();

    var item = {
        "__metadata": { "type": "SP.Data.PruebaListItem" },
        "Title": $('#inTitulo').val(),
        "Fecha": $('#inFecha').val(),
        "DetalleId": $('#ddlDetalle').val(),
        "Activo": $('#chkActivo').prop('checked')
    }

    var url = "/_api/web/lists/getByTitle('Prueba')/items";
    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(item),
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
        },
        success: function (result) {
            swal({
                title: 'Éxito!',
                text: 'Se guardó correctamente',
                type: 'success'
            }).then(function () {
                this.location.href = decodeURIComponent(source);
            });
        },
        error: function (error) {
            swal('Se produjo un error al guardar', error.responseJSON.error.message.value, 'error');
            $('#divBotonera').show();
            return false;
        }
    });
}

function Cancelar() {
    this.location.href = decodeURIComponent(source);
}