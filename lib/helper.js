module.exports = {
    isString: (value) => {
        return value && Object.prototype.toString.call(value) === "[object String]"
    }
}