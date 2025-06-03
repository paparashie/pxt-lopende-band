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

        function bepaalKleur(): string {
        init()

        let rSum = 0
        let gSum = 0
        let bSum = 0

        for (let i = 0; i < 5; i++) {
            rSum += read16(0x16)
            gSum += read16(0x18)
            bSum += read16(0x1A)
            basic.pause(5)
        }

        const r = rSum / 5
        const g = gSum / 5
        const b = bSum / 5

        if (r > g * 1.2 && r > b * 1.2) return "rood"
        if (g > r * 1.2 && g > b * 1.2) return "groen"
        if (b > r * 1.2 && b > g * 1.2) return "blauw"
        if (r > 100 && g > 100 && b < r * 0.6 && b < g * 0.6) return "geel"
        return "onbekend"
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
    
        console.log(`Gemiddelde kleuren - R: ${r} G: ${g} B: ${b}`)
    
        if (r > g * 1.2 && r > b * 1.2) {
            console.log("→ Kleur = ROOD")
            return "rood"
        }
    
        if (g > r * 1.2 && g > b * 1.2) {
            console.log("→ Kleur = GROEN")
            return "groen"
        }
    
        if (b > r * 1.2 && b > g * 1.2) {
            console.log("→ Kleur = BLAUW")
            return "blauw"
        }
    
        if (r > 100 && g > 100 && b < r * 0.6 && b < g * 0.6) {
            console.log("→ Kleur = GEEL")
            return "geel"
        }
    
        console.log("→ Kleur = ONBEKEND")
        return "onbekend"
    }
}
