var game = (function() {
    var settings = {
        playerSpeed: 0.5,
        ballSpeed: 0.6,

        playerWidth: 16,
        playerHeight: 128,
        ballWidth: 16,
        ballHeight: 16,

        ai_enabled: true
    };

    var player1 = {};
    var player2 = {};
    var ball    = {};
    var text    = {};

    var ball_dx = 1;
    var ball_dy = 1;

    var player1_score = 0;
    var player2_score = 0;

    return new function() {
        this.init = function() {
            player1.renderable = gameEngine.renderer.createRenderable("RECTANGLE");
            player1.renderable.x = 16;
            player1.renderable.y = gameEngine.getHeight() / 2 - settings.playerHeight / 2;
            player1.renderable.w = settings.playerWidth;
            player1.renderable.h = settings.playerHeight;
            player1.renderable.color = "green";

            player2.renderable = gameEngine.renderer.createRenderable("RECTANGLE");
            player2.renderable.x = gameEngine.getWidth() - settings.playerWidth - 16;
            player2.renderable.y = gameEngine.getHeight() / 2 - settings.playerHeight / 2;
            player2.renderable.w = settings.playerWidth;
            player2.renderable.h = settings.playerHeight;
            player2.renderable.color = "green";

            ball.renderable = gameEngine.renderer.createRenderable("RECTANGLE");
            ball.renderable.x = gameEngine.getWidth() / 2 - settings.ballWidth / 2;
            ball.renderable.y = gameEngine.getHeight() / 2 - settings.ballHeight / 2;
            ball.renderable.w = settings.ballWidth;
            ball.renderable.h = settings.ballHeight;
            ball.renderable.color = "green";

            text.renderable = gameEngine.renderer.createRenderable("TEXT");
            text.renderable.x = 16;
            text.renderable.y = 24;
            text.renderable.color = "green";
            text.renderable.fontSize = "24px";
            text.renderable.fontFamily = "sans-serif";
            text.renderable.text = "Score: 0:0";
        };

        this.onTick = function(dt) {
            player1.renderable.x = 16;
            player2.renderable.x = gameEngine.getWidth() - settings.playerWidth - 16;

            var player1_velocity = 0;
            var player2_velocity = 0;

            if(gameEngine.keyIsDown('w') || gameEngine.keyIsDown('W')) {
                player1_velocity = -settings.playerSpeed * dt;
            }
            else if(gameEngine.keyIsDown('s') || gameEngine.keyIsDown('S')) {
                player1_velocity = settings.playerSpeed * dt;
            }

            if(settings.ai_enabled) {
                if(ball.renderable.x > gameEngine.getWidth() / 1.8 && ball_dx > 0) {
                    if     (ball.renderable.y < player2.renderable.y + player2.renderable.h / 2)
                        player2_velocity = -settings.playerSpeed * dt;
                    else if(ball.renderable.y > player2.renderable.y + player2.renderable.h / 2)
                        player2_velocity =  settings.playerSpeed * dt;
                }

            } else {
                if(gameEngine.keyIsDown('ArrowUp')) {
                    player2_velocity = -settings.playerSpeed * dt;
                }
                else if(gameEngine.keyIsDown('ArrowDown')) {
                    player2_velocity = settings.playerSpeed * dt;
                }
            }

            var ball_vx = ball_dx * settings.ballSpeed * dt;
            var ball_vy = ball_dy * settings.ballSpeed * dt;

            if (player1.renderable.y + player1_velocity < 0)
                player1.renderable.y = 0;
            else if (player1.renderable.y + player1_velocity + player1.renderable.h > gameEngine.getHeight())
                player1.renderable.y = gameEngine.getHeight() - player1.renderable.h;
            else
                player1.renderable.y += player1_velocity;

            if (player2.renderable.y + player2_velocity < 0)
                player2.renderable.y = 0;
            else if (player2.renderable.y + player2_velocity + player2.renderable.h > gameEngine.getHeight())
                player2.renderable.y = gameEngine.getHeight() - player2.renderable.h;
            else
                player2.renderable.y += player2_velocity;

            if (ball.renderable.x + ball_vx < 0)
            {
                // Player 2 wins
                player2_score++;
                text.renderable.text = "Score: " + player1_score + ":" + player2_score + " Player 2 wins!";

                ball.renderable.x = gameEngine.getWidth() - gameEngine.getWidth() / 4 - settings.ballWidth / 2;
                ball.renderable.y = gameEngine.getHeight() / 2 - settings.ballHeight / 2;
                ball_dy *= -1;
            }
            else if (ball.renderable.x + ball_vx + ball.renderable.w > gameEngine.getWidth())
            {
                // Player 1 wins
                player1_score++;
                text.renderable.text = "Score: " + player1_score + ":" + player2_score + " Player 1 wins!";

                ball.renderable.x = gameEngine.getWidth() / 4 - settings.ballWidth / 2;
                ball.renderable.y = gameEngine.getHeight() / 2 - settings.ballHeight / 2;
                ball_dy *= -1;
            }

            if((ball.renderable.x + ball_vx >= player1.renderable.x && ball.renderable.x + ball_vx <= player1.renderable.x + player1.renderable.w &&
                ball.renderable.y + ball_vy >= player1.renderable.y && ball.renderable.y + ball_vy <= player1.renderable.y + player1.renderable.h) ||
               (ball.renderable.x + ball_vx + ball.renderable.w >= player2.renderable.x && ball.renderable.x + ball_vx + ball.renderable.w <= player2.renderable.x + player2.renderable.w &&
                ball.renderable.y + ball_vy + ball.renderable.h >= player2.renderable.y && ball.renderable.y + ball_vy + ball.renderable.h <= player2.renderable.y + player2.renderable.h))
            {
                ball_dx *= -1;
                ball_vx *= -1;
            }


            if(ball.renderable.y + ball_vy < 0)
            {
                ball.renderable.y = 0;
                ball_dy *= -1;
                ball_vy *= -1;
            }
            else if(ball.renderable.y + ball_vy + ball.renderable.h > gameEngine.getHeight())
            {
                ball.renderable.y = gameEngine.getHeight() - ball.renderable.h;
                ball_dy *= -1;
                ball_vy *= -1;
            }

            ball.renderable.x += ball_vx;
            ball.renderable.y += ball_vy;
        };
    }();
}());
