/* Переключение языка */

document.querySelector('.lang__main').addEventListener('click', function() {
    let menu = document.querySelector('.lang__menu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
});

document.querySelectorAll('.lang__menu a').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        let lang = this.getAttribute('data__lang');
        document.querySelector('.lang__main').textContent = this.textContent;
        document.querySelector('.lang__menu').style.display = 'none';
    });
});
