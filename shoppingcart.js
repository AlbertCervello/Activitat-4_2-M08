$(document).ready(() => {
    // Agafem les quantitats dels articles
    let camisetaQtyButton = $('input[type=number]:eq(0)');
    let cafeQtyButton     = $('input[type=number]:eq(1)');
    let mochilaQtyButton  = $('input[type=number]:eq(2)');

    // Creem escolta per quan canviin la quantitat
    camisetaQtyButton.on('change', function () {
        // Agafem el valor de la quantitat
        let qty  = $(this).val();
        // Cridem a la funcio per actualitzar le preu total per producte
        actualitzarPreuTotalPerProducte(qty, $('.preu-unitari:eq(0)').text(), $('.preu-producte:eq(0)'));
        // Actualitzem el preu del carrito
        actualitzarPreusCarrito();
    });

    // Creem escolta per quan canviin la quantitat
    cafeQtyButton.on('change', function () {
        // Agafem el valor de la quantitat
        let qty  = $(this).val();
        // Cridem a la funcio per actualitzar le preu total per producte
        actualitzarPreuTotalPerProducte(qty, $('.preu-unitari:eq(1)').text(), $('.preu-producte:eq(1)'));
        // Actualitzem el preu del carrito
        actualitzarPreusCarrito();
    });

    // Creem escolta per quan canviin la quantitat
    mochilaQtyButton.on('change', function () {
        // Agafem el valor de la quantitat
        let qty  = $(this).val();
        // Cridem a la funcio per actualitzar le preu total per producte
        actualitzarPreuTotalPerProducte(qty, $('.preu-unitari:eq(2)').text(), $('.preu-producte:eq(2)'));
        // Actualitzem el preu del carrito
        actualitzarPreusCarrito();
    });

    // Agafem les icones d'eliminar
    let eliminarCamiseta = $('.fa-trash:eq(0)');
    let eliminarCafe     = $('.fa-trash:eq(1)');
    let eliminarMochila  = $('.fa-trash:eq(2)');

    // Creem escolta per quan cliqui a eliminar
    eliminarCamiseta.click(function () {
        // Ocultem l'element
        $('.row .row:eq(1)').slideUp();
        // Eliminem l'element
        $('.preu-producte:eq(0)').remove();
        // Actualitzem el preu del carrito
        actualitzarPreusCarrito();
        // Actualitzem el badge
        actualitzarBadge();
    });

    // Creem escolta per quan cliqui a eliminar
    eliminarCafe.click(function () {
        // Ocultem l'element
        $('.row .row:eq(2)').slideUp();
        // Eliminem l'element
        $('.preu-producte:eq(1)').remove();
        // Actualitzem el preu del carrito
        actualitzarPreusCarrito();
        // Actualitzem el badge
        actualitzarBadge();
    });

    // Creem escolta per quan cliqui a eliminar
    eliminarMochila.click(function () {
        // Ocultem l'element
        $('.row .row:eq(3)').slideUp();
        // Eliminem l'element
        $('.preu-producte:eq(2)').remove();
        // Actualitzem el preu del carrito
        actualitzarPreusCarrito();
        // Actualitzem el badge
        actualitzarBadge();
    });

    // Agafem el boto del codi promocional
    let botoCodi = $(':button:eq(3)');
    let codiPromocio = 'PROMO1000';

    // Creem escolta per quan cliqui a reedem
    botoCodi.click(function () {
        // Agafem el que ha introduit per teclat
        let codiTeclat = $('.input-group input').val();
        $('.input-group input').css('border-color', 'black')

        // Si el codi introduit no es el esperat
        if (codiTeclat !== codiPromocio || codiTeclat.length == 0) {
            // Fiquem un border vermell per avisar a l'usuari
            $('.input-group input').css('border-color', 'red');
            // Ocultem el codi de promocio si ja n'hi havia introduit un
            $('.list-group-item:eq(3)').hide('slideUp');
            // Actualitzem els preus del carrito
            actualitzarPreusCarrito();
            return;
        }

        // Sino actualitzem els preus del carrito
        actualitzarPreusCarrito(true);
        // Mostrem l'element del codi
        $('.list-group-item:eq(3)').show('slideDown');
    });

    // Agafem el boto de checkout
    let botoCheckout = $('.fa-shopping-cart').parent();
    // Afegim escolta de quan fa click
    botoCheckout.click(function () {
        // Esborrem el que tenia el modal
        $('.modal-body').text('');

        // Definim una amplada mes gran
        $('.modal-content').width('700px');
        // Clonem el resum per mostrar-ho
        let newSumary = $('.col-md-4').clone();
        // Eliminem aquesta clase per a que s'adapti al modal
        newSumary.removeClass('col-md-4');
        // Agafem els fills del sumary
        let sumaryChildrens = newSumary.children();
        // Eliminem el que no volem que aparegui
        sumaryChildrens[1].remove();
        sumaryChildrens[2].remove();
        // O afegim al final del modal-body
        $('.modal-body').append(newSumary);

        // Fem un for, per clonar els elements que tenim per comprar
        for (let i = 1; i <= 3;i++) {
            // Clonem el element
            let newElement = $('.row .row:eq(' + i + ')').clone();
            // Eliminem l'icona de la paperera
            newElement.children()[3].remove();
            // Busquem els inputs
            let newElementChildrens = newElement.find('input');
            // Afegim readonly als inputs
            newElementChildrens.attr('readonly', '');
            // O afegim al final del modal-body
            $('.modal-body').append(newElement);
        }

        // Mostrem el modal
        $('.modal').show();
    });

    // Creem escoltes de click per ocultar el modal
    $('.close').click(function () {
        $('.modal').hide();
    });
    $(':button:eq(6)').click(function () {
        $('.modal').hide();
    });
});

