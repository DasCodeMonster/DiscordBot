class Song {
    constructor(ID, title, author, length, queuedBy) {
        this.ID = ID;
        this.title = title,
        this.author = author;
        this.length = length;
        this.queuedBy = queuedBy;
    }
}
module.exports = Song;