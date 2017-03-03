exports.checkIfContainsWholeWord = function(string, word){
    return new RegExp("\\b" + word + "\\b").test(string)
}

exports.checkIfStartsWithWord = function(string, word){
    return string.indexOf(word + " ") == 0 || string == word;
}

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

Array.prototype.randomElement = function(){
    return this[Math.floor(Math.random() * this.length)];
}
