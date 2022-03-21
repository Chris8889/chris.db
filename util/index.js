const path = require(`path`);
const absolute = (base, rel) => {
    const st = base.split(path.sep);
    const arr = rel.split(path.sep);
    st.pop();

    for (const el of arr) {
        if (el === `.`) continue;
        if (el === `..`) st.pop();
        else st.push(el);
    }; return st.join(path.sep);
};

const parseObject = (object = {}) => {
    if (!object || typeof object !== `object`) return {key: undefined, value: undefined};
    return {
        key: Object.keys(object)[0],
        value: object[Object.keys(object)[0]]
    };
};

exports.absolute = absolute;
exports.parseObject = parseObject;