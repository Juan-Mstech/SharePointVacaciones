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


            $('#inEmpleado').val(data.d.Title);
            $('#inSupervisor').val(data.d.Title);
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
    //====================================================================================

    var item = {
        "__metadata": { "type": "SP.Data.SolicitudesVacacionesListItem" },
        "Title": $('#inTitulo').val(),
        "DesdeFecha": $('#inFecha').val(),
        "HastaFecha": $('#inFecha').val(),
        "DiasHabilesPedidos": $('    ').val(),
        "DiasHabilesCorrido": $('    ').val(),
        "Estado": $('     ').val(),
        "Supervisor": $('     ').prop(' '),
        "Empleado": $('    ').val()
    }

    var url = "/_api/web/lists/getByTitle('SolicitudesVacaciones')/items";
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

    var item2 = {
        "__metadata": { "type": "SP.Data.DiasVacacionesListItem" },
        "Title": $('#inTitulo').val(),
        "Periodo": $('#inFecha').val(),
        "DiasHabiles": $('    ').val(),
        "DiasCorridoDisponibles": $('    ').val(),
        "Empleado": $('    ').val()
    }

    var url2 = "/_api/web/lists/getByTitle('DiasVacaciones')/items";
    $.ajax({
        url: url2,
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
    //-------------------------------------------------------------------------------------
}

function Cancelar() {
    this.location.href = decodeURIComponent(source);
}

function calcularDiasCorridos() {
    var desde = document.getElementById("inDesdeFecha");
    var hasta = document.getElementById("inHastaFecha");
    var dias = 0;





    if (desde != undefined && hasta != undefined && desde.value <= hasta.value) {
        var convDesde = new Date(desde.value);
        var convHasta = new Date(hasta.value);

        dias = (convHasta.getTime() - convDesde.getTime()) / 1000 / 60 / 60 / 24;
    }

    document.getElementById("inDPedidos").value = dias;



    var acum = 0;
    var fecha = new Date($(desde).val());

    for (var i = 0; i < dias; i++) {
        fecha.setDate(fecha.getDate() + dias + 1);
       
        
        if (fecha.getDay() != 0 && fecha.getDay() != 6) {
           acum++;
        }
        else { continue; }

    }
    document.getElementById("inDDisponibles").value = acum;


}