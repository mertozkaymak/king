var distributors;

$(function() {

	if(window.location.href.indexOf('sayfa/yetkili-servisler') > -1) {

		/**editing*/
			$("#main #breadcrumbs").after(`<div class="container" id="content"></div>`);
			$("#main > .container").each((index, elem) => {

				if(typeof $(elem).attr("id") === "undefined" || $(elem).attr("id") !== "content"){
					$(elem).addClass("d-none");
				}

			});
		/**editing*/

		$("#content").load("***/index.php?domain=" + window.location.origin, function() {
				
			initMap();
			for(var key in distributors) {
				$("g[data-iladi='" + key + "']").addClass("available");
			}
			
		});
	}

	$(document).on("change", "#province", function() {
		$("g").each(function() {
			$(this).removeClass("selected");
		});
		$("g[data-iladi='" + $(this).val() + "']").addClass("selected");
		$("#county").attr("disabled", false);
		$("#county option").each(function(index) {
			if(index != 0) {
				$(this).remove();
			}
			else {
				$(this).text("Tüm ilçeler").attr("disabled", false);
			}
		});
		$("#county").val("");
		for(var key in distributors[$(this).val()]) {
			$("#county").append('<option value="' + key + '">' + key + '</option>');
		}
		$("#province-heading").removeClass("d-none");
		$("#province-name").text($(this).val());
		showDists();
	});
	$(document).on("change", "#county", function() {
		showDists();
	});
});

function showDists() {
	let value = $("#province option:selected").val();
	let value2 = $("#county option:selected").val();
	console.log(value, value2);
	if(value2 == "") {
		$("#county-name").text("");
		$(".dists").each(function() {
			if($(this).attr("data-il") == value) {
				$(this).removeClass("d-none");
			}
			else {
				$(this).addClass("d-none");
			}
		});
	}
	else {
		$("#county-name").text(" (" + value2 + ")");
		$(".dists").each(function() {
			if($(this).attr("data-il") == value && $(this).attr("data-ilce") == value2) {
				$(this).removeClass("d-none");
			}
			else {
				$(this).addClass("d-none");
			}
		});
	}
	
}

function initMap() {
  const element = document.querySelector('#svg-turkiye-haritasi');
  const info = document.querySelector('.il-isimleri');

  element.addEventListener(
    'mouseover',
    function (event) {
      if (event.target.tagName === 'path' && event.target.parentNode.id !== 'guney-kibris') {
        info.innerHTML = [
          '<div>',
          event.target.parentNode.getAttribute('data-iladi'),
          '</div>'
        ].join('');
      }
    }
  );

  element.addEventListener(
    'mousemove',
    function (event) {
		/* editing
      info.style.top = parseInt(event.pageY) - parseInt($("#content").offset().top) + 25 + 'px';
      info.style.left = parseInt(event.pageX) - parseInt($("#content").offset().left) + 'px';
	  */
	  info.style.top = event.pageY + 25 + 'px';
      info.style.left = event.pageX + 'px';
    }
  );

  element.addEventListener(
    'mouseout',
    function (event) {
      info.innerHTML = '';
    }
  );

  element.addEventListener(
    'click',
    function (event) {
      if (event.target.tagName === 'path') {
        const parent = event.target.parentNode;
        const id = parent.getAttribute('data-iladi');
		if(!$(parent).hasClass("available")) {
			return;
		}
		$("g").each(function() {
			$(this).removeClass("selected");
		});
		$("g[data-iladi='" + id + "']").addClass("selected");
		$("#province").val(id).trigger("change");
      }
    }
  );
}
