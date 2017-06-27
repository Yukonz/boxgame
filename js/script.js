$(document).ready(function(){
    var turns = 15;
    var numberOfPairs = 13;
    var numberOfBoxes = numberOfPairs * 2;
    var pairColors = [];
    var boxColors = [];
    var boxSymbols = [];
    var boxColors_backup = [];
    var boxSymbols_backup = [];
    var firstClickColor = 0;
    var secondClickColor = 0;
    var boxIndexFirst;
    var boxIndexSecond;
    var boxGuessed = 0;
    var round = 1;
    var i=0;
    var hideColorsDelay = 2000;
    var totalTurns = 0;
    var boxWidth, boxHeight;
    var windowWidth, windowHeight;
    var boxes = [];
    var firstClickSymbol = 1;
    var secondClickSymbol = 1;


    function add_boxes()
    {
        pairColors[0] = "rgb(248, 19, 20)";
        pairColors[1] = "rgb(91, 91, 109)";
        pairColors[2] = "rgb(242, 212, 31)";
        pairColors[3] = "rgb(69, 114, 147)";
        pairColors[4] = "rgb(28, 112, 78)";
        pairColors[5] = "rgb(214, 148, 0)";
        pairColors[6] = "rgb(247, 103, 101)";
        pairColors[7] = "rgb(121, 105, 153)";
        pairColors[8] = "rgb(153, 148, 194)";
        pairColors[9] = "rgb(52, 161, 152)";
        pairColors[10] = "rgb(121, 37, 117)";
        pairColors[11] = "rgb(0, 0, 200)";

        pairColors = pairColors.sort(function() { return 0.5 - Math.random() });

        // for (i=0; i<numberOfBoxes; i++){
        //     var red = parseInt(Math.random() * 255);
        //     var green = parseInt(Math.random() * 255);
        //     var blue = parseInt(Math.random() * 255);
        //
        //     pairColors[i] = "rgb(" + red + "," + green + "," + blue + ")";
        // }

        for (i=0; i<numberOfPairs; i++){
            boxColors[i] = pairColors[i];
            boxColors[i + numberOfPairs] = pairColors[i];
        }

        if (numberOfBoxes <= 24) {
            for (i = 0; i < numberOfBoxes; i++) {
                boxes[i] = "<div class='box' style='background-color:" + boxColors[i] + "'></div>";
            }
        } else {
            for (i = 0; i < 24; i++) {
                boxes[i] = "<div class='box' style='background-color:" + boxColors[i] + "'></div>";
            }
            for (i = 24; i < numberOfBoxes; i) {
                boxes[i] = "<div class='box' style='background-color:" + boxColors[i] + "'><h3>@</h3></div>";
                boxes[i+1] = "<div class='box' style='background-color:" + boxColors[i] + "'><h3>@</h3></div>";
                i=i+2;
            }
        }

        boxes = boxes.sort(function() { return 0.5 - Math.random() });

        for (i = 0; i < numberOfBoxes; i++) {
            $(boxes[i]).appendTo('.game_field');
        }
    }

    function new_game() {
        add_boxes();

        i = 0;

        function hide_colors() {
            $(".box").each(function () {
                boxColors[i] = $(this).css("background-color");
                boxSymbols[i] = $(this).html();
                i++;
            });

            $(".box").css({"background-color": "rgb(128, 128, 128)"});
            $("h3").hide();
        }

        setTimeout(hide_colors, hideColorsDelay);

        $(".box").on("click", function () {
            if ($(this).css("background-color") !== "rgb(128, 128, 128)") return false;

            if (firstClickColor === 0) {
                next_turn();
                boxIndexFirst = $(this).index();
                firstClickColor = boxColors[boxIndexFirst];
                firstClickSymbol = boxSymbols[boxIndexFirst];

                $(this).css({"background-color": firstClickColor});
                $(this).children("h3").show();
            } else {
                boxIndexSecond = $(this).index();
                secondClickColor = boxColors[boxIndexSecond];
                secondClickSymbol = boxSymbols[boxIndexSecond];
                $(this).css({"background-color": secondClickColor});

                if ((secondClickColor === firstClickColor) && (firstClickSymbol === secondClickSymbol)) {                                             //Colors are equal
                    $(this).css({"background-color": secondClickColor});
                    $(this).children("h3").show();
                    firstClickColor = 0;
                    boxGuessed++;
                    if (boxGuessed === numberOfPairs) {
                        round_win();
                        return false;
                    }
                } else {                                                                                //Colors are not equal
                    firstClickColor = 0;
                    setTimeout(function () {
                        $(".box:eq(" + boxIndexFirst + ")").css({"background-color": "grey"});
                        $(".box:eq(" + boxIndexSecond + ")").css({"background-color": "grey"});
                        $(".box:eq(" + boxIndexFirst + ")").children("h3").hide();
                        $(".box:eq(" + boxIndexSecond + ")").children("h3").hide();
                    }, 300);
                }

                if (turns === 0) {
                    loose();
                    return false;
                }
            }
        });
    }

    $("#hint").on("click", function(){
        i = 0;
        $(".box").each(function(){
            boxColors_backup[i] = $(this).css("background-color");
            boxSymbols_backup[i] = $(this).html();
            $(this).css("background-color", boxColors[i]);
            $(this).html(boxSymbols[i]);
            i++;
        });
        i = 0;
        setTimeout(function(){
            $(".box").each(function(){
                $(this).css("background-color", boxColors_backup[i]);
                $(this).html(boxSymbols_backup[i]);
                i++;
            });
        }, 1000);
    });

    function loose()
    {
        $("#overlay").css({"display": "flex"});
        $("#popup_header").html("GAME OVER");
        $("#round").html("You achieved " + round + " round of Game");
        $("#total_turns").html("Total Turns: " + totalTurns);

        $("#new_game").on("click", function(){
            numberOfPairs = 3;
            numberOfBoxes = numberOfPairs * 2;
            round = 1;
            $(".round").html("<h2>Game Round: " + round + "</h2>");
            turns = 15;
            $(".turns").html("<h2>Turns Left: " + turns + "</h2>");
            boxGuessed = 0;
            remove_boxes();
            new_game();
            $("#overlay").hide();
            debugger;
        });
    }

    function round_win()
    {
        round++;
        $("#overlay").css({"display": "flex"});
        $("#popup_header").html("NEXT ROUND");
        $("#round").html("You achieved " + round + " round of Game");
        $("#total_turns").html("Total Turns: " + totalTurns);

        $("#new_game").on("click", function() {
            numberOfPairs++;
            numberOfBoxes = numberOfPairs * 2;
            turns = parseInt((turns / 3) * 2) + 15;
            $(".turns").html("<h2>Turns Left: " + turns + "</h2>");
            boxGuessed = 0;
            $(".round").html("<h2>Game Round: " + round + "</h2>");
            remove_boxes();
            new_game();
            $("#overlay").hide();
        });
    }

    function next_turn()
    {
        turns--;
        totalTurns++;
        $(".turns").html("<h2>Turns Left: " + turns + "</h2>");
    }

    function remove_boxes(){
        $(".box").each(function () {
            $(this).hide(500, function () {
                $(this).remove();
            });
        });
    }

    $(window).resize(function() {
        boxHeight = $(".box").height();
        while (($(".game_field").height() > ($(window).height())*0.7)&&(boxHeight > 45)) {
            boxHeight = $(".box").height();
            boxHeight--;
            boxWidth = boxHeight;
            $(".box").width(boxWidth);
            $(".box").height(boxHeight);
        }

        // while (($(".game_field").height() < ($(window).height())*0.7)&&(boxHeight < 160)) {
        //     boxHeight = $(".box").height();
        //     boxHeight++;
        //     boxWidth = boxHeight;
        //     $(".box").width(boxWidth);
        //     $(".box").height(boxHeight);
        // }




        // windowWidth = $(window).width();
        // windowHeight = $(window).height();
        // boxWidth = (windowWidth * 0.7) / 6;
        // if (boxWidth < 45) boxWidth = 45;
        // if (boxWidth > 150) boxWidth = 150;
        // boxHeight = boxWidth;
        // $(".box").css({"width": boxWidth, "height": boxHeight});
        // boxHeight = $(".box").height();
        // if((boxHeight > (windowWidth * 0.7))&&(boxWidth === 45)) {
        //     $(".box").css({"overflow": "scroll", "height": "70%"});
        // }

    });

    new_game();
});