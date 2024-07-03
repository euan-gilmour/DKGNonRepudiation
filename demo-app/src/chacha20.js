const crypto = require('crypto');

let key = crypto.randomBytes(32),
    text = 'test';

function encChaPoly(key, data, cb){
    try {
        let iv = crypto.randomBytes(12),
            cipher = crypto.createCipheriv('chacha20-poly1305', key, iv, {
                authTagLength: 16
            }),
            encrypted = Buffer.concat([
                cipher.update(
                    Buffer.from(data), 'utf8'),
                cipher.final()
            ]),
            tag = cipher.getAuthTag(),
            final = Buffer.concat([iv, tag, encrypted]).toString('hex');
        cb(false, final)
    } catch (err) {
        if(err){
            cb(err,null)
        }
    }
}

function decChaPoly(key, data, cb){
    try {
        let decipher = crypto.createDecipheriv(
            'chacha20-poly1305',
            key,
            Buffer.from(data.substring(0, 24), 'hex'),
            {
                authTagLength: 16
            }
        );
        decipher.setAuthTag(
            Buffer.from(data.substring(24, 56), 'hex')
        ),
            decrypted = [
                decipher.update(
                    Buffer.from(data.substring(56), 'hex'),
                    'binary',
                    'utf8'
                ), decipher.final('utf8')
            ].join('');
        cb(false, decrypted)
    } catch (err) {
        if(err){
            cb(err,null)
        }
    }
}

encChaPoly(key, text, function(err,res){
    if(err){return console.log(err)}
    console.log(res)
    decChaPoly(key, res, function(err,res){
        if(err){return console.log(err)}
        console.log(res)
    })
})
