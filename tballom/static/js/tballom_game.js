var game = document.querySelector('.game');
var rank = document.querySelector('.rank');
var store = document.querySelector('.store');
var logo = document.getElementById("logo");
var nav = document.querySelector('nav');
var gameStateDiv = document.getElementById('result');
let background = document.getElementById("background");
let gameContainer = document.querySelector('.game-container');

let swingCount = 0; // 배트 휘든 횟수
let swingingResult = null;
let score = 0;

// 마우스 우클릭 시 배트 변경 메뉴 생성
let contextMenu = document.querySelector('.contextmenu');
gameContainer.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    let posX = event.pageX;
    let posY = event.pageY;

    contextMenu.style.left = posX + 'px';
    contextMenu.style.top = posY + 'px';
    contextMenu.style.position = 'absolute';
    contextMenu.style.display = 'flex';
});
document.addEventListener('click', function () {
    contextMenu.style.display = 'none';
});

document.querySelectorAll('.contextmenu.menu li').forEach(item => {
    item.addEventListener('click', function() {
        let selectedOption = this.querySelector('a').innerText;
        if (selectedOption === '파리채') {
            let imagePath = '/static/tballom/images/파리채.png';
            changeBatImage(imagePath);
        } else if (selectedOption === '탁구채') {
            let imagePath = '/static/tballom/images/탁구채.png';
            changeBatImage(imagePath);
        } else if (selectedOption === '도깨비 배트') {
            let imagePath = '/static/tballom/images/장난감 배트.png';
            changeBatImage(imagePath);
        } else if (selectedOption === '나무 배트') {
            let imagePath = '/static/tballom/images/나무 배트.png';
            changeBatImage(imagePath);
        } else if (selectedOption === '야구 배트') {
            let imagePath = '/static/tballom/images/알루미늄 배트.png';
            changeBatImage(imagePath);
        } else if (selectedOption === '후라이팬') {
            let imagePath = '/static/tballom/images/후라이팬.png';
            changeBatImage(imagePath);
        } else if (selectedOption === '테니스 라켓') {
            let imagePath = '/static/tballom/images/테니스 라켓.png';
            changeBatImage(imagePath);
        } else if (selectedOption === '골프채') {
            let imagePath = '/static/tballom/images/골프채.png';
            changeBatImage(imagePath);
        }
    });
});

// 배트 이미지 변경 함수
function changeBatImage(imagePath) {
    let batImg = document.querySelector('.bat-imgDiv img');
    batImg.src = imagePath;

    let imgPath = decodeURIComponent(imagePath);
    let addClassName = document.querySelector('.bat-imgDiv div');
    let classMap = {
        '파리채.png': 'bat-flyswatter',
        '탁구채.png': 'bat-TableTennis',
        '나무 배트.png': 'bat-wood',
        '후라이팬.png': 'bat-FlyingPan',
        '장난감 배트.png': 'bat-toy',
        '골프채.png': 'bat-golf',
        '테니스 라켓.png': 'bat-tennis',
        '알루미늄 배트.png': 'bat-al'
    };

    function updateClass(newClass) {
        addClassName.className = '';
        if (newClass) {
            addClassName.classList.add(newClass);
        }
    }

    let newClass = null;
    for (let key in classMap) {
        if (imgPath.includes(key)) {
            newClass = classMap[key];
            break;
        }
    }
    updateClass(newClass);
}

// 스윙 결과 화면에 출력
function showResult() {
    let swingingResult1 = localStorage.getItem("swingingResult1");
    let swingingResult2 = localStorage.getItem("swingingResult2");
    let swingingResult3 = localStorage.getItem("swingingResult3");
    let currentResult = localStorage.getItem("currentResult");

    let todayResult = document.getElementById("swingingResult");
    todayResult.innerHTML = ''; // 초기화하여 중복 방지
    if (swingingResult1) {
        todayResult.innerHTML += `<p>${swingingResult1}</p>`;
    }
    if (swingingResult2) {
        todayResult.innerHTML += `<p>${swingingResult2}</p>`;
    }
    if (swingingResult3) {
        todayResult.innerHTML += `<p>${swingingResult3}</p>`;
    }

    let currentResultDiv = document.getElementById("currentResult");
    if (currentResult) {
        currentResultDiv.innerHTML = `<p>${currentResult}</p>`;
    }
}

