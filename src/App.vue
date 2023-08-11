<template>
    <div class="app dark" data-theme="dark">
        <!-- <div class="test"><img src="http://r.iirose.com/i/23/3/18/20/5307-YA.png" alt=""></div> -->
        <UserMsg v-for="(item, key ) in userList" class="card msg" :msg="msgList" :userId="item"
            :username="config.bot[item].userName" />
        <div></div>
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
    overflow: hidden;

    width: 100vw;
    height: 100vh;
    background: $bg_buttom;

    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: center;

    .test{
        position: absolute;
        z-index: 999;
        top: 0;
        left: 0;
        img{
            width: 50px;
            height: 50px;
     
        }
        width: 50px;
        height: 50px;
    }
    .card {

        border-radius: 6px;
        background: $bg_card;
        color: #fff;
    }

    .msg {
        margin: 8px;
        position: relative;
        flex-grow: 1;
        flex-shrink: 1;
        height: 95%;
        width: 50%;
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
    },
    created () {
        this.connectWebSocket();
    },
    methods: {
        connectWebSocket () {
            this.ws.wws = new WebSocket('ws://10.142.35.250:3000');

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
                userId: userId,
                msg: msg,
                color: color
            }
            this.ws.wws.send(JSON.stringify(data))
        }
    },
    computed: {
    }
}
</script>