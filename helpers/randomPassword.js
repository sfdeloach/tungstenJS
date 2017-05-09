/*jslint node: true*/

module.exports = function () {
    'use strict';
    var randWords01 = [
            "able", "accept", "accepted", "accepting", "action", "activate", "active", "add", "addition", "adorable", "advantage", "affirm", "ageless", "agree", "agreeable", "aid", "aim", "abundance", "accountability", "accomplishment", "accomplish", "accuracy", "achievement", "achieve", "acknowledge", "adaptability", "adventure", "adventurous", "agility", "alertness", "ambition", "anticipation", "appreciate", "appreciation", "appreciative", "assertive", "attentiveness", "audacity", "aware", "awareness", "authentic", "attraction", "allow", "allowing", "affection", "affectionate", "absorbed", "alert", "amazed", "awe", "awed", "animate", "animated", "animating", "animation", "animateness", "ardent", "amazing", "awesome", "awesomeness", "astonished", "astonishing", "amused", "air", "airness", "aloha", "adore", "admire", "admirable", "allure", "angel", "angelic", "altruism", "altruistic", "abound", "abounding", "abounds", "abundant", "absolute", "absolutely", "accessible", "acclaimed", "accommodate", "accommodated", "accommodation", "accommodating", "ample", "joy", "amin", "actability", "affable", "alacrity", "altrucause", "amiable", "astounding"
        ],
        choice01 = randWords01[Math.floor(Math.random() * randWords01.length)],
        randWords02 = [
            "scope", "smile", "smiling", "soulmate", "soul", "soulful", "sacred", "safe", "safety", "secure", "secured", "security", "sustain", "sustained", "save", "savings", "simple", "simplify", "selflessness", "self-esteem", "service", "simplicity", "sincerity", "skill", "skilled", "spirit", "serene", "serenity", "stability", "strength", "style", "systematization", "strive", "salvation", "self-respect", "serve", "sympathetic", "self-compassion", "self-kindness", "spellbound", "stimulated", "stimulating", "stimulation", "satisfied", "still", "surprised", "sleep", "expression", "shelter", "space", "spacious", "spontaneity", "spontaneous", "sunshine", "spark", "sparkle", "sparkles", "sweet", "sweetness", "support", "supporting", "supported", "foxy", "supreme", "succulent", "sweetheart", "study", "studious", "savour", "savouring", "sufficient", "stupendous", "swag", "swaggy", "splendid", "smart", "spectacular", "special", "serendipity", "synergy", "shine", "shining", "start", "steadfastness", "sublime", "sunniness", "superpower", "spunky", "virtuoso", "soul", "strong-words", "sacred-space", "stellar", "supercharge", "supercharged", "synchronicity"
        ],
        choice02 = randWords02[Math.floor(Math.random() * randWords02.length)],
        randNum = Math.floor(Math.random() * 10000);
    if (randNum < 1000) {
        if (randNum < 100) {
            if (randNum < 10) {
                randNum = "000" + randNum;
            } else {
                randNum = "00" + randNum;
            }
        } else {
            randNum = "0" + randNum;
        }
    }

    return choice01 + "-" + choice02 + randNum;
};