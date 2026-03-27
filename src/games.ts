

function openModal(event:any) {
    let getButton = event.target as HTMLElement;
    let overlay = getButton.closest('.overlay');
    let btn = getButton.closest('.btn-exit');
    if (btn) {
        let open = document.querySelector('.overlay') as HTMLElement;
        open.classList.add('fade-in');
        console.log('Button 1'); 
    } else if(overlay){
        console.log('overlay 2');
        let open = document.querySelector('.overlay') as HTMLElement;
        open.classList.remove('fade-in');
    }
}


document.addEventListener('click', (event) => {
    openModal(event);
    
})