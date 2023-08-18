<template>
    <div class="app dark" data-theme="dark">

        <div class="nav">
            <div class="user" v-for="(item, key) in msgList">
                <div class="btn">
                    <i class="bi bi-person-fill"></i>
                    <span>{{ config.bot[key].username }}</span>
                </div>
                <div class="list" v-for="(item1, key1) in item">
                    {{ key1 }}
                </div>

            </div>
        </div>

        <UserMsg v-for="(item, key ) in winList" class="card msg" :msg="msgList[item[0]][item[1]]"
            :config="config.bot[item[0]]" :target="item[1]" :sendid="item[2]"/>

    </div>
</template>
<style>
* {
    margin: 0;
    padding: 0;
}
</style>
<style lang="scss" scoped>
@import './theme/dark.sass';

.app {
    position: relative;
    overflow-y: hidden;
    overflow-x: auto;
    width: 100vw;
    height: 100vh;
    background: $bg_buttom;
    display: flex;
    flex-direction: row;
    align-items: center;
    /* 垂直对齐方式改为顶部对齐 */
    justify-content: flex-start;

    .test {
        position: absolute;
        z-index: 999;
        top: 0;
        left: 0;

        img {
            width: 50px;
            height: 50px;
        }

        width: 50px;
        height: 50px;
    }

    .nav {
        background: #2b2d31;
        display: flex;
        flex-direction: column;
        height: 95%;
        border-radius: 0px 4px 4px 0px;
        margin: 0 4px 0 0;

        .user {

            .btn {
                display: flex;
                flex-direction: row;
                align-items: center;
                color: #fff;
                margin: 12px 10px 12px 0px;
                padding: 4px 20px 4px 12px;
                background: #404249;
                border-radius: 0px 8px 8px 0px;
                font-size: 16px;
                font-weight: 600;
                white-space: nowrap;

                i {
                    font-size: 20px;
                    margin: 0 8px 0 0;
                }

                span {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
            }

            .list {
                color: #949ba4;
            }

        }

    }

    .card {
        background: $bg_card;
        color: #fff;
        border-radius: 4px;
    }

    .msg {
        height: 95%;
        margin: 4px;
        flex-shrink: 1;
        flex-grow: 1;
        /* 关闭缩小 */
        width: 30vw;
    }
}
</style>
<script>
import usermsg from './components/usermsg.vue';
export default {
    components: {
        UserMsg: usermsg
    },
    data () {
        return {
            Theme: 'light', // 默认主题
            test: 114,
            ws: {
                wws: null,
                status: 'disconnect'
            },
            msgList: {},
            winList: [],
            config: { bot: {} },
        }
    },
    mounted () {
        setInterval(() => {
            // console.log(this.userList);
        }, 1000)
    },
    created () {
        this.connectWebSocket();
    },
    methods: {
        connectWebSocket () {
            this.ws.wws = new WebSocket('ws://127.0.0.1:3000');

            this.ws.wws.onopen = () => {
                this.ws.status = 'online';
                console.log('ws已连接');
            };

            this.ws.wws.onclose = () => {
                console.log('ws已断开');
                this.ws.status = 'disconnect';
                this.scheduleReconnect();  // 调用重连方法
            };

            this.ws.wws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log(message);
                if (message.msg.hasOwnProperty('config')) {
                    message.msg.config.bot.forEach(element => {
                        this.config.bot[element.userid] = element;
                        this.msgList[element.userid] = { 'public': [] }
                        this.winList.push([element.userid, 'public'])
                    });
                } else if (message.msg.hasOwnProperty('publicMessage')) {
                    const msg = {
                        type: 'msg',
                        msg: message.msg.publicMessage
                    }
                    this.msgList[message.userId]['public'].push(msg)
                } else if (message.msg.hasOwnProperty('privateMessage')) {
                    const msg = {
                        type: 'msg',
                        msg: message.msg.privateMessage
                    }
                    if (!this.msgList[message.userId].hasOwnProperty(message.msg.privateMessage.username)) {
                        this.msgList[message.userId][message.msg.privateMessage.username] = []
                        this.winList.push([message.userId, message.msg.privateMessage.username,message.msg.privateMessage.uid])
                    }
                    this.msgList[message.userId][message.msg.privateMessage.username].push(msg)
                } else if (message.msg.hasOwnProperty('joinRoom')) {
                    const msg = {
                        type: 'join',
                        msg: message.msg.joinRoom
                    }
                    this.msgList[message.userId]['public'].push(msg)
                } else if (message.msg.hasOwnProperty('switchRoom')) {
                    const msg = {
                        type: 'switch',
                        msg: message.msg.switchRoom
                    }
                    this.msgList[message.userId]['public'].push(msg)
                } else if (message.msg.hasOwnProperty('leaveRoom')) {
                    const msg = {
                        type: 'leave',
                        msg: message.msg.leaveRoom
                    }
                    this.msgList[message.userId]['public'].push(msg)
                }

            };


        },
        scheduleReconnect () {
            setTimeout(() => {
                console.log('尝试重新连接...');
                this.connectWebSocket();   // 重新连接WebSocket
            }, 3000);
        },
        /**
         * 发送公屏消息
         * @param {*} userId -
         * @param {*} msg - 
         * @param {*} color 
        */
        sendPublic (userId, msg, color) {
            const data = {
                publicMsg: {
                    userId: userId,
                    msg: msg,
                    color: color
                }
            }
            this.ws.wws.send(JSON.stringify(data))
        },
        sendPrivate (userId, msg, color, target) {
            const data = {
                privateMsg: {
                    target: target,
                    userId: userId,
                    msg: msg,
                    color: color
                }
            }
            console.log(data);
            this.ws.wws.send(JSON.stringify(data))

        }

    },
    computed: {
    }
}
</script>