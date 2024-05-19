module.exports = {
    get oracle() {
        return require('./oracle.lib')
    },
    get cacheDB() {
        return require('./cacheDB.lib')
    },
    get execObj() {
        return require('./execObj.lib')
    },
}
