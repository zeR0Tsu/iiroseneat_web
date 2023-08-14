<template>
    <div class="app dark" data-theme="dark">

        <div class="nav">
            <div class="user">
                <div class="btn" v-for="(item, key) in userList">{{ config.bot[key].userName }}</div>
                <div class="list">
                    123123123
                </div>

            </div>
        </div>

        <UserMsg v-for="(item, key ) in userList" class="card msg" :msg="msgList" :userId="item"
            :username="config.bot[key].userName" :usercolor="config.bot[key].color" :roomid="config.bot[key].userRoomId" />

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
        flex-direction: row;
        height: 95%;
        border-radius: 0px 8px 8px 0px;

        .user {

            .btn {
                color: #fff;
                margin: 12px 10px 12px 0px;
                padding: 4px 20px 4px 20px;
                background: #404249;
                border-radius: 0px 8px 8px 0px;
                font-size: 16px;
                font-weight: 600;
            }
        }

        .list {}
    }

    .card {
        background: $bg_card;
        color: #fff;
        border-radius: 8px;
    }

    .msg {
        height: 95%;
        margin: 8px;
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
            msgList: [],
            userList: [],
            config: null,
        }
    },
    mounted () {
        // setInterval(() => {
        //     console.log(this.config);
        // }, 1000)
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
                    this.config = message.msg.config
                    this.userList = Object.keys(this.config.bot)

                } else if (message.msg.hasOwnProperty('publicMessage')) {
                    let msg = {
                        user: message.userId,
                        type: 'public',
                        msg: message.msg.publicMessage,
                    }
                    this.msgList.push(msg)
                } else if (message.msg.hasOwnProperty('privateMessage')) {
                    let msg = {
                        user: message.userId,
                        type: 'private',
                        msg: message.msg.privateMessage,
                    }
                    this.msgList.push(msg)
                } else if (message.msg.hasOwnProperty('joinRoom')) {
                    let msg = {
                        user: message.userId,
                        type: 'join',
                        msg: message.msg.joinRoom,
                    }
                    this.msgList.push(msg)
                } else if (message.msg.hasOwnProperty('switchRoom')) {
                    let msg = {
                        user: message.userId,
                        type: 'switch',
                        msg: message.msg.switchRoom,
                    }
                    this.msgList.push(msg)
                } else if (message.msg.hasOwnProperty('leaveRoom')) {
                    let msg = {
                        user: message.userId,
                        type: 'leave',
                        msg: message.msg.leaveRoom,
                    }
                    this.msgList.push(msg)

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
         * @param {*} userId -
         * @param {*} msg - 
         * @param {*} color 
        */
        sendMsg (userId, msg, color) {
            const data = {
                publicMsg: {
                    userId: userId,
                    msg: msg,
                    color: color
                }
            }
            this.ws.wws.send(JSON.stringify(data))
        }
    },
    computed: {
    }
}
</script>