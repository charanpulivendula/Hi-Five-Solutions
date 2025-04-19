var worker = null;
var loaded = 0;

function increment() {
    $('#counter').html(loaded+'%');
    $('#drink').css('top', (100-loaded*.9)+'%');
    if(loaded==25) $('#cubes div:nth-child(1)').fadeIn(100);
    if(loaded==50) 
        {$('#cubes div:nth-child(2)').fadeIn(100);
            $('#footer').hide();
    }
    if(loaded==75) $('#cubes div:nth-child(3)').fadeIn(100);
    if(loaded==100) {
        $('#lemon').fadeIn(100);
        $('#straw').fadeIn(300);
        loaded = 0;
        stopLoading();
        // setTimeout(startLoading, 1000);
        $('.footerDiv').append('<button type="button" class="footerBtn">Explore</button>');

    }
    else loaded++;    
}

function startLoading() {
    $('#lemon').hide();
    $('#straw').hide();
    $('#cubes div').hide();
    worker = setInterval(increment, 30);
}
function stopLoading() {
    clearInterval(worker);
}
function showButtons(){
    
}

startLoading();