var Entity = require("./Entity.js");
var ClientProtocol = require("../networking/clientProtocol");
var map = require("../maps/map.js");

class Player extends Entity {
    constructor(id, name, x, y, socket) {
        super(id, name, x, y);
        this.canBlock = true;
        this.speed = 4;
        this.socket = socket;
    }

    movePlayer(socket, newX, newY, direction) {
        let p = this;
        let id = this.id;
        if (!p.isWalking) {
            console.log(p.isWalking);
            if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10 && map[newY][newX] == 0) {
                map[p.y][p.x] = 0;
                map[newY][newX] = id;
                p.x = newX;
                p.y = newY;

                ClientProtocol.sendOtherClientMove(socket, id, direction);
                //socket.broadcast.emit("move other player", id, direction);
                //socket.emit("move player", direction);
                ClientProtocol.sendMoveClient(socket, direction);
                console.log(map);
                console.log("Player " + id + " moved to " + newX + "," + newY);
                p.isWalking = true;
                setTimeout(() => {
                    if (p) {
                        p.isWalking = false;
                        ClientProtocol.sendClientDoneMoving(socket, newX, newY);
                        //socket.emit("move player done", newX, newY);
                    }

                }, 1000);
            } else if (newX == -1 && newY == -1) {
                map[p.y][p.x] = 0;
                //socketio.emit("send map", map);
                //console.log(map);
            }
        }
    }

    
}

module.exports = Player;