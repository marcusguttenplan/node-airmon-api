var Index = {
  init: function() {
    Index.centerContent();
    Index.matchNetworkList();

    $(window).resize(Index.centerContent());

    // Events
    $('.action-next-step').on('click', function() {
      Index.nextStep($(this));
    });

    $('.input-going').on('keyup', function(e) {
      if ($(this).val().length < 30) {
        $('.label-going .text').text($(this).val());
      }

      if (e.which === 13) {
        window.location.href = './live';
      }
      
    });
  },

  nextStep: function(el) {
    var parent = $(el).parents('.subview'),
        current = Number(parent.attr('data-step')),
        next = current + 1;
        
    parent.fadeOut(400, function() {
      if (current === 2) {
        $('.subview[data-step="' + next + '"]').fadeIn(400, function() {

          var time = 800;

          $('.console-steps li').each(function(index, item) {
            if (index > 0) {
              setTimeout(function() {
                $(item).show();

                // if (index === 3) {
                //   $('.bg-map').fadeIn();
                // }
                // Last item
                if (index === $('.console-steps li').length-1) {
                  $('.subview[data-step="' + next + '"]').find('.action-next-step').fadeIn();
                }
              }, time);
              time += 800;
            }
            
          });
        });
      } else if (current === 3) {
        $('.bg').fadeIn().addClass('bg--clear');
        setTimeout(function() {
          $('.subview[data-step="' + next + '"]').fadeIn(400);
          $('.bg').removeClass('bg--clear').fadeOut();
        }, 5000)
      } else {
        $('.subview[data-step="' + next + '"]').fadeIn(400);
      }
      
    })
  },

  centerContent: function() {
    console.log('Center content');
    var el = $('.subview'),
        height = el.height(),
        width = el.width();

    $(el).each(function(index, element) {
      $(element).css({
        'position': 'absolute',
        'margin-top': -$(this).height() / 2,
        'top': '50%',
        'margin-left': -$(this).width() / 2,
        'left': '50%'
      });
    });
    
  },

  matchNetworkList: function() {
    var el = $('.network-match-list'),
        whitelist = el.find('.wifi-mine'),
        match = el.find('.wifi-match');

    $(whitelist).find('li').each(function(index, el) {
      var text = $(el).text();

      $(match).find('li').each(function(index, innerEl) {
        if ($(innerEl).text() === text) {
          $(el).addClass('match');
          $(innerEl).addClass('match');
        }
      });

    });
  }

  // eventWhere: function() {

  //   $('.subview-index').fadeOut(400);
  //   $('.bg').addClass('bg--clear');
  //   // $('.bg').animate({
  //   //   opacity: .7
  //   // }, 600);

  //   setTimeout(function() {
  //     Index.showNext();
  //   }, 5000)
  // },

  // showNext: function() {
  //   // $('.bg').animate({
  //   //   opacity: .1
  //   // }, 600);
  //   $('.bg').removeClass('bg--clear');

  //   $('.subview-where').fadeIn(400);
  // },


  // eventGoing: function() {
  //   $('.subview-where').fadeOut(400, function() {
  //     $('.subview-who').fadeIn(function() {
  //     });
  //   });

  //   $('.bg').animate({
  //     opacity: 0
  //   }, 400);

    
  // }

  // eventWho: function() {
  //   $('.subview-who').fadeOut(400, function() {
  //     $('.subview-going').fadeIn(function() {
  //       $('.input-going').focus();

  //       $(window).on('click', function() {
  //         $('.input-going').focus();
  //       })
  //     });
  //   });

  //   $('.bg').animate({
  //     opacity: 0
  //   }, 400);

    
  // }
};

$(document).ready(Index.init);