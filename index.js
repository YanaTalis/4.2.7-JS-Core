let dbnce = debounce(getRepo, 1000);
let resultRepos = [];


function form() {
    return `
        <form id="formId" class="form">
            <input type="text" id="inputId"/>
        </form>
    `

}

function createInnerBlock(className) {
    return `<div class=${className}></div>`

}

function createAutocompleteItem(repository, index) {
    return `
        <button class="button-autocomplete" data-index=${index}>${repository}</button>
    `

}

function createResultItem(repos) {
    return `
        <div class="result-item">
            <div>Name: ${repos.name}</div>
            <div>Owner: ${repos.owner.login}</div>
            <div>Stars: ${repos.stargazers_count}</div>
            <button class="close-button"></button>
        </div>
    `

}

async function getRepo(inputValue) {
    if (inputValue.trim()) {
        let response = await fetch(`https://api.github.com/search/repositories?q=${inputValue}&per_page=5`);
        if (response.ok) {
            let parseJsonToString = await response.json();
            resultRepos = [...parseJsonToString.items]
            renderAutocompleteItems(resultRepos);
            console.log(resultRepos);
        }
    }
}

function renderAutocompleteItems(resultRepos) {
    let autocompleteBlock = document.querySelector('.autocomplete');
    resultRepos.forEach((element, index) => {
        autocompleteBlock.insertAdjacentHTML("beforeend", createAutocompleteItem(element.name, index));
    });
}

function debounce(originalFn, timeoutMs) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => originalFn(...args), timeoutMs);
    };

}

function clearAutocomplete() {
    document.querySelector('.autocomplete').innerHTML = '';
}

function clearInput() {
    document.querySelector('#inputId').value = '';
}

let wrapper = document.querySelector('.wrapper');

wrapper.insertAdjacentHTML('afterbegin', `${form()}
        ${createInnerBlock('autocomplete')}
        ${createInnerBlock('result-block')}`);

wrapper.addEventListener('input', function (event) {
    if (event.target.id === 'inputId') {
        clearAutocomplete();
        dbnce(event.target.value);
    }

});

wrapper.addEventListener('click', function (event) {
    if (event.target.className === 'close-button') {
        event.target.parentNode.remove();
    }

    if (event.target.className === 'button-autocomplete') {
        let resultItem = createResultItem(resultRepos[event.target.dataset.index]);
        document.querySelector('.result-block').insertAdjacentHTML("beforeend", resultItem);
        clearAutocomplete();
        clearInput();
    }
})