<template>
    <div class="msgout">
        <div class="text" @click="msgClick" v-html="outMsg"></div>
    </div>
</template>
<style lang="scss">
.msgout {
    overflow: hidden;

    .text {
        word-wrap: break-word;
        white-space: pre-wrap;
    }

    .img1 {
        max-width: 80%;
        height: auto;
        margin: 8px;
        border: 8px;
        border-radius: 4px;

    }

    .at {
        background: #ffffff22;
        padding: 2px 6px;
        border-radius: 4px;
        margin: 50px 0 0px 0;
        cursor: pointer;

        &:hover {
            color: #ffffffaa;
            background: #ffffff11;

        }
    }
}
</style>
<script>
export default {
    data () {
        return {
            inMsg: this.msg,
        }
    },
    props: ['msg'],
    computed: {
        outMsg () {
            const regImg = /\[?(https*:\/\/[\s\S]+?\.(png|jpe?g|gif|webp|bmp|svg)(@[\w_]+)?(\.(png|jpe?g|gif|webp|bmp|svg))?(#e)?)\]?/g
            // const regImg = /(\[https*:\/\/[\s\S]+?\.(png|jpe?g|gif|webp|bmp|svg)(#e)?\])?/g
            const regAt = /\[\*(.*?)\*\]/g

            const text = this.inMsg
                .replace(regImg, (match, imgSrc) => {
                    return `<img class="img1" src="${imgSrc}">`;
                }).replace(regAt, '<span @click="userAt($event)" class="at">@$1</span>')
            return text
        }
    },
    methods: {
        msgClick (e) {
            if (e.target.classList.contains('at')) {
                this.$parent.userAt(e.target.textContent.trim().replace(/^@/, ''))
            }
        }
    },
}
</script>
