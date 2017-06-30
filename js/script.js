$(document).ready(function(){
    var i=0, n=0;

    var options = {
        hideColorsDelay: 2000,
        hintDelay: 1000,
        pairColors: ["rgb(248, 19, 20)",
                     "rgb(91, 91, 109)",
                     "rgb(242, 212, 31)",
                     "rgb(69, 114, 147)",
                     "rgb(28, 112, 78)",
                     "rgb(214, 148, 0)",
                     "rgb(247, 103, 101)",
                     "rgb(121, 105, 153)",
                     "rgb(153, 148, 194)",
                     "rgb(52, 161, 152)",
                     "rgb(121, 37, 117)",
                     "rgb(0, 0, 200)"],
        hideColor: "rgb(128, 128, 128)"
    };

    var gameData = {
        turns: 15,
        numberOfPairs: 3,
        numberOfBoxes: null,
        totalTurns: 0,
        boxGuessed: 0,
        round: 1,
        boxColors: [],
        boxColorsBackup: [],
        firstClickColor: false,
        secondClickColor: null,
        boxIndexFirst: null,
        boxIndexSecond: null,
        firstClickSymbol: null,
        secondClickSymbol: null,
        numberOfColors: null
    };

    var windowData = {
        boxWidth: 150,
        boxHeight: 150,
        boxWidthMax: 150,
        boxHeightMax: 150,
        boxWidthMin: 45,
        boxHeightMin: 45,
        windowWidth: null,
        windowHeight: null,
        gameFieldScrollHeight: null,
        gameFieldInnerHeight: null
    };

    function addBoxes()
    {
        options.pairColors = options.pairColors.sort(function() { return 0.5 - Math.random() });

        gameData.numberOfBoxes = gameData.numberOfPairs * 2;
        gameData.numberOfColors = options.pairColors.length;

        if (gameData.numberOfBoxes <= (gameData.numberOfColors * 2)) {
            for (i=0, n=0; i < gameData.numberOfBoxes; i=i+2, n++) {
                gameData.boxColors[i] = [options.pairColors[n], ""];
                gameData.boxColors[i+1] = [options.pairColors[n], ""];
            }
        } else {
            for (i=0, n=0; i < (gameData.numberOfColors * 2); i=i+2, n++) {
                gameData.boxColors[i] = [options.pairColors[n], ""];
                gameData.boxColors[i+1] = [options.pairColors[n], ""];
            }
            for (i=(gameData.numberOfColors * 2), n=0; i < gameData.numberOfBoxes; i=i+2, n++){
                gameData.boxColors[i] = [options.pairColors[n], "@"];
                gameData.boxColors[i+1] = [options.pairColors[n], "@"];
            }
        }

        gameData.boxColors = gameData.boxColors.sort(function() { return 0.5 - Math.random() });

        gameData.boxColors.forEach(function(box){
            $("<div class='box' style='background-color:" + box[0] + "'><h3>" + box[1] + "</h3></div>").appendTo('#game_field');
        });
    }

    function newGame()
    {
        addBoxes();
        setTimeout(setBoxSize, 200);
        setTimeout(hideColors, options.hideColorsDelay);

        $(".box").on("click", function () {
            if ($(this).css("background-color") !== options.hideColor) return false;

            if (gameData.firstClickColor === false) {
                gameData.boxIndexFirst = $(this).index();
                gameData.firstClickColor = gameData.boxColors[gameData.boxIndexFirst][0];
                gameData.firstClickSymbol = gameData.boxColors[gameData.boxIndexFirst][1];
                $(this).css({"background-color": gameData.firstClickColor});
                $(this).children("h3").show();
                nextTurn();
            } else {
                gameData.boxIndexSecond = $(this).index();
                gameData.secondClickColor = gameData.boxColors[gameData.boxIndexSecond][0];
                gameData.secondClickSymbol = gameData.boxColors[gameData.boxIndexSecond][1];
                $(this).css({"background-color": gameData.secondClickColor});
                $(this).children("h3").show();
                if ((gameData.secondClickColor === gameData.firstClickColor) && (gameData.firstClickSymbol === gameData.secondClickSymbol)) {                                             //Colors are equal
                    $(this).css({"background-color": gameData.secondClickColor});
                    $(this).children("h3").show();
                    gameData.firstClickColor = false;
                    gameData.boxGuessed++;
                    if (gameData.boxGuessed === gameData.numberOfPairs) {
                        if (gameData.numberOfBoxes < 30) {
                            roundWin();
                        } else gameWin();
                        return false;
                    }
                } else {                                                                                //Colors are not equal
                    gameData.firstClickColor = false;
                    setTimeout(function () {
                        $(".box:eq(" + gameData.boxIndexFirst + ")").css({"background-color": "grey"});
                        $(".box:eq(" + gameData.boxIndexSecond + ")").css({"background-color": "grey"});
                        $(".box:eq(" + gameData.boxIndexFirst + ")").children("h3").hide();
                        $(".box:eq(" + gameData.boxIndexSecond + ")").children("h3").hide();
                    }, 200);
                }

                if (gameData.turns === 0) {
                    gameOver();
                    return false;
                }
            }
        });
    }

    function gameOver()
    {
        $("#overlay").css({"display": "flex"});
        $("#popup_header").html("GAME OVER");
        $("#round").html("You achieved " + gameData.round + " round of Game");
        $("#total_turns").html("Total Turns: " + gameData.totalTurns);

        $("#new_game").on("click", function(){
            gameData.numberOfPairs = 3;
            gameData.totalTurns = 0;
            gameData.boxGuessed = 0;
            gameData.round = 1;
            gameData.turns = 15;
            $(".round").html("<h2>Game Round: " + gameData.round + "</h2>");
            $(".turns").html("<h2>Turns Left: " + gameData.turns + "</h2>");
            $("#overlay").hide();
            removeBoxes();
            newGame();
        });
    }

    function roundWin()
    {
        gameData.round++;
        $("#overlay").css({"display": "flex"});
        $("#popup_header").html("NEXT ROUND");
        $("#round").html("You achieved " + gameData.round + " round of Game");
        $("#total_turns").html("Total Turns: " + gameData.totalTurns);

        $("#new_game").on("click", function() {
            gameData.numberOfPairs++;
            gameData.turns = parseInt((gameData.turns / 3) * 2) + 15;
            gameData.boxGuessed = 0;
            $(".turns").html("<h2>Turns Left: " + gameData.turns + "</h2>");
            $(".round").html("<h2>Game Round: " + gameData.round + "</h2>");
            $("#overlay").hide();
            removeBoxes();
            newGame();
        });
    }

    function gameWin()
    {
        $("#overlay").css({"display": "flex"});
        $("#popup_header").html("YOU WIN!!!");
        $("#total_turns").html("Total Turns: " + gameData.totalTurns);

        $("#new_game").on("click", function(){
            gameData.numberOfPairs = 3;
            gameData.totalTurns = 0;
            gameData.boxGuessed = 0;
            gameData.round = 1;
            gameData.turns = 15;
            $(".round").html("<h2>Game Round: " + gameData.round + "</h2>");
            $(".turns").html("<h2>Turns Left: " + gameData.turns + "</h2>");
            $("#overlay").hide();
            removeBoxes();
            newGame();
        });
    }

    function nextTurn()
    {
        gameData.turns--;
        gameData.totalTurns++;
        $(".turns").html("<h2>Turns Left: " + gameData.turns + "</h2>");
    }

    function removeBoxes()
    {
        $(".box").each(function(){
            $(this).hide(200, function(){
                $(this).remove();
            });
        });
    }

    function hideColors()
    {
        $(".box").css({"background-color": options.hideColor});
        $("h3").hide();
    }

    function getWindowSize()
    {
        windowData.windowHeight = $(window).height();
        windowData.windowWidth = $(window).width();
    }

    function setBoxSize()
    {
        getGameFieldSize();

        if (windowData.gameFieldScrollHeight > windowData.gameFieldInnerHeight){
            while (((windowData.gameFieldScrollHeight -3) >= windowData.gameFieldInnerHeight)&&(windowData.boxHeight >= windowData.boxHeightMin)) {
                windowData.boxHeight = $(".box").height();
                windowData.boxHeight--;

                windowData.boxWidth = windowData.boxHeight;
                $(".box").width(windowData.boxWidth);
                $(".box").height(windowData.boxHeight);
                windowData.gameFieldScrollHeight = document.getElementById('game_field').scrollHeight.toFixed();
            }

            if (windowData.gameFieldScrollHeight > (windowData.gameFieldInnerHeight +2)){
                $("#game_field").css({"overflow": "scroll"});
            }
        }
    }

    function getGameFieldSize()
    {
        windowData.gameFieldScrollHeight = parseInt(document.getElementById('game_field').scrollHeight.toFixed());
        windowData.gameFieldInnerHeight = parseInt($("#game_field").innerHeight().toFixed());
    }

    $("#hint").on("click", function(){
        i = 0;
        $(".box").each(function(){
            gameData.boxColorsBackup[i] = [$(this).css("background-color"), $(this).html()];
            $(this).css("background-color", gameData.boxColors[i][0]);
            $(this).html(gameData.boxColors[i][1]);
            i++;
        });

        setTimeout(function(){
            i = 0;
            $(".box").each(function(){
                $(this).css("background-color",  gameData.boxColorsBackup[i][0]);
                $(this).html( gameData.boxColorsBackup[i][1]);
                i++;
            });
        }, options.hintDelay);
    });

    $(window).resize(function(){

        if ($(window).width() > windowData.windowWidth) {
            getGameFieldSize();

            while (((windowData.gameFieldScrollHeight -2) <= windowData.gameFieldInnerHeight) && (windowData.boxHeight <= windowData.boxHeightMax)) {
                windowData.boxHeight = $(".box").height();
                windowData.boxHeight++;

                windowData.boxWidth = windowData.boxHeight;
                $(".box").width(windowData.boxWidth);
                $(".box").height(windowData.boxHeight);
                windowData.gameFieldScrollHeight = parseInt(document.getElementById('game_field').scrollHeight.toFixed());
            }
        }

        if ($(window).width() < windowData.windowWidth) {
            setBoxSize();
        }

        getGameFieldSize();

        if ((windowData.gameFieldScrollHeight -5) > (windowData.gameFieldInnerHeight)){
            $("#game_field").css({"overflow": "scroll"});
        } else $("#game_field").css({"overflow": "hidden"});

        getWindowSize();
    });

    newGame();
});