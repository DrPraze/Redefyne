const suggestions = document.querySelector('.suggest-list');
const userName = document.querySelector("#keyword"); 

const userArr = [];

function getSuggestions(words){
    try {
        const data = words;
        if(data){
            suggestions.innerHTML = ""
        }
        data.forEach(l => {
            const li = document.createElement('li');
            userArr.push(li);
            li.insertAdjacentHTML('afterbegin',
                `
                <div class="word">
                <a href="/search/${l}">${l}</a>
                </div>
                `
            )
            suggestions.appendChild(li);
        });
            
    } catch (error) {
        console.log(error);
    }
}

userName.addEventListener('input', (e) => {
    const val = e.target.value;
    var items = document.getElementById("items");

    if (val==""){
        items.style.display = "none";
    }else{
        items.style.display = "block";
        userArr.filter((curElem) => {    
            curElem.innerText.toLowerCase().includes(val.toLowerCase()) ?
            curElem.classList.remove('hide') :
            curElem.classList.add('hide')
        });
    }
});
