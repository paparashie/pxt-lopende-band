//% color=#D83B01 icon="\uf1fb" block="Kleur"
namespace kleur {

    let i2cAddr = 0x29
    let isInit = false

    function init() {
        if (isInit) return
        // Power on + enable RGBC
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

    //% block="Kleur is %kleur"
    //% kleur.shadow="colorDropdown"
    export function kleurIs(kleur: string): boolean {
        return getColor() == kleur
    }

    //% blockId=colorDropdown block="%kleur"
    //% blockHidden=true
    export function colorDropdown(kleur: string): string {
        return kleur
    }
}
