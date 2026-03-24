import { eventNames } from "node:cluster";
import { ListInput } from "./interface";
import { memoryGame, getFromLocalStorage } from "./DB";
import { DB } from "./interface";


document.getElementById('play-btn')?.addEventListener("click", () => {
    goToNextpage();
})


document.getElementById('play-game')?.addEventListener("click", () => {
    playGame();
})


function goToNextpage(): void {
    window.location.href = 'setting.html';
}


function playGame() {
    window.location.href = 'game.html';
    //console.log(memoryGame);
}


document.addEventListener("click", (event) => {
    setPreference(event);
    aktivateButton();
    updateFooter();
})


document.addEventListener("DOMContentLoaded", () => {
    let available = localStorage.getItem("memoryGame");
    if (available) {
        getFromLocalStorage();
        updateSettings();
        updateFooter();
        startBtn();
    }
})


function updateFooter() {
    updateFotterTheme();
    updateFotterPlayer();
    updateFotterCards();
}


function updateSettings() {
    updateSettingImg();
    updateElementTheme();
    updateElementPlayer();
    updateElementCards();
}


function updateSettingImg() {
    let img = document.querySelector('.img-themse') as HTMLImageElement;
    if (memoryGame.theme == "") {
        img.src = `assets/img/settings/themes_example_code.svg`;
    } else {
        img.src = `assets/img/settings/themes_example_${memoryGame.theme}.svg`;
    }
}


function updateElementTheme() {
    if (memoryGame.theme === "") return;
    let settingTheme = document.querySelector(`input[name=theme][value=${memoryGame.theme}]`);
    if (settingTheme) {
        let listElement = settingTheme.closest('.setting-element');
        let label = listElement?.querySelectorAll('.setting-element__input-field');
        showSelection(label);
    }
}


function updateElementPlayer() {
    let settingPlayer = document.querySelector(`input[name=player][value=${memoryGame.choosePlayer}]`);
    if (settingPlayer) {
        let listElement = settingPlayer.closest('.setting-element');
        let label = listElement?.querySelectorAll('.setting-element__input-field');
        showSelection(label);
    }
}


function updateElementCards() {
    let settingCards = document.querySelector(`input[name=boardSize][value='${memoryGame.memoryDeck}']`);
    if (settingCards) {
        let listElement = settingCards.closest('.setting-element');
        let label = listElement?.querySelectorAll('.setting-element__input-field');
        showSelection(label);
    }
}


function setPreference(event: any) {
    let target = event.target instanceof HTMLInputElement;
    if (target) {
        let input = inputSingleListElement(event);
        let singleLabel = getListElement(event);
        changePicture(input);
        setSettingInDB(input);
        resetAllListElement(event);
        showSelection(singleLabel);
    }
}


function changePicture(input: any) {
    if (input.name !== "theme") return;
    let picture = memoryGame.theme
    if (picture === input.value) return;
    let img = document.querySelector('.img-themse') as HTMLImageElement;
    if (img) {
        img.src = `assets/img/settings/themes_example_${input.value}.svg`;
    }
}


function inputSingleListElement(event: any) {
    let target = event.target as HTMLElement;
    let listElement = target.closest('.setting-element');
    let input = {
        name: listElement?.querySelector('input')?.name,
        value: listElement?.querySelector('input')?.value
    };
    return input;
}


function setSettingInDB(input: ListInput) {
    if (input.name == 'theme') {
        memoryGame.theme = input.value;
    } else if (input.name == 'player') {
        memoryGame.choosePlayer = input.value;
    } else if (input.name == 'boardSize') {
        let num = input.value;
        if (num) {
            memoryGame.memoryDeck = +num;
        }
    }
    saveLocalStorage();
}


function getListElement(event: any) {
    let target = event.target as HTMLElement;
    let listElement = target.closest('.setting-element');
    let label = listElement?.querySelectorAll('.setting-element__input-field');
    return label;
}


function showSelection(label: NodeListOf<Element> | undefined) {
    if (label) {
        label.forEach((element) => {
            element.querySelector('.setting-element__circle-emp')?.classList.add('setting-element__circle-emp--aktiv');
            element.querySelector('.setting-element__circle-full')?.classList.add('setting-element__circle-full--aktiv');
            element.querySelector('.setting-element__text')?.classList.add('setting-element__text--aktiv');
            element.querySelector('.setting-element__img-flag')?.classList.add('setting-element__img-flag--aktiv');
        });
    }
}


function resetAllListElement(event: any) {
    let target = event.target as HTMLElement;
    let resetAll = target.closest('.setting-list__content');
    let ul = resetAll?.querySelectorAll('.setting-element__input-field');
    if (ul) {
        ul.forEach((element) => {
            element.querySelector('.setting-element__circle-emp--aktiv')?.classList.remove('setting-element__circle-emp--aktiv');
            element.querySelector('.setting-element__circle-full--aktiv')?.classList.remove('setting-element__circle-full--aktiv');
            element.querySelector('.setting-element__text--aktiv')?.classList.remove('setting-element__text--aktiv');
            element.querySelector('.setting-element__img-flag--aktiv')?.classList.remove('setting-element__img-flag--aktiv');
        })
    }
}


function updateFotterTheme() {
    let textTheme = document.getElementById('fTheme') as HTMLElement;
    if (memoryGame.theme === "") {
        textTheme.innerHTML = "";
        textTheme.innerHTML = `Game Themes`;
    } else {
        textTheme.innerHTML = "";
        textTheme.innerHTML = `Theme: ${memoryGame.theme}`;
    }
}


function updateFotterPlayer() { 
    let textTheme = document.getElementById('fPlayer') as HTMLElement;
    if (memoryGame.choosePlayer == "") {
        textTheme.innerHTML = "";
        textTheme.innerHTML = `Player`;
    } else {
        textTheme.innerHTML = "";
        textTheme.innerHTML = `${memoryGame.choosePlayer}`;
    }
}


function updateFotterCards() {
        let textTheme = document.getElementById('fSize') as HTMLElement;
    if (memoryGame.memoryDeck == 0) {
        textTheme.innerHTML = "";
        textTheme.innerHTML = `Bord size`;
    }else {
        textTheme.innerHTML = "";
        textTheme.innerHTML = `${memoryGame.memoryDeck} Cards`;
    }
}


function aktivateButton() {
    getBtn();
    startBtn();
}


function getBtn() {
    let count = 0;
    let flag = document.querySelectorAll('.setting-element__img-flag--aktiv');
    flag.forEach((element) => {
        if (element) {
            count++;
        }
    })
    if (count == memoryGame.allCecked) {
        memoryGame.isChecked = true;
        saveLocalStorage();
    }
}


function startBtn() {
    if (memoryGame.isChecked) {
        document.getElementById('play-game')?.classList.remove('btn-start--disabled');
    }
}


function saveLocalStorage() {
    localStorage.setItem("memoryGame", JSON.stringify(memoryGame));
}