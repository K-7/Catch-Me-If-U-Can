jQuery(function() {

	$(document).bind('selectstart dragstart', function(evt)
    	{ evt.preventDefault(); return false; });

    var count_down_timer;
            
    $(function(){
      var viewPortWidth = $(window).width();
      var height = $("#title").height() + $("#box").height();
    
      if (viewPortWidth > 1000) 
        {
            $('body').css('font-size','20px')
            $('.pic').css('width','128px'); //START BUTTON img
            $('.pic').css('height','128px');
            $('.logo').css('width','400px'); //LOGO img
            $('.logo').css('height','100px');
            $('.move img').css('width','80px') //CRAB img
            $('.move img').css('height','80px')
            height = height + 10;
            var h = $(window).height() - parseInt(height, 10); //set content height dynamically
            $("#play_content").css("height",h);

            $('#launch_content div').css("margin-left","25%"); //LAUNCH page text content
        }
      else if (viewPortWidth > 700) 
        {
            $('body').css('font-size','20px')
            $('.pic').css('width','100px');
            $('.pic').css('height','100px');
            $('.logo').css('width','305px');
            $('.logo').css('height','120px');
            $('.move img').css('width','40px')
            $('.move img').css('height','40px')
            height = height + 10;
            var h = $(window).height() - height; //set content height dynamically
            $("#play_content").css("height",h)
            $('#launch_content div').css("margin-left","15%");
        }
      else 
        {
            $('body').css('font-size','14px')
            $('.pic').css('width','100px');
            $('.pic').css('height','100px');
            $('.logo').css('width','205px');
            $('.logo').css('height','80px');
            $('.move img').css('width','35x')
            $('.move img').css('height','35px')
            var h = $(window).height() - height; //set content height dynamically
            $("#play_content").css("height",h)
            $('#launch_content div').css("margin-left","0");
        }

    });

  
    function makeNewPosition(){
        
        // Get viewport dimensions (remove the dimension of the div)
        var h = $("#play_content").height() - ($(".move img").height()/2);          //(Math.random() * 100);
        var w = $("#play_content").width() - ($(".move img").width()/2);           //(Math.random() * 100));

        var nh = Math.floor(Math.random() * h);
        var nw = Math.floor(Math.random() * w);
        if(nw<1)
            {nw = Math.floor($(".move img").width()/1.5);}
        else if(nw >= $("#play_content").width())
            {nw = Math.floor($("#play_content").width() - $(".move img").width());}

        if(nh<1)
            {nh = Math.floor($(".move img").width()/1.5);}
        else if(nh >= $("#play_content").height())
            {nh = Math.floor($("#play_content").height() - $(".move img").height());}
        
        return [nh,nw];        
    }


    function animateDiv(){
        
        // var oldq = $('.move').offset();
        $("#play_content").animate( {backgroundPositionX: "-=1900px"} ,9000,'linear');

        var newq = makeNewPosition();
        $('.crab1').animate({ top: newq[0], left: newq[1] },400, function(){
                   
        });

        var newq = makeNewPosition();
        $('.crab2').animate({ top: newq[0], left: newq[1] },500, function(){
            animateDiv();        
        });
   
    };
	
    $("#start_btn").click(function(){
        $.mobile.changePage("#play");
        location.reload();
        
    });

    $("#launch").on("pagebeforeshow",function(event, ui) {
        halt();
    })

    $("#play").on("pagebeforeshow",function(event, ui) {
        $("#min").text("1")
        $("#sec").text("0")
        $('#move1').addClass('crab1');
        $('#move2').addClass('crab2');
        if(localStorage.getItem('high_score'))
        {
            var score = localStorage.getItem('high_score')
            $("#stage").text("Best Time: "+score+" sec")
        }
        animateDiv();
        // $("*").css("cursor","crosshair");

        var min = parseInt($('#min').text());
        var sec = parseInt($('#sec').text());
        sec = 60;
        min = min - 1;
        
        count_down_timer = self.setInterval(function(){count()},1000);
        function count()
        {
            sec = sec - 1;
        if (sec < 0)
            { sec = 59;
              min = min - 1;
            }
        if (min < 0)
            {
            halt();
            var activepage = $.mobile.activePage.attr("id");
            if (activepage == "play")
            {alertBox("Time out try again","reload");}
            }
        else
            { 
             $('#min').text(min);
             $('#sec').text(sec);
            }
        }
    });

    function halt(){
        window.clearInterval(count_down_timer);
        $('#move1').removeClass('crab1');
        $('#move2').removeClass('crab2');
    }

    $('.move').click(function(){
       
        if($(this).attr("id") == "move2")
        {
           halt();
           alertBox("Oops !! caught the Dangerous crab. Game Over, Try again..","reload");
        }
        

        if($(this).attr("id") == "move1")
        {
            halt();
            var sec = parseInt($('#sec').text());
            var min = parseInt($('#min').text());
            
            var time = 60 - ((min*60)+sec);
            
            
            localStorage["score"] = JSON.stringify(time);
            if(localStorage.getItem('high_score'))
            {
                var high_score = localStorage.getItem('high_score')
                if(high_score > time)
                {localStorage["high_score"] = JSON.stringify(time);}
            }
            else
            { localStorage["high_score"] = JSON.stringify(time); }
            
            $.mobile.changePage("#result");
        }
              
    }); 


    $("#result").on("pagebeforeshow",function(event, ui) {
        halt();
        var high_score = localStorage.getItem('high_score')
        var score = localStorage.getItem('score')
        $("#score").text(score+" sec")
        $("#high_score").text(high_score+" sec")
        
    });

    
    var alertBox = function(text,page){
        $('<div>').simpledialog2({
            mode: 'blank',
            headerClose: false,
            callbackClose: function () {
                            if(page == "reload")
                            {
                                window.location.reload();
                            }
                            else if(page != null)
                            {$.mobile.changePage(page);}
                         },
            blankContent : 
                
                '<div class="alertBoxContents">'+
                "<p>" +text+ "</p>"+
                "<a rel='close' data-role='button' class='alert_close_btn' data-theme='c' data-inline='true' href='#'>START</a>"+
                "</div>"
         });
    };

    $.mobile.initializePage();
});