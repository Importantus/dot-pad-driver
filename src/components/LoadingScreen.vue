<template>
    <div class="w-full h-screen pb-20 flex justify-center items-center">
        <div class="scale-150">
            <div class="dot-bricks"></div>
        </div>
    </div>
</template>

<style scoped>
.dot-bricks {
    position: relative;
    top: 8px;
    left: -9999px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #ffffff;
    color: #ffffff;
    box-shadow: 9991px -16px 0 0 #ffffff, 9991px 0 0 0 #ffffff, 10007px 0 0 0 #ffffff;
    animation: dot-bricks 2s infinite ease;
}

@keyframes dot-bricks {
    0% {
        box-shadow: 9991px -16px 0 0 #BE8125, 9991px 0 0 0 #25B5BE, 10007px 0 0 0 #2F9B39;
    }

    8.333% {
        box-shadow: 10007px -16px 0 0 #BE8125, 9991px 0 0 0 #25B5BE, 10007px 0 0 0 #2F9B39;
    }

    16.667% {
        box-shadow: 10007px -16px 0 0 #BE8125, 9991px -16px 0 0 #25B5BE, 10007px 0 0 0 #2F9B39;
    }

    25% {
        box-shadow: 10007px -16px 0 0 #BE8125, 9991px -16px 0 0 #25B5BE, 9991px 0 0 0 #2F9B39;
    }

    33.333% {
        box-shadow: 10007px 0 0 0 #BE8125, 9991px -16px 0 0 #25B5BE, 9991px 0 0 0 #2F9B39;
    }

    41.667% {
        box-shadow: 10007px 0 0 0 #BE8125, 10007px -16px 0 0 #25B5BE, 9991px 0 0 0 #2F9B39;
    }

    50% {
        box-shadow: 10007px 0 0 0 #BE8125, 10007px -16px 0 0 #25B5BE, 9991px -16px 0 0 #2F9B39;
    }

    58.333% {
        box-shadow: 9991px 0 0 0 #BE8125, 10007px -16px 0 0 #25B5BE, 9991px -16px 0 0 #2F9B39;
    }

    66.666% {
        box-shadow: 9991px 0 0 0 #BE8125, 10007px 0 0 0 #25B5BE, 9991px -16px 0 0 #2F9B39;
    }

    75% {
        box-shadow: 9991px 0 0 0 #BE8125, 10007px 0 0 0 #25B5BE, 10007px -16px 0 0 #2F9B39;
    }

    83.333% {
        box-shadow: 9991px -16px 0 0 #BE8125, 10007px 0 0 0 #25B5BE, 10007px -16px 0 0 #2F9B39;
    }

    91.667% {
        box-shadow: 9991px -16px 0 0 #BE8125, 9991px 0 0 0 #25B5BE, 10007px -16px 0 0 #2F9B39;
    }

    100% {
        box-shadow: 9991px -16px 0 0 #BE8125, 9991px 0 0 0 #25B5BE, 10007px 0 0 0 #2F9B39;
    }
}
</style>