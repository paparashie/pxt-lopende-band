namespace Lopende_Band {

    // === MOTOR ===

    //% group="Motor"
    //% block="Motor vooruit draaien"
    export function vooruit() {
        pins.digitalWritePin(DigitalPin.P0, 1)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }
    //% group="Motor"
    //% block="Motor achteruit draaien"
    export function achteruit() {
        pins.digitalWritePin(DigitalPin.P0, 0)
        pins.digitalWritePin(DigitalPin.P14, 1)
    }
    //% group="Motor"
    //% block="Motor stoppen"
    export function stop() {
        pins.digitalWritePin(DigitalPin.P0, 0)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }

    // === KLEURSENSOR (TCS34725) ===

    let i2cAddr = 0x29
    let isInit = false

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

    function bepaalKleur(): string {
        init()
        let rSum = 0, gSum = 0, bSum = 0
        for (let i = 0; i < 10; i++) {
            rSum += read16(0x16)
            gSum += read16(0x18)
            bSum += read16(0x1A)
            basic.pause(5)
        }
        const r = rSum / 10
        const g = gSum / 10
        const b = bSum / 10

        serial.writeLine("---- Kleurmeting ----")
        serial.writeLine("R: " + r + " G: " + g + " B: " + b)

        if (r > g * 1.2 && r > b * 1.2) return "rood"
        if (g > r * 1.2 && g > b * 1.2) return "groen"
        if (b > r * 1.2 && b > g * 1.2) return "blauw"
        if (r > 100 && g > 100 && b < r * 0.6 && b < g * 0.6) return "geel"
        return "onbekend"
    }

    //% group="Kleurdetectie"
    //% block="Toon kleur"
    export function toonKleur() {
        const kleur = bepaalKleur()
        const teken = kleur == "rood" ? "R" :
                      kleur == "groen" ? "G" :
                      kleur == "blauw" ? "B" :
                      kleur == "geel" ? "Y" : "X"
        basic.showString(teken)
    }

    //% group="Kleurdetectie"
    //% block="Kleur is %kleur"
    //% kleur.shadow="colorDropdown"
    export function kleurIs(kleur: string): boolean {
        return bepaalKleur() == kleur
    }

    //% blockId=colorDropdown block="%kleur"
    //% blockHidden=true
    export function colorDropdown(kleur: string): string {
        return kleur
    }

    // === AFSTANDSSENSOR (VL6180X) ===

    let vl6180xGeinitialiseerd = false

   function initVL6180X() {
    const addr = 0x29

    // Quick check of sensor aanwezig is
    pins.i2cWriteNumber(addr, 0x00, NumberFormat.UInt8BE)
    const id = pins.i2cReadNumber(addr, NumberFormat.UInt8BE)
    if (id != 0xB4) {
        serial.writeLine("→ TOF sensor niet gevonden")
        return
    }

    // ST Application Note standaardregisters
    const inits: [number, number][] = [
        [0x0207, 0x01],
        [0x0208, 0x01],
        [0x0096, 0x00],
        [0x0097, 0xfd],
        [0x00e3, 0x00],
        [0x00e4, 0x04],
        [0x00e5, 0x02],
        [0x00e6, 0x01],
        [0x00e7, 0x03],
        [0x00f5, 0x02],
        [0x00d9, 0x05],
        [0x00db, 0xce],
        [0x00dc, 0x03],
        [0x00dd, 0xf8],
        [0x009f, 0x00],
        [0x00a3, 0x3c],
        [0x00b7, 0x00],
        [0x00bb, 0x3c],
        [0x00b2, 0x09],
        [0x00ca, 0x09],
        [0x0198, 0x01],
        [0x01b0, 0x17],
        [0x01ad, 0x00],
        [0x00ff, 0x05],
        [0x0100, 0x05],
        [0x0199, 0x05],
        [0x01a6, 0x1b],
        [0x01ac, 0x3e],
        [0x01a7, 0x1f],
        [0x0030, 0x00]
    ]

    for (let i = 0; i < inits.length; i++) {
        let reg = inits[i][0]
        let val = inits[i][1]
        pins.i2cWriteBuffer(addr, pins.createBufferFromArray([
            reg >> 8, reg & 0xff, val
        ]))
    }

    vl6180xGeinitialiseerd = true
    serial.writeLine("→ VL6180X succesvol geïnitialiseerd")
}

    // //% group="Afstandssensor"
    // //% block="Meet afstand (mm)"
    // export function meetAfstand(): number {
    //     const addr = 0x29
    //     const RANGE_START = 0x018
    //     const RANGE_RESULT = 0x062

    //     if (!vl6180xGeinitialiseerd) initVL6180X()

    //     pins.i2cWriteNumber(addr, RANGE_START, NumberFormat.UInt8BE)
    //     basic.pause(10)
    //     pins.i2cWriteNumber(addr, RANGE_RESULT, NumberFormat.UInt8BE)
    //     const afstand = pins.i2cReadNumber(addr, NumberFormat.UInt8BE)

    //     serial.writeLine("Afstand (mm): " + afstand)
    //     return afstand
    // }
    //% group="Afstandssensor" 
    //% block="Meet hoogte (cm)"
    export function meetHoogte(): number {
        const sigPin = DigitalPin.P1
    
        pins.setPull(sigPin, PinPullMode.PullNone)
        pins.digitalWritePin(sigPin, 0)
        control.waitMicros(2)
        pins.digitalWritePin(sigPin, 1)
        control.waitMicros(10)
        pins.digitalWritePin(sigPin, 0)
    
        const duration = pins.pulseIn(sigPin, PulseValue.High, 25000)
        const afstand_cm = duration / 58
    
        const maxHoogte = 5.4
        const hoogte = maxHoogte - afstand_cm
    
        serial.writeLine("Afstand: " + afstand_cm + " cm")
        serial.writeLine("Hoogte object: " + hoogte + " cm")
    
        if (afstand_cm > maxHoogte || afstand_cm <= 0) return 0 // buiten meetbereik
        return hoogte
    }    
}
