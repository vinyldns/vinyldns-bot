'use strict';
const util = require("../util");
const STOP_WORDS = new Set(["a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "another", "any", "anyhow", "anyone", "anything", "anyway", "anywhere", "are", "around", "as", "at", "back", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom", "but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven", "else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "i", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own", "part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thick", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"]);

class FaqSearchService {
    /**
     * @param faqs {FaqItem[]}
     */
    constructor(faqs) {
        this._faqs = faqs;
    }

    /**
     * Performs a search against the FAQs for the given searchText.
     *
     * @param searchText {string} - The search text
     * @returns {FaqItem[]} - The matching FAQs
     */
    performSearch(searchText) {
        // Extract the meaningful words from the search text
        let searchWords = this.extractValidWords(searchText);

        // Look through the FAQs and find questions that have the most words in common with the searchWords
        return this._faqs.map(faq => {
                       let count = 0;
                       let faqWords = this.extractValidWords(faq.question);
                       if (util.isNotNullOrEmpty(faq.extraTerms)) {
                           for (let extraTerm of faq.extraTerms) {
                               faqWords.add(extraTerm.toLowerCase());
                           }
                       }
                       searchWords.forEach((elem) => count += (faqWords.has(elem.toLowerCase()) ? 1 : 0));
                       return [count, faq];
                   })
                   .filter(x => x[0] > 0) // Ignore results with zero matches
                   .sort((a, b) => (a[0] > b[0]) ? -1 : 1) // Sort by the number of matches
                   .map(x => x[1]); // Return the FAQs
    }

    /**
     * Extracts all meaningful words from the given text (ignoring stop words and punctuation).
     * @param text {string} - The text for which to extract words.
     * @return {Set<string>} - The extracted words
     */
    extractValidWords(text) {
        let words = text.split(/[ .\-!?;`'"]/i);
        return new Set(words.filter(word => word.length > 0 && !STOP_WORDS.has(word.toLowerCase()))
                            .map(word => word.toLowerCase()));
    }
}

module.exports = FaqSearchService;