let gameState = localStorage.getItem("gameState");

function startGame() {
    localStorage.removeItem("gameState");
    gameStateDiv.style.display = 'none';
    gameContainer.style.display = 'block';
    background.style.filter = 'brightness(100%)';
    nav.style.filter = 'brightness(100%)';

    game.style.cursor = 'pointer';
    rank.style.cursor = 'pointer';
    store.style.cursor = 'pointer';
    logo.style.cursor = 'pointer';
}

function endGame() {
    console.log("endGame 실행");
    // 게임 종료 시 화면에 메시지 표시
    localStorage.setItem("gameState", "false");
    gameStateDiv.innerHTML = '<p class="gameText">게임종료</p>';
    gameStateDiv.style.display = 'flex';

    gameContainer.style.display = 'none';
    background.style.filter = 'brightness(0.5)';
    nav.style.filter = 'brightness(0.5)';
    game.style.cursor = 'default';
    rank.style.cursor = 'default';
    store.style.cursor = 'default';
    logo.style.cursor = 'default';

    nextPage();
}

function nextPage() {
    setTimeout(function() {
        // 로컬스토리지에 저장된 값들 다 지우기
        localStorage.clear();
        window.location.href = "/tballom/rank";
    }, 1500);
}

// 전광판에 게임시작 글씨 추가
// 2초 후 배트 보여지기 => startGame 호출
localStorage.clear();
localStorage.setItem("gameState", "true");
gameStateDiv.innerHTML = '<p class="gameText">게임시작</p>';
setTimeout(function () {
    startGame();
}, 1500);

background.style.filter = 'brightness(0.5)';
nav.style.filter = 'brightness(0.5)';
game.style.cursor = 'default';
rank.style.cursor = 'default';
store.style.cursor = 'default';
logo.style.cursor = 'default';

// 키보드로 배트 위치 조절
let batImgDiv = document.querySelector('.bat-imgDiv');
let isSwinging = false;

