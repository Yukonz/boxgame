$(document).ready(function(){
    var turns = 15;
    var numberOfPairs = 3;
    var numberOfBoxes = numberOfPairs * 2;
    var pairColors = [];
    var boxColors = [];
    var firstClickColor = 0;
    var secondClickColor = 0;
    var boxIndexFirst;
    var boxIndexSecond;
    var boxGuessed = 0;
    var round = 1;
    var i;
    var hideColorsDelay = 2000;

    function add_boxes()
    {
        for (i=0; i<numberOfBoxes; i++){
            var red = parseInt(Math.random() * 255);
            var green = parseInt(Math.random() * 255);
            var blue = parseInt(Math.random() * 255);

            pairColors[i] = "rgb(" + red + "," + green + "," + blue + ")";
        }

        for (i=0; i<numberOfPairs; i++){
            boxColors[i] = pairColors[i];
            boxColors[i + numberOfPairs] = pairColors[i];
        }

        boxColors = boxColors.sort(function() { return 0.5 - Math.random() });

        for (i=0; i<numberOfBoxes; i++){
            $("<div class='box' style='background-color:" + boxColors[i] + "'></div>").appendTo('.game_field');
        }
    }

    function new_game()
    {
        add_boxes();

        function hide_colors()
        {
            $(".box").each(function(){
                $(this).css({"background-color": "rgb(128, 128, 128)"});
            });
        }
        setTimeout(hide_colors, hideColorsDelay);

        $(".box").on("click", function(){
            if ($(this).css("background-color") !== "rgb(128, 128, 128)") return false;

            next_turn();

            if (firstClickColor === 0) {
                boxIndexFirst = $(this).index();
                firstClickColor = boxColors[boxIndexFirst];
                $(".box:eq(" + boxIndexFirst + ")").css({"background-color": firstClickColor});
            } else {
                boxIndexSecond = $(this).index();
                secondClickColor = boxColors[boxIndexSecond];

                if (secondClickColor === firstClickColor ){                                             //Colors are equal
                    $(".box:eq(" + boxIndexSecond + ")").css({"background-color": secondClickColor});
                    firstClickColor = 0;
                    boxGuessed++;
                    if (boxGuessed === numberOfPairs) {
                        round_win();
                        new_game();
                    }
                } else {                                                                                //Colors are not equal
                    firstClickColor = 0;
                    $(".box:eq(" + boxIndexFirst + ")").css({"background-color": "grey"});
                    $(".box:eq(" + boxIndexSecond + ")").css({"background-color": "grey"});
                }

                if (turns === 0) {
                    loose();
                    new_game();
                }
            }
        });
    }

    function loose()
    {
        alert ('LOOSER!!!');
        numberOfPairs = 3;
        numberOfBoxes = numberOfPairs * 2;
        round = 1;
        $(".round").html("<h2>Game Round: " + round + "</h2>");
        turns = 15;
        boxGuessed = 0;
        remove_boxes();
    }

    function round_win()
    {
        alert ('WINNER!!!');
        numberOfPairs++;
        numberOfBoxes = numberOfPairs * 2;
        turns = parseInt((turns/3)*2) + 15;
        $(".turns").html("<h2>Turns Left: " + turns + "</h2>");
        boxGuessed = 0;
        round++;
        $(".round").html("<h2>Game Round: " + round + "</h2>");
        remove_boxes();
    }

    function next_turn()
    {
        turns--;
        $(".turns").html("<h2>Turns Left: " + turns + "</h2>");
    }

    function remove_boxes(){
        $(".box").each(function () {
            $(this).hide(500, function () {
                $(this).remove();
            });
        });
    }

    new_game();
});