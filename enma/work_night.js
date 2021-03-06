var now = new Date();
var hr = now.getHours();

function getChromeVersion() {
    var arr = navigator.userAgent.split(' ');
    var version = '';
    for (var i = 0; i < arr.length; i++) {
        if (/Chrome/i.test(arr[i])) {
            version = arr[i];
            break;
        }
    }
    if (version) {
        return Number(version.split('/')[1].split('.')[0]);
    } else {
        return false;
    }
}

if (hr < 6 || hr >= 21) {
    if (navigator.userAgent.indexOf('MSIE 6.0') > -1) {
        document.getElementById('start').style.display = 'block';
    } else if (navigator.userAgent.indexOf('MSIE 7.0') > -1) {
        document.getElementById('start').style.display = 'block';
    } else if (navigator.userAgent.indexOf('MSIE 8.0') > -1) {
        document.getElementById('start').style.display = 'block';
    } else {
        if (getChromeVersion()) {
            if (getChromeVersion() >= 66) {
                document.getElementById('animate').muted = true;
            }
        }
        document.getElementById('fire').style.display = 'block';
        document.getElementById('animate').play();
    }
} else {
    for (var i = 0; i < Spiders.length; i++) {
        if (MoeSpider.indexOf(Spiders[i].toLowerCase()) > -1) {
            document.getElementById('fire').style.display = 'block';
            document.getElementById('animate').play();
            break;
        } else {
            document.getElementById('clock').style.display = 'block';
        }
    }
}

function FireEnd() {
    document.getElementById('fire').style.display = 'none';
    document.getElementById('start').style.display = 'block';
}

function Go() {
    location.replace("https://hell.brynhild.online/");
}

function CheckInput() {
    if (hell.nickname.value == '') {
        hell.nickname.focus();
        return false;
    } else {
        document.getElementById('start').style.display = 'none';
        document.getElementById('end').style.display = 'block';
        document.body.style.backgroundColor = '#cc0000';
        window.setTimeout("Go()", 1600);
        return false;
    }
}