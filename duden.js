const HTMLParser = require('node-html-parser')
const fetch = require('node-fetch')

class Duden
{
    async makeRequest(text){
        text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        let mainTree;
        const url = `https://www.duden.de/rechtschreibung/${text}`
        return await fetch(`${url}`)
            .then (res => res.text())
            .then (body => mainTree = HTMLParser.parse(body))
            .then (mainTree => this.extractData(mainTree));
    }

    async continueSearchRequest(links){
        var answers = [];
        var wait = null;
        for (var link of links)
        {
            const url = `https://www.duden.de/${link}`;
            let mainTree;
            wait = await fetch(`${url}`)
                .then (res => res.text())
                .then (body => mainTree = HTMLParser.parse(body))
                .then (mainTree => this.extractData(mainTree));
            answers.push(wait);
        }
        return answers;
    }

    async makeSearchRequest(text){
        text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        let mainTree;
        let links = [];
        const url = `https://www.duden.de/suchen/dudenonline/${text}`
        return await fetch(`${url}`)
            .then (res => res.text())
            .then (body => mainTree = HTMLParser.parse(body))
            .then (mainTree => links = this.extractSearchData(mainTree));
            //.then(links => this.continueSearchRequest(links));
    }

    extractData(mainTree){
        try
        {
            var description = mainTree.querySelector('h1').rawText;
            if (description.indexOf(',') > 0)
            {
                description = description.split(',');
                description =  description[1].trim() + " " + description[0].trim();
            }
            return description.trim().replace('-','');
        }
        catch (exc)
        {
            console.log(exc);
            return "Error occurred";
        }
    }

    extractSearchData(mainTree){
        try
        {
            const description = mainTree.querySelectorAll('section');
            var links = [];
            var count = 0;
            for (var i of description){
                for(var x of i.childNodes)
                {
                    if (x.rawAttrs != undefined)
                        var len = x.rawAttrs.indexOf('href');
                        if (len > 0 && x.tagName === 'a')
                        {
                            var splitedString = x.rawAttrs.slice(len).split('"');
                            if (splitedString.length < 3) continue;
                            links.push(splitedString[1]);

                            count++;
                        }
                }
                if (count >= 5) break;
            }
            return links;
        }
        catch (exc)
        {
            console.log(exc);
            return "Error occurred";
        }
    }
}

module.exports = Duden;

/*var dud = new Duden();
var resp = null;
dud.makeSearchRequest('Buch')
    .then(response => resp = dud.continueSearchRequest(response))
    .then(resp => console.log(resp));*/
    //.then()
   /* .then(response => answer => {
        for (var x of response) {
            dud.continueSearchRequest(x)
                .then(resp => {
                    return resp;
                });
        }
    });*/



