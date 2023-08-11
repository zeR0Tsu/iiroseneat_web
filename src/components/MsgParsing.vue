<template>
    <div class="msgout">
        <div class="text" v-html="outMsg"></div>
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
    }

    .at {
        background: #ffffff22;
        padding: 2px 6px;
        border-radius: 4px;
        margin-top: 50px;
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
            const regImg = /\[?(https*:\/\/[\s\S]+?\.(png|jpg|jpeg|gif|webp)(#e)*)\]?/g;
            const regAt = /\[\*(.*?)\*\]/g

            const text = this.inMsg
                .replace(regImg, (match, imgSrc) => {
                    return `<img class="img1" src="${imgSrc}">`;
                }).replace(regAt, '<span class="at">@$1</span>')
            return text
        }
    }
}
</script>
