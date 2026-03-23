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
    //window.location.href = 'game.html';
    console.log(memoryGame);
}


document.addEventListener("click", (event) => {
    setPreference(event);
    aktivateButton();
})


document.addEventListener("DOMContentLoaded", (event) => {
    console.log(event);
    getFromLocalStorage();
    updateSettings();
})






function updateSettings() {
    let img = document.querySelector('.img-themse') as HTMLImageElement;
    img.src = `assets/img/settings/themes_example_${memoryGame.theme}.svg`;
    updateElementTheme();
    updateElementPlayer();
    updateElementCards();
}


function updateElementTheme() {
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
        updateFooterInformation(input.name);
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


function updateFooterInformation(input: string | undefined) {
    if (input == "theme") {
        let textTheme = document.getElementById('fTheme') as HTMLElement;
        textTheme.innerHTML = "";
        textTheme.innerHTML = `Theme: ${memoryGame.theme}`;
    } else if (input == "player") {
        let textTheme = document.getElementById('fPlayer') as HTMLElement;
        textTheme.innerHTML = "";
        textTheme.innerHTML = `${memoryGame.choosePlayer}`;
    } else if (input == "boardSize") {
        let textTheme = document.getElementById('fSize') as HTMLElement;
        textTheme.innerHTML = "";
        textTheme.innerHTML = `${memoryGame.memoryDeck} Cards`;
    }
}


function aktivateButton() {
    let isChecked = 0;
    let flag = document.querySelectorAll('.setting-element__img-flag--aktiv');
    flag.forEach((element) => {
        if (element) {
            isChecked++;
        }
    })
    if (isChecked == memoryGame.allCecked) {
        document.getElementById('play-game')?.classList.remove('btn-start--disabled');
    }
}


function saveLocalStorage() {
    localStorage.setItem("memoryGame", JSON.stringify(memoryGame));
}