/**
 * Funcio que actualitza el preu total, multiplicant la quantitat pel preu unitari
 * @param qty
 * @param preuUnitari
 * @param preuTotal
 */
function actualitzarPreuTotalPerProducte(qty, preuUnitari, preuTotal) {
    let preu = preuUnitari.replace('€', '');
    let newPrice = qty * preu;
    preuTotal.text(newPrice + '€');
}

/**
 * Funcio que actualitza els preus del carrito
 * @param isDecompte per si hem de calcular el preu del carrito amb descompte o sense
 */
function actualitzarPreusCarrito(isDecompte = false) {
    let newSubtotal = 0;

    // Fem un for per agafar els preus dels productes i ho sumem al newSubtotal
    for (let i = 0;i < $('.preu-producte').length;i++) {
        let preuProducte = $('.preu-producte:eq(' + i + ')').text().replace('€', '');
        newSubtotal += parseFloat(preuProducte);
    }

    // Agafem la taxa i la calculem
    let tax = $('.list-group-item:eq(1) span').text().replace('%', '');
    tax = (newSubtotal * parseFloat(tax)) / 100;

    // Agafem el envio i sumem tot per obtenir el total
    let envio = $('.list-group-item:eq(2) span').text().replace('€', '');
    let newTotal = newSubtotal + tax + parseFloat(envio);

    // Si n'hi ha descompte restem 5€ al total
    if (isDecompte) {
        newTotal = (newSubtotal + tax + parseFloat(envio)) - 5;
    }

    // Escribim el subtotal i el total
    $('.list-group-item:eq(0) span').text(newSubtotal + '€');
    $('.list-group-item:eq(4) strong').text(newTotal + '€');
}

/**
 * Funcio per actualitzar el total de productes diferents que tenim
 */
function actualitzarBadge() {
    let badge = $('.badge').text();
    let newBadge = badge -= 1;

    // Si ens quedem sense productes
    if (newBadge == 0) {
        // Desactivem el boto de checkout i modifiquem el total
        $('.fa-shopping-cart').parent().prop('disabled', true);
        $(':button:eq(3)').prop('disabled', true);
        $('.list-group-item:eq(0) span').text('0€');
        $('.list-group-item:eq(4) strong').text('0€');
    }

    $('.badge').text(newBadge);
}