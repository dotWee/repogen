const fs = require('fs');

module.exports = {
    isString: (value) => {
        return value && Object.prototype.toString.call(value) === "[object String]";
    },

    xml_write: (content, file) => {
        fs.writeFile(file, content, (err) => {
            if (err) throw err;
    
            console.log('Manifest has been written to %s', file);
        });
    }
}