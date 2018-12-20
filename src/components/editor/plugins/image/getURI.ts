export function getURI(origin: string, inclusive: boolean = true): string {
    const URL = [
        'pgc-image/',
        'dfic-imagehandler/',
        'weili/'
    ];
    let index: number = -1;
    URL.forEach(function (url) {
        if (origin.indexOf(url) > -1) {
            let prefix = inclusive ?  0 : url.length;
            index = prefix + origin.indexOf(url);
        }
    });

    return index > -1 ? origin.slice(index) : '';
}
