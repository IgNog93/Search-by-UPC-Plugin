jQuery(document).ready( function($) {

    var discountCA = 0.8;
    var discountCB = 0.7;
    var discountCC = 0.6;
	var discountCD = 0.5;

	$("#search-button").click(function (){

		$("#upc_form").css('display', 'none');
		$("#search_area").css('margin', '0');
		
		var upctyped = $("#upcfield").val();
	
		var data = {
			action: 'test_response',
			post_var: upctyped,
		};
		// the_ajax_script.ajaxurl is a variable that will contain the url to the ajax processing file
		$.post(the_ajax_script.ajaxurl, data, function(json) {
	
		var result = JSON.parse(json);
		console.log(result);
	
		$.ajax({
			url: 'https://api.exchangeratesapi.io/latest?base=USD&symbols=CAD',
			success: function(json) {
				$("#form-results").css('display', 'block');
				console.log(json);
				var ExchangeUSDtoCAD = json.rates.CAD;
				
		// Creating images thru URL from JSON 
		
		var i = 0;
	
		$.each(result.items[0].images, function(){
			if (result.items[0].images[i] && i < 3) {
				var imgurl = result.items[0].images[i];
				var img = $('<img />', { 
					src: imgurl,
					alt: 'Image is not available'
				});
				$('#image'+i).append(img);  
			}
			i++;
		});
	
	// Putting images URL in an array
	
		var arrayimg = []
	
		for (i = 0; i < 3; i++ ) {
			if (result.items[0]){
				var image = result.items[0].images;
				arrayimg.push( image[i] );
			}
		}
	
		$(".img-container").on('change', function () {
			if ($("#chk-img1:checked").length){
				$("#photourl").val(arrayimg[0]);
				window.globalimage_url = arrayimg[0];
			}
			else if ($("#chk-img2:checked").length){
				$("#photourl").val(arrayimg[1]);
				window.globalimage_url = arrayimg[1];
			} 
			else if ($("#chk-img3:checked").length){
				$("#photourl").val(arrayimg[2]);
				window.globalimage_url = arrayimg[2];
			}
		});
	
	
	// Putting stores in an array
		
		var arraystore = []
		
		for (var j = 0; j < 16; j++ ) {
			if (result.items[0].offers[j]){
				var store = result.items[0].offers;
				arraystore.push( store[j]['merchant'] );
			}
		} 
		
	// Appending results from JSON
	
		var arraytitle = []
		
		var maintitle = result.items[0].title;
		$("#title-comp").append('<label class="option container container-title"><input type="checkbox" class="chk-title" id="chk-title-main"><span class="checkmark"></span><div class="option-text"><p id="maintitle">'+maintitle+'</p></div></label>'); 
		maintitle = result.items[0]
		arraytitle.push( maintitle['title'] );        
				
		var k = 0
	
		$.each(result.items[0].offers, function(){
			if (k < 5) {
				$("#title-comp").append('<label class="option container container-title"><input type="checkbox" class="chk-title" id="chk-title'+k+'"><span class="checkmark"></span><div class="option-text"><p id="title'+k+'">'+result.items[0].offers[k].title+'</p></div></label>');
			}
			k++;
		});
	
	// Putting titles in an array
	
		for (var l = 0; l < 5; l++ ) {
			if (result.items[0].offers[l]){
				var title = result.items[0].offers;
				arraytitle.push( title[l]['title'] );
			}
		}
	
		$(".container-title").on('change', function () {
			if ($("#chk-title-main:checked").length){
				$("#title").val(arraytitle[0]);
				window.globaltitle = arraytitle[0];
			}
			else if ($("#chk-title0:checked").length){
				$("#title").val(arraytitle[1]);
				window.globaltitle = arraytitle[1];
			} 
			else if ($("#chk-title1:checked").length){
				$("#title").val(arraytitle[2]);
				window.globaltitle = arraytitle[2];
			}
			else if ($("#chk-title2:checked").length){
				$("#title").val(arraytitle[3]);
				window.globaltitle = arraytitle[3];
			}
			else if ($("#chk-title3:checked").length){
				$("#title").val(arraytitle[4]);
				window.globaltitle = arraytitle[4];
			}
			else if ($("#chk-title4:checked").length){
				$("#title").val(arraytitle[5]);
				window.globaltitle = arraytitle[5];
			}
		})
	
		// Appending description from JSON
	
		var descr0 = result.items[0].description;
		$("#descr0").val(descr0);
		$("#description").val(descr0);
		window.globaldescription = descr0;
	
	
		// Putting currency & prices values in an array
	
		var arraycurrency = [];
		var arrayprice = [];
		var priceconverted = [];
	
		for (var f = 0; f < 16; f++ ) {
			if (result.items[0].offers[f]){
			var currency = result.items[0].offers;    
			arraycurrency.push( currency[f]['currency'] );
	
			var price = result.items[0].offers;
			arrayprice.push( price[f]['price'] );
			}
		}
		
		var m = 0
		
		$.each(result.items[0].offers, function(){
			if (m < 16 && arraycurrency[m] == "CAD"){
				$("#price-comp").append('<label class="option container container-store container-price grid-item'+m+'"><input type="checkbox" class="chk-price" id="chk-price'+m+'"><span class="checkmark"></span><div class="option-text"><p class="store" id="store'+m+'">'+result.items[0].offers[m].merchant+'</p><p class="prices" id="price'+m+'" type="text">'+ (Math.round(arrayprice[m]) - 0.01) +'<span id="currency"'+m+'>'+result.items[0].offers[m].currency+'</span></p></div></label>')
				priceconverted.push( arrayprice[m] );
			}
			else if (arraycurrency[m] === ""){
				$("#price-comp").append('<label class="option container container-store container-price grid-item'+m+'"><input type="checkbox" class="chk-price" id="chk-price'+m+'"><span class="checkmark"></span><div class="option-text"><p class="store" id="store'+m+'">'+result.items[0].offers[m].merchant+'</p><p class="prices" id="price'+m+'" type="text">'+(Math.round((arrayprice[m]*ExchangeUSDtoCAD)) - 0.01).toFixed(2)+'<span id="currency"'+m+'>CAD (converted)</span></p></div></label>')
				priceconverted.push( arrayprice[m] * ExchangeUSDtoCAD );  
			}
			m++;
		});
	
	// Appending value inserted UPC
	
		var upcTyped = $('#upcfield').val();
	
		$("#upc-field").append(upcTyped);
		$("#upc").val(upcTyped);
		window.globalupc = upcTyped;
	
	// Function to check only one option
				
		$('input.chk-img').on('change', function() {
			$('input.chk-img').not(this).prop('checked', false);
		});
	
		$('input.chk-price').on('change', function() {
			$('input.chk-price').not(this).prop('checked', false);
		});
	
		$('input.chk-cond').on('change', function() {
			$('input.chk-cond').not(this).prop('checked', false);  
		});
	
		$('input.chk-title').on('change', function() {
			$('input.chk-title').not(this).prop('checked', false);
		});
	
		$('input.chk-title').on('change', function() {
			$('input.chk-title').not(this).prop('checked', false);
		});
	
	// Appending condition to UPC & Declaring discounts
	
		$(".chk-price").on('change', function(){
			$("#final-price-field").empty();
			$(".chk-cond").prop('checked', false);
		});
	
		$(".chk-cond").on('change', function(){
			$("#final-price-field").empty();
			
			var cond = ["CA","CB","CC","CD"];
		
			if($("#ca-cond:checked").length){
				$("#final-price-field").empty();
				$("#condition").val(cond[0]);
				var discount = discountCA;
				window.prod_cond = cond[0];
			}
			else if($("#cb-cond:checked").length){
				$("#final-price-field").empty();
				$("#condition").val(cond[1]);
				discount = discountCB;
				window.prod_cond = cond[1];
			}
			else if($("#cc-cond:checked").length){
				$("#final-price-field").empty();
				$("#condition").val(cond[2]);
				discount = discountCC;
				window.prod_cond = cond[2];
			}
			else if($("#cd-cond:checked").length){
				$("#final-price-field").empty();
				$("#condition").val(cond[3]);
				discount = discountCD;
				window.prod_cond = cond[3];
			} 
			else {
				$("#final-price-field").empty();
			}
	
			// Conditionals to calculate final price
			
			if($("#chk-price0:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[0]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[0]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[0]);
				window.globalstore = arraystore[0];
				window.globalprice = ((Math.round(priceconverted[0]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[0]).toFixed(2)) - 0.01 );
			} 
			if($("#chk-price1:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[1]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[1]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[1]);
				window.globalstore = arraystore[1];
				window.globalprice = ((Math.round(priceconverted[1]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[1]).toFixed(2)) - 0.01 );
			}
			if($("#chk-price2:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[2]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[2]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[2]);
				window.globalstore = arraystore[2];
				window.globalprice = ((Math.round(priceconverted[2]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[2]).toFixed(2)) - 0.01 );
			} 
			if($("#chk-price3:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[3]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[3]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[3]);
				window.globalstore = arraystore[3];
				window.globalprice = ((Math.round(priceconverted[3]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[3]).toFixed(2)) - 0.01 );
			} 
			if($("#chk-price4:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[4]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[4]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[4]);
				window.globalstore = arraystore[4];
				window.globalprice = ((Math.round(priceconverted[4]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[4]).toFixed(2)) - 0.01 );
			} 
			if($("#chk-price5:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[5]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[5]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[5]);
				window.globalstore = arraystore[5];
				window.globalprice = ((Math.round(priceconverted[5]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[5]).toFixed(2)) - 0.01 );
			} 
			
			if($("#chk-price6:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[6]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[6]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[6]);
				window.globalstore = arraystore[6];
				window.globalprice = ((Math.round(priceconverted[6]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[6]).toFixed(2)) - 0.01 );
			} 
			
			if($("#chk-price7:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[7]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[7]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[7]);
				window.globalstore = arraystore[7];
				window.globalprice = ((Math.round(priceconverted[7]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[7]).toFixed(2)) - 0.01 );
			} 
			
			if($("#chk-price8:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[8]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[8]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[8]);
				window.globalstore = arraystore[8];
				window.globalprice = ((Math.round(priceconverted[8]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[8]).toFixed(2)) - 0.01 );
			} 
			
			if($("#chk-price9:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[9]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[9]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[9]);
				window.globalstore = arraystore[9];
				window.globalprice = ((Math.round(priceconverted[9]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[9]).toFixed(2)) - 0.01 );
			} 
					
			if($("#chk-price10:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[10]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[10]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[10]);
				window.globalstore = arraystore[10];
				window.globalprice = ((Math.round(priceconverted[10]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[10]).toFixed(2)) - 0.01 );
			} 
					
			if($("#chk-price11:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[11]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[11]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[11]);
				window.globalstore = arraystore[11];
				window.globalprice = ((Math.round(priceconverted[11]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[11]).toFixed(2)) - 0.01 );
			} 
					
			if($("#chk-price12:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[12]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[12]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[12]);
				window.globalprice = ((Math.round(priceconverted[12]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[12]).toFixed(2)) - 0.01 );
			} 
					
			if($("#chk-price13:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[13]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[13]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[13]);
				window.globalstore = arraystore[13];
				window.globalprice = ((Math.round(priceconverted[13]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[13]).toFixed(2)) - 0.01 );
			} 
					
			if($("#chk-price14:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[14]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[14]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[14]);
				window.globalstore = arraystore[14];
				window.globalprice = ((Math.round(priceconverted[14]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[14]).toFixed(2)) - 0.01 );
			} 
					
			if($("#chk-price15:checked").length){
				$("#final-price-field").empty();
				$("#reg-price-field").empty();
				$("#final-price-field").append((Math.round(priceconverted[15]*discount).toFixed(2)) - 0.01 +' CAD');
				$("#reg-price-field").append((Math.round(priceconverted[15]).toFixed(2)) - 0.01 +' CAD');
				$("#store").val(arraystore[15]);
				window.globalstore = arraystore[15];
				window.globalprice = ((Math.round(priceconverted[15]*discount).toFixed(2)) - 0.01);
				window.globalregprice = ((Math.round(priceconverted[15]).toFixed(2)) - 0.01 );
			} 
			
			// if($("#chk-price:checked").length){
			//     // $("#final-price-field").append((Math.round(priceconverted*discount).toFixed(2)) - 0.01 +' CAD');
			
			});
		}});
	});
	
	return false;
	
	});

	$('#upcfield').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('#search-button').click();//Trigger search button click event
			
			e.preventDefault();
		}
    });
});