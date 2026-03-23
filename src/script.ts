import { eventNames } from "node:cluster";
import { ListInput} from "./interface";
import { memoryGame } from "./DB";


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
})


function setPreference(event:any) {
    let input = inputSingleListElement(event);
    changePicture(input);
    setSettingInDB(input);
    resetAllListElement(event);
    showSelection(event);
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


function setSettingInDB(input:ListInput) {
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
}


function showSelection(event: any) {
    let target = event.target as HTMLElement;
    let listElement = target.closest('.setting-element');
    let label = listElement?.querySelectorAll('.setting-element__input-field');
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