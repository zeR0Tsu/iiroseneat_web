<template>
    <div class="msg" ref="msgboxs">

        <div class="conten" v-for="(item, key) in message">
            <div class="msgtext" v-if="item.type == 'public'">
                <div class="icon" :style="{ background: '#' + item.msg.color }"></div>
                <div class="text">
                    <div class="name">{{ item.msg.username }}</div>
                    <div class="msg">{{ item.msg.message }}</div>
                </div>
            </div>
            <div class="room" v-if="item.type == 'leave' || item.type == 'switch' || item.type == 'join'">
                <div class="after" :style="{ background: color[item.type] }"></div>
                <div class="text"><span>{{ item.msg.username }}</span>
                <div v-if="item.type=='join'">加入了</div>
                <div v-if="item.type=='leave'">离开了</div>
                <div v-if="item.type=='switch'">切换到</div>

                </div>
            </div>
        </div>

        <div class="bit" ref="bit"></div>
    </div>
</template>
<style lang="scss">
@import '../theme/dark.sass';

.msg {
    overflow: auto;


    .conten {
        width: 100%;
        display: flex;
        flex-direction: column;

        .msgtext {
            width: 100%;
            display: flex;
            flex-direction: row;


            &:hover {
                background: $bg_card_hover;
            }

            .icon {
                width: 8px;
                height: 48px;
                border-radius: 4px;
                margin: 8px 8px 8px 16px;
                flex-shrink: 0;
            }

            .text {
                margin: 8px 12px 0 0;

                .name {
                    font-size: 14px;
                    font-weight: 600;
                }

                .msg {
                    margin: 8px 0 0 8px;
                    font-weight: 100;
                }

            }
        }

        .room {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 10px 0 2px 0;

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

    .bit {
        height: 1px;
        flex-shrink: 0;
    }
}
</style>
<script>
export default {
    data () {
        return {
            message: this.msg,
            bottomStatus: true,
            color: {
                join: '#00a381',
                leave: '#d9333f',
                switch: '#1e88e5',
            }
        }
    },
    props: ['msg'],
    mounted () {
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
        }
    }

}
</script>
