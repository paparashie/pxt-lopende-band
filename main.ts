namespace Lopende_Band {

    /**
     * Laat de motor vooruit draaien
     */
    //% block="Motor vooruit draaien"
    export function vooruit() {
        pins.digitalWritePin(DigitalPin.P0, 1)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }

    /**
     * Laat de motor achteruit draaien
     */
    //% block="Motor achteruit draaien"
    export function achteruit() {
        pins.digitalWritePin(DigitalPin.P0, 0)
        pins.digitalWritePin(DigitalPin.P14, 1)
    }

    /**
     * Stopt de motor
     */
    //% block="Motor stoppen"
    export function stop() {
        pins.digitalWritePin(DigitalPin.P0, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }
}
