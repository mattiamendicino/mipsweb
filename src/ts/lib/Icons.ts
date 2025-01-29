import {Colors} from "./Colors.js";

export class Icons {
    private static items: { [key: string]: { path: string; viewBox: string } } = {
        microchip: {
            path: 'M176 24l0-24L128 0l0 24 0 40L64 64l0 64-40 0L0 128l0 48 24 0 40 0 0 56-40 0L0 232l0 48 24 0 40 0 0 56-40 0L0 336l0 48 24 0 40 0 0 64 64 0 0 40 0 24 48 0 0-24 0-40 56 0 0 40 0 24 48 0 0-24 0-40 56 0 0 40 0 24 48 0 0-24 0-40 64 0 0-64 40 0 24 0 0-48-24 0-40 0 0-56 40 0 24 0 0-48-24 0-40 0 0-56 40 0 24 0 0-48-24 0-40 0 0-64-64 0 0-40 0-24L336 0l0 24 0 40-56 0 0-40 0-24L232 0l0 24 0 40-56 0 0-40zM352 160l-192 0 0 192 192 0 0-192zM160 128l192 0 32 0 0 32 0 192 0 32-32 0-192 0-32 0 0-32 0-192 0-32 32 0z',
            viewBox: '0 0 512 512'
        },
        settings: {
            path: 'M200 0L312 0l17.2 78.4c15.8 6.5 30.6 15.1 44 25.4l76.5-24.4 56 97-59.4 54.1c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l59.4 54.1-56 97-76.5-24.4c-13.4 10.3-28.2 18.9-44 25.4L312 512l-112 0-17.2-78.4c-15.8-6.5-30.6-15.1-44-25.4L62.3 432.5l-56-97 59.4-54.1C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L6.3 176.5l56-97 76.5 24.4c13.4-10.3 28.2-18.9 44-25.4L200 0zm56 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z',
            viewBox: '0 0 512 512'
        },
        newFile: {
            path: 'M224 0L0 0 0 512l384 0 0-352-160 0L224 0zm32 0l0 128 128 0L256 0zM216 240l0 24 0 48 48 0 24 0 0 48-24 0-48 0 0 48 0 24-48 0 0-24 0-48-48 0-24 0 0-48 24 0 48 0 0-48 0-24 48 0z',
            viewBox: '0 0 384 512'
        },
        importFile: {
            path: 'M224 0L0 0 0 512l384 0 0-352-160 0L224 0zm32 0l0 128 128 0L256 0zM216 232l0 102.1 31-31 17-17L297.9 320l-17 17-72 72-17 17-17-17-72-72-17-17L120 286.1l17 17 31 31L168 232l0-24 48 0 0 24z',
            viewBox: '0 0 384 512'
        },
        editFile: {
            path: 'M0 0L224 0l0 160 160 0 0 140.4-117 117L253.4 512 0 512 0 0zM384 128l-128 0L256 0 384 128zm121 95.8l71 71-41.3 41.3-71-71L505 223.8zm-63.9 63.9l71 71L370.9 500 288 511.9 299.9 429 441.1 287.8z',
            viewBox: '0 0 576 512'
        },
        sampleFile: {
            path: 'M224 0L0 0 0 512l384 0 0-352-160 0L224 0zm32 0l0 128 128 0L256 0zM112 256l160 0 16 0 0 32-16 0-160 0-16 0 0-32 16 0zm0 64l160 0 16 0 0 32-16 0-160 0-16 0 0-32 16 0zm0 64l160 0 16 0 0 32-16 0-160 0-16 0 0-32 16 0z',
            viewBox: '0 0 384 512'
        },
        x: {
            path: 'M326.6 166.6L349.3 144 304 98.7l-22.6 22.6L192 210.7l-89.4-89.4L80 98.7 34.7 144l22.6 22.6L146.7 256 57.4 345.4 34.7 368 80 413.3l22.6-22.6L192 301.3l89.4 89.4L304 413.3 349.3 368l-22.6-22.6L237.3 256l89.4-89.4z',
            viewBox: '0 0 384 512'
        },
        dots: {
            path: 'M16 304l0-96 96 0 0 96-96 0zm160 0l0-96 96 0 0 96-96 0zm160-96l96 0 0 96-96 0 0-96z',
            viewBox: '0 0 448 512'
        },
        step: {
            path: 'M256 96l0-32 64 0 0 32 0 320 0 32-64 0 0-32 0-160L0 448 0 64 256 256l0-160z',
            viewBox: '0 0 320 512'
        },
        run: {
            path: 'M384 256L0 32V480L384 256z',
            viewBox: '0 0 384 512'
        },
        stop: {
            path: 'M0 64H384V448H0V64z',
            viewBox: '0 0 384 512'
        },
        assemble: {
            path: 'M224 144C224 64.5 288.5 0 368 0c19 0 37.1 3.7 53.7 10.3L336 96l0 80 80 0 85.7-85.7C508.3 106.9 512 125 512 144c0 61.3-38.3 113.7-92.3 134.4l-45.1-45.1L352 210.7l-22.6 22.6-8.4 8.4-97-97 0-.8zM0 416L168.4 247.6 241.8 321l-8.4 8.4L210.7 352l22.6 22.6L96 512 0 416zm137.9-8L104 374.1 70.1 408 104 441.9 137.9 408zM287 321l-129-129L96 192 0 64 64 0 192 96l0 62.1L321 287l31-31L512 416l-96 96L256 352l31-31z',
            viewBox: '0 0 512 512'
        },
        error: {
            path: 'M256 32L0 480l512 0L256 32zm24 160l0 24 0 112 0 24-48 0 0-24 0-112 0-24 48 0zM232 384l48 0 0 48-48 0 0-48z',
            viewBox: '0 0 512 512'
        },
        closeAll: {
            path: 'M320,0 L320,128 L448,128 L448,416 L96,416 L96,0 L320,0 z M330.667,182.258 L315.083,197.842 L272,240.925 L213.333,182.258 L182.258,213.333 L240.925,272 L197.842,315.083 L182.258,330.667 L213.333,361.742 L272,303.075 L315.083,346.158 L330.667,361.742 L361.742,330.667 L346.158,315.083 L303.075,272 L361.742,213.333 L330.667,182.258 z M352,0 L352,96 L448,96 L352,0 z M48,120 L48,464 L328,464 L352,464 L352,512 L328,512 L24,512 L0,512 L0,488 L0,120 L0,96 L48,96 L48,120 z',
            viewBox: '0, 0, 448, 512'
        },
        files: {
            path: 'M320,0 L320,128 L448,128 L448,416 L96,416 L96,0 L320,0 z M352,0 L352,96 L448,96 L352,0 z M48,120 L48,464 L328,464 L352,464 L352,512 L328,512 L24,512 L0,512 L0,488 L0,120 L0,96 L48,96 L48,120 z',
            viewBox: '0, 0, 448, 512'
        },
        importFiles: {
            path: 'M48,96 L48,464 L352,464 L352,512 L0,512 L0,96 L48,96 z M291.842,182.258 L291.842,286.079 L331.361,246.559 L359.272,274.47 L285.996,347.746 L272,361.742 L184.728,274.47 L212.803,246.559 L252.323,286.079 L252.323,182.258 L291.842,182.258 z M320,0 L96,0 L96,416 L448,416 L448,128 L320,128 L320,0 z M352,0 L352,96 L448,96 L352,0 z',
            viewBox: '0, 0, 448, 512'
        },
        newProject: {
            path: 'M512 480L0 480 0 32l224 0 48 64 240 0 0 384zM232 400l48 0 0-24 0-64 64 0 24 0 0-48-24 0-64 0 0-64 0-24-48 0 0 24 0 64-64 0-24 0 0 48 24 0 64 0 0 64 0 24z',
            viewBox: '0, 0, 512, 512'
        },
        project: {
            path: 'M0 480H512V96H272L224 32H0V480z',
            viewBox: '0 0 512 512'
        },
        file: {
            path: 'M0 0L224 0l0 160 160 0 0 352L0 512 0 0zM384 128l-128 0L256 0 384 128z',
            viewBox: '0 0 384 512'
        },
        fileASM: {
            path: 'M224,0 L224,160 L384,160 L384,304 L384,304 L384,320 L144,320 L144,320 L128,320 L128,512 L0,512 L0,0 L224,0 z M256,0 L256,128 L384,128 L256,0 z M512,352 L512,368 L512,496 L512,512 L480,512 L480,496 L480,421.8 L462.1,455.5 L448.2,481.7 L433.9,455.7 L416,423 L416,496 L416,512 L384,512 L384,496 L384,368 L384,352 L400,352 L404,352 L413.5,352 L418.1,360.3 L447.8,414.3 L476.3,360.5 L480.8,352 L490.4,352 L496,352 L512,352 z M272,397.7 C272,372.5 292.4,352 317.7,352 L344,352 L360,352 L360,384 L344,384 L317.7,384 C310.2,384 304,390.1 304,397.7 C304,402.9 306.9,407.6 311.6,409.9 L342.8,425.5 C358.3,433.2 368,449 368,466.3 C368,491.5 347.6,512 322.3,512 L296,512 L280,512 L280,480 L296,480 L322.3,480 C329.8,480 336,473.9 336,466.3 C336,461.1 333.1,456.4 328.4,454.1 L297.2,438.5 C281.8,430.8 272,415 272,397.7 z M216,384 C220.4,384 224,387.6 224,392 L224,432 L192,432 L192,392 C192,387.6 195.6,384 200,384 L216,384 z M216,352 L200,352 C177.9,352 160,369.9 160,392 L160,512 L192,512 L192,464 L224,464 L224,512 L256,512 L256,392 C256,369.9 238.1,352 216,352 z',
            viewBox: '0, 0, 512, 512'
        },
        edit: {
            path: 'M32 352L0 512l160-32L420.7 219.3l-128-128L32 352zM512 128L384 0 315.3 68.7l128 128L512 128zM248 464l-24 0 0 48 24 0 304 0 24 0 0-48-24 0-304 0z',
            viewBox: '0 0 576 512'
        },
        bin: {
            path: 'M144 0L128 32 0 32 0 96l448 0 0-64L320 32 304 0 144 0zM416 128L32 128 56 512l336 0 24-384z',
            viewBox: '0 0 448 512'
        },
        exportFile: {
            path: 'M224 0L0 0 0 512l384 0 0-352-160 0L224 0zm32 0l0 128 128 0L256 0zM216 408l0 24-48 0 0-24 0-102.1-31 31-17 17L86.1 320l17-17 72-72 17-17 17 17 72 72 17 17L264 353.9l-17-17-31-31L216 408z',
            viewBox: '0 0 448 512'
        },
        default: {
            path: 'M32 32l96 0 0 64L64 96l0 64L0 160 0 64 0 32l32 0zM0 192l64 0 0 128L0 320 0 192zm384 0l64 0 0 128-64 0 0-128zm64-32l-64 0 0-64-64 0 0-64 96 0 32 0 0 32 0 96zm0 192l0 96 0 32-32 0-96 0 0-64 64 0 0-64 64 0zM64 352l0 64 64 0 0 64-96 0L0 480l0-32 0-96 64 0zM288 480l-128 0 0-64 128 0 0 64zM160 96l0-64 128 0 0 64L160 96z',
            viewBox: '0 0 384 512'
        }
    };

    private static defs = ``;

    public static render(name: string, attributes: { [key: string]: string } = {}): string {
        let icon = this.items[name];
        if (!icon) {
            console.error(`Icon "${name}" not found`);
            icon = this.items['default'];
            attributes['opacity'] = '0.25';
        }

        const attrs = Object.entries(attributes)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');

        return `
            <svg viewBox="${icon.viewBox}" ${attrs}>
                ${this.defs}
                <path d="${icon.path}" />
            </svg>
        `;
    }

    public static generateDynamicCSS(): void {
        const style = document.createElement('style');
        style.type = 'text/css';

        const cssRules = Object.keys(Colors.items).map((name) => {
            return `
            .icon.${name} svg { fill: var(--rgb-${name}); }
            .label.${name} { color: var(--rgb-${name}); }
            `;
        });

        style.innerHTML = cssRules.join(' ');
        document.head.appendChild(style);
    }

    public static init() {
        this.generateDynamicCSS();
    }

}