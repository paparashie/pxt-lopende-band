basic.forever(function () {
    // Vooruit draaien
    basic.showString(">")
    pins.digitalWritePin(DigitalPin.P0, 1)
    pins.digitalWritePin(DigitalPin.P1, 0)
    basic.pause(2000)
    // Stoppen
    basic.showString("-")
    pins.digitalWritePin(DigitalPin.P0, 0)
    pins.digitalWritePin(DigitalPin.P1, 0)
    basic.pause(1000)
    // Achteruit draaien
    basic.showString("<")
    pins.digitalWritePin(DigitalPin.P0, 0)
    pins.digitalWritePin(DigitalPin.P1, 1)
    basic.pause(2000)
    // Stoppen
    basic.showString("-")
    pins.digitalWritePin(DigitalPin.P0, 0)
    pins.digitalWritePin(DigitalPin.P1, 0)
    basic.pause(1000)
})
