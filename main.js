var jsonTable, catalog, inVisElements = [], items = [], category, inputAgainst, inputUntil;
function loadDataAPI(){
    let xhr = new XMLHttpRequest();
    let xhrSellers = new XMLHttpRequest();
    var sellers;
    inputAgainst = document.getElementsByClassName("price_input")[0];
    inputUntil = document.getElementsByClassName("price_input")[1];

    catalog = document.getElementById("catalog");

    xhrSellers.open("GET", "http://avito.dump.academy/sellers");
    xhr.open("GET", "http://avito.dump.academy/products/");
    xhrSellers.send();
    xhr.send();

    xhrSellers.onreadystatechange = function(){
        if(xhrSellers.readyState === 4){
            if (xhrSellers.status === 200){
                sellers = JSON.parse(xhrSellers.responseText);
            }
        }
    }

    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4){
            if (xhr.status === 200){
                jsonTable = JSON.parse(xhr.responseText);
                document.getElementById("sortPrice_btn").textContent = "Показать " + jsonTable.data.length + " объявлений";
                for(let i = 0; i < jsonTable.data.length; i++){
                    var item = document.createElement("div");
                    item.className = "item";
                    catalog.appendChild(item);
                    var item_header = document.createElement("header");
                    item_header.className = "item_header";
                    item.appendChild(item_header);
                    var item_image = document.createElement("a");
                    item_image.className = "item_image";
                    item_image.style.backgroundImage = "url(https:" + jsonTable.data[i].pictures[0];
                    item_image.href = "";
                    item_header.appendChild(item_image);
                    var favourites = document.createElement("div");
                    favourites.className = "favourites";
                    favourites.onclick = onclickFavourites;
                    item_header.appendChild(favourites);
                    var image_count = document.createElement("a");
                    image_count.className = "image_count";
                    image_count.textContent = jsonTable.data[i].pictures.length;
                    image_count.href = item_image.href;
                    item_header.appendChild(image_count);
                    var item_content = document.createElement("div");
                    item_content.className = "item_content";
                    item.appendChild(item_content);
                    var item_content_header = document.createElement("a");
                    item_content_header.className = "item_content_header";
                    item_content_header.textContent = jsonTable.data[i].title;
                    item_content.appendChild(item_content_header);
                    item_content.href = item_image.href;
                    var item_price = document.createElement("div");
                    item_price.className = "item_price";
                    if(jsonTable.data[i].price != undefined){
                        item_price.textContent = jsonTable.data[i].price + "";
                        for(let j = item_price.textContent.length; j > 0; j -= 3){
                            item_price.textContent = item_price.textContent.substring(0, j) + " " + item_price.textContent.substring(j);
                        }
                        item_price.textContent += " ₽";
                    }
                    else{
                        item_price.textContent = "Цена не указана";
                    }
                    item_content.appendChild(item_price);
                    var item_elem = document.createElement("div");
                    item_elem.className = "item_elem";
                    let indexSeller = +jsonTable.data[i].relationships.seller;
                    item_elem.textContent = sellers.data[indexSeller].name;
                    item_content.appendChild(item_elem);
                    var item_rating = document.createElement("div");
                    item_rating.classList.add("item_elem");
                    item_rating.classList.add("item_rating");
                    item_rating.textContent = "Рейтинг: " + sellers.data[indexSeller].rating;
                    item_content.appendChild(item_rating);
                }
            }
        }
    }
    items = document.getElementsByClassName("item");
}

function onclickFavourites(){

}

function onclickSortPriceBtn(){
    for (let i = 0; i < items.length; i++){
        items[i].style.display = "block";
    }
    for (let i = 0; i < inVisElements.length; i++){
        inVisElements[i].style.display = "none";
    }
}

function onkeypressInput(){
    let numOperation = undefined;
    inVisElements = [];
    console.log(inputAgainst.value)
    if(inputAgainst.value != ""){
        if(inputUntil.value != ""){
            numOperation = 0;
        }
        else{
            numOperation = 1;
        }
    }
    else{
        if(inputUntil.value != ""){
            numOperation = 2;
        }
        else{
            numOperation = 3;
        }
    }
    if(inputAgainst.value < inputUntil.value || inputUntil.value =="")
    if(numOperation != 3 ){
        for(let i = 0; i < items.length; i++){
            switch (numOperation) {
                case 0:
                    if(jsonTable.data[i].price < inputAgainst.value || jsonTable.data[i].price > inputUntil.value || jsonTable.data[i].price == undefined){
                        inVisElements.push(items[i]);
                    }
                    break;
                case 1:
                    if(jsonTable.data[i].price < inputAgainst.value || jsonTable.data[i].price == undefined){
                        inVisElements.push(items[i]);
                    }
                    break;
                case 2:
                    if(jsonTable.data[i].price > inputUntil.value || jsonTable.data[i].price == undefined){
                        inVisElements.push(items[i]);
                    }
                    break;
                default:

            }
        }
    }

    console.log(inVisElements);

    document.getElementById("sortPrice_btn").textContent = "Показать " + (jsonTable.data.length - inVisElements.length) + " объявлений";

}

function onchangeInput(){
    if(inputUntil.value < inputAgainst.value && inputUntil.value != ""){
        let temp = inputUntil.value;
        inputUntil.value = inputAgainst.value;
        inputAgainst.value = temp;
    }
    onkeypressInput();
}

window.onload = loadDataAPI;




