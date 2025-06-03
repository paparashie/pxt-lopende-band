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

    let i2cAddr = 0x29
    let isInit = false

    function init() {
        if (isInit) return
        pins.i2cWriteBuffer(i2cAddr, pins.createBufferFromArray([0x80 | 0x00, 0x01]))
        basic.pause(10)
        pins.i2cWriteBuffer(i2cAddr, pins.createBufferFromArray([0x80 | 0x00, 0x03]))
        isInit = true
    }

    function read16(reg: number): number {
        pins.i2cWriteNumber(i2cAddr, 0x80 | reg, NumberFormat.UInt8BE)
        return pins.i2cReadNumber(i2cAddr, NumberFormat.UInt16LE)
    }

    function getColor(): string {
        init()
        const r = read16(0x16)
        const g = read16(0x18)
        const b = read16(0x1A)
        if (r > g && r > b) return "rood"
        if (g > r && g > b) return "groen"
        if (b > r && b > g) return "blauw"
        return "onbekend"
    }

    /**
     * Controleert of de gemeten kleur overeenkomt met de gekozen kleur.
     */
    //% group="Kleurdetectie"
    //% block="Kleur is %kleur"
    //% kleur.shadow="colorDropdown"
    export function kleurIs(kleur: string): boolean {
        return getColor() == kleur
    }

    /**
     * Kleurkeuze dropdown voor blok 'Kleur is'.
     */
    //% blockId=colorDropdown block="%kleur"
    //% blockHidden=true
    export function colorDropdown(kleur: string): string {
        return kleur
    }

     /**
     * Geeft de gemeten kleur terug als tekst (rood, groen, blauw of onbekend)
     */
    //% group="Kleurdetectie"
    //% block="Gemeten kleur"
    export function gemetenKleur(): string {
        return getColor()
    }
}
