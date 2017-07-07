jQuery(document).ready(function(){
    /* Product Zoom / Lightbox */
    if( jQuery('.catalog-product-view').length || jQuery('.review-product-list').length ){ jQuery('.image-zoom').featherlight(); }

    jQuery(window).resize(function(){
        if( jQuery(window).width() > 944 ) {
            if( jQuery('.mobile-nav').css('display') != 'none' ) {
                jQuery('.mobile-nav').animate({top:'-500px'}, 400, function(){
                    jQuery('.mobile-nav').css('display','none');
                });
            }
        }
    });

	/* Sticky Header */
    jQuery(window).scroll(function() {
        var fromTop = jQuery(window).scrollTop();
        jQuery('body').toggleClass('down', (fromTop > 20));
    });

    /* Mobile Nav */
    jQuery('.mobile-header .icon-NavMenuIcon').click(function(){
        if( jQuery('.mobile-nav').css('display') == 'none' ){
            jQuery('.mobile-nav').css({'top':'-500px', 'display':'block'}).animate({top: 60});
        } else {
            jQuery('.mobile-nav').animate({top:'-500px'}, 400, function(){
                jQuery('.mobile-nav').css('display','none');
            });
        }
    });

    /* Search Bar */
    jQuery('.header-actions .icon-search, .mobile-links .icon-search').click(function(){
        if( !jQuery(this).hasClass('active') ) {
            jQuery(this).addClass('active');
            jQuery('#search_mini_form').css({'top':'-100px', 'display':'block'}).animate({top:'0'});
            jQuery('#search_mini_form #search').focus();
        }
    });

    jQuery('.form-search .icon-close').click(function(){
        if( jQuery('.header-actions .icon-search').hasClass('active') || jQuery('.mobile-links .icon-search').hasClass('active') ) {
            jQuery('.header-actions .icon-search').removeClass('active');
            jQuery('.mobile-links .icon-search').removeClass('active');
            jQuery('#search_mini_form').animate({top:'-100px'}, 500, function(){ jQuery('#search_mini_form').css('display', 'none'); });
        }
    });

	/* Back to Top Button */
	var container = jQuery('.container');

	jQuery(window).scroll(function() {
        var fromTop = jQuery(window).scrollTop();
        var ww = jQuery(window).width();
        var buffer = 50;
        if( ww > 767 ) { buffer = 100; }

		jQuery('#back-top').toggleClass('visible', (fromTop > 100));
        jQuery('#back-top').toggleClass('bottom', (fromTop + jQuery(window).height()) > (jQuery(document).height() - buffer));
        jQuery('body > div > iframe').toggleClass('bottom', (fromTop + jQuery(window).height()) > (jQuery(document).height() - buffer));
	});

    var maxHeight = 0;
    if( jQuery(window).width() >= 944 ) {
        maxHeight = jQuery(window).height() - 94;
    } else {
        maxHeight = jQuery(window).height() - 74;
    }
    jQuery('div#search_autocomplete').css('max-height', maxHeight);
    

    jQuery(window).resize(function(){
        var ww = jQuery(window).width();
        var wh = jQuery(window).height();
        var buffer = 50;
        if( ww > 767 ) { buffer = 100; }

        if( (jQuery(window).scrollTop() + jQuery(window).height()) > (jQuery(document).height() - buffer) ) {
            jQuery('#back-top').addClass('bottom');
            jQuery('body > div > iframe').addClass('bottom');
        } else {
            jQuery('#back-top').removeClass('bottom');
            jQuery('body > div > iframe').removeClass('bottom');
        }

        var mh = 0;
        if( wh >= 944 ) {
            mh = wh - 94;
        } else {
            mh = wh - 74;
        }
        jQuery('div#search_autocomplete').css('max-height', mh);
    });

	jQuery('#back-top').click(function(){
		jQuery('body,html').animate({ scrollTop: 0 }, 100);
		return false;
	});
});