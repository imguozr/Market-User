module.exports = {
    getSearch(url) {
        let o = {};
        let item;
        url = url.split('&');
        url.forEach(val => {
            item = val.split('=');
            o[item[0]] = item[1];
        });
        return o;
    },
    urlEncode(param, key, encode) {
        if (param == null) {
            return '';
        }
        if (!key) {
            key = '';
        }
        let paramStr = '';
        let t = typeof (param);
        if (t === 'string' || t === 'number' || t === 'boolean') {
            paramStr += '&' + key + '=' + ((encode === null || encode) ? '-' + i + '-' : i);
        } else {
            for (let i in param) {
                let k = key === null ? i : key + (param instanceof Array ? '-' + i + '-' : i);
                paramStr += this.urlEncode(param[i], k ,encode);
            }
        }
        return paramStr;
    }
};
