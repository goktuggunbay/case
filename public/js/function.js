$(document).ready(function () {
  

  var cart = [];
 
  function jsonPull() {
    
   
      
    $.ajax({
      url: "js/x.json", 
      dataType: "json", 
      success: function (dataObj) {
       
        var products = dataObj.products; 
        var wrapper = $(".wrapper");        
        

        var productsData = dataObj.products[0];

        $.ajax({
          url: "js/orders.json",
          method: "GET",
          dataType: "json",
          success: function(orderObj) {
            var orders = orderObj.orders;
            var productListWrapper = $('.productListWrapper');
  
            for (var x in orders) {
              var order = orders[x];
              var saleId = Object.keys(order)[0];
              var products = order[saleId];
              var finalPrice = parseFloat(order.finalPriceValue); 
              var perOrderDiv = $('<div class="perOrder"></div>');
  
              for (var i = 0; i < products.length; i++) {
                var product = products[i];
                var productName = product.productName;
                var quantity = product.quantity;
  
             
                var productInfo = productsData[productName];
                if (productInfo) {
                  var unitPrice = parseFloat(productInfo.price); 
                  var totalPrice = unitPrice * parseInt(quantity); 
  
                  var productDiv = $(`
                    <div class="saleBox">
                      <div class="saleId"><span>#${saleId}</span></div>
                      <div class="productBoxOrder">
                        <div class="productImgOrder">
                          <img src="${productInfo.img}" alt="${productName}">
                        </div>
                        <div class="productInformationOrder">
                          <h2>Price per Unit</h2>
                          <p>${unitPrice} TL</p>
                          <h2>Quantity</h2>
                          <p>${quantity}</p>
                          <h2>Price</h2>
                          <p>${totalPrice} TL</p>
                        </div>
                      </div>
                    </div>
                  `);
  
                  perOrderDiv.append(productDiv);
                }
              }
  
              var discountApplied = order.isChecked === "true";
              var discount = discountApplied ? finalPrice * 0.2 : 0;
              var discountedPrice = finalPrice - discount;
  
              var orderPriceDiv = $(`
                <div class="orderPrice">
                  <div class="firstPriceOrder">
                    <h2>Before Discount </h2>
                    <h2>${totalPrice} TL</h2>
                  </div>
                  <div class="secondPriceOrder">
                    <h2>After Discount</h2>
                    <h2>${finalPrice} TL</h2>
                  </div>
                </div>
              `);
  
              perOrderDiv.append(orderPriceDiv);
              productListWrapper.append(perOrderDiv);
            }
          },
          error: function(xhr, textStatus, errorThrown) {
            console.error("Error fetching JSON:", errorThrown);
          }
        });
        
        
       
        function updateProductQuantity() {
          var $numberInput = $(this).siblings(".productNumber");
          var value = parseInt($numberInput.val());
      
          if ($(this).hasClass("minus") && !isNaN(value) && value > 0) {
            $numberInput.val(value - 1);
          } else if ($(this).hasClass("plus") && !isNaN(value)) {
            $numberInput.val(value + 1);
          }
        }
        const finalPriceElement = document.getElementById("finalPrice");
       
        $(".minus, .plus").on("click", updateProductQuantity);
            

      
        function updateFinalPrice() {
          let finalPrice = 0; 
          cart.forEach(item => {
            const productId = item.productId;
            const quantity = item.quantity;
            
          
            const product = products[0][productId];
            
            if (product) {
              
              const price = product.price;
              const totalPrice = price * quantity;

              console.log(`Product: ${productId}, Quantity: ${quantity}, Price: ${price}, Total Price: ${totalPrice}`);
        
         
              finalPrice += totalPrice;
              finalPriceValue=finalPrice;
              
            } else {
              console.log(`Product with ID ${productId} not found in the products list.`);
            }
          });
          const discountCheckbox = document.getElementById('checkx');
          if (discountCheckbox.checked) {
            const discount = finalPrice * 0.2; 
            finalPrice -= discount;
            finalPriceValue=finalPrice
            
          }
          const finalPriceElement = document.getElementById('fx');
          finalPriceElement.textContent = finalPrice;
         
          return  finalPriceValue;
        }
        const discountCheckbox = document.getElementById('checkx');
        discountCheckbox.addEventListener('change', updateFinalPrice);
      
      
        function addToCookie(){   
          var $parentCard = $(this).closest(".card");
          var productId = $(this).data("product-id");    
          var $numberInput = $parentCard.find(".productNumber");
          var quantity = parseInt($numberInput.val());
          if (quantity > 0){
            addToCart(productId, quantity);
          }
        }
        
          
        
          
        function addToCart(productId, quantity) {
          if (quantity > 0) {
           
            var productIndex = cart.findIndex(item => item.productId === productId);
            if (productIndex !== -1) {
              cart[productIndex].quantity += quantity;
              var productList = $('.productList');
              var updatedProduct = cart[productIndex];
              var columnToUpdate = productList.find(`[data-product-id="${productId}"]`);
        
     
              columnToUpdate.find('input[type="number"]').val(updatedProduct.quantity);
            } else {
              cart.push({ productId: productId, quantity: quantity });
              var productList = $('.productList');
              productList.append(`
                <div class="column" data-product-id="${productId}">
                  <div class="removeFromCart">
                    <a class="removeButton">Remove</a>
                  </div>
                  <div class="columnImg">
                    <img src="${products[0][productId].img}" alt="">
                  </div>
                  <div class="productInfo">
                    <h2>${productId}</h2>
                    <h2 class='perPrice'>${products[0][productId].price}</h2>
                  </div>
                  <div class="productUnit">
                   
                    <input type="number" value="${quantity}">
                  
                  </div>                    
                </div>
              `);
            }
          }
       
          $('.removeButton').click(function() {
            var productIdToRemove = $(this).closest('.column').data('product-id');
            var productIndexToRemove = cart.findIndex(item => item.productId === productIdToRemove);
            updateFinalPrice();
        
            if (productIndexToRemove !== -1) {
             
                cart.splice(productIndexToRemove, 1);
                updateFinalPrice();
            
                $(this).closest('.column').remove();
            }
        });
        }


        products.forEach(function (product) {
          for (var prodName in product) {
            var prodDetails = product[prodName];
            
            
            wrapper.append(`<div class="card">
            <div class="image">
              <div class="information">
                
<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184 184-82.39 184-184S349.61 64 248 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M220 220h32v116"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M208 340h88"/><path d="M248 130a26 26 0 1026 26 26 26 0 00-26-26z"/></svg>
                <h2 class="prodId">${prodName}</h2>
                
                <p>${prodDetails.description}</p>
              </div>
              <img src="${prodDetails.img}" alt="">
            </div>
            <div class="cardBottom">
              <div class="cardBottom-left">
                <div class="cardBottom-left-top">
                  <span>Size : </span>
                  <span>${prodDetails.size}</span>
                </div>
                <div class="cardBottom-left-bottom">
                  <div class="firstSection">
                    <button type="button" class="minus">
                    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M400 256H112"/></svg></button>
                    <input type="number" class="productNumber" value="0">
                    <button type="button" class="plus">
                    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288M400 256H112"/></svg></button>
                  </div>
                  <div class="secondSection">
                    <span>Fiyat</span>
                  </div>
                  <div class="thirdSection">
                    <span>${prodDetails.price}</span>
                    <span>TL</span>
                  </div>
                </div>
              </div>
              <div data-product-id="${prodName}" class="cardBottom-right">
                
<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><circle cx="176" cy="416" r="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="400" cy="416" r="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M48 80h64l48 272h256"/><path d="M160 288h249.44a8 8 0 007.85-6.43l28.8-144a8 8 0 00-7.85-9.57H128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
              </div>
            </div>
            </div>
            `);
          }


        }); 
        $(".cardBottom-right").on("click", addToCookie);
        $(".cardBottom-right").on("click", updateFinalPrice);
        
        $(".minus, .plus").off("click").on("click", updateProductQuantity);
      },
      error: function (xhr, status, error) {
     
        console.error("Error fetching JSON data:", error);
      },
    });
  }
  ///////////////

   
 


  function addToJson() {
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var idLength = 6;
    var randomId = "";

    for (var i = 0; i < idLength; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
       
    }
    
    var orders = [];
    
    var cartAsArray = cart.slice();

    cartAsArray.forEach(product => {
      const productForOrder = product.productId;
      const quantityForOrder = product.quantity;
  
      orders.push({ productName: productForOrder, quantity: quantityForOrder });
     
     
    });
   
    const isChecked = $("#checkx").is(":checked");
    
    $.ajax({
     

      
      type: "POST",
        url: "/save", 
        data: {[randomId]: orders,finalPriceValue , isChecked 
        }
        , 
        success: function(response) {
            alert(response);
        },
        error: function() {
            alert("Veri gönderilirken bir hata oluştu.");
        }
    });
  console.log(orders);
};

$('.cartSale').on('click', addToJson);


  
  jsonPull();
  
});