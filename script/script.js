window.onload = function () {

    var canvaswidth = 1000
    var canvasheight = 600
    var blocksize = 20
    var ctx
    var delay = 400   
    var snakee 
    var applee
    var widthInBlocks = canvaswidth/blocksize
    var heightInBlocks = canvasheight/blocksize
    var score
    var timeout


    init()

    function init() {
    var canvas = document.createElement('canvas')
    canvas.width = canvaswidth
    canvas.height = canvasheight
    canvas.style.border = "30px solid gray"
    canvas.style.margin = "50px auto"
    canvas.style.display = "block"
    canvas.style.backgroundColor = "#ddd"
    document.body.appendChild(canvas)
    ctx = canvas.getContext("2d")
    snakee = new snake ([[6,4],[5,4],[4,4]], "right")
    applee = new Apple([10,10])
    score = 0
    refreshcanvas()
    // ctx.fillStyle = "#ff0000"
    // ctx.fillRect(30, 30, 100,50)
    }

    function refreshcanvas () {


        snakee.advance()
        if (snakee.checkCollision()){
            gameover()
        } else {
            if(snakee.isEatingApple(applee)){
                score++
                snakee.ateApple = true
                do{
                    applee.setNewPosition()
                }
                while(applee.isOneSnake(snakee))
                
            }

            ctx.clearRect(0, 0, canvaswidth, canvasheight)
        
        // snakee.advance()
            drawScore()
            snakee.draw()
            applee.draw()
            
            timeout =  setTimeout(refreshcanvas,delay)
        }
       
        
    }

    function gameover() {
        ctx.save()
        ctx.font = "bold 70px sans-serif"
        ctx.fillStyle = "#000"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.strokeStyle = "white"
        ctx.lineWidth = 5
        var centerX = canvaswidth/2
        var centerY = canvasheight/2
        ctx.strokeText("Game Over", centerX, centerY-180)
        ctx.fillText("Game Over", centerX, centerY-180)
        ctx.font = "bold 30px sans-serif"
        ctx.strokeText("Appuyer sur la touche Espace pur rejouer",centerX, centerY-120)
        ctx.fillText("Appuyer sur la touche Espace pur rejouer",centerX, centerY-120)
        ctx.restore()
    }

    function restart() {
        snakee = new snake ([[6,4],[5,4],[4,4]], "right")
        applee = new Apple([10,10])
        score = 0
        clearTimeout(timeout)
        refreshcanvas()
    }

    function drawScore() {
        ctx.save()
        ctx.font = "bold 200px sans-serif"
        ctx.fillStyle = "gray"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        var centerX = canvaswidth/2
        var centerY = canvasheight/2
        ctx.fillText(score.toString() , centerX,centerY-5)
        ctx.restore()
    }

    function drawblock(ctx, position) {
        var x = position[0] * blocksize
        var y = position[1] * blocksize
        ctx.fillRect(x,y, blocksize, blocksize)
    }

    function snake(body, direction) {
        this.body = body
        this.direction = direction
        this.ateApple = false
        this.draw = function() {
            ctx.save()
            ctx.fillStyle = "#ff0000"
            for(var i = 0; i < this.body.length; i++) {
                drawblock(ctx, this.body[i])
            }
            ctx.restore()
        }
        this.advance = function () {
            var nextPosition = this.body[0].slice()
            switch(this.direction) {
                case "right":
                    nextPosition[0] += 1
                    break
                case "left" :
                    nextPosition[0] -= 1
                    break
                case "down" :
                    nextPosition[1] += 1
                    break
                case "up":
                    nextPosition[1] -= 1
                    break
                default:
                    throw("invalid direction")
                
            }
            this.body.unshift(nextPosition)
            if(!this.ateApple) {
                this.body.pop()
            } else {
                this.ateApple = false
            }
        }

        this.setDirection = function (newDirection){
            var allowedDirections

            switch(this.direction) {
                case "right":
                case "left" :
                    allowedDirections = ["up", "down"]
                    break
                case "down" : 
                case "up":
                    allowedDirections = ["left", "right"]
                    break
                default:
                    throw("invalid direction")
                
                
            }

            if (allowedDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection
            }

        }
        this.checkCollision = function() {
            var wallCollision = false
            var snakeCollision = false
            var head = this.body[0]
            var rest = this.body.slice(1)
            var snakeX = head[0]
            var snakeY = head[1]
            var minX = 0
            var minY = 1
            var maxX = widthInBlocks -1
            var maxY = heightInBlocks -1
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                wallCollision = true

            }

            for (var i = 0; i < rest.length; i++) {
                if(snakeX=== rest[i][0] && snakeY === rest[i][1] ) {
                    snakeCollision = true
                } 
            }

            return wallCollision || snakeCollision
        }
        this.isEatingApple = function (apppleToEat) {
            var head = this.body[0]
            if(head[0] === apppleToEat.position[0] && head[1] === apppleToEat.position[1]) {
                return true
            } else {
                return false
            }
        }

    }

    function Apple (position) {
        this.position = position
        this.draw = function() {
            ctx.save()
            ctx.fillStyle = "#33cc33"
            ctx.beginPath()
            var radius = blocksize/2
            var x = this.position[0] * blocksize + radius
            var y = this.position[1] * blocksize + radius
            ctx.arc(x,y,radius,0 , Math.PI*2, true)
            ctx.fill()
            ctx.restore()

        }
         this.setNewPosition = function () {
             var newX = Math.round(Math.random()*(widthInBlocks-1))
             var newY =  Math.round(Math.random()*(heightInBlocks-1))
             this.position = [newX, newY]
         }

         this.isOneSnake = function (snakeToCheck) {
            var isOneSnake = false 

            for(var i = 0; i< snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOneSnake = true
                }
            }
            return isOneSnake
         }
    }

    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode
        var newDirection

        switch (key) {
            case 37:
                newDirection = "left"
                break;
        
            case 38:
                newDirection = "up"
                break;
            case 39:
                newDirection = "right"
                break
            case 40 :
                newDirection = "down"
                break
            case 32:
                restart()
                return
                default:
                    return
        }

        snakee.setDirection(newDirection)
    }

    
}