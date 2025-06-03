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
    //% block="Motorrrrr stoppen"
    export function stop() {
        pins.digitalWritePin(DigitalPin.P0, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }
    
    
    export let i2cAddr = 0x29
    export let isInit = false

    export function init() {
        if (isInit) return
        pins.i2cWriteBuffer(i2cAddr, pins.createBufferFromArray([0x80 | 0x00, 0x01]))
        basic.pause(10)
        pins.i2cWriteBuffer(i2cAddr, pins.createBufferFromArray([0x80 | 0x00, 0x03]))
        isInit = true
    }

    export function read16(reg: number): number {
        pins.i2cWriteNumber(i2cAddr, 0x80 | reg, NumberFormat.UInt8BE)
        return pins.i2cReadNumber(i2cAddr, NumberFormat.UInt16LE)
    }

   

    /**
     * Toont de gemeten kleur op het scherm: R, G, B, Y of X
     */
    //% group="Kleurdetectie"
    //% block="Toon kleur"
    export function toonKleur() {
        const kleur = bepaalKleur()
        let teken = "X"
        if (kleur == "rood") teken = "R"
        else if (kleur == "groen") teken = "G"
        else if (kleur == "blauw") teken = "B"
        else if (kleur == "geel") teken = "Y"
        basic.showString(teken)
    }

    /**
     * Geeft true als de kleur overeenkomt met de gekozen optie
     */
    //% group="Kleurdetectie"
    //% block="Kleur is %kleur"
    //% kleur.shadow="colorDropdown"
    export function kleurIs(kleur: string): boolean {
        return bepaalKleur() == kleur
    }

    /**
     * Dropdown met beschikbare kleuren
     */
    //% blockId=colorDropdown block="%kleur"
    //% blockHidden=true
    export function colorDropdown(kleur: string): string {
        return kleur
    }

     function bepaalKleur(): string {
        init()
    
        let rSum = 0
        let gSum = 0
        let bSum = 0
    
        for (let i = 0; i < 5; i++) {
            const r = read16(0x16)
            const g = read16(0x18)
            const b = read16(0x1A)
            rSum += r
            gSum += g
            bSum += b
            basic.pause(5)
        }
    
        const r = rSum / 5
        const g = gSum / 5
        const b = bSum / 5
    
        serial.writeLine("---- Kleurmeting ----")
        serial.writeLine("Gemiddelde R: " + r)
        serial.writeLine("Gemiddelde G: " + g)
        serial.writeLine("Gemiddelde B: " + b)
    
        if (r > g * 1.2 && r > b * 1.2) {
            serial.writeLine("→ Kleur: ROOD")
            return "rood"
        }
    
        if (g > r * 1.2 && g > b * 1.2) {
            serial.writeLine("→ Kleur: GROEN")
            return "groen"
        }
    
        if (b > r * 1.2 && b > g * 1.2) {
            serial.writeLine("→ Kleur: BLAUW")
            return "blauw"
        }
    
        if (r > 100 && g > 100 && b < r * 0.6 && b < g * 0.6) {
            serial.writeLine("→ Kleur: GEEL")
            return "geel"
        }
    
        serial.writeLine("→ Kleur: ONBEKEND")
        return "onbekend"
    }

    
}