document.addEventListener('keydown', function(event) {
    if (isSwinging) return;
    const moveNum = 10; // 이동 속도
    // getComputedStyle : 해당 태그가 가지고 있는 모든 속성 추출
    // getPropertyValue : 특정 속성만 추출
    let top = parseInt(window.getComputedStyle(batImgDiv).getPropertyValue('top'));
    let left = parseInt(window.getComputedStyle(batImgDiv).getPropertyValue('left'));

    switch(event.key) {
        case 'ArrowUp': top -= moveNum; break;
        case 'ArrowDown': top += moveNum; break;
        case 'ArrowLeft': left -= moveNum; break;
        case 'ArrowRight': left += moveNum; break;
    }
    // 위치 변경
    batImgDiv.style.top = top + 'px';
    batImgDiv.style.left = left + 'px';

    if (event.key === 'Enter') {
        swingBat(batImgDiv);
        swingCount++;
    }

    function swingBat(batImgDiv) {
        batImgDiv.style.transition = 'transform 0.3s';
        batImgDiv.style.transform = 'rotate(100deg)';
        let isSwinging = true;

        setTimeout(() => {
            batImgDiv.style.transition = 'transform 0.1s';
            batImgDiv.style.transform = `rotate(0deg)`;
            isSwinging = false;

            // ball-imgDiv와 bat-center의 위치 정보 가져오기
            let ballImgDiv = document.querySelector('.ball-imgDiv');
            let batCenter = document.querySelector('.bat-imgDiv > div');

            let batCenterRect = batCenter.getBoundingClientRect();
            let ballImgDivRect = ballImgDiv.getBoundingClientRect();

            let x = Math.min(ballImgDivRect.right, batCenterRect.right) - Math.max(ballImgDivRect.left, batCenterRect.left);
            let y = Math.min(ballImgDivRect.bottom, batCenterRect.bottom) - Math.max(ballImgDivRect.top, batCenterRect.top);

            console.log(x, y);

            // fileName 구하기
            var imgElement = document.querySelector('.bat-imgDiv img');
            var src = imgElement.getAttribute('src');
            var filename = src.split('/').pop();
            var decodedFilename = decodeURIComponent(filename);

            var actions = {
                '파리채.png': Flyswatter,
                '탁구채.png': TableTennis,
                '나무 배트.png': Wood,
                '후라이팬.png': FlyingPan,
                '장난감 배트.png': Toy,
                '골프채.png': Golf,
                '테니스 라켓.png': Tennis,
                '알루미늄 배트.png': Al
            };

            if (actions[decodedFilename]) {
                actions[decodedFilename](x, y);
            }

            function moveBall(translateX, translateY, duration = '1s') {
                ballImgDiv.style.transition = `transform ${duration}`;
                ballImgDiv.style.transform = `translateX(${translateX}) translateY(${translateY})`;
            }

            // 파리채 배트 스윙 함수 (완성)
            function Flyswatter(x, y) {
                let translateX, translateY, duration = '1s';
                if ((x >= 50 && x < 51)  && (y > -68 && y <= -57)) {
                    score += 29;
                    console.log("왼쪽 안타");
                    swingingResult = "안타";
                    translateX = '-700px';
                    translateY = '-200px';
                } else if ((x >= 40 && x <= 41) && (y > -68 && y <= -47)) {
                    score += 29;
                    console.log("오른쪽 안타");
                    swingingResult = "안타";
                    translateX = '700px';
                    translateY = '-200px';
                } else if (((x >= 30 && x < 31) || (x >= 20 && x < 21)) && (y >= -78 && y < -47)) {
                    score += -37;
                    console.log("오른쪽 파울");
                    swingingResult = "파울";
                    translateX = '1000px';
                    translateY = '-100px';
                } else if (((x >= 40 && x < 41) || x === 50) && (y >= -48 && y < -47)) {
                    score += -37;
                    console.log("왼쪽 파울");
                    swingingResult = "파울";
                    translateX = '-1000px';
                    translateY = '-100px';
                } else if ((x >= 50 && x < 51) && (y > -58 && y <= -57)) {
                    score += 51;
                    console.log("정면 홈런");
                    swingingResult = "홈런";
                    translateX = '10px';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 50 && x < 51)  && (y > -88 && y <= -77)) {
                    score += 51;
                    console.log("왼쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '-800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 30 && x < 31) && (y > -68 && y <= -57)) {
                    score += 51;
                    console.log("오른쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if (x === 50 && (y > -29 && y <= -27)) {
                    score += -37;
                    console.log("정면 아래 파울");
                    swingingResult = "파울";
                    translateX = '0px';
                    translateY = '200px';
                } else if (((x >= 40 && x < 41) || x >= 30 && x < 31) && ((y > -28 && y <= -27) || (y > -38 && y <= -37))) {
                    score += -37;
                    console.log("오른쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '800px';
                    translateY = '150px';
                } else if (x === 50 && (y > -38 && y <= -37)) {
                    score += -37;
                    console.log("왼쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '-800px';
                    translateY = '150px';
                } else {
                    score += -25;
                    console.log("헛스윙");
                    swingingResult = "헛스윙";
                }
                moveBall(translateX, translateY, duration);
            }

            // 탁구채 배트 스윙 함수 (완성)
            function TableTennis(x, y) {
                let translateX, translateY, duration = '1s';
                if (x === 50 && (y >= 42 && y <= 43)) {
                    score += 29;
                    console.log("왼쪽 안타");
                    swingingResult = "안타";
                    translateX = '-700px';
                    translateY = '-200px';
                } else if (x === 50 && (y >= 32 && y <= 33)) {
                    score += 29;
                    console.log("오른쪽 안타");
                    swingingResult = "안타";
                    translateX = '700px';
                    translateY = '-200px';
                } else if ((x >= 43 && x < 50) && (y >= 19 && y < 50)) {
                    score += -37;
                    console.log("오른쪽 파울");
                    swingingResult = "파울";
                    translateX = '1000px';
                    translateY = '-100px';
                } else if ((x >= 41 && x < 42) && (y >= 29 && y < 40)) {
                    score += -37;
                    console.log("왼쪽 파울");
                    swingingResult = "파울";
                    translateX = '-1000px';
                    translateY = '-100px';
                } else if ((x >= 50 && x < 51) && (y >= 29 && y < 30)) {
                    score += 51;
                    console.log("정면 홈런");
                    swingingResult = "홈런";
                    translateX = '10px';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 50 && x < 51) && (y >= 19 && y < 20)) {
                    score += 51;
                    console.log("왼쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '-800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 50 && x < 51) && (y >= 29 && y < 30)) {
                    score += 51;
                    console.log("오른쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 50 && x < 51) && ((y >= 39 && y <= 40) || (y >= 9 && y < 10))) {
                    score += -37;
                    console.log("정면 아래 파울");
                    swingingResult = "파울";
                    translateX = '0px';
                    translateY = '200px';
                } else if ((x >= 50 && x < 51) && (y >= 49 && y < 51)) {
                    score += -37;
                    console.log("오른쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '800px';
                    translateY = '150px';
                } else if ((x >= 41 && x < 42) && (y >= 49 && y < 50)) {
                    score += -37;
                    console.log("왼쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '-800px';
                    translateY = '150px';
                } else {
                    score += -25;
                    console.log("헛스윙");
                    swingingResult = "헛스윙";
                }
                moveBall(translateX, translateY, duration);
            }

            // 나무 배트 스윙 함수 (완성)
            function Wood(x, y) {
                let translateX, translateY, duration = '1s';
                if ((x >= 50 && x < 51) && (y > -37 && y <= -36)) {
                    score += 29;
                    console.log("왼쪽 안타");
                    swingingResult = "안타";
                    translateX = '-700px';
                    translateY = '-200px';
                } else if ((x >= 25 && x < 26) && (y > -57 && y <= -56)) {
                    score += 29;
                    console.log("오른쪽 안타");
                    swingingResult = "안타";
                    translateX = '700px';
                    translateY = '-200px';
                } else if ((x >= 16 && x < 17) && (y > -57 && y <= -56)) {
                    score += -37;
                    console.log("오른쪽 파울");
                    swingingResult = "파울";
                    translateX = '1000px';
                    translateY = '-100px';
                } else if ((x >= 50 && x < 51) && (y > -27 && y <= -24)) {
                    score += -37;
                    console.log("왼쪽 파울");
                    swingingResult = "파울";
                    translateX = '-1000px';
                    translateY = '-100px';
                } else if ((x >= 45 && x < 46) && (y > -27 && y <= -26)) {
                    score += 51;
                    console.log("정면 홈런");
                    swingingResult = "홈런";
                    translateX = '10px';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 45 && x < 46) && (y > -37 && y <= -36)) {
                    score += 51;
                    console.log("왼쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '-800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 25 && x < 26) && (y > -47 && y <= -46)) {
                    score += 51;
                    console.log("오른쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 45 && x < 46) && (y > -17 && y <= -16)) {
                    score += -37;
                    console.log("정면 아래 파울");
                    swingingResult = "파울";
                    translateX = '0px';
                    translateY = '200px';
                } else if (((x >= 25 && x < 26) || (x >= 35 && x < 36)) && ((y > -37 && y <= -36) || (y > -27 && y <= -26))) {
                    score += -37;
                    console.log("오른쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '800px';
                    translateY = '150px';
                } else if (x === 50 && (y > -25 && y <= -4)) {
                    score += -37;
                    console.log("왼쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '-800px';
                    translateY = '150px';
                } else {
                    score += -25;
                    console.log("헛스윙");
                    swingingResult = "헛스윙";
                }
                moveBall(translateX, translateY, duration);
            }

            // 후라이팬 배트 스윙 함수 (완성)
            function FlyingPan(x, y) {
                let translateX, translateY, duration = '1s';
                if ((x >= 46 && x < 47) && (y >= 20 && y < 21)) {
                    score += 29;
                    console.log("왼쪽 안타");
                    swingingResult = "안타";
                    translateX = '-700px';
                    translateY = '-200px';
                } else if ((x >= 49 && x < 51) && (y >= 42 && y < 43)) {
                    score += 29;
                    console.log("오른쪽 안타");;
                    swingingResult = "안타";
                    translateX = '700px';
                    translateY = '-200px';
                } else if ((x >= 39 && x < 40) && (y >= 30 && y < 31)) {
                    score += -37;
                    console.log("오른쪽 파울");
                    swingingResult = "파울";
                    translateX = '1000px';
                    translateY = '-100px';
                } else if ((x >= 36 && x < 37) && (y >= 20 && y < 21)) {
                    score += -37;
                    console.log("왼쪽 파울");
                    swingingResult = "파울";
                    translateX = '-1000px';
                    translateY = '-100px';
                } else if (x === 50 && (y >= 20 && y < 21)) {
                    score += 51;
                    console.log("정면 홈런");
                    swingingResult = "홈런";
                    translateX = '10px';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if (x === 50 && (y >= 30 && y < 31)) {
                    score += 51;
                    console.log("왼쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '-800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if (x === 50 && (y >= 40 && y < 41)) {
                    score += 51;
                    console.log("오른쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if (x === 50 && (y >= 10 && y < 11)) {
                    score += -37;
                    console.log("정면 아래 파울");
                    swingingResult = "파울";
                    translateX = '0px';
                    translateY = '200px';
                } else if (x === 50 && y === 50) {
                    score += -37;
                    console.log("오른쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '800px';
                    translateY = '150px';
                } else if ((x >= 46 && x < 47) && y === 50) {
                    score += -37;
                    console.log("왼쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '-800px';
                    translateY = '150px';
                } else {
                    score += -25;
                    console.log("헛스윙");
                    swingingResult = "헛스윙";
                }
                moveBall(translateX, translateY, duration);
            }

            // 장난감 배트 스윙 함수 (완성)
            function Toy(x, y) {
                let translateX, translateY, duration = '1s';
                if ((x >= 50 && x < 51) && ((y >= 12 && y < 13) || (y >= 32 && y < 43))) {
                    score += 29;
                    console.log("왼쪽 안타");
                    swingingResult = "안타";
                    translateX = '-700px';
                    translateY = '-200px';
                } else if ((x >= 47 && x < 48) && (y >= 23 && y < 43)) {
                    score += 29;
                    console.log("오른쪽 안타");
                    swingingResult = "안타";
                    translateX = '700px';
                    translateY = '-200px';
                } else if ((x >= 37 && x < 38) && (y >= 22 && y < 43)) {
                    score += -37;
                    console.log("오른쪽 파울");
                    swingingResult = "파울";
                    translateX = '1000px';
                    translateY = '-100px';
                } else if ((x >= 42 && x < 43) && (y >= 32 && y < 33)) {
                    score += -37;
                    console.log("왼쪽 파울");
                    swingingResult = "파울";
                    translateX = '-1000px';
                    translateY = '-100px';
                } else if ((x >= 50 && x < 51) && (y >= 35 && y < 36)) {
                    score += 51;
                    console.log("정면 홈런");
                    swingingResult = "홈런";
                    translateX = '10px';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 50 && x < 51) && (y >= 22 && y < 23)) {
                    score += 51;
                    console.log("왼쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '-800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 47 && x < 48) && (y >= 22 && y < 23)) {
                    score += 51;
                    console.log("오른쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 50 && x < 51) && ((y >= 10 && y < 11) || (y >= 50 && y < 51))) {
                    score += -37;
                    console.log("정면 아래 파울");
                    swingingResult = "파울";
                    translateX = '0px';
                    translateY = '200px';
                } else if ((x >= 37 && x < 48) && (y >= 50 && y < 51)) {
                    score += -37;
                    console.log("오른쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '800px';
                    translateY = '150px';
                } else if ((x >= 46 && x < 47) && (y >= 50 && y < 51)) {
                    score += -37;
                    console.log("왼쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '-800px';
                    translateY = '150px';
                } else {
                    console.log("헛스윙");
                    swingingResult = "헛스윙";
                }
                moveBall(translateX, translateY, duration);
            }

            // 골프 배트 스윙 함수 (완성)
            function Golf(x, y) {
                let translateX, translateY, duration = '1s';
                if ((x >= 22 && x < 23) && (y >= -90 && y < -89)) {
                    score += 29;
                    console.log("왼쪽 안타");
                    swingingResult = "안타";
                    translateX = '-700px';
                    translateY = '-200px';
                } else if ((x >= 28 && x < 29) && (y >= -100 && y < -99)) {
                    score += 29;
                    console.log("오른쪽 안타");
                    swingingResult = "안타";
                    translateX = '700px';
                    translateY = '-200px';
                } else if ((x >= 26 && x < 27) && (y >= -100 && y < -99)) {
                    score += -37;
                    console.log("오른쪽 파울");
                    swingingResult = "파울";
                    translateX = '1000px';
                    translateY = '-100px';
                } else if ((x >= 22 && x < 23) && (y >= -100 && y < -99)) {
                    score += -37;
                    console.log("왼쪽 파울");
                    swingingResult = "파울";
                    translateX = '-1000px';
                    translateY = '-100px';
                } else if ((x >= 22 && x < 23) && (y >= -110 && y < -109)) {
                    score += 51;
                    console.log("왼쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '-800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 28 && x < 29) && (y >= -90 && y < -89)) {
                    score += 51;
                    console.log("오른쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 28 &&  x < 29) && (y >= -110 && y < -109)) {
                    score += -37;
                    console.log("정면 아래 파울");
                    swingingResult = "파울";
                    translateX = '0px';
                    translateY = '200px';
                } else if ((x >= 28 &&  x < 29) && (y >= -80 && y < -79)) {
                    score += -37;
                    console.log("오른쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '800px';
                    translateY = '150px';
                } else if ((x >= 12 && x < 13) && (y >= -100 && y < -89)) {
                    score += -37;
                    console.log("왼쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '-800px';
                    translateY = '150px';
                } else {
                    score += -25;
                    console.log("헛스윙");
                    swingingResult = "헛스윙";
                }
                moveBall(translateX, translateY, duration);
            }

            // 테니스 라켓 배트 스윙 함수 (완성)
            function Tennis(x, y) {
                let translateX, translateY, duration = '1s';
                if ((x <= 50 && x > 43) && ((y >= 5 && y < 6) || (y >= -15 && y < -14))) {
                    score += 29;
                    console.log("왼쪽 안타");
                    swingingResult = "안타";
                    translateX = '-700px';
                    translateY = '-200px';
                } else if ((x >= 35 && x < 46) && (y >= -5 && y < -4)) {
                    score += 29;
                    console.log("오른쪽 안타");
                    swingingResult = "안타";
                    translateX = '700px';
                    translateY = '-200px';
                } else if ((x >= 35 && x < 46)  && ((y >= 5 && y < 6))) {
                    score += -37;
                    console.log("오른쪽 파울");
                    swingingResult = "파울";
                    translateX = '1000px';
                    translateY = '-100px';
                } else if ((x >= 43 && x < 44) && (y >= -5 && y < -4) || (y >= 15 && y < 16)) {
                    score += -37;
                    console.log("왼쪽 파울");
                    swingingResult = "파울";
                    translateX = '-1000px';
                    translateY = '-100px';
                } else if ((x >= 50 && x < 51) && (y >= -15 && y < -14)) {
                    score += 51;
                    console.log("정면 홈런");;
                    swingingResult = "홈런";
                    translateX = '10px';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 50 && x < 51) && (y >= -5 && y < -4)) {
                    score += 51;
                    console.log("왼쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '-800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 45 && x < 46) && (y >= -15 && y < -14)) {
                    score += 51;
                    console.log("오른쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 50 && x < 51) && (y >= 25 && y < 36)) {
                    score += -37;
                    console.log("정면 아래 파울");
                    swingingResult = "파울";
                    translateX = '0px';
                    translateY = '200px';
                } else if (((x >= 45 && x < 51)) && (y >= 15 && y < 26)) {
                    score += -37;
                    console.log("오른쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '800px';
                    translateY = '150px';
                } else if ((x >= 33 && x < 44) && ((y >= 5 && y < 6) || (y >= 25 && y < 36))) {
                    score += -37;
                    console.log("왼쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '-800px';
                    translateY = '150px';
                } else {
                    score += -25;
                    console.log("헛스윙");
                    swingingResult = "헛스윙";
                }
                moveBall(translateX, translateY, duration);
            }

            // 알루미늄 배트 스윙 함수 (완성)
            function Al(x, y) {
                let translateX, translateY, duration = '1s';
                if ((x >= 50 && x < 51) && (y >= -25 && y < -24)) {
                    score += 29;
                    console.log("왼쪽 안타");
                    swingingResult = "안타";
                    translateX = '-700px';
                    translateY = '-200px';
                } else if ((x >= 47 && x < 48) && (y >= -25 && y < -24)) {
                    score += 29;
                    console.log("오른쪽 안타");
                    swingingResult = "안타";
                    translateX = '700px';
                    translateY = '-200px';
                } else if ((x >= 37 && x < 38)  &&  (y >= -35 && y < -24)) {
                    score += -37;
                    console.log("오른쪽 파울");
                    swingingResult = "파울";
                    translateX = '1000px';
                    translateY = '-100px';
                } else if ((x >= 50 && x < 51) && (y >= -35 && y < -34)) {
                    score += -37;
                    console.log("왼쪽 파울");
                    swingingResult = "파울";
                    translateX = '-1000px';
                    translateY = '-100px';
                } else if ((x >= 47 && x < 48) && (y >= -35 && y < -34)) {
                    score += 51;
                    console.log("정면 홈런");
                    swingingResult = "홈런";
                    translateX = '10px';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 50 && x < 51) && (y >= -15 && y < -14)) {
                    score += 51;
                    console.log("왼쪽 홈런");
                    swingingResult = "홈런";
                    translateX = '-800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 37 && x < 38) && (y >= -45 && y < -44)) {
                    score += 51;
                    console.log("오른쪽 홈런");;
                    swingingResult = "홈런";
                    translateX = '800vh';
                    translateY = '-1000vh';
                    duration = '3s';
                } else if ((x >= 50 && x < 51) && (y >= 5 && y < 6)) {
                    score += -37;
                    console.log("정면 아래 파울");
                    swingingResult = "파울";
                    translateX = '0px';
                    translateY = '200px';
                } else if ((x >= 47 && x < 48) && (y >= -15 && y < -4)) {
                    score += -37;
                    console.log("오른쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '800px';
                    translateY = '150px';
                } else if ((x >= 50 && x < 51) && (y >= -5 && y < -4)) {
                    score += -37;
                    console.log("왼쪽 아래 파울");
                    swingingResult = "파울";
                    translateX = '-800px';
                    translateY = '150px';
                } else {
                    score += -25;
                    console.log("헛스윙");
                    swingingResult = "헛스윙";
                }
                moveBall(translateX, translateY, duration);
            }

            // 3초 후 원래 자리로 돌아오기
            setTimeout(() => {
                localStorage.removeItem("currentResult");
                ballImgDiv.style.transform = 'translateX(0px) translateY(0px)';
                ballImgDiv.style.transition = 'none';

                batImgDiv.style.transition = 'none';
                batImgDiv.style.top = '67%';
                batImgDiv.style.left = '37%';
                if (swingCount >= 3) {
                    console.log("점수", score);
                    // score db에 저장
                    saveScore();
                    savePoint();

                    // 게임 종료
                    endGame();
                }

                if (swingCount <= 3) {
                    localStorage.setItem(`swingingResult${swingCount}`, swingingResult);
                    localStorage.setItem("currentResult", swingingResult);
                    showResult();
                }
             }, 3000);
        }, 500);
    }
});

function saveScore() {
    var xhr = new XMLHttpRequest();
    var url = '/tballom/save-score/';
    var data = {
        user_id: userId,
        user_score: score
    };

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log('Score 저장 완료!');
        } else if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log('Score 저장 실패:', xhr.status);
        }
    };
    xhr.send(JSON.stringify(data));
}

function savePoint() {
    var xhr = new XMLHttpRequest();
    var url = '/tballom/save-point/';
    var data = {
        user_id: userId,
        user_score: score
    };

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                console.log('Point 저장 완료!');
            } else if (xhr.readyState === XMLHttpRequest.DONE) {
                console.log('Point 저장 실패:', xhr.status);
            }
        };
    };
    xhr.send(JSON.stringify(data));
}