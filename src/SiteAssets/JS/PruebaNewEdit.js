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


    var d = new Date();
    var acum = 0;


    if (desde != undefined && hasta != undefined && desde.value <= hasta.value) {
        var convDesde = new Date(desde.value);
        var convHasta = new Date(hasta.value);

        dias = (convHasta.getTime() - convDesde.getTime()) / 1000 / 60 / 60 / 24;
    }

    document.getElementById("inDPedidos").value = dias;

}

//for(var i=0; i<=dias; i++){


    //     if(desde.value == desde.getDay(0) || desde.value == desde.getDay(6) ||
    //     hasta.value == hasta.getDay(0) || hasta.value == hasta.getDay(6)){
    //        continue;
    //     }
    //     else { acum++; }
    //}
  //  alert(typeof(desde));
    //document.getElementById("inDDisponibilidad").value = acum;
//}


// var Xmas95 = new Date('December 25, 1995 23:15:30');
// var weekday = Xmas95.getDay();

// console.log(weekday); //

// for (i = 1; i <= diasEntreLasFechas, i++) {
//     var habiles = 0
//     var fechaAevaluar = fechaDesde.AddDays(i)
//     if (fechaAEvaluar != sabado && fechaAEvaluar != domingo) {
//         habiles = habiles + 1
//     }


// }

// document.getElementByID("idDelContadorHabiles").value = habiles