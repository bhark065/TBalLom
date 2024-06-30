// 배트 클릭 시 alert 창이 뜨고 구매 확정 후 구매 함수 호출
let alert = document.getElementById("alert");
let userPoint = document.querySelector(".point > #user_point");

document.addEventListener('DOMContentLoaded', function() {
    let boxes = document.querySelectorAll('.box');
    boxes.forEach(function(box) {
        box.addEventListener('click', function() {
            let batName = box.querySelector(".name").textContent;
            let priceElement = box.querySelector('.price');
            let bat_point = priceElement.textContent.trim();
            let answer = confirm(`${batName} 구매하시겠습니까?`);
            if (answer) {
                if (user_point < bat_point) {
                    showAlert('금액이 부족합니다.', 'danger');
                 } else {
                    buyingBat(userId, parseInt(bat_point), batName);
                 }
            }
        });
    });
});

// 배트 구매 함수
function buyingBat(userId, bat_point, batName) {
    var xhr = new XMLHttpRequest();
    var url = '/tballom/buying_bat/';
    var data = {
        user_id: userId,
        bat_point: bat_point,
        bat_name: batName
    };

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log('배트 구매 성공');
            let response = JSON.parse(xhr.responseText);
            userPoint.innerText = response.user_point;
            showAlert(response.status, 'success');
        } else if (xhr.readyState === XMLHttpRequest.DONE) {
            let response = JSON.parse(xhr.responseText);
            if (response.status === '이미 구매한 배트입니다.') {
                showAlert(response.status, 'danger');
            } else {
                console.log('배트 구매 실패', xhr.status);
            }
        }
    }
    xhr.send(JSON.stringify(data));
}

// alert 메시지 표시 함수
function showAlert(message, type) {
    alert.innerHTML += `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        alert.innerHTML = '';
    }, 1500);
}