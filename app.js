var $j = jQuery.noConflict();

$j(function() {
	if (typeof books !== 'undefined') {
		$j("#bookcount").text(books.length);
	}
});

function getBookCategories() {
	var result = [];
	$j("#categoryfilter input").each(function(index, element) {
		if (this.checked) {
			result.push(this.id.replace(/_/g, " "));
		}
	});
	return result;
}

var catsort = 1;

function searchBook() {
    var foundbooks = [];
	var categories = getBookCategories();
	catsort = $j("#catsort option:selected").val();
    var terms = $j("#search").val().split(" ");
	var count = books.length;
	
	for (var index = 0; index<count;index++) {
        var book = books[index];
		var found = true;
		
		if (categories.length > 0) {
			found = false;
			for (catindex=0; catindex < categories.length;catindex++) {
				var category = categories[catindex];
				var bookCategories = book.Categories || "";
				if (bookCategories.indexOf(category) != -1) {
					found = true;
					break;
				}
			}
		}
    

        if (found && terms.length > 0) {
            for (termindex=0; termindex<terms.length;termindex++) {
                var term = terms[termindex];
                if (!isBookMatch(book, term)) {
                    found = false;
                    break;
                }
            }
        }
		if (found) {
			foundbooks.push(book);
		}
	}	
	
	foundbooks.sort(compareBooks);
		
    var foundcount = foundbooks.length;	
    $j("#books-found").html( foundcount + " boeken gevonden");
	var sb = [];
    sb.push("<div class='book-cards'>");
    if (foundcount > 0) {
        
		for (var index = 0; index<foundcount;index++) {
			var book = foundbooks[index];
			var ga = book.GaNum || "";
			var uitgeleend =  "";
			if (book.LentById) {
				uitgeleend = "<span class='uitgeleend'>Uitgeleend</span>";
			}
            var gapart = ga  != "" ? " (GA " + book.GaNum + ")" : "";
				sb.push("<div class='book-card'><div class='book-author'>" + book.Author + "</div><div class='book-title'>" + book.Title + "</div><div class='book-number'>" + book.LibNum1 + gapart + " " + uitgeleend + "</div><div class='book-category'>" + (book.Categories || "")  + "</div></div>");
		}
	}
	else {
		sb.push("<div class='book-card'>Geen boeken gevonden op de zoekterm '" + term + "'</div>");
	}
       sb.push("</div>");
	$j("#grid").html(sb.join(""));
}

function isBookMatch(book, term) {
	var pattern = term.charAt(0) == '~' ? term.substring(1) : "\\b" + term + "\\b";
	var re = new RegExp(pattern, "i");
	if (book.Title != null && book.Title != "" && re.test(book.Title) || book.Author!= null && book.Author!= "" && re.test(book.Author) || book.Categories != null && book.Categories != "" && re.test(book.Categories)   ) {
		return true;
	}
	else {
		return false;
	}
}

function compareBooks(a, b) {
	if (catsort == "2") {
		return (a.LibNum1 || "").localeCompare(b.LibNum1 || "");	
	}
	else if (catsort == "3") {
		return (a.GaNum || "").localeCompare(b.GaNum || "");
	}
	else if (catsort == "4") {
		return (a.Categories || "").localeCompare(b.Categories || "");
	}
	else {
		var comparison = (a.Author || "").localeCompare(b.Author || "");
		if (comparison == 0) {
			return (a.Title || "").localeCompare(b.Title || "");
		}
		else {
			return comparison
		}
	}
}

jQuery( function ( $ ) {
	// Focus styles for menus when using keyboard navigation

	// Properly update the ARIA states on focus (keyboard) and mouse over events
	$( 'nav > ul' ).on( 'focus.wparia  mouseenter.wparia', '[aria-haspopup="true"]', function ( ev ) {
		$( ev.currentTarget ).attr( 'aria-expanded', true );
	} );

	// Properly update the ARIA states on blur (keyboard) and mouse out events
	$( 'nav > ul' ).on( 'blur.wparia  mouseleave.wparia', '[aria-haspopup="true"]', function ( ev ) {
		$( ev.currentTarget ).attr( 'aria-expanded', false );
	} );
} );


