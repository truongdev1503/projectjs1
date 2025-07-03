var listProduct = document.querySelector('.listProduct');

var getListProduct = async  (start, end)  => {
    const respone = await fetch(`http://localhost:3000/products?_start=${start}&_limit=${end}`)
    return respone.json();
}

var renderItem= (data) => {
    var htmls = data.map( item => {
        return `
        <div class="box">
            <div class="title">${item.title}</div>
            <div class="price">${item.price}</div>
            <div class="rating">${item.rating}</div>
            <div class="thumbnail">
                <img src="${item.thumbnail}">
            </div>
            <input class ="quantity" type="number"></input>
            <button class = "cart" id = ${item.id} >Add to Cart</button>
        </div>`
    })
    listProduct.innerHTML = htmls.join("")
}

var creatNextPage = (arr) => {
        const pageUrl = window.location.href.split('?')[0]
    
    var pages = arr.map( (item,  index) =>{
        return `
            <a href = "${pageUrl}?page=${index+1}"> ${index+1} </a>
         `
    })
    const nextPage = document.querySelector('.nextPage')
    nextPage.innerHTML = pages.join('')
}

document.addEventListener('DOMContentLoaded', async() => {
    var pageNumber = window.location.href.split("page=")
    if(pageNumber[1]){
        var data = await getListProduct( parseInt(pageNumber[1] -1 )*9 ,9)
    }else{
         var data = await getListProduct(0,9)
    }
    renderItem(data)
       
    const totalProduct = await getListProduct(0, 10000);
    var arr = [...Array(Math.ceil(totalProduct.length / 9))]
    
    creatNextPage(arr)

    var carts = document.querySelectorAll('.cart')
   
    var obCart = JSON.parse(localStorage.getItem("cart"))|| []
    carts.forEach( item => {
        item.addEventListener("click", () => {
            const boxElement = item.parentElement.querySelector(".quantity")
            
            var tmp = {
                id: item.getAttribute('id'),
                quantity: +boxElement.value
            }
            var check = obCart.findIndex( item => {
                return item.id === tmp.id
            })
            if(obCart.length ===  0 || check === -1 ) {
                obCart.push(tmp)
            }else {
                obCart[check].quantity += (+tmp.quantity)
            }
            localStorage.setItem("cart", JSON.stringify(obCart))
        })
    })
    
      
})