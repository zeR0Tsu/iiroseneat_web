<template>
    <div class="app dark" data-theme="dark">
        <UserMsg v-for="(item, key ) in userList" class="card msg" :msg="msgList" :userId="item" />
        <textarea placeholder="输入消息"></textarea>
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
    overflow: hidden;

    width: 100vw;
    height: 100vh;
    background: $bg_buttom;

    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: center;

    textarea {
        position: absolute;
        flex-grow: 1;
        background: #313338;
        font-size: 16px;
        padding: 5px 5px 5px 20px;
        border-radius: 10px;
        border: #2a2a31 solid 1px;
        border-right: transparent solid 40px;
        border-top: transparent solid 10px;
        border-bottom: transparent solid 10px;
        box-shadow: 0 0 15px 2px #00000044;
        color: #fff;
        flex-grow: 1;
        resize: none;
        overflow-y: auto;
        height: auto;
        height: 4%;
        width: 40%;
        bottom: 4%;
        opacity: .8;

        &:focus {
            outline: 2px solid #3b82f6;
        }

        &::placeholder {
            color: #8e8ea0;
        }
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
            userList: ["60f66a44c2008", "5f1131ff6d1a2"],
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
                if (message.msg.hasOwnProperty('userList')) {

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
    },
}
</script>