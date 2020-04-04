module.exports = {

    userId(ids) {
        return ids[Math.floor(Math.random() * ids.length)];
    }

}