<template>
    <div class="app dark" data-theme="dark">
        <UserMsg class="card" :msg="msgList" />
    </div>
</template>
<style>
* {
    margin: 0;
    padding: 0;
}
</style>
<style lang="scss">
@import './theme/dark.sass';

.app {
    position: relative;

    width: 100vw;
    height: 100vh;
    background: $bg_buttom;

    display: flex;
    flex-direction: row;
    align-items: center;

    .test {
        position: absolute;
        width: 50px;
        height: 50px;
        color: #fff;
        z-index: 999;
        top: 0;
    }

    .card {
        position: absolute;
        height: 95%;
        width: 90%;
        margin: 0 0 0 2.5%;
        border-radius: 6px;
        background: $bg_card;
        color: #fff;
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
                if (this.userList.indexOf(message.userId) < 0) {
                    this.userList.push(message.userId)
                }
                if (message.msg.hasOwnProperty('publicMessage')) {
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
    },
}
</script>