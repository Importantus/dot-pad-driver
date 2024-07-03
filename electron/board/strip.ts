import { Colors } from "../../shared/constants";
import { strip } from "./board";

function setColor(color: string) {
    if (strip) {
        strip.color(color)
        strip.show()
    } else {
        console.log('No strip available')
    }
}

function fillInColor(color: string) {
    if (!strip) {
        console.log('No strip available')
        return
    }

    strip.color('#000');
    strip.show();

    let pos = 0;
    const fadeIn = setInterval(function () {
        strip.pixel(pos++).color(color);
        strip.show();
        if (pos >= strip.length) {
            clearInterval(fadeIn);
        }
    }, 30);
}

// function clearOutColor() {
//     if (!strip) {
//         console.log('No strip available')
//         return
//     }
//     let pos = strip.length - 1;
//     const fadeOut = setInterval(function () {
//         strip.pixel(pos--).color('#000');
//         strip.show();
//         if (pos < 0) {
//             clearInterval(fadeOut);
//         }
//     }, 30);
// }

export function showBootupAnimation() {
    fillInColor(Colors.IDLE)
}

export function showShutdownAnimation() {
    // The duration of this is to long, so we will just set the color to black
    // clearOutColor()
    setColor(Colors.BLACK)
}

export function showColor(color: Colors) {
    setColor(color)
}