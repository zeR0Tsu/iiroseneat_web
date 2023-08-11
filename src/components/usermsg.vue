<template>
    <div class="usermsg">
        <div class="msg" ref="msgboxs">

            <div class="conten" v-for="(item, key) in message">
                <div class="screen" v-if="user == item.user">
                    <div class="reply">
                        <div class="replymsg" v-for="(item1, key1) in item.msg.replyMessage">
                            <div class="name">{{ item1.username + "：" }}</div>
                            <Msg class="text" :msg="item1.message"></Msg>
                        </div>
                    </div>
                    <div class="msgtext" v-if="item.type == 'public'">
                        <div class="icon" :style="{ background: '#' + item.msg.color }"></div>
                        <div class="text">
                            <div class="name">{{ item.msg.username }}</div>
                            <Msg class="msg" :msg="item.msg.message"></Msg>
                        </div>
                    </div>
                    <div class="room" v-if="item.type == 'leave' || item.type == 'switch' || item.type == 'join'">
                        <div class="after" :style="{ background: color[item.type] }"></div>
                        <div class="text"><span>{{ item.msg.username }}</span>
                            <div v-if="item.type == 'join'">加入了</div>
                            <div v-if="item.type == 'leave'">离开了</div>
                            <div v-if="item.type == 'switch'">切换到 <span>{{ '房间：' + item.msg.targetRoom }}</span></div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="bit" ref="bit"></div>
        </div>
        <div class="textarea">
            <textarea @keydown.enter="sendKey($event)" ref="textarea" :placeholder="`以 ${username} 的身份说点什么...`"
                v-model="textarea"></textarea>
            <i class="bi bi-send" @click="send()"></i>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '../theme/dark.sass';

*::-webkit-scrollbar {
    width: 6px;
    border: 0px;
    margin: 0 5px 0 0;

    background: transparent;
}

*::-webkit-scrollbar-track {
    background: transparent;
}

*::-webkit-scrollbar-thumb {
    margin: 0 5px 0 0;

    border-radius: 2.5px;
    background: #777;
}

*::-webkit-scrollbar-thumb:hover {
    margin: 0 5px 0 0;

    background: rgb(100, 100, 100);
}

*::-webkit-scrollbar-thumb:active {
    margin: 0 5px 0 0;
}

.usermsg {
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .msg {
        overflow-x: hidden;
        overflow-y: auto;
        height: 100%;

        .conten {
            width: 100%;
            display: flex;
            flex-direction: column;

            .screen {

                .reply {
                    margin: 8px 0 0 0;

                    .replymsg {
                        position: relative;
                        width: 80%;
                        display: flex;
                        flex-direction: row;
                        font-size: 14px;
                        margin: 0 0 0 12px;
                        color: #ffffff55;
                        align-items: flex-end;


                        .name {
                            white-space: nowrap;
                            font-weight: 600;
                            background: $bg_card;
                            padding: 0 0 0 4px;
                        }

                        .text {
                            width: 100%;
                            font-weight: 100;
                            overflow-wrap: break-word;

                        }

                    }
                }

                .msgtext {
                    width: 100%;
                    display: flex;
                    flex-direction: row;

                    &:hover {
                        background: $bg_card_hover;
                    }

                    .icon {
                        position: relative;
                        width: 8px;
                        height: 48px;
                        border-radius: 4px;
                        margin: 8px 8px 8px 16px;
                        flex-shrink: 0;

                    }

                    .text {
                        margin: 8px 12px 0px 0;
                        white-space: normal;
                        width: calc(100% - 12px - 8px - 16px - 16px);


                        .name {
                            font-size: 14px;
                            font-weight: 600;
                        }

                        .msg {
                            width: 100%;
                            overflow: visible;
                            margin: 8px 0 0 8px;
                            font-weight: 100;
                            overflow-wrap: break-word;
                        }

                    }
                }

                .room {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    padding: 2px 0 2px 0;

                    .after {
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        margin: 0px 8px 0px 16px;

                    }

                    .text {
                        display: flex;
                        flex-direction: row;
                        align-items: center;

                        span {
                            font-weight: 600;
                            font-size: 14px;
                            margin: 0 4px 0 0;
                        }

                        font-size: 14px;
                        font-weight: 100;
                    }
                }
            }
        }

        .bit {
            height: 2px;
            flex-shrink: 0;
        }
    }

    .textarea {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        textarea {
            margin: 10px 12px 20px;
            flex-grow: 1;
            height: 42px;
            min-height: 42px;
            max-height: 50vh;
            background: #383a40;
            border-radius: 4px;
            border: none;
            border-right: 40px solid #383a40;
            border-top: 8px solid #383a40;
            border-bottom: 8px solid #383a40;

            resize: none;
            color: #fff;
            padding: 0px 2px 0 12px;
            font-size: 16px;


            &:focus {
                outline: none;
            }

            &::placeholder {
                color: #8e8ea0;
                font-size: 16px;
            }

        }

        .bi-send {
            position: absolute;
            right: 24px;
            bottom: 28px;
            color: #6a6c85;
            font-size: 1.2em;
            transform: scaleX(-1);

            &:hover {
                color: #ffffff;
            }

        }
    }
}
</style>
<script>
import MsgParsing from './MsgParsing.vue';
export default {
    data () {
        return {
            textarea: '',
            message: this.msg,
            bottomStatus: true,
            user: this.userId,
            color: {
                join: '#00a381',
                leave: '#d9333f',
                switch: '#1e88e5',
            }
        }
    },
    props: ['msg', 'userId', 'username'],
    components: {
        'Msg': MsgParsing
    },
    mounted () {
        this.scrollToBottom();

        const bit = this.$refs.bit

        let options = {
            threshold: 1.0,
        };

        let observer = new IntersectionObserver(entries => {
            this.bottomStatus = entries[0].isIntersecting
        });
        observer.observe(bit)

    },
    methods: {
        scrollToBottom () {
            const container = this.$refs.msgboxs;
            if (this.bottomStatus) {
                container.scroll({
                    top: container.scrollHeight,
                    behavior: "smooth",
                })

            }


        },
        sendKey (event) {
            if (event.key === 'Enter' && event.ctrlKey) {
                this.send()
            }
        },
        send () {
            if (this.textarea === "") { return } else {
                this.$parent.sendMsg(this.user, this.textarea, '66ccff')
                this.textarea = ''
                setTimeout(() => {
                    this.$refs.textarea.style.height = '42px'
                }, 1)
            }

        },
        textareaAuto () {
            this.$refs.textarea.style.height = "auto";
            this.$refs.textarea.style.height = this.$refs.textarea.scrollHeight + "px";
        }
    },
    watch: {
        message: {
            handler () {
                // 监听数组变化，在数组变化后滚动到底部
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            },
            deep: true
        },
        textarea: {
            handler (newVal, oldVal) {
                this.textareaAuto()
            },

        }
    }

}
</script>
