export class Icons {
    static render(name, attributes = { fill: 'rgb(72, 72, 74)' }) {
        let icon = this.icons[name];
        if (!icon) {
            console.error(`Icon "${name}" not found`);
            icon = this.icons['default'];
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
}
Icons.icons = {
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
    ellipsis: {
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
    default: {
        path: 'M32 32l96 0 0 64L64 96l0 64L0 160 0 64 0 32l32 0zM0 192l64 0 0 128L0 320 0 192zm384 0l64 0 0 128-64 0 0-128zm64-32l-64 0 0-64-64 0 0-64 96 0 32 0 0 32 0 96zm0 192l0 96 0 32-32 0-96 0 0-64 64 0 0-64 64 0zM64 352l0 64 64 0 0 64-96 0L0 480l0-32 0-96 64 0zM288 480l-128 0 0-64 128 0 0 64zM160 96l0-64 128 0 0 64L160 96z',
        viewBox: '0 0 448 512'
    },
};
Icons.defs = `
    <defs>
        <linearGradient id="gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1024" y2="1024">
            <stop offset="0" stop-color="rgb(162, 132, 94)"/>
            <stop offset="1" stop-color="rgb(0, 122, 255)"/>
        </linearGradient>
    </defs>
    `;
